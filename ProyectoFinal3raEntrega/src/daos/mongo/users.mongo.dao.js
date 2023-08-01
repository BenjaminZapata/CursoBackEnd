import userModel from '../../models/user.model.js'

export default class UsersMongoDAO {
  constructor() {}

  getById = async (id) => {
    return await userModel.findOne({ _id: { $eq: id }})
  }

  getByEmail = async (email) => {
    return await userModel.findOne({ email: { $eq: email }})
  }

  create = async (user) => {
    return await userModel.create( user )
  }

  updateById = async (id, user) => {
    return await userModel.updateOne({ _id: id }, user )
  }
}