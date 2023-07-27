import { faker } from "@faker-js/faker/locale/es"

export const generateProductsList = () => {
  let products = []
  for (let i = 0; i < 5; i++){
    products.push(generateProduct())
  }
  return products
}

export const generateProduct = (role, email) => {
  const owner = role == "admin" ? 'admin' : email

  return {
    code: faker.string.numeric(6),
    name: faker.commerce.productName(),
    sellingPrice: faker.commerce.price(),
    stock: faker.string.numeric(2),
    owner: owner
  }
}