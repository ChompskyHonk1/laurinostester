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
  box-shadow: ${({ theme }) => theme.shadows.light};
  backdrop-filter: blur(10px);

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
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
  
  .logo-text {
    margin-bottom: 0.25rem;
  }
  
  .pumpkin-icon {
    width: 24px;
    height: 24px;
    margin-top: 2px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.1);
    }
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
    position: relative;
    overflow: hidden;
    padding: 0.5rem 1rem;
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transform: translateY(-50%);
      transition: left 0.6s ease;
      z-index: -1;
    }
    
    &:hover {
      background: ${({ theme }) => theme.colors.lighterBlue};
      transform: translateY(-2px);
      box-shadow: ${({ theme }) => theme.shadows.medium};
      
      &::before {
        left: 100%;
      }
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
  
  /* Bat animations */
  .bat-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9998;
  }
  
  .bat {
    position: absolute;
    width: 40px;
    height: 40px;
    opacity: 0;
    animation: flyAcross 5s ease-in-out;
    
    &.bat1 {
      top: 20%;
      animation-delay: 0s;
    }
    
    &.bat2 {
      top: 40%;
      animation-delay: 0.5s;
    }
  }
  
  @keyframes flyAcross {
    0% {
      left: -50px;
      opacity: 0;
      transform: translateY(0px) rotate(0deg);
    }
    10% {
      opacity: 1;
    }
    25% {
      transform: translateY(-30px) rotate(-15deg);
    }
    50% {
      transform: translateY(30px) rotate(15deg);
    }
    75% {
      transform: translateY(-20px) rotate(-10deg);
    }
    90% {
      opacity: 1;
    }
    100% {
      left: calc(100% + 50px);
      opacity: 0;
      transform: translateY(0px) rotate(0deg);
    }
  }
  
  
`;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBats, setShowBats] = useState(false);
  
  
  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  const handleLogoClick = (e) => {
    // Always trigger bats when logo is clicked on home page
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (currentPath === '/' || currentPath === '' || currentPath.includes('/page')) {
        e.preventDefault();
        setShowBats(true);
        console.log('Bats triggered!', showBats); // Debug log
        // Hide bats after animation completes
        setTimeout(() => setShowBats(false), 5000);
      }
    }
  };
  
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
    <>
      <HeaderContainer>
      <div className="main-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }} onClick={handleLogoClick}>
            <div className="logo">
              <div className="logo-text">Laurino&apos;s Tavern</div>
              <svg className="pumpkin-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C12 2 10 4 10 6C10 8 12 10 12 10C12 10 14 8 14 6C14 4 12 2 12 2Z" fill="#FF6B35"/>
                <ellipse cx="12" cy="16" rx="8" ry="7" fill="#FF8C42"/>
                <path d="M8 14C8 14 9 15 10 15C11 15 12 14 12 14" stroke="#2C5F7C" strokeWidth="1"/>
                <path d="M14 14C14 14 15 15 16 15C17 15 18 14 18 14" stroke="#2C5F7C" strokeWidth="1"/>
                <circle cx="9" cy="13" r="1" fill="#2C5F7C"/>
                <circle cx="15" cy="13" r="1" fill="#2C5F7C"/>
                <path d="M12 10C12 10 11 12 11 14C11 16 12 18 12 18" stroke="#FF6B35" strokeWidth="1"/>
              </svg>
            </div>
          </Link>
          
        </div>
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
            <Link href="/" className="nav-link">
              Home
            </Link>
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
            
            <Link href="/" className="nav-link" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faHome} className="menu-icon" />
              Home
            </Link>
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
            </div>
        </nav>
      </div>
    </HeaderContainer>
    
    {/* Bat animations */}
    {showBats && (
      <div className="bat-container">
        <svg className="bat bat1" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 5C20 5 15 8 15 12C15 16 20 20 20 20C20 20 25 16 25 12C25 8 20 5 20 5Z" fill="#2C5F7C"/>
          <ellipse cx="20" cy="25" rx="8" ry="6" fill="#1a1a1a"/>
          <path d="M12 20C12 20 15 22 18 22C21 22 24 20 24 20" stroke="#FF6B35" strokeWidth="1"/>
          <path d="M16 20C16 20 17 21 18 21C19 21 20 20 20 20" stroke="#FF6B35" strokeWidth="1"/>
          <circle cx="17" cy="23" r="1" fill="#FF6B35"/>
          <circle cx="23" cy="23" r="1" fill="#FF6B35"/>
        </svg>
        <svg className="bat bat2" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 5C20 5 15 8 15 12C15 16 20 20 20 20C20 20 25 16 25 12C25 8 20 5 20 5Z" fill="#2C5F7C"/>
          <ellipse cx="20" cy="25" rx="8" ry="6" fill="#1a1a1a"/>
          <path d="M12 20C12 20 15 22 18 22C21 22 24 20 24 20" stroke="#FF6B35" strokeWidth="1"/>
          <path d="M16 20C16 20 17 21 18 21C19 21 20 20 20 20" stroke="#FF6B35" strokeWidth="1"/>
          <circle cx="17" cy="23" r="1" fill="#FF6B35"/>
          <circle cx="23" cy="23" r="1" fill="#FF6B35"/>
        </svg>
      </div>
    )}
    </>
  );
}