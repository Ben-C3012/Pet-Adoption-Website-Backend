const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path: './.env'})

const app = require('./app')

const DB = process.env.DATABASE
console.log(DB)


mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(con => {
    console.log(con)
    console.log('DB Connection Successful!')
})

const port = 4320
app.listen(port, () => {
    console.log('App Running On Port ' + port)
})


