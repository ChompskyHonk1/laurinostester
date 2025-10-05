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
  }

  /* Example usage of a global media query */
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    html, body {
      font-size: 90%;
    }
  }
`;

export default GlobalStyles;
