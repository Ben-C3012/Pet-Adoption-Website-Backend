const express = require('express')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')


const router = express.Router()

router.post('/signup', authController.signup)
router.post('/login', authController.login)

router.post('/forgotPassword', authController.forgotPassword)
// router.post('/resetPassword', authController.resetPassword)

router.patch('/updateMyPassword', authController.protect, authController.updatePassword)

router.patch(
    '/updateMe', authController.protect, userController.uploadUserPhoto,
    userController.updateMe
)

router.route('/')
    .get(authController.protect,
        authController.restrictTo('admin')
        , userController.getAllUsers)

    .post(userController.createUser)

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

router.route('/:id/adopt')
    .patch(authController.protect, userController.adoptPet)


module.exports = router