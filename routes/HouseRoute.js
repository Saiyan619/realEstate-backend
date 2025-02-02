const express = require('express')
const router = express.Router();
const multer = require('multer');
const House = require('../models/House');


// Multer Config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/uploads')
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
});

// File type Filter

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
        cb(null, true); // Accept file
    } else {
        cb(new Error("Only image files are allowed!"), false); // Reject file
    }
};


// Create House
router.post('/createHouse', async (req, res) => {
    try {
        const {
            title,
            description,
            price,
            location,
            type,
            rooms,
            bathrooms,
            images,
            postedBy
        } = req.body;
        
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