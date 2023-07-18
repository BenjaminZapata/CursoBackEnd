import logger from '../logger.js'
import UserModel from '../models/user.model.js'
import { createHash, passwordValidation } from '../utils.js'

const register = async (req, res) => {
  const { first_name, last_name, email, password } = req.body
  if (!first_name || !last_name || !email || !password) return res.status(400).send({ status: "error", message: "All fields are required" })
  console.log(`Registering ${first_name} ${last_name}, ${email}, password: ${password}`)

  const exists = await UserModel.findOne({ email })
  if (exists) return res.status(400).send({ status: "Error", message: "There is an user already registered with that email" })

  const hashedPassword = await createHash(password)
  await UserModel.create({
    first_name, last_name, email, password: hashedPassword
  })

  logger.log('info', `User successfully registered with email ${email} - ${new Date().toLocaleTimeString()}`)
  res.send({ status: "success", message: "User registered" })
}

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).send({ status: "error", message: "All fields are required" })

  const user = await UserModel.findOne({ email })
  if (!user) return res.status(400).send({ status: "error", message: "No user registered with that email" })

  const isValidPassword = passwordValidation(user, password)
  if (!isValidPassword) return res.status(400).send({ status: "error", message: "Password is not valid" })

  logger.log('info', `Logged in succesfully on ${email} - ${new Date().toLocaleTimeString()}`)
  res.send({ status: "success", message: "Logged in"})
}

export default { register, login }