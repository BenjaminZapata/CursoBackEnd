export default class UserDTO {
  constructor(user) {
    this.mongoId = user._id
    this.email = user.email
    this.age = user.age
    this.password = user.password
    this.cartId = user.cart
    this.role = user.role
  }

  getUserDTO = () => {
    return {
      mongoId ,
      email,
      age,
      password,
      cartId,
      role
    }
  }
}