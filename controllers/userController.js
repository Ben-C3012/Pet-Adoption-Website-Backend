const catchAsync = require('../utils/catchAsync')
const User = require('../models/userModel')
const AppError = require('../utils/appError')
const multer = require('multer')

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/users')
    },

    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1]
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
    }
})


const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError('Not an Image, Please Upload only images', 400), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})


exports.uploadUserPhoto = upload.single('photo')


const filterObj = (obj, ...allowedFields) => {
    const newObj = {}
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el]
    })

    return newObj
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
    console.log(req.file)
    console.log(req.body)

    // 1) Create an error  if user posts password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'This Route is not for password updates. Please use / update my password')
            , 400)
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email', 'phoneNumber')
    if (req.file) filteredBody.photo = req.file.filename

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