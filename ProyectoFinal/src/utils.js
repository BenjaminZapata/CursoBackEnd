import { fileURLToPath } from 'url'
import { dirname } from 'path'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import bcrypt from 'bcrypt'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const PRIVATE_KEY = "s3cr3tK3y"

export const generateToken = user => {
  const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '24h' })
  return token
}

export const authToken = (req, res, next) => {
  let token = req.header.authorization
  if (!token) token = req.cookies['testCookie']
  if (!token) return res.status(401).json({ error: "Not auth"})
  jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
    if (error) return res.status(403).json({ error: "Not authorized" })
    req.user = credentials.user
    next()
  })
}

export const passportCall = ( strategy ) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function(err, user, info) {
      if (err) return next(err)
      if (!user){
        return res.status(401).send({ error: info.messages ? info.messages : info.toString() })
      }
      req.user = user
      next()
    })(req, res, next)
  }
}

export const authorization = role => {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized '})
    if (req.user.user.role != role) return res.status(403).json({ error: 'No permission' })
    next()
  }
}

export const createHash = ( password ) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const isValidPassword = ( user, password ) => {
  return bcrypt.compareSync(password, user.password)
}

export default __dirname