import mongoose from "mongoose"

const userSchema = mongoose.Schema({
  usuario: String,
  email: String,
  contraseña: String,
  rol: {
    type: String,
    default: 'usuario'
  }
})

const userModel = mongoose.model('users', userSchema)

export default userModel