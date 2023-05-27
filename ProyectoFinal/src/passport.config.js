import passport from "passport"
import GitHubStrategy from "passport-github2"
import userModel from "./models/user.model.js"

const appID = "339668"
const clientID = "Iv1.bc3be33234a7b53b"
const clientSecret = "78bf92021873755ff1a982eadcdf762012bd08eb"

const initializePassport = () => {

  passport.use('github', new GitHubStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: "http://127.0.0.1:8080/login/github"
  }, async (accessToken, refreshToken, profile, done) => {
    try{
      const user = await userModel.findOne({ email: {$eq: profile._json.email} })
      if (user) return done(null, user)

      const newUser = await userModel.create({
        usuario: profile._json.name,
        email: profile._json.email,
        contraseña: ""
      })

      return done(null, newUser)
    } catch(err) {
      return done("Error al iniciar sesion con Github")
    }
  }))

  passport.serializeUser((user, done) => {
    done(null, user)
  })

  passport.deserializeUser(async (data, done) => {
    const user = data
    done(null, user)
  })
}

export default initializePassport