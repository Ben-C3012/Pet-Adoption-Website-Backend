const express = require('express')
const petController = require('../controllers/petController')
const authController = require('../controllers/authController')

const router = express.Router()

// router.param('id', petController.checkID)

router.route('/')
    .get(petController.getAllPets)
    .post(authController.protect, petController.createNewPet)

router.route('/:id')
    .get(petController.getPet)
    .patch(petController.editPet)
    .delete(authController.protect, authController.restrictTo('admin'), petController.deletePet)

module.exports = router