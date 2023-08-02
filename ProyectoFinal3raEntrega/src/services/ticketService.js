import PersistenceFactory from "../daos/factory.daos.js"

export default class TicketService {
  constructor () {
    this.ticketDao
    this.init()
  }

  init = async () => {
    this.ticketDao = await PersistenceFactory.getTicketPersistence()
  }

  createTicket = async (ticket) => {
    return await this.ticketDao.createTicket(ticket)
  }
}