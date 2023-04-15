const fs = require('fs');

class ProductManager {
  #products

  constructor() {
    this.path = "./products.txt"
    this.#products = this.loadFile()
  }

  loadFile = () => {
    const data = JSON.parse(fs.readFileSync(this.path, {encoding: "utf-8"} ))
    if (data) return data
    else return []
  }

  updateFile = () => {
    fs.writeFileSync(this.path, JSON.stringify(this.#products, null, '\t'), (err) => {
      if (err){
      console.log(err)
      } else {
      console.log(fs.readFileSync(this.path, "utf-8"))
      }
    })
  }

  #generateID = () => {
    let id
    if (this.#products.length === 0) id = 1
    else id = this.#products[this.#products.length - 1].id + 1
    return id
  }

  getProducts = () => {
    return this.#products
  }

  addProduct = (title, description, price, thumbnails, code, stock, status, category) => {
    if (thumbnails == undefined) thumbnails = [""]
    let id = this.#generateID()
    let newProduct = {
      id, title, description, price, thumbnails, code, stock, status, category
    }
    if (!this.#products.some( el => el.code === code)){
      this.#products.push(newProduct)
      this.updateFile()
      return true
    }
    else {
      return false
    }
  }

  getProductByID = (id) => {
    let index = this.#products.findIndex( item => item.id === id)
    if (index === -1){
      return false
    } else {
      return this.#products[index]
    }
  }  

  updateProductByID = (id, newProperties) => {
    if (!this.#products.some( p => p.id === id)){
      return false
    } else {
      let index = this.#products.findIndex( p => p.id === id)
      Object.assign(this.#products[index], newProperties)
      this.updateFile()
      return true
    }
  }

  deleteProduct = (id) => {
    if (!this.#products.some( p => p.id == id)){
      return false
    } else {
      let newProductsList = this.#products.filter( p => p.id !== id)
      this.#products = newProductsList
      this.updateFile()
      return true
    }
  }
}

module.exports = ProductManager