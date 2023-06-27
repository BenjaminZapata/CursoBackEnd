import express from "express"
import userRouter from "./routers/user.router.js"

const app = express()

app.use(express.json())
app.use('/api/users', userRouter)

app.listen(8080, () => console.log("Server UP!"))