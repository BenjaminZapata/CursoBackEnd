import mongoose from 'mongoose'

const productSchema = mongoose.Schema({
  codigo: String,
  nombre: String, 
  categoria: String,
  precioCompra: Number,
  precioVenta: Number,
  stock: Number
})

const productModel = mongoose.model('products', productSchema)

export default productModel