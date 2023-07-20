import mongoose from "mongoose"

const productSchema = mongoose.Schema({
  code: String,
  title: String,
  price: Number,
  stock: Number
})

const productModel = mongoose.model('products', productSchema)

export default productModel