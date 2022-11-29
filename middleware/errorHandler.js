import {DEBUG_MODE} from "../config/index.js";
import ValidationError from 'joi'
import CoustomErrorHandler from "../service/CoustomErrorHandler.js";

const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let data = {
        message: 'internal server error ',
        ...(DEBUG_MODE === 'true' && {originalError: err.message})
    }
    if ( ValidationError) {

        statusCode = 422;
        data = {
            message: err.message
        }

    
    }
    if (CoustomErrorHandler) {

        statusCode = err.status;
        data = {
            statusCode: statusCode,
            message: err.message
        }
    }
    return res.status(statusCode).json(data)


}
export default errorHandler