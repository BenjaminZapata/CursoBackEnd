import mongoose from 'mongoose'

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

cartSchema.pre('find', function() {
  this.populate('products.product').lean()
})

cartSchema.plugin(mongoosePaginate)
const cartModel = mongoose.model('carts', cartSchema)

export default cartModel