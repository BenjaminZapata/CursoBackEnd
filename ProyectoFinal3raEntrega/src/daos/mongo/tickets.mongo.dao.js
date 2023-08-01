import ticketModel from "../../models/ticket.model.js"

export default class TicketsMongoDAO {
  constructor() {}

  createTicket = async ( code, date, total, purchaser ) => {
    return await ticketModel.create({ code, date, total, purchaser })
  }
}