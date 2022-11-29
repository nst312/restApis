import Joi from "joi";
import User from "../model/userModel.js";
import bcrypt from 'bcrypt'
import CoustomErrorHandler from "../service/CoustomErrorHandler.js";
import JwtService from "../service/jwtService.js";
import {REFRESH_SECRET} from "../config/index.js";
import RefreshToken from "../model/refreshToken.js";


const registerController = {
    async register(req, res, next) {
        const querySchema = Joi.object({
            name: Joi.string().min(3).required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            repeat_password: Joi.ref('password')
        })
        const {error} = querySchema.validate(req.body);
        if (error) {
            return next(error)
        }


        // check email is already in use or not
        try {
            const exist = await User.exists({email: req.body.email})
            if (exist) {

                return next(CoustomErrorHandler.alreadyExist("this email id is already exist"))
            }
        } catch (err) {
            return next(err)
        }

        //hash password
        const hashPassword = await bcrypt.hash(req.body.password, 10)

        //payload for database
        const {name, email, password} = req.body
        const user = new User({
            name,
            email,
            password: hashPassword
        })
        let access_token;
        let refresh_token;
        try {
            const result = await user.save()
            //genrate token
            access_token = JwtService.sign({_id: result._id, role: result.role})
            refresh_token = JwtService.sign({_id: result._id, role: result.role}, '1y', REFRESH_SECRET)

            await RefreshToken.create({
                token: refresh_token
            })

        } catch (err) {
            next(err)
        }

        res.json({
            access_token,
            refresh_token
        })
    }
}

export default registerController