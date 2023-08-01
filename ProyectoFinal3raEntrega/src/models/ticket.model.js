import mongoose from 'mongoose'

const ticketSchema = mongoose.Schema({
  code: String,
  purchase_datetime: Number,
  amount: Number,
  purchaser: String
})

const ticketModel = mongoose.model('tickets', ticketSchema)

export default ticketModel