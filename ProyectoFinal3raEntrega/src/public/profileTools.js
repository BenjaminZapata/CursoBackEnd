const $deleteForm = document.getElementById('deleteAccount')
const $roleForm = document.getElementById('handleRole')
const $roleSelected = document.getElementById('role')
let email = document.currentScript.getAttribute('userEmail')
let id = document.currentScript.getAttribute('id')

$deleteForm.addEventListener("submit", e => {
  e.preventDefault()
  const xhr = new XMLHttpRequest()
  xhr.open("DELETE", `http://localhost:8080/api/users/deleteUser/${email}`)
  xhr.send()
  setTimeout(() => location.reload(), 1000)
})

$roleForm.addEventListener("submit", e => {
  e.preventDefault()
  const newRole = $roleSelected.value
  const xhr = new XMLHttpRequest()
  xhr.open("PUT", `http://localhost:8080/api/users/switchRole/${id}/${newRole}`)
  xhr.send()
  setTimeout(() => location.reload(), 1000)
})