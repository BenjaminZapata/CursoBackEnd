import express from 'express'
import appRouter from './routers/app.router.js'

const app = express()
app.use(express.json())

app.use('/api', appRouter)
app.listen(8080, () => console.log("Server up"))