import { Router } from "express"
import passport from "passport"
import { getUserDTO, github, login, loginGithub, logout, register, renderLogin, renderRegister } from "../controllers/users.controller.js"

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

// POST /register - registra un usuario a la DB
router.post('/register', register)

// GET /userDTO - Desconecta la sesion actual del usuario
router.get('/userDTO', getUserDTO)

export default router