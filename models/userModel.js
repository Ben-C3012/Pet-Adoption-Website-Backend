const crypto = require('crypto')
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
    },

    passwordChangedAt: Date,
    PasswordResetToken: String,
    PasswordResetToken: Date,

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
})

userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next()

    // Hash the paqssword with cost of 12
    this.password = await bcrypt.hash(this.password, 12)

    // Delete the password Confirm field
    this.passwordConfirm = undefined

    this.passwordChangedAt = Date.now() - 1000
    next()

})

userSchema.methods.correctPassword = async function (canidatePassword, userPassword) {
    return await bcrypt.compare(canidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        // console.log(changedTimestamp)
        return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
};


userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex')

    crypto.createHash('sha256').update(resetToken).digest('hex')

    console.log({ resetToken }, this.passwordResetToken)

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000

    return resetToken
}


const User = mongoose.model('User', userSchema)

module.exports = User