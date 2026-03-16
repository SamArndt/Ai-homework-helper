import axios from 'axios'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Auth.css'

const Signup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')
    if (formData.password !== formData.confirm_password) {
      return setError('Passwords do not match')
    }

    try {
      await axios.post('/api/v1/signup/', {
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
      })
      navigate('/login')
    } catch (err) {
      const detail = err.response?.data
      const message =
        (typeof detail === 'object' && detail?.email?.[0]) ||
        (typeof detail === 'string' && detail) ||
        err.response?.data?.detail ||
        'Registration failed. Try a different email.'
      setError(Array.isArray(message) ? message.join(' ') : message)
    }
  }

  return (
    <div className="auth-page">
      <div className="deco-circle deco-1" />
      <div className="deco-circle deco-2" />
      <div className="deco-circle deco-3" />

      <div className="auth-inner">
        <div className="auth-card">
          <h2 className="auth-title">CREATE ACCOUNT</h2>
          <p className="auth-subtitle">Join AI Homework Helper</p>

          {error && <p className="auth-error">{error}</p>}

          <form onSubmit={handleSignup}>
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="signup-first_name">
                First name
              </label>
              <input
                id="signup-first_name"
                type="text"
                name="first_name"
                placeholder="First name"
                value={formData.first_name}
                onChange={handleChange}
                className="auth-input"
              />
            </div>
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="signup-last_name">
                Last name
              </label>
              <input
                id="signup-last_name"
                type="text"
                name="last_name"
                placeholder="Last name"
                value={formData.last_name}
                onChange={handleChange}
                className="auth-input"
              />
            </div>
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="signup-email">
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="auth-input"
                required
              />
            </div>
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="signup-password">
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="auth-input"
                required
              />
            </div>
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="signup-confirm_password">
                Confirm password
              </label>
              <input
                id="signup-confirm_password"
                type="password"
                name="confirm_password"
                placeholder="Confirm password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="auth-input"
                required
              />
            </div>
            <button type="submit" className="btn-auth">
              SIGN UP
            </button>
            <div className="auth-footer">
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup
