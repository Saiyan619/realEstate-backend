const express = require('express')
const router = express.Router()
const User = require('../models/User');

 
// Create user
router.post('/create', async (req, res) => {
    try {
        const { userId, name, email, phone, location } = req.body;
        const data = {
            userId: userId,
            name: name,
            email: email,
            phone: phone,
            location: location
        };
        const userRes = await User.findOneAndUpdate(
            { userId },
        data,
            {new:true, upsert:true, runValidators:true}
        )

        res.status(200).json(userRes)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

//Get user by clerkId(When user enters a page and goes to their dashboard)
router.get('/getUser/:userId', async (req, res) => {
    try {
        const userRes = await User.find({ userId: req.params.userId })
        res.status(200).json(userRes)
    } catch (error) {
        res.status(500).json({ message: error.message })
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

module.exports = router