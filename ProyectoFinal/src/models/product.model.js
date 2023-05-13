import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const productSchema = mongoose.Schema({
  codigo: String,
  nombre: String, 
  categoria: String,
  precioVenta: Number,
  stock: Number
})

productSchema.plugin(mongoosePaginate)
const productModel = mongoose.model('products', productSchema)

export default productModel