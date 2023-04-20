const express = require('express')
const ProductManager = require('../ProductManager.js')
const router = express.Router()

const productManager = new ProductManager()

router.get('/', (req, resp) => {
  let products = productManager.getProducts()
  console.log(products)
  resp.render('productsList', { products })
})

module.exports = router