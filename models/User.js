const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true }, // Unique identifier for the user (e.g., Clerk ID)
    userId: { type: String, default: () => new mongoose.Types.ObjectId().toString() }, // Add default value to avoid null
    firstName: { type: String }, 
    lastName: { type: String }, 
    email: { type: String }, 
    phone: { type: Number, default: 0 }, 
    location: { type: String, default: " " }, 
    savedHouses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'House' }], 
    postedHouses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'House' }], 
    createdAt: { type: Date, default: Date.now }, 
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);