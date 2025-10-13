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
    cardBackground: '#ffffff',
    border: '#e0e0e0',
    text: '#8B7355',
    mutedText: '#A68B6B',
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

// Function to get theme colors (light mode only)
export const getThemeColors = () => {
  return {
    primaryDark: Theme.colors.primaryDark,
    secondaryDark: Theme.colors.secondaryDark,
    tertiaryDark: Theme.colors.tertiaryDark,
    primaryLight: Theme.colors.primaryLight,
    bluePastel: Theme.colors.bluePastel,
    lighterBlue: Theme.colors.lighterBlue,
    background: Theme.colors.background,
    cardBackground: Theme.colors.cardBackground,
    border: Theme.colors.border,
    text: Theme.colors.text,
    mutedText: Theme.colors.mutedText,
    accent: Theme.colors.accent,
    highlight: Theme.colors.highlight,
    ...Theme.shadows,
    ...Theme.borderRadius,
    ...Theme.breakpoints,
  };
};

export default Theme;
