import PersistenceFactory from "../daos/factory.daos.js"

export default class UserService {
  constructor () {
    this.userDao
    this.init()
  }

  init = async () => {
    this.userDao = await PersistenceFactory.getUserPersistence()
  }

  getUsers = async () => {
    return await this.userDao.getUsers()
  }

  getById = async (id) => {
    return await this.userDao.getById(id)
  }

  getByEmail = async (email) => {
    return await this.userDao.getByEmail(email)
  }

  create = async (user) => {
    return await this.userDao.create(user)
  }

  deleteById = async (id) => {
    return await this.userDao.deleteById(id)
  }

  updateById = async (id, user) => {
    return await this.userDao.updateById(id, user)
  }
}