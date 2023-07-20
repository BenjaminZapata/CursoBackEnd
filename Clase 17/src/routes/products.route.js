import { Router } from "express"
import { generateProductsList } from "../utils/utils.js"
import productModel from "../models/product.model.js"

const router = Router()

router.get('/products', async (req, res) => {
  let products = await productModel.find()
  if (products.length == 0) return res.status(200).send("No existen productos en la base de datos")
  res.status(200).send({ "status": "succesful", "message": `${products.length} products found`, "data": products })
})

router.get('/mockingproducts', async (req, res) => {
  let products = generateProductsList()
  await productModel.insertMany(products)
  res.json({ "status": "succesful", "message": "mocking products generated correctly", "data": products })
})



export default router