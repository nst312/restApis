import express from "express";
import registerController from "../controllers/registerController.js";
import loginController from "../controllers/loginController.js";
import userController from "../controllers/userController.js";
import auth from "../middleware/auth.js";
import tokenController from "../controllers/tokenController.js";
import productController from "../controllers/productController.js";
import admin from "../middleware/admin.js";
import categoryController from "../controllers/categoryController.js";
import aggrigationController from '../controllers/aggrigationController.js'

const router = express.Router()


// login - registration
router.post('/register', registerController.register)
router.post('/login', loginController.login)
router.post('/logout', auth, loginController.logout)
router.get('/me', auth, userController.me)
router.post('/refreshToken', tokenController.refreshToken)

// Products
router.post('/products', productController.store)
router.post('/products/:id', [auth, admin], productController.update)
router.delete('/products/:id', [auth, admin], productController.delete)
router.get('/products', [auth, admin], productController.index)
router.get('/uploads', express.static('uploads'))
router.get('/products/:id', [auth, admin], productController.show)

// Category
router.post('/category', categoryController.addCategory)
router.get('/aggregate', aggrigationController.aggregate)


export default router