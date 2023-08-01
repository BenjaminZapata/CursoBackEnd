import { Router } from "express"
import logger from "../utils/logger.js"

const router = Router()

router.get('/', (req, res) => {
  logger.log('debug', `Testing logs - ${new Date().toLocaleTimeString()}`)
  logger.log('http', `Testing logs - ${new Date().toLocaleTimeString()}`)
  logger.log('info', `Testing logs - ${new Date().toLocaleTimeString()}`)
  logger.log('warning', `Testing logs - ${new Date().toLocaleTimeString()}`)
  logger.log('error', `Testing logs - ${new Date().toLocaleTimeString()}`)
  logger.log('fatal', `Testing logs - ${new Date().toLocaleTimeString()}`)
  res.status(200).send("Se completo el test de loggers")
})

export default router