const express = require('express')
const router = express.Router()
const User = require('../models/User');
const House = require('../models/House');


// Create user
router.post('/create', async (req, res) => {
    try {
        const { clerkId, firstName, lastName, email, phone, location } = req.body;

        // Ensure clerkId is provided
        if (!clerkId) {
            return res.status(400).json({ message: "clerkId is required" });
        }

        const data = {
            clerkId,
            firstName,
            lastName,
            email,
            phone,
            location,
            userId: clerkId // Set userId to clerkId to ensure it's not null
        };

        const userRes = await User.findOneAndUpdate(
            { clerkId: clerkId },
            data,
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json(userRes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/getUserId/:id', async (req, res) => {
    try {
        const userRes = await User.findById(req.params.id)

         // Fetch posted houses separately using clerkId
         const postedHouses = await House.find({ postedBy: req.params.id });

         res.status(200).json({
             ...userRes.toObject(),
             postedHouses // Override populated houses to fetch using Clerk ID
         });

        res.status(200).json(userRes)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.get('/profile/:clerkId', async (req, res) => {
    try {
        const { clerkId } = req.params;

        // Find the user by clerkId and populate postedHouses
        const user = await User.findOne({ clerkId }).populate({
            path: 'postedHouses',
            model: 'House',
            select: 'title description price location type rooms bathrooms images postedBy'
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch posted houses separately using clerkId
        const postedHouses = await House.find({ postedBy: clerkId });

        res.status(200).json({
            ...user.toObject(),
            postedHouses // Override populated houses to fetch using Clerk ID
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = router