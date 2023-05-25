const $form = document.getElementById('loginForm')
addEventListener("submit", async e => {
  e.preventDefault()
  const user = $form.elements[0].value
  const email = $form.elements[1].value
  const password = $form.elements[2].value
  if (user.length < 4 || password.length < 4 || email.length < 4) {
    $form.elements[0].value = ''
    $form.elements[1].value = ''
    $form.elements[2].value = ''
    return
  }
  const xhr = new XMLHttpRequest()
  xhr.open("GET", `http://127.0.0.1:8080/login/${user}/${email}/${password}`)
  xhr.send()
  window.location.replace(`/api/products`)
})