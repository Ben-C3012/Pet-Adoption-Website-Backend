const mongoose = require('mongoose')


const petSchema = new mongoose.Schema({
    type: {
       type: String,
       required: true, 
       unique : true
    },
    name: String,
    adoptionStatus: String,
    picture: String,
    height: Number,
    weight: Number,
    color: String,
    bio: String,
    hypoallergenic: Boolean,
    dietaryRestrictions: Boolean,
    breed: String
})

const Pet = mongoose.model('Pet' , petSchema)

module.exports = Pet