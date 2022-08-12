const express = require('express')
const fs = require('fs')

const router = express.Router()

const pets = JSON.parse(fs.readFileSync('./dev-data/pets.json'))

const getAllPets = (req, res) => {
    console.log(req.requestTime)
    res.status(200).json({
        status: 'success',
        results: pets.length,
        data: {
            pets
        }
    })
}

const createNewPet = (req, res) => {

    const newId = pets[pets.length - 1].id + 1
    const newPet = Object.assign({ id: newId }, req.body)

    pets.push(newPet)

    fs.writeFile('./dev-data/pets.json', JSON.stringify(pets), err => {
        res.status(201).json({
            status: 'success',
            data: {
                newPet
            }
        })
    })
}

const editPet = (req, res) => {
    const id = req.params.id * 1;
    const pet = pets.find(pet => pet.id === id);

    if (!pet) {
        return res.status(404).send({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    const updatedPet = { ...pet, ...req.body };
    const updatedPets = pets.map(pet =>
        pet.id === updatedPet.id ? updatedPet : pet
    );

    fs.writeFile(
        `${__dirname}/dev-data/pets.json`,
        JSON.stringify(updatedPets),
        err => {
            res.status(200).send({
                status: 'success',
                data: updatedPet
            });
        }
    );
}

const getPet = (req, res) => {

    const id = req.params.id * 1
    if (id > pets.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'invalid ID'
        })
    }

    const pet = pets.find(pet => pet.id === id)

    res.status(200).json({
        status: 'succsess',
        data: {
            pet
        }
    })
}

const deletePet = (req, res) => {
    const id = req.params.id * 1
    const pet = pets.find(pet => pet.id === id)

    if (!pet) {
        return res.status(404).json({
            status: 'fail',
            message: 'invalid ID'
        })
    }

    const updatedPets = pets.filter(pet => pet.id !== id)
    fs.writeFile(`${__dirname}/dev-data/pets.json`, JSON.stringify(updatedPets), err => {
        res.status(204).json({
            status: 'success',
            data: null
        })
    })
}

router.route('/')
    .get(getAllPets)
    .post(createNewPet)

router.route('/:id')
    .get(getPet)
    .patch(editPet)
    .delete(deletePet)

module.exports = router