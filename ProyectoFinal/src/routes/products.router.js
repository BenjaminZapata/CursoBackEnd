import { Router } from "express"
import productModel from '../models/product.model.js'

const router = Router()

const adminAuth = (req, res, next) => {
  if (req.session.rol == 'admin') return next()
  return res.status(403).send("ERROR DE PERMISOS: No eres administrador")
}

// MOSTRAR PRODUCTOS
router.get('/', async (req, res) => {
  // Pedimos el numero de la pagina por query. Por defecto sera la pagina 1
  let page = parseInt(req.query.page)
  if (!page) page = 1

  // Pedimos la cantidad de productos a mostrar por pagina. Por defecto sera 5
  let limit = parseInt(req.query.limit)
  if (!limit) limit = 5

  // Pedimos el orden. Por defecto sera asc
  let obj = {}
  let sortOption = req.query.sort
  if (sortOption == 'asc' || sortOption == 'desc'){
    obj.precioVenta = sortOption
  } else if (sortOption == 'cat'){
    obj.categoria = 1
  } else if (sortOption == 'stock'){
    obj.stock = -1
  }
  // Obtenemos la informacion y paginamos
  const data = await productModel.paginate({}, { page, limit, sort: obj, lean: true})
  // Agregamos la informacion del usuario
  data.user = req.session.user[0]
  // Seteamos los links para la pagina anterior y siguiente, en caso de que existan
  data.prevLink = data.hasPrevPage ? `/api/products?page=${data.prevPage}&limit=${limit}${sortOption ? `&sort=${sortOption}` : ``}` : ''
  data.nextLink = data.hasNextPage ? `/api/products?page=${data.nextPage}&limit=${limit}${sortOption ? `&sort=${sortOption}` : ``}` : ''
  res.render('products', data)
})

// MOSTRAR UN PRODUCTO ESPECIFICO
router.get('/:pid', async (req, res) => {
  let pid = req.params.pid
  let productData = await productModel.find({ codigo: {$eq: pid} })
  // Agregamos la informacion del usuario
  productData[0].user = req.session.user[0]
  res.render('product', productData[0])
})

// CREAR UN PRODUCTO
router.post('/', adminAuth, async (req, res) => {
  // Desestructuramos el query con los parametros y transformamos stock y precioVenta a numero
  let { codigo, nombre, categoria, stock, precioVenta } = req.query
  stock = Number (stock), precioVenta = Number (precioVenta)
  // Chequeamos que no falte ningun campo
  if (!codigo || !nombre || !categoria || !precioVenta || !stock){
    res.status(400).send("Falta completar algun campo")
    return
  }
  // Chequeamos que no exista un producto con ese codigo
  let exists = await productModel.find({ codigo: {$eq: codigo}})
  if (exists.length != 0){
    res.status(400).send(`Ya existe un producto con codigo ${codigo}`)
    return
  }
  // Finalmente creamos el producto y lo guardamos a la DB
  let producto = {
    codigo: codigo,
    nombre: nombre,
    categoria: categoria,
    precioVenta: precioVenta,
    stock: stock
  }
  await productModel.create( producto )
  res.status(200).send(`Producto con codigo ${codigo} creado con exito`)
})

// ACTUALIZAMOS UN PRODUCTO
router.put('/:pid', adminAuth, async (req, res) => {
  // Verificamos que se hayan ingresado bien los datos
  let pid = req.params.pid
  let { nombre, categoria, precioVenta, stock } = req.query
  precioVenta = Number (precioVenta), stock = Number(stock)
  // Chequeamos si existe el producto
  let data = await productModel.find({ codigo: {$eq: pid}})
  if (data.length == 0){
    res.status(404).send(`No existe el producto con codigo ${pid}`)
    return
  }
  // Creamos una copia del producto y reemplazamos los campos ingresados
  let product = data[0]
  if (nombre) product.nombre = nombre
  if (categoria) product.categoria = categoria
  if (precioVenta) product.precioVenta = precioVenta
  if (stock) product.stock = stock
  // Actualizamos la DB
  await productModel.updateOne({ codigo: pid }, product )
  res.send(`Producto con codigo ${codigo} actualizado con exito`)
})

// ELIMINAMOS UN PRODUCTO
router.delete('/:pid', adminAuth, async (req, res) => {
  let pid = req.params.pid
  // Verificamos que exista el producto con dicho codigo
  let exists = await productModel.find({ codigo: {$eq: pid}})
  if (exists.length == 0){
    res.status(404).send(`No existe el producto con codigo ${pid}`)
    return
  }
  // Eliminamos el producto de la DB
  await productModel.deleteOne({ codigo: {$eq: pid}})
  res.send(`Producto con codigo ${pid} eliminado con exito`)
})

export default router