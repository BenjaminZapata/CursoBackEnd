import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const productSchema = mongoose.Schema({
  code: String,
  name: String, 
  category: String,
  sellingPrice: Number,
  buyingPrice: Number,
  stock: Number
})

productSchema.plugin(mongoosePaginate)
const productModel = mongoose.model('products', productSchema)

export default productModel