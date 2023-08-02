import mongoose from 'mongoose'

const ticketSchema = mongoose.Schema({
  code: String,
  purchase_datetime: Number,
  amount: Number,
  purchaser: String,
  products: []
})

const ticketModel = mongoose.model('tickets', ticketSchema)

export default ticketModel