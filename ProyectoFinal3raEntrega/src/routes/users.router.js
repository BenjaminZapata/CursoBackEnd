import { Router } from "express"
import { deleteUser, deleteUsers, getProfile, getUsers, renderUpdateProfilePhoto, switchRole, updateProfilePhoto, renderProfileTools } from "../controllers/users.controller.js"
import multer from "multer"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/public/documents')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage })

// Inicializamos el router
const router = Router()

// Admin middleware
const adminAuth = (req, res, next) => {
  if (req.session.user.role == 'admin') return next()
  res.send('ERROR: insufficient role permissions')
}

// GET / - devuelve los usuarios
router.get('/', getUsers )

// DELETE / - elimina los usuarios que no tengan actividad en los ultimos 2 dias
router.delete('/', deleteUsers )

// DELETE / - elimina un usuario segun su email
router.delete('/deleteUser/:email', deleteUser )

// GET /profile - muestra el perfil del usuario loggeado
router.get('/profile', getProfile )

// PUT /switchRole/:uid/:role
router.put('/switchRole/:uid/:role', adminAuth, switchRole)

// GET /profile/:email - muestra perfil de admin para el user seleccionado
router.get('/profileTools/:email', adminAuth, renderProfileTools)

// GET /updateProfilePhoto
router.get('/updateProfilePhoto', renderUpdateProfilePhoto)

// POST /updateProfilePhoto
router.post('/updateProfilePhoto', upload.single('profile_photo'), updateProfilePhoto)

export default router