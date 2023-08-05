import mongoose from 'mongoose'

const recoverSchema = mongoose.Schema({
  id: String,
  email: String,
  code: String,
  expires_in: Number
})

const recoverModel = mongoose.model('recoverCodes', recoverSchema)

export default recoverModel