import { Router } from "express"
import cartModel from "../models/cart.model.js"
import productModel from "../models/product.model.js"

// Inicializamos el router
const router = Router()

// Funcion que sirve para autorizar operaciones segun el rol del usuario
const checkAuth = (req, role) => {
  if (req.session.user.role == role) return true
  return false
}

// POST / - crea un carrito nuevo
router.post('/', async (req, res) => {
  // Empezando desde la id 1, chequeamos que no exista carritos con dicha id e id posteriores. Cuando encontremos el id no utilizado, crearemos el carrito con dicho id
  let id = 1
  let data = await cartModel.findOne({ id: {$eq: id}})
  while (data){
    id += 1
    data = await cartModel.findOne({ id: {$eq: id}})
  }
  // Creamos un nuevo carrito con la primera id no utilizada que encontremos y renderizamos
  await cartModel.create({id: id, productos: []})
  res.status(200).send(`Carrito con id ${id} creado con exito`)
})

// GET /:cid - muestra un carrito especifico
router.get('/:cid', async (req, res) => {
  let cid = req.params.cid
  let data = await cartModel.findOne({ id: {$eq: cid}})
  if (!data) {
    res.status(404).send(`No existe el carrito con id ${cid}`)
    return
  }
  // Agregamos la informacion del usuario
  data.user = req.session.user
  res.render('carts', data)
})

// POST /:cid/product/:pid - agrega un producto a un determinado carrito
router.post('/:cid/product/:pid', async (req, res) => {
  // Solicitamos los parametros y chequeamos que exista el carrito
  let cid = req.params.cid
  let pid = req.params.pid
  let cartData = await cartModel.findOne({ id: {$eq: cid}})
  if (!cartData) {
    res.status(404).send(`No existe el carrito con id ${cid}`)
    return
  }
  // Luego chequeamos que exista el producto a agregar
  let productData = await productModel.findOne({ code: {$eq: pid}})
  if (!productData) {
    res.status(404).send(`No existe el producto con id ${pid}`)
    return
  }
  // Chequeamos el rol del usuario y que el producto no sea creado por el mismo
  if (req.session.user.role == 'premium' && req.session.user.email == productData.owner){
    res.status(401).send("ERROR: premium users can't add own products")
    return
  }
  // Chequeamos que haya stock del producto
  if (productData.stock == 0){
    res.status(200).send(`No hay stock del producto de codigo ${pid}`)
    return
  }
  // Chequeamos que el producto no exista en el carrito. Si existe, solo incrementamos la cantidad
  let index = cartData.products.findIndex( p => p.product.code === pid)
  if (index != -1){
    // Vemos si el stock es igual a la cantidad añadida en el carrito
    if (productData.stock == cartData.products[index].quantity){
      res.status(200).send(`Se alcanzo el limite de stock del producto con codigo ${pid}`)
      return
    }
    cartData.products[index].quantity += 1
    cartData = await cartModel.updateOne({ id: {$eq: cid}}, cartData)
    res.status(200).send(`Se agrego otra unidad del producto con codigo ${pid} al carrito de id ${cid}`)
    return
  }
  // Si no existe, lo agregamos
  let newProduct = {
    product: {
      _id: productData._id
    },
    quantity: 1
  }
  await cartModel.updateOne({ id: cid }, { $push: { products: newProduct }})
  res.status(200).send(`El producto con codigo ${pid} se ha agregado con exito al carrito de id ${cid}`)
})

// DELETE /:cid/products/:pid -  elimina un producto determinado de un carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  let cid = req.params.cid
  let pid = req.params.pid
  // Primero chequeamos que exista el carrito
  let cartCopy = await cartModel.findOne({ id: {$eq: cid}})
  if (!cartCopy){
    res.status(404).send(`No existe el carrito con id ${cid}`)
    return
  }
  // Copiamos el contenido del carrito en un array
  let array = cartCopy.products
  // Chequeamos que exista el producto en el carrito
  let index = array.findIndex( e => e.product.code == pid)
  if (index == -1){
    res.status(404).send(`No existe el producto de codigo ${pid} en el carrito de id ${cid}`)
    return
  }
  // Filtramos los productos, removiendo el producto con el codigo indicado y actualizamos el carrito en la DB
  array = array.filter( item => item.product.code != pid)
  cartCopy.products = array
  await cartModel.updateOne({id: cid}, cartCopy)
  res.status(200).send(`Producto de codigo ${pid} eliminado del carrito con id ${cid} con exito`)
})

// PUT /:cid/products/:pid - actualiza la cantidad de un producto dentro de un carrito
router.put('/:cid/products/:pid', async (req, res) => {
  let cid = req.params.cid
  let pid = req.params.pid
  let quantity = req.body.quantity
  // Primero chequeamos que exista el carrito
  let cartCopy = await cartModel.findOne({ id: {$eq: cid}})
  if (!cartCopy){
    res.status(404).send(`No existe el carrito con id ${cid}`)
    return
  }
  // Copiamos el contenido del carrito en un array
  let array = cartCopy.products
  // Chequeamos que exista el producto en el carrito
  let index = array.findIndex( e => e.product.code == pid)
  if (index == -1){
    res.status(404).send(`No existe el producto de codigo ${pid} en el carrito de id ${cid}`)
    return
  }
  // Chequeamos que no se intenten agregar mas cantidad que el stock disponible
  if (array[index].product.stock < quantity){
    res.status(400).send(`El numero ingresado es mayor al stock del producto de codigo ${pid}`)
    return
  }
  // Actualizamos la copia y la DB
  array[index].quantity = quantity
  cartCopy.products = array
  await cartModel.updateOne({id: cid}, cartCopy)
  res.status(200).send(`Se ha actualizado la cantidad del producto de codigo ${pid} del carrito ${cid}`)
})

// DELETE /:cid - vacia por completo un carrito
router.delete('/:cid', async (req, res) => {
  let cid = req.params.cid
  // Primero chequeamos que exista el carrito
  let cartCopy = await cartModel.findOne({ id: {$eq: cid}})
  if (!cartCopy){
    res.status(404).send(`No existe el carrito con id ${cid}`)
    return
  }
  // Chequeamos si el carrito ya se encuentra vacio
  if (cartCopy.products.length == 0){
    res.status(200).send("El carrito ya se encuentra vacio")
    return
  }
  // Vaciamos el array de productos de la copia y actualizamos la DB
  cartCopy.products = []
  await cartModel.updateOne({ id: cid }, cartCopy)
  res.status(200).send(`Carrito de codigo ${cid} vaciado con exito`)
})

// GET /:cid/purchase - Finaliza la compra del carrito
router.get('/:cid/purchase', async (req, res) => {
  let cid = req.params.cid
  // Controlamos que el carrito exista
  let cartData = await cartModel.findOne({ id: {$eq: cid}})
  if (!cartData){
    res.status(400).send(`El carrito de id ${cid} no existe`)
  }
  // Controlamos el stock de los productos seleccionados. Si no hay stock, se retira el producto del carrito. Caso contrario se remueve la cantidad de la propiedad stock del producto
  cartData.products.forEach(async (p, index) => {
    const productData = await productModel.findOne({ code: {$eq: p.product.code}})
    if (p.quantity < productData.stock){
      cartData.products.splice(index, 1)
    }
  })
  console.log(cartData.products)
  let newCart = cartData.products
  res.status(200).send("Dea")
})

export default router