const express = require('express')
const petController = require('../controllers/petController')
const authController = require('../controllers/authController')

const router = express.Router()


router.route('/')
    .get(petController.getAllPets)
    .post(authController.protect, authController.restrictTo('admin'), petController.uploadPetPhoto, petController.uploadToCloudinary, petController.createNewPet)




router.route('/:id')
    .get(petController.getPet)
    .patch(authController.protect, authController.restrictTo('admin'), petController.uploadPetPhoto, petController.editPet)
    .delete(authController.protect, authController.restrictTo('admin'), petController.deletePet)


router.route('/:id/save')
    .put(authController.protect, petController.savePet)
    .delete(authController.protect, petController.deleteSavedPet)


module.exports = router