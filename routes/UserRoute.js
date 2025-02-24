const express = require('express')
const router = express.Router()
const User = require('../models/User');
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

//Get user by mongoDb Id(wWhen user decides to check other user/seller profile)
router.get('/getUserId/:id', async (req, res) => {
    try {
        const userRes = await User.findById(req.params.id)
        res.status(200).json(userRes)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

// Get user profile by Clerk ID
router.get('/profile/:clerkId', async (req, res) => {
    try {
        const { clerkId } = req.params;

        // Find the user by clerkId
        const user = await User.findOne({ clerkId }).populate("postedHouses"); 

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router