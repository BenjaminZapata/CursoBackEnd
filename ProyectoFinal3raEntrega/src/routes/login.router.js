import { Router } from "express"
import userModel from '../models/user.model.js'
import { createHash, isValidPassword } from "../utils/utils.js"

const router = Router()

// GET / - Pantalla de inicio
router.get('/', (req, res) => {
  console.log(req.session)
  // Si el usuario ya esta logeado en la session, lo redirigimos a la lista de productos
  if (req.session.user) return res.redirect('/api/products')
  res.render('login')
})

// GET /register - Pantalla de registro
router.get('/register', (req, res) => {
  // Si el usuario ya esta logeado en la session, lo redirigimos a la lista de productos
  if (req.session.user) return res.redirect('/api/products')
  res.render('register')
})

// GET /login/:email/:password - Logea al usuario
router.get('/login', async (req, res) => {
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

// POST /register - registra un usuario a la DB
router.post('/register', async (req, res) => {
  let email = req.params.email
  let password = req.params.password
  let age = req.params.age
  let userData = await userModel.findOne({email: {$eq: email}})
  if (userData){
    res.status(200).send('Ya existe un usuario con ese email')
    return
  }
  let hashedPassword = createHash(password)
  let cartData = await cartModel.findOne({ id: {$eq: 1}})
  await userModel.create({ 
    email: email,
    password: hashedPassword, 
    age: age,
    cart: {
      _id: cartData._id
    }
  })
  res.status(200).send('Usuario creado con exito')
})

export default router