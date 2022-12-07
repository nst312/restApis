import User from "../model/userModel.js";
import CoustomErrorHandler from "../service/CoustomErrorHandler.js";

const admin = async (req, res, next) => {
    try {
        const user = await User.findOne({_id: req.user._id})
        if (user.role === 'admin') {
            next()
        } else {
            return next(CoustomErrorHandler.unAuthorized())
        }
    } catch (err) {
        return next(CoustomErrorHandler.serverError())

    }
}

export default admin