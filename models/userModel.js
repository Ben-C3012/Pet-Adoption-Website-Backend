const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

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
        validate: [validator.isEmail, 'Plase Provide a valid email']
    },

    photo: String,

    password: {
        type: String,
        required: [true, 'please enter a valid password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'please confirm your password'],
        validate: {
            // This Only Works On Save
            validator: function (el) {
                return el === this.password
            },
            message: 'Passwords Are Not The Same!'
        }
    },

    phoneNumber: {
        type: String,
        required: [true, 'please enter a phone number'],
        validate: [validator.isMobilePhone, 'Plase Provide a valid phone number']
    }
})

userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next()

    // Hash the paqssword with cost of 12
    this.password = await bcrypt.hash(this.password, 12)

    // Delete the password Confirm field
    this.passwordConfirm = undefined
    next()

})

userSchema.methods.correctPassword = async function (canidatePassword, userPassword) {
    return await bcrypt.compare(canidatePassword, userPassword)
}

const User = mongoose.model('User', userSchema)

module.exports = User