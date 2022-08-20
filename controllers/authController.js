const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const User = require('./../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id)

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })

}

exports.signup = catchAsync(async (req, res, next) => {


    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        phoneNumber: req.body.phoneNumber,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role
    })

    createSendToken(newUser, 201, res)
})


exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body


    // 1) Check if email and password exists
    if (!email || !password) {
        return next(new AppError('Please Provide Email and Password', 400))
    }
    // 2) Check if user exits and password is correct 
    const user = await User.findOne({ email }).select('+password')

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401))
    }

    // 3) if everyrhing is ok send a token. 
    createSendToken(user, 200, res)
})


exports.protect = catchAsync(async (req, res, next) => {

    // 1) Getting token and check of it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(
            new AppError('You are not logged in! Please log in to get access.', 401)
        );

    }


    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded)



    // 3) Check if user still exits
    const currentUser = await User.findById(decoded.id)
    if (!currentUser) {
        return next(new AppError('The User Does not longer Exists'))
    }

    // 4) Check if user changed passwords after the JWT was issued 
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User Recently changed passwords! please log in again', 401))
    }

    // GRANT ACESSS TO PROTECTED ROUTE
    req.user = currentUser

    next()
})

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have premisson to preform this action', 403))
        }
        next()
    }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get User based on POSTed email 
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return next(new AppError('There is no user with this email address', 404))
    }

    // 2) Generate the random reset token 
    const resetToken = user.createPasswordResetToken(
        await user.save({ validateBeforeSave: false })
    )

    // 3) Send it to the users email
})



// exports.resetPassword = (req, res, next => {

// })


exports.updatePassword = catchAsync(async (req, res, next) => {
    //  1) Get the user from the collection 
    const user = await User.findById(req.user.id).select('+password')

    console.log(req.body.passwordCurrent, user.password)

    // 2) Check if posted current password is correct 
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Your current password is wrong', 401))
    }

    // 3) Log User in , send JWT back to the user
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    await user.save()

    // 4) Log user in , send JWT
    createSendToken(user, 200, res)
})