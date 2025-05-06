import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Create theme context
const ThemeContext = createContext();

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Provider component
export const ThemeProvider = ({ children }) => {
  // Available themes
  const themes = {
    light: {
      name: 'light',
      primary: '#000000',
      secondary: '#9368E9',
      tertiary: '#D4AF37',
      textPrimary: '#333333',
      textSecondary: '#666666',
      textLight: '#FFFFFF',
      backgroundPrimary: '#FFFFFF',
      backgroundSecondary: '#F8F8F8',
      backgroundTertiary: '#F0F0F0',
      borderColor: '#E0E0E0',
      success: '#4CAF50',
      warning: '#FF9800',
      danger: '#F44336',
      info: '#2196F3'
    },
    dark: {
      name: 'dark',
      primary: '#121212',
      secondary: '#9368E9',
      tertiary: '#D4AF37',
      textPrimary: '#E0E0E0',
      textSecondary: '#AAAAAA',
      textLight: '#FFFFFF',
      backgroundPrimary: '#1E1E1E',
      backgroundSecondary: '#2D2D2D',
      backgroundTertiary: '#3D3D3D',
      borderColor: '#444444',
      success: '#4CAF50',
      warning: '#FF9800',
      danger: '#F44336',
      info: '#2196F3'
    },
    luxury: {
      name: 'luxury',
      primary: '#000000',
      secondary: '#D4AF37', // Gold as primary accent
      tertiary: '#9368E9',
      textPrimary: '#333333',
      textSecondary: '#666666',
      textLight: '#FFFFFF',
      backgroundPrimary: '#FFFFFF',
      backgroundSecondary: '#F9F6F0', // Soft cream background
      backgroundTertiary: '#F1EEE8',
      borderColor: '#E8E0D0',
      success: '#4CAF50',
      warning: '#FF9800',
      danger: '#F44336',
      info: '#2196F3'
    }
  };

  // Get stored theme preference, default to light
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem('dashboard-theme');
    if (storedTheme && themes[storedTheme]) {
      return storedTheme;
    }
    
    // Check for system preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  };

  // State
  const [currentTheme, setCurrentTheme] = useState(getInitialTheme());
  const [theme, setTheme] = useState(themes[getInitialTheme()]);

  // Change theme - Wrapped in useCallback
  const changeTheme = useCallback((themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      setTheme(themes[themeName]);
      localStorage.setItem('dashboard-theme', themeName);
      applyThemeToDOM(themes[themeName]);
    }
  }, [themes]); // Dependencies for useCallback

  // Apply theme to DOM
  const applyThemeToDOM = (themeObj) => {
    // Set CSS variables
    const root = document.documentElement;
    
    root.style.setProperty('--primary', themeObj.primary);
    root.style.setProperty('--secondary', themeObj.secondary);
    root.style.setProperty('--tertiary', themeObj.tertiary);
    root.style.setProperty('--text-primary', themeObj.textPrimary);
    root.style.setProperty('--text-secondary', themeObj.textSecondary);
    root.style.setProperty('--text-light', themeObj.textLight);
    root.style.setProperty('--background-primary', themeObj.backgroundPrimary);
    root.style.setProperty('--background-secondary', themeObj.backgroundSecondary);
    root.style.setProperty('--background-tertiary', themeObj.backgroundTertiary);
    root.style.setProperty('--border-color', themeObj.borderColor);
    root.style.setProperty('--success', themeObj.success);
    root.style.setProperty('--warning', themeObj.warning);
    root.style.setProperty('--danger', themeObj.danger);
    root.style.setProperty('--info', themeObj.info);
  };

  // Apply theme on mount and changes
  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only change if user hasn't set a preference
      if (!localStorage.getItem('dashboard-theme')) {
        changeTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [changeTheme]); // Fixed: Added changeTheme to dependency array

  // Context value
  const value = {
    currentTheme,
    theme,
    changeTheme,
    availableThemes: Object.keys(themes)
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};