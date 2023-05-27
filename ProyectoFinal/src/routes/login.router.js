import { Router } from "express"
import userModel from '../models/user.model.js'
import { createHash, isValidPassword } from "../utils.js"
import passport from "passport"

const router = Router()

// PANTALLA DE BIENVENIDA
router.get('/', (req, res) => {
  if (req.session.user) return res.redirect('/api/products')
  res.render('login')
})

// PANTALLA DE REGISTRO
router.get('/register', (req, res) => {
  res.render('register')
})

// INICIAR SESION
router.get('/login/:user/:password', async (req, res) => {
  let user = req.params.user
  let password = req.params.password
  let userData = await userModel.find({ usuario: {$eq: user}})
  if (userData.length == 0){
    return res.status(401).send('El usuario no existe')
  }
  let valid = isValidPassword(userData[0], password)
  if (!valid){
    return res.status(401).send('Los datos ingresados son incorrectos')
  }
  req.session.user = userData
  res.redirect('/api/products')
})

// INICIAR SESION CON GITHUB
router.get('/github', passport.authenticate('github', { scope: ["usuario:email"] }, (req, res) => {}))

router.get('/login/github', passport.authenticate('github', { failureRedirect: '/login'}), async (req, res) =>{
  req.session.user = req.user,
  res.redirect('/')
})

// DESCONECTARSE DE LA SESION
router.get('/logout', (req, res) => {
  if (req.session.user){
    req.session.destroy( err => {
      if (err) return res.send('Error al desconectarse')
    })
  }
  res.redirect('/')
})

// REGISTRAR UN USUARIO
router.post('/register/:user/:email/:password', async (req, res) => {
  let user = req.params.user
  let password = req.params.password
  let email = req.params.email
  let userData = await userModel.find({$or: [{usuario: {$eq: user}}, {email: {$eq: email}}]})
  let userExists = userData.length == 1 ? true : false
  if (userExists){
    res.status(200).send('Ya existe un usuario con ese nombre o email')
    return
  }
  let hashedPassword = createHash(password)
  await userModel.create({ usuario: user, email: email, contraseña: hashedPassword })
  res.status(200).send('Usuario creado con exito')
})

export default router