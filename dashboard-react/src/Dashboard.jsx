import { useContext } from 'react'
import { AuthContext } from './context/AuthContext'

const Dashboard = () => {
  const { user } = useContext(AuthContext)

  return (
    <div style={{ padding: '1.5rem', maxWidth: 800, margin: '0 auto' }}>
      <h1>Dashboard</h1>
      <p>
        Hello, {user.first_name} {user.last_name}!
      </p>
      <p>You're logged in. This is the main app view after login.</p>
    </div>
  )
}

export default Dashboard
