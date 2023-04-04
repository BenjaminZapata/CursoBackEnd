import { ProductManager } from './ProductManager.js'
import express from 'express';

const app = express()

const productManager = new ProductManager()


app.get('/products', (req, resp) => {
 let products = productManager.getProducts()
 let limit = req.query.limit
 if (limit){
  let newProducts = products.slice(0, limit)
  products = newProducts
 }
 resp.status(200).send(products)
})

app.get('/products/:pid', (req, resp) => {
 let pid = Number (req.params.pid)
 let product = productManager.getProductByID(pid)
 resp.status(200).send(product)
})

app.listen(8080, () => console.log('Server up'))