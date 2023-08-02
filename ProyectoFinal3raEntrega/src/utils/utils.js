import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import uuid4 from 'uuid4'

const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename).slice(0, -6)

export const createHash = ( password ) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const isValidPassword = ( user, password ) => {
  return bcrypt.compareSync(password, user.password)
}

export const generateRandomID = () => {
  return uuid4()
}