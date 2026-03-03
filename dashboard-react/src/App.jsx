import { useContext } from 'react'
import {
  Link,
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from 'react-router-dom'
import './App.css'
import { AuthContext, AuthProvider } from './context/AuthContext'
import Dashboard from './Dashboard'
import Login from './Login'
import ProtectedRoute from './ProtectedRoute'
import Signup from './Signup'

function AppContent() {
  const { user, logout } = useContext(AuthContext)
  const location = useLocation()
  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/signup'

  return (
    <>
      {!isAuthPage && (
        <nav className="app-nav">
          <Link to="/" className="nav-brand">
            Ai Homework Helper
          </Link>
          <div className="nav-links">
            {user ? (
              <>
                <Link to="/dashboard" className="nav-link">
                  Dashboard
                </Link>
                <button onClick={logout} className="btn-nav-logout">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/signup" className="btn-nav-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <div className="home-page">
              <div className="deco-circle deco-1" />
              <div className="deco-circle deco-2" />
              <div className="home-content">
                <p className="home-eyebrow">Welcome</p>
                <h1 className="home-title">Home Page</h1>
                <p className="home-sub">
                  Your journey starts here. Sign in or create an account to get
                  started.
                </p>
                {!user && (
                  <Link to="/login" className="home-cta">
                    Get Started
                  </Link>
                )}
              </div>
            </div>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div className="page-wrapper">
                <Dashboard />
              </div>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
