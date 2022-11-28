import * as Joi from "joi"
import User from "../model/userModel"
import CoustomErrorHandler from "../service/CoustomErrorHandler"
import bcrypt from 'bcrypt'

const loginController ={
    async login(req, res ,next){
        const loginSchema = joi.object({
            email : Joi.string().email().required(),
            password: Joi.string().required()
        })

        const {error} = loginSchema.validate(req.body)

        if (error) {
            return next(error)
        }
        try{
            const user = User.findOne({
                email: req.body.email
            })
            if(!user){
                return next(CoustomErrorHandler.wrongCradentials())
            }

            const match = await bcrypt.compare(req.body.password, user.password)
            if(!match){
                return next(CoustomErrorHandler.wrongCradentials())
            }
            const token =  access_token= JwtService.sign({_id: user._id, role: user.role})
            res.json({token})
        }catch(err){
            return next(err)
        }
    }
}

export default loginController