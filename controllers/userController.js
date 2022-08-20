const catchAsync = require('../utils/catchAsync')
const User = require('../models/userModel')


exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find()

    // SEND RESPONE . 
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    })

})

exports.createUser = async(req, res, next) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })

}

exports.getUser = (req, res, next) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

exports.updateUser = (req, res, next) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

exports.deleteUser = (req, res, next) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}