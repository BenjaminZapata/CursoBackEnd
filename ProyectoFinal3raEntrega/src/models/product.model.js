import mongoose, { Schema }  from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const productSchema = mongoose.Schema({
  code: String,
  name: String, 
  category: String,
  description: String,
  sellingPrice: Number,
  buyingPrice: Number,
  stock: Number,
  status: {
    type: Boolean,
    default: true
  },
  thumbnails: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/8676/8676496.png"
  },
  owner: {
    type: String,
    default: "admin"
  }
})

productSchema.plugin(mongoosePaginate)
const productModel = mongoose.model('products', productSchema)

export default productModel