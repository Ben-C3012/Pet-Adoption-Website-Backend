const Pet = require('../models/petModel')
const User = require('../models/userModel')
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

    cloudinary.uploader.upload(req.file.path, async (error, result) => {
        if (error) {
            res.status(500).send(error);
            return;
        }
        if (result) {
            fs.unlinkSync(req.file.path);

            req.body.photo = result.url
            console.log(req.body)

            //  Create The Pet
            const newPet = await Pet.create(req.body)

            res.status(201).json({
                status: 'Success',
                data: {
                    pet: newPet
                }
            })
        }

    });
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


exports.editPet = catchAsync(async (req, res, next) => {


    // if (req.file) req.body.photo = req.file.filename
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



exports.savePet = catchAsync(async (req, res, next) => {

    const petToSave = await Pet.findById(req.params.id)

    const currentUser = req.user

    const updatedUser = await User.findByIdAndUpdate(
        { _id: currentUser._id },
        {
            $addToSet: {
                savedPets: petToSave
            }
        }, { new: true, runValidators: true })


    res.status(200).json({
        status: 'Success',
        savedPets: updatedUser.savedPets

    })

})


exports.deleteSavedPet = catchAsync(async (req, res, next) => {

    const petToRemove = await Pet.findById(req.params.id)

    const currentUser = req.user


    await User.findByIdAndUpdate(
        { _id: currentUser._id },
        {
            $pull: {
                savedPets: petToRemove
            },

        }, { new: true, runValidators: true })



    res.status(204).json({
        status: 'Success',

    })


})


exports.adoptPet = catchAsync(async (req, res, next) => {

    console.log(req.body)

    const currentUser = req.user
    const petToAdopt = await Pet.findById(req.params.id)

    // Change Adoption Status of the pet
    const pet = await Pet.findByIdAndUpdate(
        { _id: petToAdopt._id },
        { adoptionStatus: req.body?.foster ? 'Fostered' : 'Adopted' },
        { new: true, runValidators: true }

    )


    // Add desired Pet to the users Pets
    const updatedUser = await User.findByIdAndUpdate(
        { _id: currentUser._id },
        {
            $addToSet: {
                currentPets: pet
            }
        }, { new: true, runValidators: true })


    res.status(200).json({
        status: 'Success',
        pet,
        updatedUser
    })

})