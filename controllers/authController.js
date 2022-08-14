const User = require('./../models/userModel')
const catchAsync = require('../utils/catchAsync')

exports.signup = async (req, res, next) => {

    try  {
        const newUser = await User.create(req.body)

        res.status.json({
            status: 'success',
            data: {
                user: newUser
            }
        })
    } catch(err) {
        res.status(400).json({
            status : 'fail', 
            data : {
                error : err.message
            }
        })
    }
   
   next()
}