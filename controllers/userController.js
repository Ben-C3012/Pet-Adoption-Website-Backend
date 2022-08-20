const catchAsync = require('../utils/catchAsync')
const User = require('../models/userModel')
const AppError = require('../utils/appError')


const filterObj = (obj, ...allowedFields) => {
    const newObj = {}
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el]
    })

    return newObj
}

const getEmail = (objUser) => {
    if (objUser == undefined) {
        return
    }
    const { email } = objUser
    return email
}

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

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create an error  if user posts password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'This Route is not for password updates. Please use / update my password')
            , 400)
    }

    const currentUser = await User.find({ email: req.body.email })


    const currentEmail = getEmail(...currentUser)

    if (currentEmail === req.body.email) {
        next(new AppError('Email is already in use'))
    }



    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email', 'phoneNumber')

    // 3) Update the user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    })


    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    })

    // 3) 
})

exports.createUser = async (req, res, next) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })

}

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new AppError('No User Found With That ID', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
})

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