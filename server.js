import express from 'express'
// import {APP_PORT, DB_URL} from './config/index'
// import router from "./router";
const router = require('./router/index')
import errorHandler from "./middleware/errorHandler";
import mongoose from "mongoose";

//database connection
mongoose.connect(DB_URL).then(()=>{
    console.log("database connected ")
}).catch((err)=>{
    console.log(err)
})

const app = express()
app.use(express.json())

app.use("/api",router)
app.use(errorHandler)


app.listen(APP_PORT,()=>{
    console.log(`server is listening on port ${APP_PORT}`)
})