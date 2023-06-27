export default class UserModel {
  static get model(){
    return 'users'
  }
  static get schema(){
    return {
      nombre: String,
      apellido: String,
      email: String
    }
  }
}