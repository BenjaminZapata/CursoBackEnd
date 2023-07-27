import { Router } from "express"
import userModel from '../models/user.model.js'
import cartModel from '../models/cart.model.js'
import { createHash, isValidPassword } from "../utils/utils.js"
import passport from "passport"

// Inicializamos el router
const router = Router()

// GET / - Pantalla de inicio
router.get('/', (req, res) => {
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

// GET /github - inicia sesion con github
router.get('/github', passport.authenticate('github', { scope: ["user:email"] }, (req, res) => {}))

router.get('/login/github', passport.authenticate('github', { failureRedirect: '/login'}), async (req, res) =>{
  req.session.user = req.user,
  res.redirect('/')
})

// GET /logout - Desconecta la sesion actual del usuario
router.get('/logout', (req, res) =>{
  if (req.session.user){
    req.session.destroy( err => {
      if (err) return res.send('ERROR: cannot logout properly')
    })
  }
  res.redirect('/')
})

// POST /login - Logea al usuario
router.post('/login', async (req, res) => {
  let email = req.body.email
  let password = req.body.password
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
  let email = req.body.email
  let password = req.body.password
  let age = req.body.age
  if (!email || !password || !age) return res.status(401).send("Uno de los campos esta vacio")
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