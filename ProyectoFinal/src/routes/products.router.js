const { Router } = require('express')
const ProductManager = require('../ProductManager.js')

const router = Router()
const productManager = new ProductManager()

router.get('/', (req, resp) => {
	let products = productManager.getProducts()
	let limit = req.query.limit
	if (products.length == 0) resp.status(200).send("No hay ningun producto en la lista")
	if (limit){
		let newProducts = products.slice(0, limit)
		products = newProducts
	}
	resp.status(200).send(products)
})

router.get('/:pid', (req, resp) => {
	let pid = Number (req.params.pid)
	let product = productManager.getProductByID(pid)
	if (!product) resp.status(400).send(`No existe el producto con id ${id}`)
	else resp.status(200).send(product)
})

router.post('/', (req, resp) => {
	let { title, description, code, price, stock, category, thumbnails } = req.query
	price = Number (price), stock = Number (stock)
	let productStatus = true
	if (!title || !description || !code || !price || !stock || !category){
		resp.status(400).send("No se han completado todos los campos obligatorios")
	}
	let addStatus = productManager.addProduct(title, description, price, thumbnails, code, stock, productStatus, category)
	if (addStatus) resp.status(201).send("Producto creado con exito")
	else resp.status(400).send(`Ya existe un producto con code ${code}`)
})

router.put('/:pid', (req, resp) => {
	let pid = Number (req.params.pid)
	const newProperties = req.body
	const filteredProperties = Object.fromEntries(Object.entries(newProperties).filter(([key, value]) => value !== undefined))
	if (filteredProperties["price"]){
		filteredProperties["price"] = Number (filteredProperties["price"])
	}
	if (filteredProperties["stock"]){
		filteredProperties["stock"] = Number (filteredProperties["stock"])
	}
	const status = productManager.updateProductByID(pid, filteredProperties)
	if (status)	resp.status(200).send(`Producto con id ${pid} modificado correctamente`)
	resp.status(400).send(`No existe el producto con id ${pid}`)
})

router.delete('/:pid', (req, resp) => {
	let pid = Number (req.params.pid)
	let status = productManager.deleteProduct(pid)
	if (status) resp.status(200).send(`Producto eliminado con exito`)
	else resp.status(400).send(`No existe un producto con id ${pid}`)
})

module.exports = router