const Pet = require('../models/petModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const multer = require('multer')
const fs = require('fs')

const cloudinary = require('../utils/cloudinary')

// Multer
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/pets')
    },

    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1]
        cb(null, `pet-${req.user.id}-${Date.now()}.${ext}`)
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

exports.uploadPetPhoto = upload.single('photo')

////////////////////

// Cloudinary
exports.uploadToCloudinary = async (req, res, next) => {

    cloudinary.uploader.upload(req.file.path, (error, result) => {
        if (error) {
            res.status(500).send(error);
            return;
        }
        if (result) {
            fs.unlinkSync(req.file.path);
            req.body.photo = result.secure_url

            console.log(req.body)


        }
    });

    next()

}


exports.getAllPets = catchAsync(async (req, res, next) => {

    // Build Query
    const queryObj = { ...req.query }
    const exludedFields = ['page', 'sort', 'limit', 'fields']
    exludedFields.forEach(el => delete queryObj[el])

    const query = Pet.find(queryObj)

    // EXECUTE QUERY
    const pets = await query


    res.status(200).json({
        status: 'success',
        results: pets.length,
        data: {
            pets
        }
    })
})

exports.createNewPet = catchAsync(async (req, res, next) => {

    // if (req.file) req.body.photo = req.file.filename
    console.log(req.body)
    const newPet = await Pet.create(req.body)

    res.status(201).json({
        status: 'Success',
        data: {
            pet: newPet
        }
    })

})

exports.editPet = catchAsync(async (req, res, next) => {


    if (req.file) req.body.photo = req.file.filename
    console.log(req.body.photo)

    const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })


    if (!pet) {
        return next(new AppError('No Pet Found With That ID', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            pet
        }
    })
})

exports.getPet = catchAsync(async (req, res, next) => {

    const pet = await Pet.findById(req.params.id)

    if (!pet) {
        return next(new AppError('No Pet Found With That ID', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            pet
        }
    })
})

exports.deletePet = catchAsync(async (req, res, next) => {

    const pet = await Pet.findByIdAndDelete(req.params.id)

    if (!pet) {
        return next(new AppError('No Pet Found With That ID', 404))
    }

    res.status(204).json({
        status: 'success',
        message: "Pet Successfully Deleted",
        data: null

    })

})


