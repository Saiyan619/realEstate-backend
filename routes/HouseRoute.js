const express = require('express')
const router = express.Router();
const multer = require('multer');
const House = require('../models/House');
const User = require('../models/User');
const path = require('path');




// Ensure uploads directory exists
const fs = require('fs');
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}


// After Making sure the directory exists write Multer Config
const storage = multer.diskStorage({
    //First the destination(function)
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },

    //second the filname(function)
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
});


// File type Filter

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/; //Allow only jpeg, jpg, png, webp files
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase()); //Check if the file extension is allowed
    const mimeType = allowedTypes.test(file.mimetype); //Check if the file mimetype is allowed

    if (extName && mimeType) {
        cb(null, true); // Accept file
    } else {
        cb(new Error("Only image files are allowed!"), false); // Reject file
    }
};

// Multer middleware
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
});


// Create House
router.post('/createHouse', upload.array("images", 5), async (req, res) => {
    console.log('Request Body:', req.body);
    console.log('Uploaded Files:', req.files);
    try {
        const {
            title,
            description,
            price,
            location,
            type,
            rooms,
            bathrooms,
            postedBy
        } = req.body;


        const images = req.files.map(file => file.path);
        
        const newHouse = await House.create({
            title,        
            description,  
            price,       
            location,     
            type,        
            rooms,        
            bathrooms,    
            images,
            postedBy
        });

        console.log("postedBy", postedBy)
        res.status(201).json({ message: "House created successfully", house: newHouse });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// Get all House
// router.get('/getHouse', async (req, res) => {
//     try {
//         const houseRes = await House.find().
        
//         res.status(200).json(houseRes)
//     } catch (error) {
//         res.status(500).json({message:error.message})
//     }
// })



// Get all Houses with populated user information using ClerkID
router.get('/getHouse', async (req, res) => {
    try {
      // First, fetch all houses
      const houses = await House.find();
      
      // Check if we have houses to process
      if (!houses.length) {
        return res.status(200).json([]);
      }
      
      // Extract all ClerkIDs from the houses (assuming houses have ownerId field with ClerkID)
      const ownerIds = houses.map(house => house.ownerId);
      
      // Fetch all relevant users in one query
      const users = await User.find({
        clerkId: { $in: ownerIds }
      }).select('name email clerkId');
      
      // Create a map for quick lookup
      const userMap = {};
      users.forEach(user => {
        userMap[user.clerkId] = user;
      });
      
      // Populate the houses with owner details
      const populatedHouses = houses.map(house => {
        const houseObj = house.toObject();
        const ownerDetails = userMap[house.ownerId] || null;
        
        return {
          ...houseObj,
          owner: ownerDetails
        };
      });
      
      res.status(200).json(populatedHouses);
    } catch (error) {
      console.error("Error fetching houses:", error.message);
      res.status(500).json({message: error.message});
    }
  });

  router.get('/getHouse/:clerkId', async (req, res) => {
    try {
        const { clerkId } = req.params;

        // Fetch house details using the Clerk ID
        const houseDetails = await House.findOne({ ownerId: clerkId });

        // Check if the house exists
        if (!houseDetails) {
            return res.status(404).json({ message: "House not found" });
        }

        // Fetch owner details from the User collection using Clerk ID
        const ownerDetails = await User.findOne({ clerkId }).select('name email clerkId');

        // Attach owner details to the response
        const populatedHouse = {
            ...houseDetails.toObject(),
            owner: ownerDetails || null, // If no owner found, set to null
        };

        res.status(200).json(populatedHouse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




module.exports = router;