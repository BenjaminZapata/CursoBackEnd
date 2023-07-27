import { Router } from "express"
import userModel from "../models/user.model.js"

// Inicializamos el router
const router = Router()

// Admin middleware
const adminAuth = (req, res, next) => {
  if (req.session.user.role == 'admin') return next()
  res.send('ERROR: insufficient role permissions')
}

// GET /profile - muestra el perfil del usuario loggeado
router.get('/profile', (req, res) => res.render('profile', req.session.user))

//GET /premium/:uid
router.get('/premium/:uid', adminAuth, async (req, res) => {
  let uid = req.params.uid
  const userData = await userModel.findOne({ _id: {$eq: uid}})
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
  await userModel.updateOne({ _id: uid}, userData)
  res.send({
    message: "user role updated",
    payload: userData
  })
})


export default router