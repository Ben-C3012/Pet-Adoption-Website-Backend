const express = require('express')
const fs = require('fs')
const petController = require('../controllers/petController')
// AJV
const petSchema = require('../schema/petSchema')
const validateBody = require('../schema/validateBody')

const router = express.Router()

router.param('id', petController.checkID)


router.route('/')
    .get(petController.getAllPets)
    .post(validateBody(petSchema), petController.createNewPet)

router.route('/:id')
    .get(petController.getPet)
    .patch(petController.editPet)
    .delete(petController.deletePet)

module.exports = router