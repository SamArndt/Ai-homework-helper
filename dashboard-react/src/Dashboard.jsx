import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from './context/AuthContext'

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  return (
    <div className="home-page">
      <div className="deco-circle deco-1" />
      <div className="deco-circle deco-2" />
      <div className="home-content">
        <p className="home-eyebrow">Dashboard</p>
        <h1 className="home-title">Welcome back, {user.first_name}!</h1>
        <p className="home-sub">
          Hello, {user.first_name} {user.last_name}! This is your dashbaord!
        </p>
        <Link to="/study" className="home-cta">
          Go to Study
        </Link>
      </div>
    </div>
  )
}

export default Dashboard
