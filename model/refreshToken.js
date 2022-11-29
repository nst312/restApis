import mongoose from "mongoose";

const schema = mongoose.Schema;

const refreshTokenShema = new schema({
    token : {
        type: String,
        unique: true
    }
   }, {timestamps: false})

const RefreshToken= new mongoose.model('refreshTokens', refreshTokenShema)

export default RefreshToken