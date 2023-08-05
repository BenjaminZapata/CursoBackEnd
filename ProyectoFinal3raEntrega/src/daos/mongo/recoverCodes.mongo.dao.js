import recoverModel from "../../models/recoverCode.model.js"

export default class RecoverCodesMongoDAO {
  constructor() {}

  getByCode = async (code) => {
    return await recoverModel.findOne({ code: { $eq: code }})
  }

  generateCode = async (data) => {
    return await recoverModel.create(data)
  }
  
  eraseCode = async (code) => {
    return await recoverModel.deleteOne({ code: { $eq: code }})
  }
}