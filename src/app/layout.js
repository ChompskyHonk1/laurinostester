"use client";
import StyledComponentsRegistry from './styledComponentsRegistry';
import { ThemeProvider } from 'styled-components';
import { CartProvider } from './context/CartContext';
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext';
import Theme, { getThemeColors } from './styles/Theme';
import GlobalStyles from './styles/GlobalStyles';
import Header from './components/Header';
import Footer from './components/Footer';

function ThemeWrapper({ children }) {
  // Light mode only - no need for isDarkMode parameter
  const themeColors = getThemeColors();
  
  return (
    <ThemeProvider theme={{ ...Theme, colors: themeColors }}>
      {children}
    </ThemeProvider>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#8B7355" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body>
        <StyledComponentsRegistry>
          <CustomThemeProvider>
            <CartProvider>
              <ThemeWrapper>
                <GlobalStyles />
                <Header />
                <main>{children}</main>
                <Footer />
              </ThemeWrapper>
            </CartProvider>
          </CustomThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}