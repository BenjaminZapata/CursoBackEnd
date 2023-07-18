import express from 'express'
import mongoose from 'mongoose'
import sessionRouter from './src/routes/session.route.js'
import logger from './src/logger.js'

const app = express()
const PORT = 8080
const connection = mongoose.connect("mongodb+srv://benjazapata:BetoMongo1991@db.loenabf.mongodb.net/Clase18DB")

app.use(express.json())
app.use('/api/session', sessionRouter)

app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT} - ${new Date().toLocaleTimeString()}`)
  logger.log('info', `Server listening on port ${PORT} - ${new Date().toLocaleTimeString()}`)
})