import mongoose from "mongoose";

const Schema= mongoose.Schema

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    }
},{ timestamps: true})


const Category = new mongoose.model('categories', categorySchema)

export default Category