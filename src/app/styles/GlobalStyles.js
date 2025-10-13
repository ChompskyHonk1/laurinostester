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

  /* Scrollbar styling */
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

  /* Enhanced mobile optimizations */
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    /* Improve tap targets for better mobile UX */
    button, a, input, textarea, select {
      min-height: 48px;
      min-width: 48px;
      padding: 0.75rem 1rem;
      touch-action: manipulation;
    }

    /* Better spacing for mobile */
    section {
      padding: 2rem 0.75rem !important;
      margin-bottom: 0 !important;
    }
    
    /* Reduce margins between sections on mobile */
    section + section {
      margin-top: -1rem !important;
    }

    /* Improved text rendering on mobile */
    body {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
      font-size: 16px; /* Prevent zoom on iOS */
    }

    /* Prevent horizontal scroll on mobile */
    body {
      overflow-x: hidden;
      width: 100%;
    }
    
    /* Ensure full width containers */
    html, body {
      width: 100%;
      min-width: 100%;
    }

    /* Better image handling on mobile */
    img {
      max-width: 100%;
      height: auto;
      display: block;
    }
    
    /* Better iframe handling on mobile */
    iframe {
      max-width: 100%;
      height: auto;
    }

    /* Improved scroll performance */
    * {
      -webkit-overflow-scrolling: touch;
    }
    
    /* Better focus states for mobile */
    button:focus, a:focus, input:focus, textarea:focus, select:focus {
      outline: 2px solid ${({ theme }) => theme.colors.tertiaryDark};
      outline-offset: 2px;
    }
    
    /* Reduce motion for users who prefer it */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  }

  /* Tablet optimizations */
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    section {
      padding: 3rem 1.5rem !important;
    }
    
    /* Better spacing between sections on tablet */
    section + section {
      margin-top: -0.5rem !important;
    }
  }
  
  /* Small mobile optimizations */
  @media (max-width: 400px) {
    section {
      padding: 1.5rem 0.5rem !important;
    }
    
    html, body {
      font-size: 15px;
    }
  }
`;

export default GlobalStyles;
