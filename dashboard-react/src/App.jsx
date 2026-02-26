import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import Login from './Login'
import Signup from './Signup'
import NavbarLayout from './components/NavbarLayout'
import Assignments from './pages/Assignments'
import Study from './pages/Study'
import Settings from './pages/Settings'

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
      <Routes>


        <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
        <Route path="/signup" element={<Signup />} />

        <Route 
          element={
            <NavbarLayout isAuthenticated={isAuthenticated} onLogout={handleLogout}/>
          }
          >

            <Route path='/' element={<h1>Home Page</h1>} />
            <Route path='/assignments' element={<Assignments/>} />
            <Route path='/study' element={<Study/>} />
            <Route path='/settings' element={<Settings/>} />

          </Route>
      </Routes>
  </Router>


      
  )
}

export default App
