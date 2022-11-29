import * as Joi from "joi"
import User from "../model/userModel.js"
import CoustomErrorHandler from "../service/CoustomErrorHandler.js"
import bcrypt from 'bcrypt'
import JwtService from '../service/jwtService.js'

const loginController ={
    async login(req, res ,next){
        // const loginSchema = joi.object({
        //     email : Joi.string().email().required(),
        //     password: Joi.string().required()
        // })

        // const {error} = loginSchema.validate(req.body)

        // if (error) {
        //     return next(error)
        // }
        try{
            const user = await User.findOne({
                email: req.body.email
            })
            if(!user === true){
                return next(CoustomErrorHandler.alreadyExist("email id dose not already exist"))
            }
            const match = await bcrypt.compare(req.body.password, user.password)
            if(!match){
                return next(CoustomErrorHandler.wrongCradentials())
            }
            const jwt_token =   JwtService.sign({_id: user._id, role: user.role})
            res.json({jwt_token})
        }catch(err){
            return next(err)
        }
    }
}

export default loginController