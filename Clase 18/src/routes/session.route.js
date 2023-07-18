import { Router } from "express"
import sessionController from "../controllers/sessions.controller.js"

const router = Router()

router.post('/register', sessionController.register)
router.post('/login', sessionController.login)

export default router