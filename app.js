const fs = require('fs')
const express = require('express')
const app = express()

const petRouter = require('./routes/petRoutes')
const userRouter = require('./routes/userRoutes')

// const validateBody = require('./schema/validateBody')
// const { petSchema } = require('./schema/petSchema')

// app.use('/api/v1/pets/new', validateBody(petSchema))

app.use(express.json())

app.use((req, res, next) => {
    console.log('Hello From the Middleware 👋')
    next()
})

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})


app.use('/api/v1/pets', petRouter)
app.use('/api/v1/users', userRouter)


module.exports = app