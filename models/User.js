const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true }, // Unique identifier for the user (e.g., Clerk ID)
    name: { type: String}, // Full name of the user
    email: { type: String }, // Email for login and communication
    phone: { type: Number, default:null}, // Phone number for inquiries/contact
    location: { type: String, default:null}, // User's primary location (optional)
    savedHouses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'House' }], // Houses favorited by the user
    postedHouses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'House' }], // Houses posted by the user
    createdAt: { type: Date, default: Date.now }, // Timestamp for user creation
    updatedAt: { type: Date, default: Date.now }, // Timestamp for last update
});

module.exports = mongoose.model("User", UserSchema);