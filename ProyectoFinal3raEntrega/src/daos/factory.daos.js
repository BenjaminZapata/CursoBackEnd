import { persistence } from "../config/main.config.js"

export default class PersistenceFactory {
  static getPersistence = async() => {
    switch (persistence){
      case 'MONGO':
        const { default: MongoClientDAO } = await import('./mongo/mongo.connection.dao.js')
        return new MongoClientDAO()
      default:
        break
    }
  }

  static getCartPersistence = async() => {
    switch (persistence){
      case 'MONGO':
        const { default: CartsMongoDAO } = await import('./mongo/carts.mongo.dao.js')
        return new CartsMongoDAO()
      default:
        break
    }
  }

  static getProductPersistence = async() => {
    switch (persistence){
      case 'MONGO':
        const { default: ProductsMongoDAO } = await import('./mongo/products.mongo.dao.js')
        return new ProductsMongoDAO()
      default:
        break
    }
  }

  static getUserPersistence = async() => {
    switch (persistence){
      case 'MONGO':
        const { default: UsersMongoDAO } = await import('./mongo/users.mongo.dao.js')
        return new UsersMongoDAO()
      default:
        break
    }
  }

  static getTicketPersistence = async() => {
    switch (persistence){
      case 'MONGO':
        const { default: TicketsMongoDAO } = await import('./mongo/tickets.mongo.dao.js')
        return new TicketsMongoDAO()
      default:
        break
    }
  }
}