import { useContext } from 'react'
import {
  Link,
  Navigate,
  NavLink,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from 'react-router-dom'
import './App.css'
import { AuthContext, AuthProvider } from './context/AuthContext'
import Dashboard from './Dashboard'
import Login from './Login'
import Profile from './Profile'
import ProtectedRoute from './ProtectedRoute'
import Signup from './Signup'
import Study from './study'

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
            AI-Based Homework Helper
          </Link>
          <div className="nav-links">
            {user ? (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive ? 'nav-link nav-link-active' : 'nav-link'
                  }
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/study"
                  className={({ isActive }) =>
                    isActive ? 'nav-link nav-link-active' : 'nav-link'
                  }
                >
                  Study
                </NavLink>

                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    isActive ? 'nav-link nav-link-active' : 'nav-link'
                  }
                >
                  Profile
                </NavLink>

                <button onClick={logout} className="btn-nav-logout">
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? 'nav-link nav-link-active' : 'nav-link'
                  }
                >
                  Login
                </NavLink>

                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    isActive ? 'nav-link nav-link-active' : 'nav-link'
                  }
                >
                  Sign Up
                </NavLink>
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
        <Route
          path="/study"
          element={
            <ProtectedRoute>
              <div className="page-wrapper">
                <Study />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <div className="page-wrapper">
                <Profile />
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
