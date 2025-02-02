const mongoose = require('mongoose')

const houseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true }, 
    price: { type: Number, required: true }, 
    location: { type: String, required: true }, 
    type: { 
        type: String, 
        enum: ['bungalow', 'duplex', 'mansion', 'penthouse', 'apartment'], 
        required: true 
    }, 
    rooms: { type: Number, required: true }, 
    bathrooms: { type: Number, required: true }, 
    images: { type: [String], required: true }, 
    postedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }, 

});

module.exports = mongoose.model('House', houseSchema);