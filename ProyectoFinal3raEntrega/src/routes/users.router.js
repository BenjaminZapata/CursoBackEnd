import { Router } from "express"
import { getProfile, switchPremiumRole } from "../controllers/users.controller.js"

// Inicializamos el router
const router = Router()

// Admin middleware
const adminAuth = (req, res, next) => {
  if (req.session.user.role == 'admin') return next()
  res.send('ERROR: insufficient role permissions')
}

// GET /profile - muestra el perfil del usuario loggeado
router.get('/profile', getProfile )

//GET /premium/:uid
router.get('/premium/:uid', adminAuth, switchPremiumRole)


export default router