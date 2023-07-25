import { Router } from "express"
import productModel from "../models/product.model.js"

// Inicializamos el router
const router = Router()

// Ruta POST / - crea un carrito nuevo
router.post('/', async (req, res) => {
  
})

// Ruta GET /:cid - muestra un carrito especifico
router.get('/:cid', async (req, res) => {

})

// Ruta POST /:cid/product/:pid - agrega un producto a un determinado carrito
router.post('/:cid/product/:pid', async (req, res) => {

})

// Ruta DELETE /:cid/products/:pid -  elimina un producto determinado de un carrito
router.delete('/:cid/products/:pid', async (req, res) => {

})

// Ruta PUT /:cid/products/:pid - actualiza la cantidad de un producto dentro de un carrito
router.put('/:cid/products/:pid', async (req, res) => {

})

// Ruta DELETE /:cid - vacia por completo un carrito
router.delete('/:cid', async (req, res) => {

})

export default router