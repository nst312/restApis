import mongoose from "mongoose";
const Schema= mongoose.Schema

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
},{ timestamps: true})

const Product = new mongoose.model("products", productSchema)
export default Product