import mongoose from 'mongoose'

const cartSchema = mongoose.Schema({
  id: String,
  productos: [{
    producto: {
    type: Schema.Types.ObjectId,
    ref: 'products'
    },
    cantidad: Number
  }]
})

cartSchema.pre('find', function() {
  this.populate('productos.producto').lean()
})

const cartModel = mongoose.model('carts', cartSchema)

export default cartModel