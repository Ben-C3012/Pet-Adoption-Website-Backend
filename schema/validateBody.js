const Ajv = require("ajv")
const ajv = new Ajv()



function validateBody(petSchema) {
    return (req, res, next) => {
        const data = req.body
        const valid = ajv.validate(petSchema, data)
        if (!valid) {
            console.log(ajv.errors)
            res.status(400).send(ajv.errors[0])
            return
        }
        next()
    }
}

module.exports = validateBody