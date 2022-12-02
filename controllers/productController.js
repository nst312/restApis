import Product from "../model/product.js";
import multer from 'multer'
import * as path from "path";
import CoustomErrorHandler from "../service/CoustomErrorHandler.js";
import * as fs from "fs";
import Joi from "joi";

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}${path.extname(file.originalname)}`
        cb(null, uniqueName)
    }
})
const imageMulter = multer({storage, limits: {fileSize: 1000000 * 10}}).single('image')
const productController = {
    async store(req, res, next) {
        imageMulter(req, res, async (err) => {
            if (err) {
                return next(CoustomErrorHandler.serverError(err.message))
            }
            const filePath = req.file.path
            const appRoot = path.resolve()
            console.log(appRoot)

            //validation
            const productShema = Joi.object({
                name: Joi.string().required(),
                price: Joi.string().required(),
                size: Joi.string().required()
            })
            const {error} = productShema.validate(req.body)
            if (error) {
                fs.unlink(`${appRoot}/${filePath}`, (err) => {
                    if (err) {
                        return next(CoustomErrorHandler.serverError())
                    }

                })
                return next(error)
            }


            let document
            try {
                document = await Product.create({
                    ...req.body,
                    image: filePath
                })
            } catch (err) {
                return next(err)
            }
            res.status(201).json(document)
        })
    },

    update(req, res, next) {
        imageMulter(req, res, async (err) => {
            if (err) {
                return next(CoustomErrorHandler.serverError(err.message))
            }
            let filePath;
            if (req.file) {
                filePath = req.file.path
            }
            const appRoot = path.resolve()

            //validation
            const productShema = Joi.object({
                name: Joi.string().required(),
                price: Joi.string().required(),
                size: Joi.string().required(),
                image: Joi.string()
            })
            const {error} = productShema.validate(req.body)
            if (error) {
                if (req.file) {
                    fs.unlink(`${appRoot}/${filePath}`, (err) => {
                        if (err) {
                            return next(CoustomErrorHandler.serverError())
                        }
                    })
                }
                return next(error)
            }
            let document
            const {name, price, size} = req.body
            try {
                document = await Product.findOneAndUpdate({
                    _id: req.params.id
                },{
                    name, price, size,
                    ...(req.file && {image: filePath})
                },{
                    new: true
                })
            } catch (err) {
                console.log("here is comming")
                return next(err)
            }
            res.status(201).json(document)
        })

    },

    async delete(req, rse, next){
        const document = await Product.findOneAndRemove({_id:req.params.id})
        if (!document){
            return next(new Error("nothing to delete"))
        }
        const imagePath = document.image
        const appRoot = path.resolve()

        fs.unlink(`${appRoot}/${imagePath}`,(e)=>{
            if (e){
                return next(CoustomErrorHandler.serverError())
            }
        })
        rse.json(document)
    }


}
export default productController