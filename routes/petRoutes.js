const express = require('express')
const fs = require('fs')
const petController = require('../controllers/petController')

const router = express.Router()



router.route('/')
    .get(petController.getAllPets)
    .post(petController.createNewPet)

router.route('/:id')
    .get(petController.getPet)
    .patch(petController.editPet)
    .delete(petController.deletePet)

module.exports = router