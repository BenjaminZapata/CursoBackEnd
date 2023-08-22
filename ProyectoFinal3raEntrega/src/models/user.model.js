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
  },
  documents: [{
    document: {
      name: String,
      reference: String
    }
  }],
  last_connection: String,
  profile_photo: {
    type: String,
    default: '/profiles/user.jpg'
  }
})

const userModel = mongoose.model('users', userSchema)

export default userModel