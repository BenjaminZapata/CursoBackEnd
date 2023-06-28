import express from 'express'
import userRouter from './routers/user.router.js'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 8080

app.use(express.json())
// Para aceptar datos de formularios
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use('/api/users', userRouter)

app.listen(PORT, () => console.log(`Server up on port ${PORT}`))