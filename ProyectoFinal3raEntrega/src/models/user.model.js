import mongoose, { Schema } from "mongoose"

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
  }
})

const userModel = mongoose.model('users', userSchema)

export default userModel