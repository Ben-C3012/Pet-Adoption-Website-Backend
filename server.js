const dotenv = require('dotenv')
dotenv.config({path: './.env'})
const app = require('./app')



console.log(process.env.HELLO)

const port = 3003
app.listen(port, () => {
    console.log('App Running On Port ' + port)
})


