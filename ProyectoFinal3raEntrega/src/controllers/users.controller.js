import { createHash, isValidPassword } from "../utils/utils.js"
import UserService from "../services/userService.js"
import { cartService } from "../controllers/carts.controller.js"
import UserDTO from "../dtos/user.dto.js"

const userService = new UserService()

export const renderLogin = async ( req, res ) => {
  // Si el usuario ya esta logeado en la session, lo redirigimos a la lista de productos
  if (req.session.user) return res.redirect('/api/products')
  res.render('login')
}

export const renderRegister = async ( req, res ) => {
  // Si el usuario ya esta logeado en la session, lo redirigimos a la lista de productos
  if (req.session.user) return res.redirect('/api/products')
  res.render('register')
}

export const login = async ( req, res ) => {
  let email = req.body.email
  let password = req.body.password
  let userData = await userService.getByEmail(email)
  if (!userData){
    return res.status(401).send('El usuario no existe')
  }
  let valid = isValidPassword(userData, password)
  if (!valid){
    return res.status(401).send('Los datos ingresados son incorrectos')
  }
  req.session.user = userData
  res.redirect('/api/products')
}

export const register = async ( req, res ) => {
  let email = req.body.email
  let password = req.body.password
  let age = req.body.age
  if (!email || !password || !age) return res.status(401).send("Uno de los campos esta vacio")
  let userData = await userService.getByEmail(email)
  if (userData){
    res.status(200).send('Ya existe un usuario con ese email')
    return
  }
  let hashedPassword = createHash(password)
  let cartData = await cartService.getById(1)
  await userModel.create({ 
    email: email,
    password: hashedPassword, 
    age: age,
    cart: {
      _id: cartData._id
    }
  })
  res.status(200).send('Usuario creado con exito')
}

export const github = async ( req, res ) => {
}

export const loginGithub = async ( req, res ) => {
  req.session.user = req.user
  res.redirect('/')
}

export const logout = async ( req, res ) => {
  if (req.session.user){
    req.session.destroy( err => {
      if (err) return res.send('ERROR: cannot logout properly')
    })
  }
  res.redirect('/')
}

export const getProfile = async ( req, res ) => {
  res.render('profile', req.session.user)
}

export const switchPremiumRole = async ( req, res ) => {
  let uid = req.params.uid
  const userData = await userService.getById(uid)
  if (!userData){
    res.status(401).send(`No existe un usuario con id ${uid}`)
    return
  }
  const userRole = userData.role
  if (userRole == "admin"){
    res.status(401).send("ERROR: el usuario tiene el rol de admin")
    return
  }
  const newRole = userRole == "user" ? "premium" : "user"
  userData.role = newRole
  await userService.updateById(id, userData)
  res.send({
    message: "user role updated",
    payload: userData
  })
}

export const getUserDTO = async ( req, res ) => {
  const userDTO = new UserDTO(req.session.user)
  res.status(200).json(userDTO)
}