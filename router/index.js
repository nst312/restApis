import express from "express";
import registerController from "../controllers/registerController.js";
import loginController from "../controllers/loginController.js";

const router = express.Router()     

router.post('/register',registerController.register)
router.post('/login',loginController.login)


export default router