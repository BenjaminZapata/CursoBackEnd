import { Router } from "express"
import userModel from '../models/user.model.js'
import { createHash, isValidPassword } from "../utils.js"
import passport from "passport"
import cartModel from "../models/cart.model.js"

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
router.get('/login/:email/:password', async (req, res) => {
  let email = req.params.email
  let password = req.params.password
  let userData = await userModel.findOne({ email: {$eq: email}})
  if (!userData){
    return res.status(401).send('El usuario no existe')
  }
  let valid = isValidPassword(userData, password)
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
  let userData = await userModel.findOne({email: {$eq: email}})
  // let userData = await userModel.find({$or: [{usuario: {$eq: user}}, {email: {$eq: email}}]})
  if (userData){
    res.status(200).send('Ya existe un usuario con ese nombre o email')
    return
  }
  let hashedPassword = createHash(password)
  let cartData = await cartModel.findOne({ id: {$eq: 1}})
  // await userModel.create({ usuario: user, email: email, contraseña: hashedPassword })
  await userModel.create({ 
    first_name: "Nombre",
    last_name: "Apellido",
    email: email,
    password: hashedPassword, 
    age: "18",
    cart: {
      _id: cartData._id
    }
  })
  res.status(200).send('Usuario creado con exito')
})

export default router