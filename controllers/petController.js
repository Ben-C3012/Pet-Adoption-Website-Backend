const Pet = require('../models/petModel')



exports.getAllPets = async (req, res) => {

    try {
        const pets = await Pet.find()

        res.status(200).json({
            status: 'success',
            results: pets.length,
            data: {
                pets
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }

}

exports.createNewPet = async (req, res) => {
    try {
        const newPet = await Pet.create(req.body)

        res.status(201).json({
            status: 'Success',
            data: {
                pet: newPet
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.editPet = (req, res) => {


}

exports.getPet = async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id)

        res.status(200).json({
            status: 'success',
            data: {
                pet
            }
        })
    } catch (err) {
        res.status(404).send({
            status: 'fail',
            message: err.message
        })
    }

}

exports.deletePet = (req, res) => {

}