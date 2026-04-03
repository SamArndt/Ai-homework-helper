import axios from 'axios'
import { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token')) // Added token state
  const [loading, setLoading] = useState(true)

  const setAuthHeader = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Token ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }

  const fetchMe = async () => {
    try {
      const res = await axios.get('/api/v1/users/me/')
      setUser(res.data)
    } catch (err) {
      logout()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      setToken(savedToken) // Sync state with localStorage
      setAuthHeader(savedToken)
      fetchMe()
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (newToken) => {
    localStorage.setItem('token', newToken)
    setToken(newToken) // Update token state
    setAuthHeader(newToken)
    await fetchMe()
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null) // Clear token state
    setAuthHeader(null)
    setUser(null)
  }

  // Included 'token' in the context value
  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
