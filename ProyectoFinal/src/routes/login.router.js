import { Router } from "express"
import userModel from '../models/user.model.js'

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
  let userData = await userModel.find({ usuario: {$eq: user}, contraseña: {$eq: password}})
  if (userData.length == 0){
    return res.status(401).send('El usuario no existe o los datos son invalidos')
  }
  req.session.user = userData
  res.redirect('/api/products')
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
router.post('/register/:user/:password', async (req, res) => {
  let user = req.params.user
  let password = req.params.password
  let userData = await userModel.find({ usuario: {$eq: user}})
  let userExists = userData.length == 1 ? true : false
  if (userExists){
    res.status(200).send('Ya existe un usuario con ese nombre')
    return
  }
  await userModel.create({ usuario: user, contraseña: password })
  res.status(200).send('Usuario creado con exito')
})

export default router