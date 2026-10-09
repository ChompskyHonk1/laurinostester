"use client";
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* Declare your custom font first. 'font-display: optional' means the browser
     uses the (metric-matched) fallback if the font is not ready almost
     immediately, and never swaps afterwards — so the display face can no longer
     reflow headings and cause CLS. The preload below still fetches it early, so
     it is used whenever it wins the race and always on repeat visits. */
  @font-face {
    font-family: 'Aloja';
    src: url('/Aloja%20Extended.ttf') format('truetype');
    font-style: normal;
    font-weight: 400;
    font-display: optional;
  }

  /* Metric-matched fallback for Aloja. Aloja is wider (x1.124) and has a taller
     default line box (1.24em vs 1.15em) than the system sans, so swapping it in
     after first paint reflows every heading that uses it — the main source of
     CLS on the homepage. This face scales the system font to Aloja's metrics so
     the swap changes nothing about layout. Pair it everywhere Aloja is used:
     font-family: 'Aloja', 'Aloja Fallback', sans-serif. */
  @font-face {
    font-family: 'Aloja Fallback';
    /* Ordered most- to least-metric-compatible with Arial across platforms.
       Linux/headless Chrome (and Lighthouse) ships Liberation/DejaVu/Nimbus
       rather than Arial, so those must be listed or the face errors out and the
       size-adjust never applies. */
    src: local('Arial'), local('Helvetica Neue'), local('ArialMT'),
         local('Roboto'), local('Liberation Sans'), local('Nimbus Sans'),
         local('DejaVu Sans');
    font-style: normal;
    font-weight: 400;
    size-adjust: 112.36%;
    /* size-adjust scales these overrides too, so target sum is
       1.24em / 1.1236 = 110.34% to match Aloja's default line box. */
    ascent-override: 88%;
    descent-override: 22.34%;
    line-gap-override: 0%;
    font-display: swap;
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

  /* A universal 'transition: *' forces every element to watch for color and
     background changes — that is a lot of style recalculation for a theme that
     only ships light mode. Scope it to the surfaces that actually transition. */
  body,
  header,
  footer,
  main,
  section {
    transition: background-color 0.3s ease, color 0.3s ease;
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
    html, body {
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

  /* Respect the OS "reduce motion" setting everywhere, not just on mobile.
     This also silences the decorative animations for motion-sensitive users. */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

export default GlobalStyles;
