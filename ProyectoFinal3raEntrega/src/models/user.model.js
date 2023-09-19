import mongoose, { Schema } from "mongoose"
import { generateTimestamp } from "../utils/utils.js"

const userSchema = mongoose.Schema({
  email: String,
  age: Number,
  password: String,
  cart: {
    type: Schema.Types.ObjectId,
    ref: 'carts'
  },
  role: {
    type: String,
    default: 'user'
  },
  documents: [{
    document: {
      name: String,
      reference: String
    }
  }],
  last_connection: {
    type: Number,
    default: generateTimestamp()
  },
  profile_photo: {
    type: String,
    default: '/profiles/user.jpg'
  }
})

const userModel = mongoose.model('users', userSchema)

export default userModel