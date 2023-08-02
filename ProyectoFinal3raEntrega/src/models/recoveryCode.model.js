import mongoose from 'mongoose'

const recoverSchema = mongoose.Schema({
  id: String,
  code: String,
  expires_in: Number
})

const recoveryModel = mongoose.model('recoveryCodes', recoverSchema)

export default recoveryModel