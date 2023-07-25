import passport from "passport"

// Definicimos la inicializacion de passport
export const initializePassport = () => {
  passport.serializeUser(( user, done ) => {
    done(null, user)
  })

  passport.deserializeUser(async (data, done) => {
    const user = data
    done(null, user)
  })
}