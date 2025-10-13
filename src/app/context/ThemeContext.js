"use client";
import { createContext, useContext } from 'react';

const ThemeContext = createContext();

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }) {
  // Light mode only - no dark mode functionality
  const value = {
    isDarkMode: false, // Always false for light mode only
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}