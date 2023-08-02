import productModel from '../../models/product.model.js'

export default class ProductsMongoDAO {
  constructor () {}

  getAll = async (page, limit, sort) => {
    return await productModel.paginate({}, { page, limit, sort, lean: true })
  }

  getById = async (id) => {
    return await productModel.findOne({ code: { $eq: id }})
  }

  createOne = async (product) => {
    return await productModel.create( product )
  }

  createMany = async (products) => {
    return await productModel.insertMany( products )
  }

  updateById = async (id, product) => {
    return await productModel.updateOne({ code: id }, { product } )
  }

  deleteByID = async (id) => {
    return await productModel.deleteOne({ code: {$eq: id} })
  }
}