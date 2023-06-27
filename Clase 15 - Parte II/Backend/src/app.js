import express from 'express'
import userRouter from './routers/user.router.js'

const app = express()
const PORT = process.env.PORT || 8080

app.use(express.json())
app.use('/api/users', userRouter)

app.listen(PORT, () => console.log(`Server up on port ${PORT}`))