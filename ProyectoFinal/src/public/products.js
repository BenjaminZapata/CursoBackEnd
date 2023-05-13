const $form = document.getElementById('sortForm')
addEventListener("submit", e => {
  e.preventDefault()
  const filter = $form.elements[0].value
  const entries = $form.elements[1].value
  let q = ''
  if (filter) q += `sort=${filter}&`
  if (entries) q += `limit=${entries}`
  window.location.replace(`/productos?${q}&page=1`)
})