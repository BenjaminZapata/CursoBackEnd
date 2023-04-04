import * as fs from 'fs'

export class ProductManager {
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

 addProduct = (title, description, price, thumbnail, code, stock) => {
  if (!title || !description || !price || !thumbnail || !code || !stock){
   console.error("No se han completado todos los campos necesarios")
   return
  }
  let id = this.#generateID()
  let newProduct = {
   id, title, description, price, thumbnail, code, stock
  }
  if (!this.#products.some( el => el.code === code)){
   this.#products.push(newProduct)
   console.log(`Producto ${title} agregado correctamente`)
   this.updateFile()
  }
  else {
   console.log("Ya existe un producto con ese codigo")
  }
 }

 getProductByID = (id) => {
  let index = this.#products.findIndex( item => item.id === id)
  if (index === -1){
   return `No existe el producto con id ${id}`
  } else {
   return this.#products[index]
  }
 }

 updateProduct = (id, attributeToModify, newValue) => {
  if (!this.#products.some( p => p.id === id)){
   console.log("No existe un producto con ese ID")
  } else {
   let index = this.#products.findIndex( p => p.id === id)
   this.#products[index][attributeToModify] = newValue
   console.log(`Se actualizo el producto con ID ${id}`)
   this.updateFile()
  }
 }

 deleteProduct = (id) => {
  if (!this.#products.some( p => p.id == id)){
   console.log("No existe un producto con ese ID")
  } else {
   let newProductsList = this.#products.filter( p => p.id !== id)
   this.#products = newProductsList
   console.log(`Se elimino el producto con ID ${id}`)
   this.updateFile()
  }
 }
}