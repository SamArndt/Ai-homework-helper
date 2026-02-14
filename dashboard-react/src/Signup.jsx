import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
    if (formData.password !== formData.confirm_password) {
      return setError('Passwords do not match')
    }

    try {
      // Adjust URL to your specific Django endpoint
      await axios.post('/api/v1/signup/', {
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
      })

      alert('Account created! Please log in.')
      navigate('/login') // Send them to login after successful signup
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          'Registration failed. Try a different email.',
      )
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Create Account</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSignup}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          style={{ display: 'block', width: '100%', marginBottom: '10px' }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          style={{ display: 'block', width: '100%', marginBottom: '10px' }}
        />
        <input
          type="password"
          name="confirm_password"
          placeholder="Confirm Password"
          onChange={handleChange}
          required
          style={{ display: 'block', width: '100%', marginBottom: '10px' }}
        />
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          onChange={handleChange}
          style={{ display: 'block', width: '100%', marginBottom: '10px' }}
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          onChange={handleChange}
          style={{ display: 'block', width: '100%', marginBottom: '10px' }}
        />
        <button type="submit" style={{ width: '100%', padding: '10px' }}>
          Sign Up
        </button>
      </form>
    </div>
  )
}

export default Signup
