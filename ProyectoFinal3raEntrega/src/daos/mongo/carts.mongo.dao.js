import cartModel from "../../models/cart.model.js"

export default class CartsMongoDAO {
  constructor() {}

  getById = async (id) => {
    return await cartModel.findOne({ id: { $eq: id }})
  }

  createCart = async (id) => {
    return await cartModel.create({ id: id, products: [] })
  }

  addOne = async (id, product) => {
    return await cartModel.updateOne({ id: id }, { $push: { products: product }})
  }

  updateCart = async (id, cart) => {
    return await cartModel.updateOne({ id: id }, cart)
  }

  emptyCart = async (id, cart) => {
    return await cartModel.updateOne({ id: id }, cart)
  }

  deleteCart = async (id) => {
    return await cartModel.deleteOne({ id: id })
  }
}