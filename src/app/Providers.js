"use client";

// All client-only providers, header, footer and global styles live here so the
// root layout can stay a server component. A server root is what lets Next
// resolve `export const metadata` (titles, Open Graph, canonical, robots) for
// crawlers — without it, every route ships with no head metadata at all.

import { ThemeProvider } from "styled-components";
import StyledComponentsRegistry from "./styledComponentsRegistry";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider as CustomThemeProvider } from "./context/ThemeContext";
import Theme, { getThemeColors } from "./styles/Theme";
import GlobalStyles from "./styles/GlobalStyles";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Providers({ children }) {
  const themeColors = getThemeColors();

  return (
    <StyledComponentsRegistry>
      <CustomThemeProvider>
        <CartProvider>
          <ThemeProvider theme={{ ...Theme, colors: themeColors }}>
            <GlobalStyles />
            <Header />
            <main>{children}</main>
            <Footer />
          </ThemeProvider>
        </CartProvider>
      </CustomThemeProvider>
    </StyledComponentsRegistry>
  );
}
