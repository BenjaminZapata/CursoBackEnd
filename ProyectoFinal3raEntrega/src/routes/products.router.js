import { Router } from "express"
import { addProduct, createMockingProducts, deleteProduct, getAllProducts, getOneProduct, updateProduct } from "../controllers/products.controller.js"

// Inicializamos el router
const router = Router()

// GET / - muestra los productos
router.get('/', getAllProducts)

// GET /:pid - devuelve un producto especifico
router.get('/:pid', getOneProduct)

// POST / - agrega un producto
router.post('/', addProduct)

// PUT /:pid - actualiza un producto
router.put('/:pid', updateProduct)

// DELETE /:pid - elimina un producto
router.delete('/:pid', deleteProduct)

// POST /mockingproducts - agrega productos ficticios a la DB
router.post('/mockingproducts', createMockingProducts)

export default router