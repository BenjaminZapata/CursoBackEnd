import { Router } from "express"
import cartModel from '../models/cart.model.js'
import productModel from "../models/product.model.js"

const router = Router()

// CREAR CARRITO
router.post('/', async (req, res) => {
  // Empezando desde la id 1, chequeamos que no exista carritos con dicha id e id posteriores. Cuando encontremos el id no utilizado, crearemos el carrito con dicho id
  let id = 1
  let data = await cartModel.find({ id: {$eq: id}})
  let exists = data.length == 1 ? true : false
  while (exists){
    id += 1
    data = await cartModel.find({ id: {$eq: id}})
    exists = data.length == 1 ? true : false
  }
  // Creamos un nuevo carrito con la primera id no utilizada que encontremos y renderizamos
  let newCart = await cartModel.create({id: id, products: []})
  res.render('carts', newCart)
})

// AGREGAR PRODUCTOS AL CARRITO
router.post('/:cid/product/:pid', async (req, res) => {
  //
  let cid = req.params.cid
  let pid = req.params.pid
  let cartData = await cartModel.find({ id: {$eq: cid}})
  let cartExists = cartData.length == 1 ? true : false
  if (!cartExists) {
    res.status(404).send(`No existe el carrito con id ${cid}`)
    return
  }
  let productData = await productModel.find({ codigo: {$eq: pid}})
  let productExists = productData.length == 1 ? true : false
  if (!productExists) {
    res.status(404).send(`No existe el producto con id ${pid}`)
    return
  }
  let newProduct = {
    codigo: pid,
    nombre: productData[0].nombre,
    cantidad: 1
  }
  await cartModel.updateOne({ id: cid }, { $push: { products: newProduct }})
  cartData = await cartModel.find({ id: {$eq: cid}})
  res.render('carts', cartData[0])
})

// MOSTRAR CARRITO
router.get('/:cid', async (req, res) => {
  let cid = req.params.cid
  let data = await cartModel.find({ id: {$eq: cid}})
  let exists = data.length == 1 ? true : false
  if (!exists) {
    res.status(404).send(`No existe el carrito con id ${cid}`)
    return
  }
  res.render('carts', data[0])
})

// ELIMINAR UN PRODUCTO DEL CARRITO
router.delete('/:cid/products/:pid', async (req, res) => {
  let cid = req.params.cid
  let pid = req.params.pid
  // Primero chequeamos que exista el carrito
  let cartCopy = await cartModel.find({ id: {$eq: cid}})
  if (cartCopy.length == 0){
    res.status(404).send(`No existe el carrito con id ${cid}`)
    return
  }
  // Copiamos el contenido del carrito en un array
  let array = cartCopy[0].products
  // Chequeamos que exista el producto en el carrito
  let index = array.findIndex( e => e.codigo == pid)
  if (index == -1){
    res.status(404).send(`No existe el producto de codigo ${pid} en el carrito de id ${cid}`)
    return
  }
  // Filtramos los productos, removiendo el producto con el codigo indicado y actualizamos el carrito en la DB
  array = array.filter( item => item.codigo != pid)
  cartCopy[0].products = array
  await cartModel.updateOne({id: cid}, cartCopy[0])
  res.status(200).send(`Producto de codigo ${pid} eliminado del carrito con id ${cid} con exito`)
})

export default router