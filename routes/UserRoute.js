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

        // Check if user already exists
        let user = await User.findOne({ clerkId });

    
        if (!user) {
          // Create new user with limited info
          user = await User.create({
            clerkId,
            firstName,
            lastName,
            email,
          // Only update phone if it's provided and not empty
                    ...(phone && phone.trim() !== '' && { phone }),
                    // Only update location if it's provided
                    ...(location && { location }),
          });
        }
    
        res.status(200).json({ message: "User authenticated", user });

        // const userRes = await User.findOne(
        //     { clerkId: clerkId },
        //     data,
        //     { new: true, upsert: true, runValidators: true }
        // );


        // res.status(200).json(userRes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//Get user by id
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


// get user profile with clerkId
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

//Edit/Update user Profile
router.patch('/edit-userProfile/', async (req, res) => {
    try {
        const { clerkId, firstName, lastName, email, phone, location } = req.body;

        if (!clerkId) {
          return res.status(400).json({message:"user doesnt not exist"})
        }

        const updatedUser = await User.findOneAndUpdate(
            {clerkId},
            {firstName,
            lastName,
            email,
            location,
                phone,
            },
            {new:true}
        )

        if (!updatedUser) {
            return res.status(400).json({message:"user not found"})
        }

        res.status(200).json(updatedUser)


    } catch (error) {
        res.status(500).json({message:error.message})
    }


    // Last Feature to add : Save House for later Review //
})



module.exports = router