import Joi from "joi";
import User from "../model/userModel";
import bcrypt from 'bcrypt'
import CoustomErrorHandler from "../service/CoustomErrorHandler";
import JwtService from "../service/jwtService";


const registerController = {
    async register(req, res, next) {
        const validateFunction = async (data) => {
            const querySchema = Joi.object({
                name: Joi.string().min(3).required(),
                email: Joi.string().email().required(),
                password: Joi.string().required().pattern(new RegExp('^[a-zA_Z0-9]{3-30}$')),
                repeat_password: Joi.ref('password')
            })
            await Joi.validate(data, querySchema);
        }
        // validateFunction(req.body)


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
        try {
            const result = await user.save()
            //genrate token
            access_token= JwtService.sign({_id: result._id, role: result.role})
        } catch (err) {
            next(err)
        }

        res.json({
            access_token
        })
    }
}

export default registerController