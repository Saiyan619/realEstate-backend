const mongoose = require('mongoose')

const houseSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Title or name of the listing
    description: { type: String, required: true }, // Detailed description of the house
    price: { type: Number, required: true }, // Price of the house
    location: { type: String, required: true }, // Location of the house (e.g., city, state)
    type: { 
        type: String, 
        enum: ['bungalow', 'duplex', 'mansion', 'penthouse', 'apartment'], 
        required: true 
    }, // Type of the house
    rooms: { type: Number, required: true }, // Number of rooms
    bathrooms: { type: Number, required: true }, // Number of bathrooms
    images: { type: [String], required: true }, // Array of image URLs
    postedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    createdAt: { type: Date, default: Date.now }, // Timestamp for when the house was listed
    updatedAt: { type: Date, default: Date.now }, // Timestamp for the last update

});

module.exports = mongoose.model('House', houseSchema);