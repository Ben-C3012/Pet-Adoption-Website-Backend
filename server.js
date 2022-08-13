const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: './.env' })

const app = require('./app')


const DB = process.env.DATABASE



mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
.then(() => console.log('DB Connection Successful 🚀' ))





const port = 8080
app.listen(port, () => {
    console.log('App Running On Port ' + port)
})


