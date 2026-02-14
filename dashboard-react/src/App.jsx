import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import Login from './Login'
import Signup from './Signup'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check for token on initial load
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      setIsAuthenticated(true)
      axios.defaults.headers.common['Authorization'] = `Token ${token}`
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    delete axios.defaults.headers.common['Authorization']
    setIsAuthenticated(false)
    window.location.href = '/login' // Hard redirect to clear state
  }

  return (
    <Router>
      <nav
        style={{
          padding: '1rem',
          background: '#f4f4f4',
          display: 'flex',
          gap: '15px',
        }}
      >
        <Link to="/">Home</Link>

        {/* Conditional Rendering based on state */}
        {isAuthenticated ? (
          <button onClick={handleLogout} style={{ cursor: 'pointer' }}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        {/* Pass the setter to Login so it can update the Navbar immediately */}
        <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  )
}

export default App
