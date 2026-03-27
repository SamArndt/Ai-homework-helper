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
import Study from './Study'
import Settings from './Settings'
import ProfileSettings from './pages/ProfileSettings'
import SettingsPlaceholder from './pages/SettingsPlaceholder'

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
            MyApp
          </Link>
          <div className="nav-links">
            {user ? (
              <>
                <Link to="/dashboard" className="nav-link">
                  Dashboard
                </Link>
                <Link to="/study" className="nav-link">
                  Study
                </Link>
                <Link to="/settings" className="nav-link">
                  Settings
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
          path="/settings"
          element={
            <ProtectedRoute>
              <div className="page-wrapper">
                <Settings />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/profile"
          element={
            <ProtectedRoute>
              <div className="page-wrapper">
                <ProfileSettings />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/password"
          element={
            <ProtectedRoute>
              <div className="page-wrapper">
                <SettingsPlaceholder

                  title = "Change Your Password"
                  description = "Change your password " />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings/privacy-policy"
          element={
            <ProtectedRoute>
              <div className="page-wrapper">
                <SettingsPlaceholder

                  title = "Privacy Policy"
                  description = "More Boring Stuff" />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings/tos"
          element={
            <ProtectedRoute>
              <div className="page-wrapper">
                <SettingsPlaceholder

                  title = "Terms Of Service"
                  description = "The Boring Stuff " />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings/help"
          element={
            <ProtectedRoute>
              <div className="page-wrapper">
                <SettingsPlaceholder

                  title = "Help & FAQ"
                  description = "Find Answers To All of Your Questions " />
              </div>
            </ProtectedRoute>
          }
        />


        <Route
          path="/settings/contact"
          element={
            <ProtectedRoute>
              <div className="page-wrapper">
                <SettingsPlaceholder

                  title = "Contact Us"
                  description = "Send Us A Message " />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings/report-bug"
          element={
            <ProtectedRoute>
              <div className="page-wrapper">
                <SettingsPlaceholder

                  title = "Report A Bug"
                  description = "Submit Your Findings" />
              </div>
            </ProtectedRoute>
          }
        />

       <Route
          path="/settings/about"
          element={
            <ProtectedRoute>
              <div className="page-wrapper">
                <SettingsPlaceholder

                  title = "About"
                  description = "App Details" />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings/rate"
          element={
            <ProtectedRoute>
              <div className="page-wrapper">
                <SettingsPlaceholder

                  title = "Rate Our App"
                  description = "5 Stars pls" />
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
