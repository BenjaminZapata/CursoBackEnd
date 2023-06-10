const $form = document.getElementById('loginForm')

const resetData = () => {
  $form.elements[0].value = ''
  $form.elements[1].value = ''
  $form.elements[2].value = ''
}

addEventListener("submit", async e => {
  e.preventDefault()
  // const user = $form.elements[0].value
  const email = $form.elements[0].value
  const password = $form.elements[1].value
  if (password.length < 4 || email.length < 4) {
    resetData()
    return
  }
  const result = await fetch(`http://127.0.0.1:8080/login/${email}/${password}`)
  console.log(result)
  if (!result.ok){
    resetData()
    return
  }
  window.location.replace(`/api/products`)
})