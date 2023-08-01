import mongoose from "mongoose"
import { mongoURL } from "../../config/main.config.js"
import logger from "../../utils/logger.js"

export default class MongoClientDAO {
  constructor() {
    this.connected = false
    this.client = mongoose
    this.connect()
  }

  connect = async () => {
    try {
      if (this.connected) throw new Error("Already connected to MongoDB")
      await this.client.connect(mongoURL)
      logger.info("INFO: succesful connection to MongoDB")
    } catch (err) {
      logger.fatal(`ERROR: ${err}`)
    }
  }
}