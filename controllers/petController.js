const Pet = require('../models/petModel')
const catchAsync = require('../utils/catchAsync')


exports.getAllPets = catchAsync(async (req, res , next) => {

        const pets = await Pet.find()

        res.status(200).json({
            status: 'success',
            results: pets.length,
            data: {
                pets
            }
        })
})

exports.createNewPet = catchAsync(async (req, res , next) => {

    const newPet = await Pet.create(req.body)

    res.status(201).json({
        status: 'Success',
        data: {
            pet: newPet
        }
    })

})

exports.editPet = catchAsync(async (req, res , next) => {

    const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        status: 'success',
        data: {
            pet
        }
    })
})

exports.getPet = catchAsync(async (req, res , next) => {

    const pet = await Pet.findById(req.params.id)

    res.status(200).json({
        status: 'success',
        data: {
            pet
        }
    })


})

exports.deletePet = catchAsync(async (req, res , next) => {

    const pet = await Pet.findByIdAndDelete(req.params.id)

    res.status(200).json({
        status: 'success',
        message: "Pet Successfully Deleted",
        data: {
            pet
        }
    })

})