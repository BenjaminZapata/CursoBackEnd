import PersistenceFactory from "../daos/factory.daos.js"

export default class ProductService {
  constructor () {
    this.productDao
    this.init()
  }

  init = async () => {
    this.productDao = await PersistenceFactory.getProductPersistence()
  }

  getAll = async (page, limit, sort) => {
    return await this.productDao.getAll(page, limit, sort)
  }

  getById = async (id) => {
    return await this.productDao.getById(id)
  }

  createOne = async (product) => {
    return await this.productDao.createOne(product)
  }

  createMany = async (products) => {
    return await this.productDao.createMany(products)
  }

  updateById = async (id, product) => {
    return await this.productDao.updateById(id, product)
  }

  deleteByID = async (id) => {
    return await this.productDao.deleteByID(id)
  }
}