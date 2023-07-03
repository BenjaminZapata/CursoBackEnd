import { useState } from 'react'
import axios from 'axios'

function App() {
  const [input, setInput] = useState({
    nombre: '',
    apellido: '',
    email: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios('http://localhost:8080/api/users', {
        method: 'POST',
        data: JSON.stringify(input),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } catch(err) {
      console.log(err.message)
    }
  }

  const handleInputChange = (e) => {
    setInput(prev => ({ ...prev, [e.target.name]: e.target.value }))
    console.log(input)
  }


  return (
    <>
      <div>
        <h1>Registrar nuevo usuario</h1>
        <form onSubmit={handleSubmit}>
          <label>Nombre</label>
          <input name='nombre' value={input.nombre} onChange={handleInputChange}></input>
          <label>Apellido</label>
          <input name='apellido' value={input.apellido} onChange={handleInputChange}></input>
          <label>Email</label>
          <input name='email' value={input.email} onChange={handleInputChange}></input>
          <input type='submit'/>
        </form>
      </div>
    </>
  )
}

export default App
