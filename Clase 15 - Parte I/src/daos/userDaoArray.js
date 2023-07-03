// Capa de persistencia que utiliza el patron DAO. Persistencia en memoria. CamelCase por utilizar clases

export default class UserDaoArray {
  constructor() {
    this.users = []
  }

  getAll = async () => {
    return this.users
  }

  save = async (user) => {
    if (this.users.length === 0) user.id = 1
    else user.id = this.users[this.users.length - 1].id + 1
    this.users.push(user)
    return user
  }

  getUser = async (id) => {
    return
  }

  updateUser = async () => {
    return
  }
}