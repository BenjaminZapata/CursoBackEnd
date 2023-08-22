import { Router } from "express"
import { getProfile, renderUpdateProfilePhoto, switchPremiumRole, updateProfilePhoto } from "../controllers/users.controller.js"
import multer from "multer"

const upload = multer({ dest: './documents'})

// Inicializamos el router
const router = Router()

// Admin middleware
const adminAuth = (req, res, next) => {
  if (req.session.user.role !== 'admin') return next()
  res.send('ERROR: insufficient role permissions')
}

// GET /profile - muestra el perfil del usuario loggeado
router.get('/profile', getProfile )

// GET /premium/:uid
router.get('/premium/:uid', adminAuth, switchPremiumRole)

// GET /updateProfilePhoto
router.get('/updateProfilePhoto', renderUpdateProfilePhoto)

// POST /updateProfilePhoto
router.post('/updateProfilePhoto', upload.single('profile_photo'), updateProfilePhoto)

export default router