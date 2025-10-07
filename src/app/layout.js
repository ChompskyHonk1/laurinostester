"use client";
import StyledComponentsRegistry from './styledComponentsRegistry';
import { ThemeProvider } from 'styled-components';
import { CartProvider } from './context/CartContext';
import { ThemeProvider as CustomThemeProvider, useTheme } from './context/ThemeContext';
import Theme, { getThemeColors } from './styles/Theme';
import GlobalStyles from './styles/GlobalStyles';
import Header from './components/Header';
import Footer from './components/Footer';

function ThemeWrapper({ children }) {
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);
  
  return (
    <ThemeProvider theme={{ ...Theme, colors: themeColors }}>
      {children}
    </ThemeProvider>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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