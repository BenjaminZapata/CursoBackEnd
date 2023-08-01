import PersistenceFactory from "../daos/factory.daos.js"

export default class CartService {
  constructor () {
    this.cartDao
    this.init()
  }

  init = async () => {
    this.cartDao = await PersistenceFactory.getCartPersistence()
  }

  getById = async (id) => {
    return await this.cartDao.getById(id)
  }

  createCart = async (id) => {
    return await this.cartDao.createCart(id)
  }

  addOne = async (id, product) => {
    return await this.cartDao.addOne(id, product)
  }

  updateCart = async (id, cart) => {
    return await this.cartDao.updateCart(id, cart)
  }

  emptyCart = async (id, cart) => {
    return await this.cartDao.emptyCart(id, cart)
  }

  deleteCart = async (id) => {
    return await this.cartDao.deleteCart(id)
  }
}