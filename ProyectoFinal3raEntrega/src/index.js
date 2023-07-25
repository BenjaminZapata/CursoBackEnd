import express from "express"
import session from "express-session"
import MongoStore from "connect-mongo"
import { __dirname } from "./utils/utils.js"
import { initializePassport } from "./config/passport.config.js"
import passport from "passport"
import handlebars from "express-handlebars"
import loginRouter from "./routes/login.router.js"
import productsRouter from "./routes/products.router.js"
import { auth } from "./middlewares/authentication.js"
import mongoose from "mongoose"

const server = express()

// Iniciamos mongo, motor de plantillas, passport, session y otras utilidades
server.use(session({
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://benjazapata:BetoMongo1991@db.loenabf.mongodb.net/',
    dbName: 'DB',
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  }),
  secret: 'libreriapop',
  resave: true,
  saveUninitialized: true
}))
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(express.static(__dirname + '/public'))
initializePassport()
server.use(passport.initialize())
server.use(passport.session())
server.engine('handlebars', handlebars.engine())
server.set('views', 'src/views')
server.set('view engine', 'handlebars')

// Definimos las rutas
server.use('/', loginRouter)
server.use('/api/products', auth, productsRouter)
server.use('/api/carts', auth, productsRouter)
server.use('/api/users', auth, productsRouter)

// Arrancamos el servidor
await mongoose.connect('mongodb+srv://benjazapata:BetoMongo1991@db.loenabf.mongodb.net/', {
  dbName: 'DB'
})
server.listen(8080, () => {
  console.log(`Servidor escuchando en el puerto 8080`)
})