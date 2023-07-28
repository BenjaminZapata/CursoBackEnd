import { persistence } from "../config/main.config.js"

let ProductDao, CartDao, UsersDao

switch (persistence){
  case 'MONGO':
    const { default: ProductMongoDAO } = await import('')
    ProductDao = ProductMongoDAO

    const { default: CartMongoDAO } = await import('')
    CartDao = CartMongoDAO

    const { default: UsersMongoDAO } = await import('')
    UsersDao = UsersMongoDAO
    break
  default:
    break
}