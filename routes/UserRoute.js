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
   
        if (user) {
            // For existing users, only update fields that are currently empty
            const updateData = {
                lastLoginAt: new Date(),
                updatedAt: new Date()
            };

            // Only update if the field is empty/null in database
            if (!user.firstName && firstName) {
                updateData.firstName = firstName;
            }
            
            if (!user.lastName && lastName) {
                updateData.lastName = lastName;
            }
            
            if (!user.email && email) {
                updateData.email = email;
            }
            
            if (!user.phone && phone && phone.trim() !== '') {
                updateData.phone = phone;
            }
            
            if (!user.location && location && location.trim() !== '') {
                updateData.location = location;
            }

            // Arrays are preserved automatically (savedHouses, postedHouses)
            // Only update if completely empty - but this should never happen for existing users

            user = await User.findOneAndUpdate(
                { clerkId },
                updateData,
                { new: true, runValidators: true }
            );
            
            return res.status(200).json({ 
                message: "User login recorded", 
                user,
                isNewUser: false,
                updatedFields: Object.keys(updateData).filter(key => key !== 'lastLoginAt' && key !== 'updatedAt')
            });
        } else {
            // Create new user
            const userData = {
                clerkId,
                firstName,
                lastName,
                email,
                // Only include phone if it exists and is not empty
                ...(phone && phone.trim() !== '' && { phone }),
                // Only include location if it exists
                ...(location && { location })
            };

            user = await User.create(userData);
            
            return res.status(201).json({ 
                message: "User created successfully", 
                user,
                isNewUser: true 
            });
        }

    }  catch (error) {
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