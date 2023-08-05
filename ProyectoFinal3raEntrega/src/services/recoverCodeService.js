import PersistenceFactory from "../daos/factory.daos.js"

export default class RecoverCodeService {
  constructor () {
    this.recoverCodeDao
    this.init()
  }

  init = async () => {
    this.recoverCodeDao = await PersistenceFactory.getRecoverCodePersistence()
  }

  getByCode = async (code) => {
    return await this.recoverCodeDao.getByCode(code)
  }

  generateCode = async (data) => {
    return await this.recoverCodeDao.generateCode(data)
  }
  
  eraseCode = async (code) => {
    return await this.recoverCodeDao.eraseCode(code)
  }
}