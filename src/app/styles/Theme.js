// src/app/styles/Theme.js

const Theme = {
  colors: {
    // Light mode colors
    primaryDark: '#918576', // cape cod darker brown
    secondaryDark: '#c0ab9a', // Lighter brown
    tertiaryDark: '#3a5666', // deeper blue (ocean blue)
    primaryLight: '#ffffff',
    bluePastel: '#91acbd', // pastel baby blue
    lighterBlue: '#b1c5d0', // lightest pastel blue
    background: '#FAF9F6', // Off-white: main page background
    
    // Dark mode colors
    dark: {
      primaryDark: '#b8a99a', // lighter brown for dark mode
      secondaryDark: '#8b7f72', // darker brown for dark mode
      tertiaryDark: '#4a7b96', // lighter blue for dark mode
      primaryLight: '#1a1a1a', // dark background
      bluePastel: '#7a95a6', // darker pastel blue
      lighterBlue: '#6a8596', // darker light blue
      background: '#2d2d2d', // dark background
      cardBackground: '#3a3a3a', // card backgrounds in dark mode
      border: '#4a4a4a', // borders in dark mode
      text: '#ffffff', // text color in dark mode
      mutedText: '#a0a0a0', // muted text in dark mode
    }
  },
  breakpoints: {
    mobile: '580px',
    tablet: '768px',
    desktop: '1024px',
  },
};

// Function to get theme colors based on dark mode state
export const getThemeColors = (isDarkMode) => {
  if (isDarkMode) {
    return Theme.colors.dark;
  }
  return {
    primaryDark: Theme.colors.primaryDark,
    secondaryDark: Theme.colors.secondaryDark,
    tertiaryDark: Theme.colors.tertiaryDark,
    primaryLight: Theme.colors.primaryLight,
    bluePastel: Theme.colors.bluePastel,
    lighterBlue: Theme.colors.lighterBlue,
    background: Theme.colors.background,
    cardBackground: Theme.colors.primaryLight,
    border: '#e0e0e0',
    text: Theme.colors.primaryDark,
    mutedText: Theme.colors.secondaryDark,
  };
};

export default Theme;
