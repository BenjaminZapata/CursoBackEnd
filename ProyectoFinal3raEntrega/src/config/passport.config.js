import passport from "passport"
import GitHubStrategy from 'passport-github2'
import { githubClientID, githubClientSecret } from "./main.config.js"

// Definicimos la inicializacion de passport
export const initializePassport = () => {
  passport.use('github', new GitHubStrategy({
    clientID: githubClientID,
    clientSecret: githubClientSecret,
    callbackURL: "http://127.0.0.1:8080/login/github"
  }, async (accessToken, refreshToken, profile, done) => {
    try{
      const user = await userModel.findOne({ email: {$eq: profile._json.email} })
      if (user) return done(null, user)

      const newUser = await userModel.create({
        email: profile._json.email,
        password: ""
      })

      return done(null, newUser)
    } catch(err) {
      return done("ERROR: Cannot login via Github")
    }
  }))

  passport.serializeUser(( user, done ) => {
    done(null, user)
  })

  passport.deserializeUser(async (data, done) => {
    const user = data
    done(null, user)
  })
}