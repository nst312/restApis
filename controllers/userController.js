import User from "../model/userModel.js";
import CoustomErrorHandler from "../service/CoustomErrorHandler.js";

const userController = {
    async me(req, res, next) {
        try {

            const user = await User.findOne({
                _id: req.user._id
                // remove filed for proper view (-{fieldName})
            }).select('-password -updatedAt -createdAt -__v')

            if (!user) {
                return next(CoustomErrorHandler.alreadyExist('user data not found'))
            }

            res.json({
                user
            })

        } catch (err) {
            return next(err)
        }
    }
}

export default userController