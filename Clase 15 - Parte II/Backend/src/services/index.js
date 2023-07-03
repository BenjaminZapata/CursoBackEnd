import MongoDao from "../models/MongoDao.js"
import UserService from "./userService.js"
// import ProductService from './productService.js'
import config from "../config/config.js"

let dao

switch(config.app.persistence){
  case "MONGO":
    dao = new MongoDao(config.mongo)
    break
}

export const userService = new UserService(dao)
// export const productService = new ProductService(dao)