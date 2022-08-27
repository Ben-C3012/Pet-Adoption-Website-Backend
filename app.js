const express = require('express')
const app = express()

const morgan = require('morgan')
const cors = require('cors')
const cookieParser = require('cookie-parser');




const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorContoller')

app.use(morgan('dev'))

const petRouter = require('./routes/petRoutes')
const userRouter = require('./routes/userRoutes')


// 1. MIDDLEWARES
app.use(express.json())
app.use(cookieParser())

app.use('/public/pets', express.static('public/pets'))
app.use('/public/users', express.static('public/users'))

app.use(cors({ origin: 'http://localhost:3000', credentials: true }))

// Test MiddleWhere
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    console.log(req.cookies)
    next()
})

app.use('/api/v1/pets', petRouter)
app.use('/api/v1/users', userRouter)

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`))
})

app.use(globalErrorHandler)


module.exports = app