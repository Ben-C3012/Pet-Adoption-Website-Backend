const express = require('express')

const router = express.Router()

getAllUsers = (req, res, next) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })

}

createUser = (req, res, next) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })

}

getUser = (req, res, next) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

updateUser = (req, res, next) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

deleteUser = (req, res, next) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

router.route('/')
    .get(getAllUsers)
    .post(createUser)

router.route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)


module.exports = router