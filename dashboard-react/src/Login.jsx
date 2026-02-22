import axios from 'axios'
import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'
import { AuthContext } from './context/AuthContext'

const Login = () => {
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

  const { login } = useContext(AuthContext)

  const handleLogin = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    try {
      const response = await axios.post('/api/v1/login/', formData)
      await login(response.data.token)

      navigate('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      setErrorMessage(
        error.response?.data?.detail || 'Check your email or password.',
      )
    }
  }

  return (
    <div className="auth-page">
      <div className="deco-circle deco-1" />
      <div className="deco-circle deco-2" />
      <div className="deco-circle deco-3" />

      <div className="auth-inner">
        <div className="auth-card">
          <h2 className="auth-title">USER LOGIN</h2>
          <p className="auth-subtitle">Welcome to the website</p>

          {errorMessage && <p className="auth-error">{errorMessage}</p>}

          <form onSubmit={handleLogin}>
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className="auth-input"
                required
              />
            </div>
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="login-password">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="auth-input"
                required
              />
            </div>
            <button type="submit" className="btn-auth">
              LOGIN
            </button>
            <div className="auth-footer">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="auth-link">
                Create Account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
