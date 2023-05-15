import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

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

cartSchema.plugin(mongoosePaginate)
const cartModel = mongoose.model('carts', cartSchema)

export default cartModel