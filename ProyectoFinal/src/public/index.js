let socket = io()
let $productsList = document.getElementById("productsList")
let $form = document.getElementById("form")

const eraseProduct = (id) => {
  socket.emit("erase", id)
}

socket.on("products", data => {
  let products = ""
  data.forEach( item => {
    products += `<li>${item.title}</li><button onclick="eraseProduct(${item.id})">Eliminar</button>`
  })
  $productsList.innerHTML = products
})

$form.addEventListener("submit", e => {
  e.preventDefault()
  const formData = new FormData(e.target)
  const formProps = Object.fromEntries(formData)
  socket.emit("product", formProps)
})