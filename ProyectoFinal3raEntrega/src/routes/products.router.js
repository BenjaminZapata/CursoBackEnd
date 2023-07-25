import { Router } from "express"
import productModel from "../models/product.model.js"

// Inicializamos el router
const router = Router()

// Ruta GET / - muestra los productos
router.get('/', async (req, res) => {
  // Recuperamos el numero de la pagina, la cant. de productos a mostrar y el orden o dejamos los valores por default
  let page = parseInt(req.query.page) || 1
  let limit = parseInt(req.query.limit) || 10
  let sortObj = {}
  let sortOption = req.query.sort
  if (sortOption == 'asc' || sortOption == 'desc'){
    obj.precioVenta = sortOption
  } else if (sortOption == 'cat'){
    obj.categoria = 1
  } else if (sortOption == 'stock'){
    obj.stock = -1
  }

  // Obtenemos la informacion y paginamos
  const data = await productModel.paginate({}, { page, limit, sort: sortObj, lean: true })
  // Agregamos la informacion del usuario
  data.user = req.session.user
  // Seteamos los links para la pagina anterior y siguiente, en caso de que existan
  data.prevLink = data.hasPrevPage ? `/api/products?page=${data.prevPage}&limit=${limit}${sortOption ? `&sort=${sortOption}` : ``}` : null
  data.nextLink = data.hasNextPage ? `/api/products?page=${data.nextPage}&limit=${limit}${sortOption ? `&sort=${sortOption}` : ``}` : null
  res.render('products', data)
})

// Ruta GET /:pid - devuelve un producto especifico
router.get('/:pid', async (req, res) => {

})

// Ruta POST / - agrega un producto
router.post('/', async (req, res) => {

})

// Ruta PUT /:pid - actualiza un producto
router.put('/:pid', async (req, res) => {

})

// Ruta DELETE /:pid - elimina un producto
router.delete('/:pid', async (req, res) => {

})

export default router