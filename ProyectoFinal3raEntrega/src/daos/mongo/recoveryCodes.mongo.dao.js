import recoveryModel from "../../models/recoveryCode.model.js"

export default class CartsMongoDAO {
  constructor() {}

  getByCode = async (code) => {
    return await recoveryModel.findOne({ code: { $eq: code }})
  }

  generateCode = async (data) => {
    return await recoveryModel.create(data)
  }
  
  eraseCode = async () => {
    return await recoveryModel.deleteOne({ code: { $eq: code }})
  }
}