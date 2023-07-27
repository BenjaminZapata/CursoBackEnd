const $form = document.getElementById('cartForm')
let id = document.currentScript.getAttribute('cartId')

addEventListener("submit", e => {
  e.preventDefault()
  const q = $form.elements[0].value
  if (q == ''){
    return
  }
  const xhr = new XMLHttpRequest()
  xhr.open("POST", `http://127.0.0.1:8080/api/carts/${id}/product/${q}`)
  xhr.send()
  setTimeout(() => location.reload(), 1000)
})

function logout () {
  window.location.replace('/logout')
}