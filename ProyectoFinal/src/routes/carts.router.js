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
  let newCart = await cartModel.create({id: id, productos: []})
  res.render('carts', newCart)
})

// AGREGAR PRODUCTOS AL CARRITO
router.post('/:cid/product/:pid', async (req, res) => {
  // Solicitamos los parametros y chequeamos que exista el carrito
  let cid = req.params.cid
  let pid = req.params.pid
  let cartData = await cartModel.find({ id: {$eq: cid}})
  let cartExists = cartData.length == 1 ? true : false
  if (!cartExists) {
    res.status(404).send(`No existe el carrito con id ${cid}`)
    return
  }
  // Luego chequeamos que exista el producto a agregar
  let productData = await productModel.find({ codigo: {$eq: pid}})
  let productExists = productData.length == 1 ? true : false
  if (!productExists) {
    res.status(404).send(`No existe el producto con id ${pid}`)
    return
  }
  // Chequeamos que haya stock del producto
  if (productData[0].stock == 0){
    res.status(200).send(`No hay stock del producto de codigo ${pid}`)
    return
  }
  // Chequeamos que el producto no exista en el carrito. Si existe, solo incrementamos la cantidad
  let index = cartData[0].productos.findIndex( p => p.producto.codigo === pid)
  if (index != -1){
    // Vemos si el stock es igual a la cantidad añadida en el carrito
    if (productData[0].stock == cartData[0].productos[index].cantidad){
      res.status(200).send(`Se alcanzo el limite de stock del producto con codigo ${pid}`)
      return
    }
    cartData[0].productos[index].cantidad += 1
    cartData = await cartModel.updateOne({ id: {$eq: cid}}, cartData[0])
    res.status(200).send(`Se agrego otra unidad del producto con codigo ${pid} al carrito de id ${cid}`)
    return
  }
  // Si no existe, lo agregamos
  let newProduct = {
    producto: {
      _id: productData[0]._id
    },
    cantidad: 1
  }
  await cartModel.updateOne({ id: cid }, { $push: { productos: newProduct }})
  res.status(200).send(`El producto con codigo ${pid} se ha agregado con exito al carrito de id ${cid}`)
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
router.delete('/:cid/product/:pid', async (req, res) => {
  let cid = req.params.cid
  let pid = req.params.pid
  // Primero chequeamos que exista el carrito
  let cartCopy = await cartModel.find({ id: {$eq: cid}})
  if (cartCopy.length == 0){
    res.status(404).send(`No existe el carrito con id ${cid}`)
    return
  }
  // Copiamos el contenido del carrito en un array
  let array = cartCopy[0].productos
  // Chequeamos que exista el producto en el carrito
  let index = array.findIndex( e => e.producto.codigo == pid)
  if (index == -1){
    res.status(404).send(`No existe el producto de codigo ${pid} en el carrito de id ${cid}`)
    return
  }
  // Filtramos los productos, removiendo el producto con el codigo indicado y actualizamos el carrito en la DB
  array = array.filter( item => item.producto.codigo != pid)
  cartCopy[0].productos = array
  await cartModel.updateOne({id: cid}, cartCopy[0])
  res.status(200).send(`Producto de codigo ${pid} eliminado del carrito con id ${cid} con exito`)
})

router.put('/:cid/products/:pid', async (req, res) => {
  let cid = req.params.cid
  let pid = req.params.pid
  let cantidad = req.body.cantidad
  // Primero chequeamos que exista el carrito
  let cartCopy = await cartModel.find({ id: {$eq: cid}})
  if (cartCopy.length == 0){
    res.status(404).send(`No existe el carrito con id ${cid}`)
    return
  }
  // Copiamos el contenido del carrito en un array
  let array = cartCopy[0].productos
  // Chequeamos que exista el producto en el carrito
  let index = array.findIndex( e => e.producto.codigo == pid)
  if (index == -1){
    res.status(404).send(`No existe el producto de codigo ${pid} en el carrito de id ${cid}`)
    return
  }
  // Chequeamos que no se intenten agregar mas cantidad que el stock disponible
  if (array[index].producto.stock < cantidad){
    res.status(400).send(`El numero ingresado es mayor al stock del producto de codigo ${pid}`)
    return
  }
  // Actualizamos la copia y la DB
  array[index].cantidad = cantidad
  cartCopy[0].productos = array
  await cartModel.updateOne({id: cid}, cartCopy[0])
  res.status(200).send(`Se ha actualizado la cantidad del producto de codigo ${pid} del carrito ${cid}`)
})

// VACIAR UN CARRITO
router.delete('/:cid', async (req, res) => {
  let cid = req.params.cid
  // Primero chequeamos que exista el carrito
  let cartCopy = await cartModel.find({ id: {$eq: cid}})
  if (cartCopy.length == 0){
    res.status(404).send(`No existe el carrito con id ${cid}`)
    return
  }
  // Chequeamos si el carrito ya se encuentra vacio
  if (cartCopy[0].productos.length == 0){
    res.status(200).send("El carrito ya se encuentra vacio")
    return
  }
  // Vaciamos el array de productos de la copia y actualizamos la DB
  cartCopy[0].productos = []
  await cartModel.updateOne({id: cid}, cartCopy[0])
  res.status(200).send(`Carrito de codigo ${cid} vaciado con exito`)
})

export default router