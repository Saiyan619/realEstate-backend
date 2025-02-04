const express = require('express')
const router = express.Router();
const multer = require('multer');
const House = require('../models/House');


// Ensure uploads directory exists
const fs = require('fs');
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}


// Multer Config
const storage = multer.diskStorage({
    //First the destination(function)
    destination: function (req, file, cb) {
        cb(null, '/uploads')
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
})


// Create House
router.post('/createHouse', upload.array("images", 5) ,async (req, res) => {
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

        res.status(201).json({ message: "House created successfully", house: newHouse });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// Get all House
router.get('/getHouse', async (req, res) => {
    try {
        const houseRes = await House.find().populate('postedBy')
        res.status(200).json(houseRes)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})




module.exports = router;