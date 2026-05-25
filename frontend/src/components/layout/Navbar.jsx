import React from 'react';
import { NavLink } from 'react-router-dom';
import { HeartPulse, Sun, Moon, LogOut, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        <NavLink to="/" className="navbar-logo">
          <HeartPulse size={28} />
          <span>DocSpot</span>
        </NavLink>

        <nav>
          <ul className="navbar-links">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
              >
                Home
              </NavLink>
            </li>
            {user && user.role === 'user' && (
              <>
                <li>
                  <NavLink 
                    to="/book" 
                    className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
                  >
                    Book Appointment
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/dashboard" 
                    className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
                  >
                    Dashboard
                  </NavLink>
                </li>
              </>
            )}
            {user && user.role === 'admin' && (
              <li>
                <NavLink 
                  to="/admin" 
                  className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
                >
                  Admin Panel
                </NavLink>
              </li>
            )}
            <li>
              <NavLink 
                to="/contact" 
                className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="navbar-actions" style={{ gap: '12px' }}>
          <button 
            onClick={toggleTheme} 
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle Dark Mode"
            style={{ marginRight: '4px' }}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                <div style={{ display: 'inline-flex', padding: '6px', backgroundColor: 'var(--primary-light)', borderRadius: '50%', color: 'var(--primary)' }}>
                  <User size={14} />
                </div>
                <span>{user.name}</span>
                {user.role === 'admin' && (
                  <span className="badge badge-completed" style={{ fontSize: '0.65rem', padding: '2px 6px', marginLeft: '4px', textTransform: 'uppercase' }}>Admin</span>
                )}
              </div>
              <button 
                onClick={logout} 
                className="btn btn-outline" 
                style={{ padding: '8px 14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', borderColor: 'rgba(239, 68, 68, 0.2)', color: 'hsl(0, 84%, 60%)' }}
                title="Log Out"
              >
                <LogOut size={14} />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <NavLink to="/login" className="btn btn-outline" style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
                Sign In
              </NavLink>
              <NavLink to="/book" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
                Book Now
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
