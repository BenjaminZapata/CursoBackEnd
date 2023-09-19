import ProductService from "../services/productService.js"
import TicketService from "../services/ticketService.js"
import { generateProductsList } from "../utils/mockingProducts.js"
import { sendDeletedProductEmail } from "../utils/sendEmail.js"

// Iniciamos los servicios
export const productService = new ProductService()
const ticketService = new TicketService()

// Funcion que sirve para autorizar operaciones segun el rol del usuario
const checkAuth = (req, role) => {
  if (req.session.user.role == role) return true
  return false
}

export const getAllProducts = async ( req, res ) => {
  // Recuperamos el numero de la pagina, la cant. de productos a mostrar y el orden o dejamos los valores por default
  let page = parseInt(req.query.page) || 1
  let limit = parseInt(req.query.limit) || 5
  let sortObj = {}
  let sortOption = req.query.sort
  if (sortOption == 'asc' || sortOption == 'desc'){
    sortObj.precioVenta = sortOption
  } else if (sortOption == 'cat'){
    sortObj.categoria = 1
  } else if (sortOption == 'stock'){
    sortObj.stock = -1
  }

  // Obtenemos la informacion y paginamos
  const data = await productService.getAll(page, limit, sortObj)
  // Agregamos la informacion del usuario
  data.user = req.session.user
  // Seteamos los links para la pagina anterior y siguiente, en caso de que existan
  data.prevLink = data.hasPrevPage ? `/api/products?page=${data.prevPage}&limit=${limit}${sortOption ? `&sort=${sortOption}` : ``}` : null
  data.nextLink = data.hasNextPage ? `/api/products?page=${data.nextPage}&limit=${limit}${sortOption ? `&sort=${sortOption}` : ``}` : null
  res.render('products', data)
}

export const getOneProduct = async ( req, res ) => {
  let pid = req.params.pid
  let productData = await productService.getById(pid)
  if (!productData){
    res.status(400).send(`No existe el producto de codigo ${pid}`)
  }
  // Agregamos la informacion del usuario
  productData.user = req.session.user
  res.render('product', productData)
}

export const addProduct = async ( req, res ) => {
  if (checkAuth(req, "user")) return res.status(401).send("ERROR: role not valid for that action")
  // Desestructuramos el query con los parametros y transformamos stock y precioVenta a numero
  let { code, name, category, description, stock, sellingPrice, buyingPrice, thumbnails } = req.query
  stock = Number (stock), sellingPrice = Number (sellingPrice)
  // Chequeamos que no falte ningun campo
  if (!code || !name || !category || !sellingPrice || !stock || !buyingPrice){
    res.status(400).send("Falta completar algun campo obligatorio")
    return
  }
  // Chequeamos que no exista un producto con ese codigo
  let exists = await productService.getById(code)
  if (exists){
    res.status(400).send(`Ya existe un producto con codigo ${code}`)
    return
  }
  // Chequeamos el rol del usuario
  let owner = req.session.user.role == "admin" ? "admin" : req.session.user.email
  // Finalmente creamos el producto y lo guardamos a la DB
  let product = {
    code: code,
    name: name,
    description: description,
    category: category,
    thumbnails: thumbnails,
    buyingPrice: buyingPrice,
    sellingPrice: sellingPrice,
    stock: stock,
    owner: owner
  }
  await productService.createOne(product)
  res.status(200).send(`Producto con codigo ${code} creado con exito`)
}

export const updateProduct = async ( req, res ) => {
  if (checkAuth(req, "user")) return res.status(401).send("ERROR: role not valid for that action")
  // Verificamos que se hayan ingresado bien los datos
  let pid = req.params.pid
  let { name, category, sellingPrice, stock } = req.query
  sellingPrice = Number (sellingPrice), stock = Number(stock)
  // Chequeamos si existe el producto
  let data = await productService.getById(pid)
  if (!data){
    res.status(404).send(`No existe el producto con codigo ${pid}`)
    return
  }
  // Chequeamos si el usuario es premium y si el producto es suyo
  if (req.user.session.role == 'premium' && req.user.session.email != data.owner){
    res.status(401).send("ERROR: premium users can only update own products")
    return
  }
  // Creamos una copia del producto y reemplazamos los campos ingresados
  let product = data
  if (name) product.name = name
  if (category) product.category = category
  if (sellingPrice) product.sellingPrice = sellingPrice
  if (stock) product.stock = stock
  // Actualizamos la DB
  await productService.updateById(code, product)
  res.send(`Producto con codigo ${code} actualizado con exito`)
}

export const deleteProduct = async ( req, res ) => {
  if (checkAuth(req, "user")) return res.status(401).send("ERROR: role not valid for that action")
  let pid = req.params.pid
  // Verificamos que exista el producto con dicho codigo
  let product = await productService.getById(pid)
  if (!product){
    res.status(404).send(`No existe el producto con codigo ${pid}`)
    return
  }
  // Chequeamos si el usuario es premium y que el producto sea suyo
  if (req.user.session.role == 'premium' && req.user.session.email != product.owner){
    res.status(401).send("ERROR: premium users can only erase own products")
    return
  }
  // Eliminamos el producto de la DB
  await productService.deleteByID(pid)
  // Si el producto era de un usuario premium, le enviamos un email
  await sendDeletedProductEmail(product.owner, product.name)
  res.send(`Producto con codigo ${pid} eliminado con exito`)
}

export const createMockingProducts = async ( req, res ) => {
  if (checkAuth(req, "user")) return res.status(401).send("ERROR: role not valid for that action")
  let products = generateProductsList(req.session.user.role, req.session.user.email)
  let productsData = await productService.createMany(products)
  res.status(200).send({ 
    "status": "succesful",
    "message": "mocking products generated correctly",
    "data": productsData
  })
}