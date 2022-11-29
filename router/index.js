import express from "express";
import registerController from "../controllers/registerController.js";
import loginController from "../controllers/loginController.js";
import userController from "../controllers/userController.js";
import auth from "../middleware/auth.js";
import tokenController from "../controllers/tokenController.js";

const router = express.Router()

router.post('/register', registerController.register)
router.post('/login', loginController.login)
router.post('/logout',auth, loginController.logout)
router.get('/me', auth, userController.me)
router.post('/refreshToken',tokenController.refreshToken)


export default router