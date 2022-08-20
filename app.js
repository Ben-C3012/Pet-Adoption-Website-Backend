const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorContoller')

app.use(morgan('dev'))

const petRouter = require('./routes/petRoutes')
const userRouter = require('./routes/userRoutes')


// 1. MIDDLEWARES
app.use(express.json())

app.use(cors({
    origin : '*',
    allowedHeaders: 'Access-Control-Allow-Origin'
}))

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    // console.log(req.headers)
    next()
})

app.use('/api/v1/pets', petRouter)
app.use('/api/v1/users', userRouter)

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`))
})

app.use(globalErrorHandler)


module.exports = app