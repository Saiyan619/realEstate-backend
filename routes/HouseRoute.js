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

        if (!postedBy) {
            return res.status(400).json({ message: "postedBy (user ID) is required" });
        }

        const user = await User.findOne({ clerkId: postedBy });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const images = req.files.map(file => file.path);

        // Create new house entry
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

        // Update user's postedHouses array
        user.postedHouses.push(newHouse._id);
        await user.save();

        res.status(201).json({
            message: "House posted successfully",
            newHouse,
            postedHousesCount: user.postedHouses.length
        })
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
      const ownerIds = houses.map(house => house.postedBy);
      
      // Fetch all relevant users in one query
      const users = await User.find({
        clerkId: { $in: ownerIds }
      }).select('firstName lastName email clerkId');
      
      // Create a map for quick lookup
      const userMap = {};
      users.forEach(user => {
        userMap[user.clerkId] = user;
      });
      
      // Populate the houses with owner details
      const populatedHouses = houses.map(house => {
        const houseObj = house.toObject();
        const ownerDetails = userMap[house.postedBy] || null;
        
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


  // Get House Details By id
  router.get('/getHouse/:id', async (req, res) => {
    try {
        const houseDetails = await House.findById(req.params.id);

        // If house is not found, return 404
        if (!houseDetails) {
            return res.status(404).json({ message: "House not found" });
        }

        // Fetch the owner details using the ownerId (Clerk ID) from the User collection
        const ownerDetails = await User.findOne({ clerkId: houseDetails.postedBy })
            .select('firstName lastName email clerkId'); // Only return necessary fields

        // Attach owner details to the house response
        const populatedHouse = {
            ...houseDetails.toObject(),
            owner: ownerDetails || null, // If no owner found, return null
        };

        res.status(200).json(populatedHouse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



router.patch("/editHouse/:id", upload.array("images", 5), async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {};

        // Convert fields to numbers where necessary
        if (req.body.title) updateData.title = req.body.title;
        if (req.body.description) updateData.description = req.body.description;
        if (req.body.price !== undefined) updateData.price = Number(req.body.price);
        if (req.body.location) updateData.location = req.body.location;
        if (req.body.type) updateData.type = req.body.type;
        if (req.body.rooms !== undefined ) updateData.rooms = Number(req.body.rooms);
        if (req.body.bathrooms !== undefined) updateData.bathrooms = Number(req.body.bathrooms);
        if (req.body.postedBy) updateData.postedBy = req.body.postedBy; 

        // If new images are uploaded, add them to the updateData
        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map(file => file.path);
        }

        // Find and update the house
        const updatedHouse = await House.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedHouse) {
            return res.status(404).json({ message: "House not found" });
        }

        res.status(200).json({ message: "House updated successfully", updatedHouse });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;