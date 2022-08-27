const express = require('express')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')


const router = express.Router()

router.post('/signup', authController.signup)

router.post('/login', authController.login)
    .get(authController.logout)

router.get('/logout', authController.logout)

router.post('/isloggedin', authController.isLoggeedIn)

router.post('/forgotPassword', authController.forgotPassword)
// router.post('/resetPassword', authController.resetPassword)

router.patch('/updateMyPassword', authController.protect, authController.updatePassword)

router.patch('/updateMe',
    authController.protect,
    userController.uploadUserPhoto,
    // userController.uploadToCloudinary,
    userController.updateMe
)

router.route('/photo')
    .patch(authController.protect, userController.uploadUserPhoto, userController.uploadToCloudinary)

router.route('/').get(authController.protect, authController.restrictTo('admin'), userController.getAllUsers)

    .post(userController.createUser)

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)





module.exports = router