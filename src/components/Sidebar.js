import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaChartLine, 
  FaBoxes, 
  FaChartBar, 
  FaInstagram, 
  FaCog, 
  FaQuestion,
  FaSignOutAlt
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Sidebar.css';

const Sidebar = ({ collapsed }) => {
  const { logout } = useAuth();

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <img 
            src="/logo.png" 
            alt="MiN NEW YORK" 
            className="logo" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/150x50?text=MiN+NEW+YORK';
            }}
          />
        </div>
      </div>
      
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end>
            <FaChartLine className="nav-icon" />
            <span className="nav-text">Sales Overview</span>
          </NavLink>
          
          <NavLink to="/inventory" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <FaBoxes className="nav-icon" />
            <span className="nav-text">Inventory Status</span>
          </NavLink>
          
          <NavLink to="/market-trends" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <FaChartBar className="nav-icon" />
            <span className="nav-text">Market Trends</span>
          </NavLink>
          
          <NavLink to="/social-media" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <FaInstagram className="nav-icon" />
            <span className="nav-text">Social Media</span>
          </NavLink>
        </nav>
      </div>
      
      <div className="sidebar-footer">
        <button className="sidebar-btn">
          <FaCog className="nav-icon" />
          <span className="nav-text">Settings</span>
        </button>
        
        <button className="sidebar-btn">
          <FaQuestion className="nav-icon" />
          <span className="nav-text">Help</span>
        </button>
        
        <button className="sidebar-btn logout" onClick={logout}>
          <FaSignOutAlt className="nav-icon" />
          <span className="nav-text">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;