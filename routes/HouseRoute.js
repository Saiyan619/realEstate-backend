const express = require('express')
const router = express.Router();
const House = require('../models/House')

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

router.get('/getHouse', async (req, res) => {
    try {
        const houseRes = await House.find().populate('postedBy')
        res.status(200).json(houseRes)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})


module.exports = router;