import express from "express";
import registerController from "../controllers/registerController.js";
import loginController from "../controllers/loginController.js";
import userController from "../controllers/userController.js";
import auth from "../middleware/auth.js";
import tokenController from "../controllers/tokenController.js";
import productController from "../controllers/productController.js";
import admin from "../middleware/admin.js";

const router = express.Router()

router.post('/register', registerController.register)
router.post('/login', loginController.login)
router.post('/logout', auth, loginController.logout)
router.get('/me', auth, userController.me)
router.post('/refreshToken', tokenController.refreshToken)

router.post('/products', [auth, admin], productController.store)
router.post('/products/:id', productController.update)
router.delete('/products/:id', productController.delete)


export default router