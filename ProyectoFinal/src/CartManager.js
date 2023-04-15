const fs = require('fs');

class CartManager {
	#carts

	constructor() {
		this.path = "./carts.txt"
		this.#carts = this.loadFile()
	}

	loadFile = () => {
		const data = JSON.parse(fs.readFileSync(this.path, {encoding: "utf-8"} ))
		if (data) return data
		else return []
	}

	updateFile = () => {
		fs.writeFileSync(this.path, JSON.stringify(this.#carts, null, '\t'), (err) => {
			if (err){
				console.log(err)
			} else {
				console.log(fs.readFileSync(this.path, "utf-8"))
			}
		})
	}

	#generateID = () => {
		let id
		if (this.#carts.length === 0) id = 1
		else id = this.#carts[this.#carts.length - 1].id + 1
		return id
	}

	createNewCart = () => {
		const newCart = {
			id: this.#generateID(),
			products: []
		}
		this.#carts.push(newCart)
		this.updateFile()
		return [true, newCart.id]
	}

	getCartProducts = (id) => {
		let index = this.#carts.findIndex( cart => cart.id === id)
		let products = this.#carts[index].products
		if (products.length == 0) return false
		else return products
	}

	cartExists = (id) => {
		let index = this.#carts.findIndex( cart => cart.id === id)
		if (index == -1) return false
		else return true
	}

	addProductToCart = (id, product) => {
		let index = this.#carts.findIndex( cart => cart.id === id)
		let productExists =  this.productExistsInCart(product, index)
		if (productExists === false){
			let newProduct = {
				id: product,
				quantity: 1
			}
			this.#carts[index].products.push(newProduct)
		}
		else this.#carts[index].products[productExists].quantity = this.#carts[index].products[productExists].quantity + 1
		this.updateFile()
		return true
	}

	productExistsInCart = (pid, cindex) => {
		let exists = this.#carts[cindex].products.findIndex( product => product.id === pid)
		if (exists === -1 ) return false
		else return exists
	}
}

module.exports = CartManager