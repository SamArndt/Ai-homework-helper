import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, Route, BrowserRouter as Router, Routes, Navigate, useLocation } from 'react-router-dom'
import './App.css'
import Login from './Login'
import Signup from './Signup'
import Dashboard from './Dashboard'
import ProtectedRoute from './ProtectedRoute'

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'

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
    window.location.href = '/login'
  }

  return (
    <>
      {!isAuthPage && (
        <nav
          style={{
            padding: '1rem',
            background: '#f4f4f4',
            display: 'flex',
            gap: '15px',
          }}
        >
          <Link to="/">Home</Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <button onClick={handleLogout} style={{ cursor: 'pointer' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </nav>
      )}

      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
