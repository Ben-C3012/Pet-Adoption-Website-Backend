const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Please Tel us Your name'],
    },
    email: {
        type: String,
        required: [true, 'Plese Provide an email'],
        unique: true,
        lowercase: true,
        // validate: [validator.email, 'Plase Provide a valid email']
    },

    photo: String,

    password: {
        type: String,
        required: [true, 'please enter a valid password'],
        minlength: 8,
        unique : true
    },
    passwordConfirm: {
        type: String,
        required: [true, 'please confirm your password'],
        unique : true,
    }

})


const User = mongoose.model('User', userSchema)

module.exports = User