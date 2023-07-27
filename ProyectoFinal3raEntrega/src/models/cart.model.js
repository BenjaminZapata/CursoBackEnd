import mongoose, { Schema }  from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const cartSchema = mongoose.Schema({
  id: String,
  products: [{
    product: {
    type: Schema.Types.ObjectId,
    ref: 'products'
    },
    quantity: Number
  }]
})

cartSchema.pre('findOne', function() {
  this.populate('products.product').lean()
})

cartSchema.plugin(mongoosePaginate)
const cartModel = mongoose.model('carts', cartSchema)

export default cartModel