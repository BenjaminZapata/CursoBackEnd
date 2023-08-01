import PersistenceFactory from "../daos/factory.daos.js"

export default class PersistenceService {
  constructor() {
    this.persistenceDao
    this.init()
  }

  init = async () => {
    this.persistenceDao = await PersistenceFactory.getPersistence()
    this.persistenceDao.connect()
  }
}