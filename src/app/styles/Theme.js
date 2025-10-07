// src/app/styles/Theme.js

const Theme = {
  colors: {
    // Light mode colors - enhanced modern palette
    primaryDark: '#8B7355', // warmer, richer brown
    secondaryDark: '#A68B6B', // complementary lighter brown
    tertiaryDark: '#2C5F7C', // deeper ocean blue
    primaryLight: '#ffffff',
    bluePastel: '#7FA7B8', // more sophisticated pastel blue
    lighterBlue: '#A8C4D4', // lighter, more elegant blue
    background: '#FAF8F5', // warmer off-white
    accent: '#E8DFD3', // subtle accent color
    highlight: '#D4A574', // warm highlight color
    
    // Dark mode colors - improved contrast and modern feel
    dark: {
      primaryDark: '#C4B5A0', // lighter brown for dark mode
      secondaryDark: '#9B8B7A', // darker brown for dark mode
      tertiaryDark: '#5A8BA8', // lighter blue for dark mode
      primaryLight: '#1a1a1a', // dark background
      bluePastel: '#6B8B9E', // darker pastel blue
      lighterBlue: '#5A7B8E', // darker light blue
      background: '#2a2a2a', // slightly warmer dark background
      cardBackground: '#353535', // card backgrounds in dark mode
      border: '#454545', // borders in dark mode
      text: '#ffffff', // text color in dark mode
      mutedText: '#b0b0b0', // muted text in dark mode
      accent: '#4A6B7C', // accent in dark mode
      highlight: '#8B7355', // highlight in dark mode
    }
  },
  breakpoints: {
    mobile: '580px',
    tablet: '768px',
    desktop: '1024px',
  },
  shadows: {
    light: '0 2px 8px rgba(0, 0, 0, 0.08)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.12)',
    heavy: '0 8px 32px rgba(0, 0, 0, 0.16)',
    hover: '0 8px 25px rgba(0, 0, 0, 0.15)',
  },
  borderRadius: {
    small: '6px',
    medium: '8px',
    large: '12px',
    xl: '16px',
  },
};

// Function to get theme colors based on dark mode state
export const getThemeColors = (isDarkMode) => {
  if (isDarkMode) {
    return {
      ...Theme.colors.dark,
      ...Theme.shadows,
      ...Theme.borderRadius,
      ...Theme.breakpoints,
    };
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
    accent: Theme.colors.accent,
    highlight: Theme.colors.highlight,
    ...Theme.shadows,
    ...Theme.borderRadius,
    ...Theme.breakpoints,
  };
};

export default Theme;
