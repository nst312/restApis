import CoustomErrorHandler from "../service/CoustomErrorHandler.js";
import JwtService from "../service/jwtService.js";

const auth = async (req, res, next) => {
    let authHeader = req.headers.authorization
    if (!authHeader) {
        return next(CoustomErrorHandler.unAuthorized())
    }
    try {
        const {_id, role}= await JwtService.verify(authHeader)
        const user ={
            _id,
            role
        }
        req.user = user
        next()
    }catch (err){
        return next(CoustomErrorHandler.unAuthorized())
    }
}
export default auth