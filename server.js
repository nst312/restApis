import express from 'express'
import mongoose from "mongoose";
import {APP_PORT, DB_URL} from './config/index.js'
import router from "./router/index.js";
import errorHandler from "./middleware/errorHandler.js";
import * as path from "path";


const app = express()

//database connection
mongoose.connect(DB_URL).then(() => {
    console.log("database connected ")
}).catch((err) => {
    console.log(err)
})

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use("/api", router)
app.use(errorHandler)



app.listen(APP_PORT, () => {
    console.log(`server is listening on port ${APP_PORT}`)
})