import Joi from "joi";
import Category from "../model/catagory.js";
import CoustomErrorHandler from "../service/CoustomErrorHandler.js";

const categoryController = {

    async addCategory(req, res, next) {
        const allCategory = await Category.find()
        // validation using set functionality
        const mySet1 = new Set()
        allCategory.map((e) => {
            mySet1.add(e.name)
        })

        if (mySet1.has(req.body.name)) {
            return next(CoustomErrorHandler.alreadyExist("data already exist"))
        }

        const productShema = Joi.object({
            name: Joi.string().required(),
        })

        const {error} = productShema.validate(req.body)
        if (error) {
            return next(error)
        }

        let document;
        try {
            document = await Category.create({
                ...req.body
            })


        } catch (e) {
            return next(e)
        }

        res.json(document)

    }

}

export default categoryController
