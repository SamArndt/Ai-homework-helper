import axios from 'axios'
import { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Helper to set Axios header
  const setAuthHeader = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Token ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }

  // Fetch the "me" user object
  const fetchMe = async () => {
    try {
      const res = await axios.get('/api/v1/users/me/')
      setUser(res.data)
    } catch (err) {
      logout() // Clear if token is invalid
    } finally {
      setLoading(false)
    }
  }

  // Initialize: Check localStorage on every full page refresh
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setAuthHeader(token)
      fetchMe()
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (token) => {
    localStorage.setItem('token', token)
    setAuthHeader(token)
    await fetchMe() // Fetch user object immediately after login
  }

  const logout = () => {
    localStorage.removeItem('token')
    setAuthHeader(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
