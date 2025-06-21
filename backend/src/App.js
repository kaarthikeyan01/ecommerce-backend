import express, { urlencoded } from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"

const app= express()

dotenv.config({
        path:"../env"
    }
)

app.use(json())
app.use(urlencoded({ extended:true }))
app.use(cors())
app.use(cookieParser())

export {
    app
}