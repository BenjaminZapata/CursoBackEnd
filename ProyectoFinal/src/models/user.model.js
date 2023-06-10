import mongoose, { Schema } from "mongoose"

// const userSchema = mongoose.Schema({
//   usuario: String,
//   email: String,
//   contraseña: String,
//   rol: {
//     type: String,
//     default: 'usuario'
//   }
// })

// Entrega clase 13
const userSchema = mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true
  },
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