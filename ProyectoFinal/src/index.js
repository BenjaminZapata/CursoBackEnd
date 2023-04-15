const express = require('express');
const bodyParser = require('body-parser')
const productsRouter = require("./routes/products.router.js")
const cartsRouter = require("./routes/carts.router.js")

const app = express()
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/products', productsRouter)
app.use('/carts', cartsRouter)

app.listen(8080, () => console.log('Server up'))