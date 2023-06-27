import mongoose from 'mongoose'
import config from '../config/config.js'
import UserModel from './userModel.js'
// import ProductModel from './productModel.js'

export default class MongoDao {
  constructor(){
    this.mongoose = mongoose.connect(config.mongo.url).catch(err => {
      console.log(err.message)
      process.exit()
    })
    const timestamp = { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
    const userSchema = mongoose.Schema(UserModel.schema, timestamp)
    // const productSchema = mongoose.Schema(ProductModel.schema, timestamp)
    this.models = {
      [UserModel.model]: mongoose.model(UserModel.model, userSchema),
      // [ProductModel.model]: mongoose.model(ProductModel.model, productSchema)
    }
  }

  get = async(options, entity) => {
    if (!this.models[entity]) throw new Error ('Entidad no encontrada')
    let results = await this.models[entity].find(options)
    return results.map(res => res.toObject())
  }

  insert = async(document, entity) => {
    if (!this.models[entity]) throw new Error ('Entidad no encontrada')
    try{
      let instance = new this.models[entity](document)
      let result = await instance.save()
      return result ? result.toObject() : null
    } catch (err) {
      console.log(err.message)
      return null
    }
  }
}