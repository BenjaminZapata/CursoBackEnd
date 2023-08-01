import PersistenceFactory from "../daos/factory.daos.js"

export default class UserService {
  constructor () {
    this.userDao
    this.init()
  }

  init = async () => {
    this.userDao = await PersistenceFactory.getUserPersistence()
  }

  getByEmail = async (email) => {
    return await this.userDao.getByEmail(email)
  }

  create = async (user) => {
    return await this.userDao.create(user)
  }

  updateById = async (id, user) => {
    return await this.userDao.updateById(id, user)
  }
}