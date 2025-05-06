import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SalesOverview from './components/SalesOverview';
import InventoryStatus from './components/InventoryStatus';
import MarketTrends from './components/MarketTrends';
import SocialMediaMetrics from './components/SocialMediaMetrics';
import GrokVoiceCommandPanel from './components/GrokVoiceCommandPanel';
import LoginForm from './components/LoginForm';
import NotFound from './components/NotFound';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">
          <img src="/logo.png" alt="MiN NEW YORK" />
        </div>
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Dashboard component
const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data loading
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">
          <img src="/logo.png" alt="MiN NEW YORK" />
        </div>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar collapsed={collapsed} />
      <div className="main-content">
        <Header 
          toggleSidebar={() => setCollapsed(!collapsed)} 
          title="CEO Dashboard" 
        />
        <GrokVoiceCommandPanel />
        <div className="dashboard-content">
          <Routes>
            <Route path="/" element={<SalesOverview />} />
            <Route path="/inventory" element={<InventoryStatus />} />
            <Route path="/market-trends" element={<MarketTrends />} />
            <Route path="/social-media" element={<SocialMediaMetrics />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <DataProvider>
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route 
                path="/*" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </DataProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;