const $form = document.getElementById('registerForm')
addEventListener("submit", async e => {
  e.preventDefault()
  const user = $form.elements[0].value
  const password = $form.elements[1].value
  if (user.length < 4 || password.length < 4) {
    $form.elements[0].value = ''
    $form.elements[1].value = ''
    return
  }
  const xhr = new XMLHttpRequest()
  xhr.open("POST", `http://127.0.0.1:8080/register/${user}/${password}`)
  xhr.send()
  window.location.replace(`/`)
})