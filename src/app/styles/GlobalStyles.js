"use client";
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* Declare your custom font first */
  @font-face {
    font-family: 'Aloja';
    src: url('/Aloja Extended.ttf') format('truetype');
    font-style: normal;
  }
 
  /* Basic CSS reset or normalize can go here */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
    /* Now you can use your custom font */
    font-family:  sans-serif;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primaryDark};
    min-height: 100%;
    width: 100%;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  /* Smooth transitions for theme changes */
  * {
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  }

  /* Scrollbar styling for dark mode */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.tertiaryDark};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.secondaryDark};
  }

  /* Example usage of a global media query */
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    html, body {
      font-size: 90%;
    }
  }

  /* Mobile-first responsive improvements */
  @media (max-width: 768px) {
    html, body {
      font-size: 85%;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
  }

  /* Ensure proper touch targets on mobile */
  button, a, input, textarea, select {
    min-height: 44px;
    min-width: 44px;
  }

  /* Improve readability on mobile */
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    body {
      line-height: 1.6;
    }
  }
`;

export default GlobalStyles;
