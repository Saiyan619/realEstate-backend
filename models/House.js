const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
    title: { type: String },
    description: { type: String }, 
    price: { type: Number }, 
    location: { type: String }, 
    type: { 
        type: String, 
        enum: ['Bungalow', 'Duplex', 'Mansion', 'Penthouse', 'Apartment'], 
        default: 'apartment'
    }, 
    rooms: { type: Number }, 
    bathrooms: { type: Number }, 
    images: { type: [String] }, 
    postedBy: { 
        type: String, // Store Clerk ID directly
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model('House', houseSchema);
