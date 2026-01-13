import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../store/slices/authSlice'

const Layout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ 
        background: '#1976d2', 
        color: 'white', 
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0 }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            Company Registration
          </Link>
        </h1>
        
        <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>
                Dashboard
              </Link>
              <Link to="/settings" style={{ color: 'white', textDecoration: 'none' }}>
                Settings
              </Link>
              <button 
                onClick={handleLogout}
                style={{ 
                  background: 'transparent', 
                  border: '1px solid white',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                Logout
              </button>
              <span>{user?.full_name}</span>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
                Login
              </Link>
              <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>
                Register
              </Link>
            </>
          )}
        </nav>
      </header>

      <main style={{ flex: 1, padding: '2rem' }}>
        <Outlet />
      </main>

      <footer style={{ 
        padding: '1rem', 
        textAlign: 'center', 
        background: '#f5f5f5',
        marginTop: 'auto'
      }}>
        <p>© {new Date().getFullYear()} Company Registration System. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Layout
