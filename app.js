const fs = require('fs')
const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(morgan('dev'))



const petRouter = require('./routes/petRoutes')
const userRouter = require('./routes/userRoutes')



app.use(express.json())



app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})


app.use('/api/v1/pets', petRouter)
app.use('/api/v1/users', userRouter)


module.exports = app