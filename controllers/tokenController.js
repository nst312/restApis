import Joi from "joi";
import RefreshToken from "../model/refreshToken.js";
import CoustomErrorHandler from "../service/CoustomErrorHandler.js";
import JwtService from "../service/jwtService.js";
import {REFRESH_SECRET} from "../config/index.js";
import User from "../model/userModel.js";

const tokenController = {
    async refreshToken(req, res, next) {
        const refreshShema = Joi.object({
            refresh_token: Joi.string().required()
        })
        const {error} = refreshShema.validate(req.body)
        if (error) {
            next(error)
        }
        let refreshToken;
        try {
            refreshToken = await RefreshToken.findOne({
                token: req.body.refresh_token
            })
            if (!refreshToken) {
                return next(CoustomErrorHandler.unAuthorized("invalid refresh token"))
            }
            let userId;
            const {_id} = await JwtService.verify(refreshToken.token, REFRESH_SECRET)
            userId = _id
            const user = await User.findOne({
                _id: userId
            })
            if (!user) {
                return next(CoustomErrorHandler.unAuthorized("no user found"))

            }
            const jwt_token = JwtService.sign({_id: user._id, role: user.role})
            const refresh_token = JwtService.sign({_id: user._id, role: user.role}, '1y', REFRESH_SECRET)

            await RefreshToken.create({
                token: refresh_token
            })

            res.json({jwt_token, refresh_token})

        } catch (err) {
            return next(new Error("somthing went wrong " + err.message))
        }
    }
}
export default tokenController