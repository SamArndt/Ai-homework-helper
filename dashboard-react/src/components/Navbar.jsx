import {NavLink, Link} from 'react-router-dom';
import './Navbar.css';

const navPages = [
    {to: '/', label: 'Home'},
    {to: '/assignments', label: 'Assignments'},
    {to: '/study', label: 'Study'},
    {to: '/settings', label: 'Settings'},
    //{to: '/', label: 'Home'},
    //{to: '/', label: 'Home'},
    //{to: '/', label: 'Home'},
]

export default function Navbar({isAuthenticated, onLogout}) {

    return(
    <div className='navbar'>
        <div className='navbarTitle'> Navigator </div>

        <nav className='navbarNav' aria-label="Navbar Navigation">
            {navPages.map((item) => (

                <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}

                        className={({isActive}) => `navbarLink ${isActive ? 'navbarLinkOn' : ''}`}
                    >
                        {item.label}
                    </NavLink>
            ))}
        </nav>

        {/* 2/25 Moving Sam's App.jsx Home page auth over here */}

        <div className='navbarAuth'>
        {isAuthenticated ? (
          <button onClick={onLogout} style={{ cursor: 'pointer' }}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
</div>


    )
}