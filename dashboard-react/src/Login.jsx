import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = ({ setAuth }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errorMessage, setErrorMessage] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    try {
      // The path /api/v1/login/ will be proxied to http://127.0.0.1:8000 by Vite
      const response = await axios.post('/api/v1/login/', formData)

      // 1. Grab the token from the response (check if your key is 'token' or 'access')
      const token = response.data.token

      // 2. Save it in the browser
      localStorage.setItem('authToken', token)

      // 3. Set it as a default for ALL future Axios calls
      axios.defaults.headers.common['Authorization'] = `Token ${token}`

      setAuth(true)

      alert('Logged in successfully!')
      navigate('/')
    } catch (error) {
      console.error('Login error:', error)
      setErrorMessage(
        error.response?.data?.detail || 'Check your email or password.',
      )
    }
  }

  return (
    <div style={{ maxWidth: '300px', margin: '50px auto' }}>
      <h2>Sign In</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px' }}>
          Login
        </button>
      </form>
    </div>
  )
}

export default Login
