const mongoose = require('mongoose')

const houseSchema = new mongoose.Schema({
    title: { type: String,},
    description: { type: String,  }, 
    price: { type: Number,  }, 
    location: { type: String, }, 
    type: { 
        type: String, 
        enum: ['bungalow', 'duplex', 'mansion', 'penthouse', 'apartment'], 
        required: true 
    }, 
    rooms: { type: Number,  }, 
    bathrooms: { type: Number, }, 
    images: { type: [String],  }, 
    postedBy: { 
        type: String,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }, 

});

module.exports = mongoose.model('House', houseSchema);