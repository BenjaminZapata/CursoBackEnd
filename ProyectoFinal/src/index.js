const express = require('express');
const { Server } = require('socket.io')
const ProductManager = require('./ProductManager.js')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const productsRouter = require("./routes/products.router.js")
const cartsRouter = require("./routes/carts.router.js")
const productsList = require("./routes/productsList.router.js")
const realTimeProducts = require("./routes/realTimeProducts.router.js")

const productManager = new ProductManager()
const app = express()
const httpServer = app.listen(8080, () => console.log("Servidor on"))
const socketServer = new Server(httpServer)

app.engine('handlebars', handlebars.engine())
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname+'/public'))
app.set('views', __dirname+'/views')
app.set('view engine', 'handlebars')

app.use('/home', productsList)
app.use('/realtimeproducts', realTimeProducts)
app.use('/products', productsRouter)
app.use('/carts', cartsRouter)


socketServer.on('connection', (socketClient) =>{
  let productsWebsocket = productManager.getProducts()
  socketClient.emit("products", productsWebsocket)
  socketClient.on("product", data => {
    productManager.addProduct(data.title, data.description, data.price, data.thumbnails, data.code, data.stock, true, data.category)
    socketClient.emit("products", productManager.getProducts())
  })
  socketClient.on("erase", data => {
    productManager.deleteProduct(data)
    socketClient.emit("products", productManager.getProducts())
  })
})