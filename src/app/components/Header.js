"use client";
import Link from "next/link";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faGift,
  faStore,
  faBeer,
  faHome,
  faPhone,
  faEnvelope,
  faBookOpen,
  faStar
} from "@fortawesome/free-solid-svg-icons";

const HeaderContainer = styled.header`
  z-index: 9999;
  position: relative;
  background-color: ${({ theme }) => theme.colors.secondaryDark};
  color: ${({ theme }) => theme.colors.primaryLight};
  padding: 1rem;
  display: flex;
  flex-direction: column;

  .top-bar {
    display: flex;
    align-items: center;
    margin-bottom: 0.75rem;
    justify-content: flex-end;
  }
  
  .phone-link {
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.colors.primaryLight};
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.3s ease;
    
    &:hover {
      color: ${({ theme }) => theme.colors.accent || "#f8f3e9"};
    }
    
    .phone-icon {
      font-size: 0.8rem;
    }
  }

  .main-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    font-size: 1.5rem;
    font-family: 'Aloja';
  }
  
  a {
    color: ${({ theme }) => theme.colors.primaryLight};
    text-decoration: none;
  }

  /* To ensure the color doesn't change when visited */
  a:visited {
    color: ${({ theme }) => theme.colors.primaryLight};
  }
  
  nav {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  /* Desktop links */
  .desktop-links {
    display: flex;
    gap: 2rem;
  }

  .nav-link {
    color: #ffffff;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    
    &:hover {
      background: ${({ theme }) => theme.colors.lighterBlue};
    }
  }

  /* Always visible links container */
  .always-visible-links {
    display: flex;
    gap: 1.5rem;
  }

  /* Hamburger icon (hidden on desktop) */
  .hamburger {
    display: none;
    padding: 0.5rem;
    background: none;
    border: none;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.primaryLight};
    position: relative;
    z-index: 1002;
    transition: transform 0.4s ease;
    
    /* Modern hamburger styles */
    .hamburger-icon {
      width: 24px;
      height: 20px;
      position: relative;
      margin: 0 auto;
      transform: rotate(0deg);
      transition: .5s ease-in-out;
    }
    
    .hamburger-icon span {
      display: block;
      position: absolute;
      height: 2px;
      width: 100%;
      background: ${({ theme }) => theme.colors.primaryLight};
      border-radius: 2px;
      opacity: 1;
      left: 0;
      transform: rotate(0deg);
      transition: .25s ease-in-out;
    }
    
    .hamburger-icon span:nth-child(1) {
      top: 0px;
    }
    
    .hamburger-icon span:nth-child(2), 
    .hamburger-icon span:nth-child(3) {
      top: 9px;
    }
    
    .hamburger-icon span:nth-child(4) {
      top: 18px;
    }
    
    /* Open hamburger state */
    &.open .hamburger-icon span:nth-child(1) {
      top: 9px;
      width: 0%;
      left: 50%;
    }
    
    &.open .hamburger-icon span:nth-child(2) {
      transform: rotate(45deg);
    }
    
    &.open .hamburger-icon span:nth-child(3) {
      transform: rotate(-45deg);
    }
    
    &.open .hamburger-icon span:nth-child(4) {
      top: 9px;
      width: 0%;
      left: 50%;
    }
  }

  /* Mobile dropdown menu */
  .mobile-menu {
    position: fixed;
    top: 0;
    right: -100%;
    width: 80%;
    max-width: 350px;
    height: 100vh;
    background: ${({ theme }) => theme.colors.tertiaryDark || "#4a7b96"}; /* Lighter blue shade */
    padding: 6rem 2rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 0;
    font-size: 1.2rem;
    box-shadow: -5px 0 15px rgba(0,0,0,0.15);
    z-index: 1001;
    transition: right 0.4s ease-in-out;
    overflow-y: auto;
    
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4rem;
      background: ${({ theme }) => theme.colors.secondaryDark};
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: -1;
    }
  }
  
  .mobile-menu.open {
    right: 0;
  }
  
  /* Menu logo */
  .menu-logo {
    position: absolute;
    top: 1.5rem;
    left: 2rem;
    font-family: 'Aloja';
    font-size: 1.2rem;
    color: white;
    font-weight: 400;
    letter-spacing: 0.5px;
  }
  
  /* Overlay for mobile menu */
  .menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(3px);
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
  }
  
  .menu-overlay.open {
    opacity: 1;
    visibility: visible;
  }

  /* Mobile menu links: full-width with dividers and icons */
  .mobile-menu .nav-link {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 1rem 0.5rem;
    margin: 0;
    text-align: left;
    border-radius: 0;
    transition: all 0.2s ease;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    
    &:hover {
      background: rgba(255,255,255,0.1);
      transform: translateX(5px);
    }
    
    &:first-child {
      border-top: 1px solid rgba(255, 255, 255, 0.15);
    }
  }
  
  /* Icon styling: pastel blue theme color */
  .mobile-menu .menu-icon {
    margin-right: 1rem;
    font-size: 1.2rem;
    width: 20px;
    text-align: center;
    color: ${({ theme }) => theme.colors.primaryLight};
  }

  /* Mobile-only phone link - hidden by default (desktop view) */
  .mobile-phone-link {
    display: none;
  }

  /* Responsive: show hamburger on mobile, hide desktop links */
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    .desktop-links {
      display: none;
    }
    .hamburger {
      display: block;
    }
    
    .top-bar {
      display: none; /* Hide top bar on mobile */
    }
    
    /* Show mobile phone in the main nav */
    .mobile-phone-link {
      display: flex;
  margin-left: 4rem;/* Add space between logo and phone icon */
    }
    
    /* Enhanced styling for always visible mobile items */
    .mobile-phone-link .phone-icon {
      font-size: 1.3rem; /* Larger icon on mobile */
    }
    
    .always-visible-links {
      align-items: center;
    }
    
    .always-visible-links .nav-link {
      font-size: 1.05rem; /* Larger font for mobile */
      font-weight: 600; /* Slightly bolder on mobile */
      padding: 0.5rem 0.6rem; /* More tap area on mobile */
    }
    
    .main-nav {
      justify-content: flex-start; /* Align items to start for better spacing */
    }
    
    .logo {
      margin-right: auto; /* Push the logo to the left */
    }
  }
`;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  // Prevent scrolling when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  return (
    <HeaderContainer>
      <div className="main-nav">
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div className="logo">Laurino&apos;s Tavern</div>
        </Link>
        <nav>
          {/* Always visible links */}
          <div className="always-visible-links">
            {/* Mobile-only phone link that appears between main nav items */}
            <a href="tel:+15088966135" className="nav-link mobile-phone-link">
              <FontAwesomeIcon icon={faPhone} className="phone-icon" />
            </a>
          </div>
          
          {/* Desktop-only links */}
          <div className="desktop-links">
            <Link href="https://www.clover.com/online-ordering/laurinos-tavern-brewster" className="nav-link">
              Order
            </Link>
            <Link href="/components/Contact" className="nav-link">
              Contact
            </Link>
            <Link href="/components/menu" className="nav-link">
              Menu
            </Link>
            <Link href="/components/seltzer" className="nav-link">
              Locally Brewed Seltzer
            </Link>
            <a 
              href="https://laurinostavern.webgiftcardsales.com/" 
              className="nav-link"
              target="_blank" 
              rel="noopener noreferrer"
            >
              Gift Cards
            </a>
            <Link href="/components/laurinosstore/Store" className="nav-link">
              Laurino&apos;s Store
            </Link>
            <Link href="/" className="nav-link">
              Home
            </Link>
          </div>
          
          {/* Modern hamburger icon (mobile only) */}
          <button 
            type="button" 
            className={`hamburger ${menuOpen ? 'open' : ''}`} 
            onClick={toggleMenu} 
            aria-label="Menu"
          >
            <div className="hamburger-icon">
              <span />
              <span />
              <span />
              <span />
            </div>
          </button>
          
          {/* Overlay for mobile menu */}
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
          <div 
            className={`menu-overlay ${menuOpen ? 'open' : ''}`} 
            onClick={toggleMenu}
          />
          
          {/* Mobile dropdown menu */}
          <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
            {/* Small white logo at the top of the menu */}
            <div className="menu-logo">Laurino&apos;s Tavern</div>
            
            <Link href="/components/menu" className="nav-link" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faBookOpen} className="menu-icon" />
              Menu
            </Link>
            <Link href="/components/Contact" className="nav-link" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faEnvelope} className="menu-icon" />
              Contact
            </Link>
            <Link href="/feedback" className="nav-link" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faStar} className="menu-icon" />
              Feedback
            </Link>
            <Link href="https://www.clover.com/online-ordering/laurinos-tavern-brewster" className="nav-link" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faUtensils} className="menu-icon" />
              Order
            </Link>
            <a 
              href="https://laurinostavern.webgiftcardsales.com/" 
              className="nav-link"
              target="_blank" 
              rel="noopener noreferrer"
              onClick={toggleMenu}
            >
              <FontAwesomeIcon icon={faGift} className="menu-icon" />
              Gift Cards
            </a>
            <Link href="/components/laurinosstore/Store" className="nav-link" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faStore} className="menu-icon" />
              Laurino&apos;s Store
            </Link>
            <Link href="/components/seltzer" className="nav-link" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faBeer} className="menu-icon" />
              Local Seltzer
            </Link>
            <Link href="/" className="nav-link" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faHome} className="menu-icon" />
              Home
            </Link>
          </div>
        </nav>
      </div>
    </HeaderContainer>
  );
}