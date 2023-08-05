import { Router } from "express"
import passport from "passport"
import { getUserDTO, github, login, loginGithub, logout, register, renderLogin, renderRegister, recover, generateRecoverCode, setNewPassword } from "../controllers/users.controller.js"

// Inicializamos el router
const router = Router()

// GET / - Pantalla de inicio
router.get('/', renderLogin)

// GET /register - Pantalla de registro
router.get('/register', renderRegister)

// GET /github - inicia sesion con github
router.get('/github', passport.authenticate('github', { scope: ["user:email"] }, github))

router.get('/login/github', passport.authenticate('github', { failureRedirect: '/'}), loginGithub)

// GET /logout - Desconecta la sesion actual del usuario
router.get('/logout', logout)

// POST /login - Logea al usuario
router.post('/login', login)

// POST /register - Registra un usuario en la DB
router.post('/register', register)

// GET /userDTO - Obtiene el DTO del usuario de la sesion actual
router.get('/userDTO', getUserDTO)

// GET /recover - Pantalla de reestablecimiento de contraseña
router.get('/recover', recover)

// POST /recover - Facilita un codigo via email para recuperar la contraseña
router.post('/recover', generateRecoverCode)

// POST /recoverCheck - Chequea si el codigo es correcto y cambia la contraseña
router.post('/checkRecover', setNewPassword)

export default router