import passport from "passport"
import { createHash, isValidPassword } from "./utils.js"
import local from "passport-local"
import GitHubStrategy from "passport-github2"
import userModel from "./models/user.model.js"

const LocalStrategy = local.Strategy
const appID = "339668"
const clientID = "Iv1.bc3be33234a7b53b"
const clientSecret = "78bf92021873755ff1a982eadcdf762012bd08eb"

const initializePassport = () => {

  passport.use('register', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email'
  }, async (req, username, password, done) => {
    const {first_name, last_name, email, age } = req.body
    try {
      const user = await userModel.findOne({email: username})
      if(user) {
        console.log("Ya existe un usuario con ese email");
        return done(null, false)
      }
      const newUser = {
        first_name,
        last_name,
        email,
        age,
        password: createHash(password)
      }
      const result = await userModel.create(newUser)
      return done(null, result)
    } catch (error) {
      return done("Error al obtener el usuario: " + error)
    }
  }))

  passport.use('login', new LocalStrategy({
    usernameField: 'email'
  }, async (username, password, done) => {
    try {
      const user = await userModel.findOne({email: username})
      if(!user) {
        console.log("No existe un usuario con ese email");
        return done(null, user)
      }
      if(!isValidPassword(user, password)) return done(null, false)
      return done(null, user)
    } catch (error) {
      return done("Error al validar el usuario: " + error)
    }
  }))

  // passport.use('github', new GitHubStrategy({
  //   clientID: clientID,
  //   clientSecret: clientSecret,
  //   callbackURL: "http://127.0.0.1:8080/login/github"
  // }, async (accessToken, refreshToken, profile, done) => {
  //   try{
  //     const user = await userModel.findOne({ email: {$eq: profile._json.email} })
  //     if (user) return done(null, user)

  //     const newUser = await userModel.create({
  //       usuario: profile._json.name,
  //       email: profile._json.email,
  //       contraseña: ""
  //     })

  //     return done(null, newUser)
  //   } catch(err) {
  //     return done("Error al iniciar sesion con Github")
  //   }
  // }))

  passport.serializeUser((user, done) => {
    done(null, user)
  })

  passport.deserializeUser(async (data, done) => {
    const user = data
    done(null, user)
  })
}

export default initializePassport