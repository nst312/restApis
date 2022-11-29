import Joi from "joi"
import User from "../model/userModel.js"
import CoustomErrorHandler from "../service/CoustomErrorHandler.js"
import bcrypt from 'bcrypt'
import JwtService from '../service/jwtService.js'
import {REFRESH_SECRET} from "../config/index.js";
import RefreshToken from "../model/refreshToken.js";

const loginController = {
    async login(req, res, next) {
        const loginSchema = Joi.object({
            email: Joi.string().email().required(), password: Joi.string().required()
        })

        const {error} = loginSchema.validate(req.body)

        if (error) {
            return next(error)
        }
        try {
            const user = await User.findOne({
                email: req.body.email
            })
            if (!user === true) {
                return next(CoustomErrorHandler.alreadyExist("email id dose not already exist"))
            }
            const match = await bcrypt.compare(req.body.password, user.password)
            if (!match) {
                return next(CoustomErrorHandler.wrongCradentials())
            }
            const jwt_token = JwtService.sign({_id: user._id, role: user.role})
            const refresh_token = JwtService.sign({_id: user._id, role: user.role}, '1y', REFRESH_SECRET)

            await RefreshToken.create({
                token: refresh_token
            })

            res.json({jwt_token, refresh_token})
        } catch (err) {
            console.log(err)
            return next(err)
        }
    },
    async logout(req, res, next){
        const refreshShema = Joi.object({
            refresh_token: Joi.string().required()
        })
        const {error} = refreshShema.validate(req.body)
        if (error) {
            next(error)
        }
        try {
            await RefreshToken.deleteOne({
                token: req.body.refresh_token
            })
        }catch (err){
            return next(new Error("somthing went wrong"))
        }

        res.json(1)
    }
}

export default loginController