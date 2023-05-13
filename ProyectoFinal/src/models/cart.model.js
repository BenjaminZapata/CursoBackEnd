import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const cartSchema = mongoose.Schema({
  id: String,
  products: { type: Array, default: []}
})

cartSchema.plugin(mongoosePaginate)
const cartModel = mongoose.model('carts', cartSchema)

export default cartModel