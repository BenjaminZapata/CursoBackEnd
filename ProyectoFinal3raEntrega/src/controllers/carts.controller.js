import CartService from "../services/cartService.js"
import { productService } from "./products.controller.js"
export const cartService = new CartService()

const checkAuth = (req, role) => {
  if (req.session.user.role == role) return true
  return false
}

export const createCart = async ( req, res ) => {
  // Empezando desde la id 1, chequeamos que no exista carritos con dicha id e id posteriores. Cuando encontremos el id no utilizado, crearemos el carrito con dicho id
  let id = 1
  let data = await cartService.getById(id)
  while (data){
    id += 1
    data = await cartService.getById(id)
  }
  // Creamos un nuevo carrito con la primera id no utilizada que encontremos y renderizamos
  await cartService.createCart(id)
  res.status(200).send(`Carrito con id ${id} creado con exito`)
}

export const getCart = async ( req, res ) => {
  let cid = req.params.cid
  let data = await cartService.getById(cid)
  if (!data) {
    res.status(404).send(`No existe el carrito con id ${cid}`)
    return
  }
  // Agregamos la informacion del usuario
  data.user = req.session.user
  res.render('carts', data)
}

export const addProductToCart = async ( req, res ) => {
  // Solicitamos los parametros y chequeamos que exista el carrito
  let cid = req.params.cid
  let pid = req.params.pid
  let cartData = await cartService.getById(cid)
  if (!cartData) {
    res.status(404).send(`No existe el carrito con id ${cid}`)
    return
  }
  // Luego chequeamos que exista el producto a agregar
  let productData = await productService.getById(pid)
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
    cartData = await cartService.updateCart(cid, cartData)
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
  await cartService.addOne(cid, newProduct)
  res.status(200).send(`El producto con codigo ${pid} se ha agregado con exito al carrito de id ${cid}`)
}

export const deleteProductFromCart = async ( req, res ) => {
  let cid = req.params.cid
  let pid = req.params.pid
  // Primero chequeamos que exista el carrito
  let cartCopy = await cartService.getById(cid)
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
  await cartService.updateCart(cid, cartCopy)
  res.status(200).send(`Producto de codigo ${pid} eliminado del carrito con id ${cid} con exito`)
}

export const updateProductInCart = async ( req, res ) => {
  let cid = req.params.cid
  let pid = req.params.pid
  let quantity = req.body.quantity
  // Primero chequeamos que exista el carrito
  let cartCopy = await cartService.getById(cid)
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
  await cartService.updateCart(cid, cartCopy)
  res.status(200).send(`Se ha actualizado la cantidad del producto de codigo ${pid} del carrito ${cid}`)
}

export const emptyCart = async ( req, res ) => {
  let cid = req.params.cid
  // Primero chequeamos que exista el carrito
  let cartCopy = await cartService.getById(cid)
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
  await cartService.updateCart(cid, cartCopy)
  res.status(200).send(`Carrito de codigo ${cid} vaciado con exito`)
}

export const buyCart = async ( req, res ) => {
  let cid = req.params.cid
  // Controlamos que el carrito exista
  let cartData = await cartService.getById(cid)
  if (!cartData){
    res.status(400).send(`El carrito de id ${cid} no existe`)
    return
  }
  // Creamos dos carritos, uno con los productos que no pueden procesarse (por falta de stock, etc) y los que si vendimos. Tambien ya vamos definiendo el total de la compra
  let purchasedCart = []
  let remainingProductsCart = []
  let total = 0
  // Controlamos el stock de los productos seleccionados. Si no hay stock, se retira el producto del carrito. Caso contrario se remueve la cantidad de la propiedad stock del producto
  let index = 0
  for (const p of cartData.products){
    const productData = await productService.getById(p.product.code)
    if (p.quantity < productData.stock){
      productData.stock -= p.quantity
      total += (productData.sellingPrice * p.quantity)
      await productService.updateById(p.code, productData)
      purchasedCart.push({
        _id: productData._id,
        name: productData.name,
        code: productData.code,
        sellingPrice: productData.sellingPrice,
        quantity: p.quantity
      })
    } else {
      remainingProductsCart.push(p)
    }
  }
  // Si no existen productos con stock dentro del carrito, devolvemos 
  if (purchasedCart.length == 0) {
    res.status(200).send("No se puede concretar la compra, stock no disponible")
    return
  }
  // Actualizamos el carrito con los productos sin stock
  cartService.updateCart(cid, remainingProductsCart)
  res.status(200).send({"purchased": purchasedCart, "unavailable": remainingProductsCart})
}