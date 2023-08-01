import PersistenceFactory from "../daos/factory.daos.js"

export default class TicketService {
  constructor () {
    this.ticketDao
    this.init()
  }

  init = async () => {
    this.ticketDao = await PersistenceFactory.getTicketPersistence()
  }

  createTicket = async (code, date, total, purchaser) => {
    return await this.productDao.createTicket(code, date, total, purchaser)
  }
}