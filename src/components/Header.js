import React from 'react';
//import { FaBars, FaBell, FaUser, FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Header.css';

const Header = ({ toggleSidebar, title }) => {
  const { availableThemes } = useTheme();
  const { user } = useAuth();

  // Toggle between light and dark theme
  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    changeTheme(newTheme);
  };

  return (
    <header className="header">
      <div className="header-title">
        <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <h1>{title}</h1>
      </div>
      
      <div className="header-actions">
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {currentTheme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
        
        <div className="notification-container">
          <button className="notification-btn">
            <FaBell />
            <span className="notification-badge">3</span>
          </button>
        </div>
        
        <div className="user-profile">
          <img 
            src={user?.avatar || "/avatar-placeholder.png"} 
            alt={user?.name || "User"} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/36';
            }}
          />
          <div className="user-info">
            <span className="user-name">{user?.name || "Guest"}</span>
            <span className="user-role">{user?.role || "User"}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;