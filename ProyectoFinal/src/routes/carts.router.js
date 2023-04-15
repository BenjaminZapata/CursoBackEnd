const { Router } = require('express')
const CartManager = require('../CartManager.js')
const ProductManager = require('../ProductManager.js')

const router = Router()
const cartManager = new CartManager()
const productManager = new ProductManager()

router.post('/', (req, resp) => {
	let status = cartManager.createNewCart()
	if (status[0]) return resp.status(200).send(`Se ha creado el carrito con id ${status[1]}`)
})

router.get('/:cid', (req, resp) => {
	let cid = Number (req.params.cid)
	let exists = cartManager.cartExists(cid)
	if (exists === false) return resp.status(400).send(`No existe el carrito con id ${cid}`)
	let status = cartManager.getCartProducts(cid)
	if (!status) return resp.status(400).send("No hay productos en el carrito")
	else return resp.status(200).send(status)
})

router.post('/:cid/product/:pid', (req, resp) => {
	let cid = Number (req.params.cid), pid = Number (req.params.pid)
	let exists = cartManager.cartExists(cid)
	if (exists === false) return resp.status(400).send(`No existe el carrito con id ${cid}`)
	let product = productManager.getProductByID(pid)
	if (!product) return resp.status(400).send(`No existe el producto con id ${pid}`)
	let status = cartManager.addProductToCart(cid, product.id)
	if (status) return resp.status(200).send(`Se añadio el producto con id ${pid} al carrito`)
})

module.exports = router