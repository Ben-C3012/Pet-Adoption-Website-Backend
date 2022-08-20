
const AppError = require("../utils/appError")

const handleJWTError = () => new AppError('Invalid Token Please Log In Again', 401)
const handleJWTExpiredError = () => new AppError('Your Token Has Expired! Plesse Log In Again', 401)


const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperationonal) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })

    // Programming or other error: don't want to leak details to the client
    } else {
        console.error('ERROR 💥 ', err)
        res.status(500).json({
            status: 'error',
            message: 'Somthing Went Wrong'

        })
    }
}


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res)
    } else if (process.env.NODE_ENV === 'production') {
        sendErrorProd(err, res)
    }

    if (err.name === 'JsonWebTokenError') err = handleJWTError()
    if (err.name === 'TokenExpiredError') err = handleJWTExpiredError()

}