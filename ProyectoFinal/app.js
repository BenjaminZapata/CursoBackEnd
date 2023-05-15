import express from 'express'
import mongoose from 'mongoose'
import handlebars from 'express-handlebars'
import __dirname from './src/utils.js'
import cartsRouter from './src/routes/carts.router.js'
import productsRouter from './src/routes/products.router.js'

const uri = 'mongodb+srv://benjazapata:BetoMongo1991@db.loenabf.mongodb.net/'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.engine('handlebars', handlebars.engine())
app.set('views', 'src/views')
app.set('view engine', 'handlebars')

app.use('/api/carts', cartsRouter)
app.use('/api/products', productsRouter)

await mongoose.connect( uri, {
  dbName: 'DB'
})

app.listen(8080, () => console.log("SERVER UP"))