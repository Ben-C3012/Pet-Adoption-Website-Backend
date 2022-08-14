const mongoose = require('mongoose')


const petSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: [true, 'A Dog Must Have a name'],
    },
    adoptionStatus: {
        type: String,
        required: [true, 'A Dog Must Have a adoptionStatus'],
    },
    picture: {
        type: String,
        required: [true, 'A Dog Must have a Cover image ']
    },
    height: {
        type: Number,
        required: [true, 'A Dog Must Have a height'],
    },
    weight: {
        type: Number,
        required: [true, 'A Dog Must Have a weight'],
    },
    color: {
        type: String,
        required: [true, 'A Dog Must Have a Color'],
    },
    bio: {
        type: String,
        required: [true, 'A Dog Must Have a Bio'],
    },
    hypoallergenic: {
        type: Boolean,
        required: [true, 'A Dog Must Have a hypoallergenic status'],

    },
    dietaryRestrictions: {
        type: Boolean,
        required: [true, 'A Dog Must Have a dietaryRestrictions description'],
    },
    breed: {
        type: String,
        required: [true, 'A Dog Must Have a breed'],
    }
})

const Pet = mongoose.model('Pet', petSchema)

module.exports = Pet