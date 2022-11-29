import express from 'express'
import mongoose from "mongoose";
import {APP_PORT, DB_URL} from './config/index.js'
import router from "./router/index.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express()
app.use(express.json())

app.use("/api", router)
app.use(errorHandler)

//database connection
mongoose.connect(DB_URL).then(()=>{
    console.log("database connected ")
}).catch((err)=>{
    console.log(err)
})




app.listen(APP_PORT,()=>{
    console.log(`server is listening on port ${APP_PORT}`)
})