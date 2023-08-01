import { Router } from "express"
import { addProductToCart, buyCart, createCart, deleteProductFromCart, emptyCart, getCart, updateProductInCart } from "../controllers/carts.controller.js"

// Inicializamos el router
const router = Router()

// Funcion que sirve para autorizar operaciones segun el rol del usuario
const isUserLogged = ( req, res, next ) => {
  if (req.session.user) return next()
  res.redirect('/login')
}

// POST / - crea un carrito nuevo
router.post('/', isUserLogged, createCart)

// GET /:cid - muestra un carrito especifico
router.get('/:cid', isUserLogged, getCart)

// POST /:cid/product/:pid - agrega un producto a un determinado carrito
router.post('/:cid/product/:pid', isUserLogged, addProductToCart)

// DELETE /:cid/products/:pid -  elimina un producto determinado de un carrito
router.delete('/:cid/products/:pid', isUserLogged, deleteProductFromCart)

// PUT /:cid/products/:pid - actualiza la cantidad de un producto dentro de un carrito
router.put('/:cid/products/:pid', isUserLogged, updateProductInCart)

// DELETE /:cid - vacia por completo un carrito
router.delete('/:cid', isUserLogged, emptyCart)

// GET /:cid/purchase - Finaliza la compra del carrito
router.get('/:cid/purchase', isUserLogged, buyCart)

export default router