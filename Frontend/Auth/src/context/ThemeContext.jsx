import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to 'dark'
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const availableThemes = [
    'dark', 
    'light', 
    'retro', 
    'valentine', 
    'aqua', 
    'coffee', 
    'forest'
  ];

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      changeTheme, 
      availableThemes 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};