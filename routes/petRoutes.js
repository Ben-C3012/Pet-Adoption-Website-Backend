const express = require('express')
const petController = require('../controllers/petController')
const authController = require('../controllers/authController')

const router = express.Router()


router.route('/')
    .get(petController.getAllPets)
    .post(authController.protect,
        authController.restrictTo('admin'),
        petController.uploadPetPhoto,
        petController.uploadToCloudinary)

// Update Pet Photo
router.route('/:id/photo')
    .patch(authController.protect, petController.uploadPetPhoto, petController.uploadToCloudinaryPet)


router.route('/:id')
    .get(petController.getPet)
    .patch(authController.protect, authController.restrictTo('admin'), petController.uploadPetPhoto, petController.editPet)


    .delete(authController.protect, authController.restrictTo('admin'), petController.deletePet)


router.route('/:id/save')
    .patch(authController.protect, petController.savePet)
    .delete(authController.protect, petController.deleteSavedPet)

router.route('/:id/adopt')
    .patch(authController.protect, petController.adoptPet)

router.route('/user/:id')
    .get(authController.protect, petController.getUserPets)

router.route('/return/:id')
    .post(authController.protect, petController.returnPet)



module.exports = router