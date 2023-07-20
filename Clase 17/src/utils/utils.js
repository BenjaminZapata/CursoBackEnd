import { faker } from "@faker-js/faker/locale/es"

export const generateProductsList = () => {
  let products = []
  for (let i = 0; i < 10; i++){
    products.push(generateProduct())
  }
  return products
}

export const generateProduct = () => {
  return {
    code: faker.string.numeric(6),
    title: faker.commerce.productName(),
    price: faker.commerce.price(),
    stock: faker.string.numeric(2)
  }
}