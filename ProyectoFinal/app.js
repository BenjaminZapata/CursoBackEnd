import express from 'express'
import session from 'express-session'
import mongoose from 'mongoose'
import MongoStore from 'connect-mongo'
import handlebars from 'express-handlebars'
import __dirname from './src/utils.js'
import loginRouter from './src/routes/login.router.js'
import cartsRouter from './src/routes/carts.router.js'
import productsRouter from './src/routes/products.router.js'

const uri = 'mongodb+srv://benjazapata:BetoMongo1991@db.loenabf.mongodb.net/'

const app = express()

app.use(session({
  store: MongoStore.create({
    mongoUrl: uri,
    dbName: 'DB',
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  }),
  secret: 'libreriapop',
  resave: true,
  saveUnitialized: true
}))

const auth = (req, res, next) => {
  if (req.session.user) return next()
  return res.render('login')
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.engine('handlebars', handlebars.engine())
app.set('views', 'src/views')
app.set('view engine', 'handlebars')

app.use('/', loginRouter)
app.use('/api/carts', auth, cartsRouter)
app.use('/api/products', auth, productsRouter)

await mongoose.connect( uri, {
  dbName: 'DB'
})

app.listen(8080, () => console.log("SERVER UP"))