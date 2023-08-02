import ticketModel from "../../models/ticket.model.js"

export default class TicketsMongoDAO {
  constructor() {}

  createTicket = async (ticket) => {
    return await ticketModel.create(ticket)
  }
}