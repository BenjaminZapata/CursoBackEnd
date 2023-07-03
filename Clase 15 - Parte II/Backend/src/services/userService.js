import UserModel from "../models/userModel.js"
import Repository from "./Repository.js"

export default class UserService extends Repository {
  constructor(dao) {
    // super es la keyword utilizada para acceder a las
    // propiedades de la clase superior de la cual se extiende
    super(dao, UserModel.model)
  }
}