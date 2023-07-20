import express from 'express'
import mongoose from 'mongoose'
import productRouter from './routes/products.route.js'

const MONGO_URL = "mongodb+srv://benjazapata:BetoMongo1991@db.loenabf.mongodb.net/Clase17DB"
const app = express()
const mongoConnection = await mongoose.connect(MONGO_URL)

app.use('/', productRouter)

app.listen(8080, () => console.log("Server up on PORT 8080"))