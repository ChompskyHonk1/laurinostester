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
  faGlassCheers
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
    width: 44px;
    height: 44px;
    margin-top: 2px;
    cursor: pointer;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    transition: transform 0.3s ease, filter 0.45s ease;
    outline: none;
    
    &:hover {
      transform: scale(1.12);
    }
    
    &:focus-visible {
      transform: scale(1.08);
    }

    /* The carved face stays hidden until the pumpkin is pressed. */
    .pumpkin-face {
      opacity: 0;
      transition: opacity 0.35s ease;
    }

    /* Soft warm halo that appears around the lit pumpkin. */
    .pumpkin-ambient {
      opacity: 0;
      transition: opacity 0.5s ease;
    }

    &.lit {
      filter: drop-shadow(0 0 6px rgba(255, 150, 40, 0.7))
              drop-shadow(0 0 16px rgba(255, 120, 20, 0.5));
      animation: pumpkinPulse 2.4s ease-in-out infinite;

      .pumpkin-face {
        opacity: 1;
        animation: pumpkinFlicker 2.2s ease-in-out infinite;
      }

      .pumpkin-ambient {
        opacity: 1;
        animation: pumpkinAmbient 2.4s ease-in-out infinite;
      }
    }
  }

  /* Candle-like flicker of the jack-o'-lantern face. */
  @keyframes pumpkinFlicker {
    0%, 100% { opacity: 1; }
    9%  { opacity: 0.82; }
    18% { opacity: 0.97; }
    35% { opacity: 0.86; }
    52% { opacity: 1; }
    70% { opacity: 0.8; }
    86% { opacity: 0.95; }
  }

  /* Gentle breathing scale of the whole glowing pumpkin. */
  @keyframes pumpkinPulse {
    0%, 100% { transform: scale(1.06); }
    50%      { transform: scale(1.12); }
  }

  /* Breathing intensity of the ambient halo. */
  @keyframes pumpkinAmbient {
    0%, 100% { opacity: 0.95; }
    50%      { opacity: 0.55; }
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
    right: 0;
    transform: translateX(100%);
    width: 80%;
    max-width: 350px;
    height: 100vh;
    background: ${({ theme }) => theme.colors.tertiaryDark || "#3A5666"}; /* Harbor Navy fallback */
    padding: 6rem 2rem 2rem;
    display: none;
    flex-direction: column;
    gap: 0;
    font-size: 1.2rem;
    box-shadow: -5px 0 15px rgba(0,0,0,0.15);
    z-index: 1001;
    transition: transform 0.4s ease-in-out;
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
    transform: translateX(0);
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
    display: none;
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
    
    /* Reveal the slide-in menu + overlay only on mobile */
    .mobile-menu {
      display: flex;
    }
    .menu-overlay {
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

// Autumn leaf overlay: a fixed column in the top-left where leaves fall from the logo.
const LeafOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 340px;
  height: 100vh;
  pointer-events: none;
  z-index: 9998;
  overflow: hidden;

  .leaf {
    position: absolute;
    top: -30px;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.25));
    animation-name: leafFall;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    will-change: transform, opacity;
  }

  @keyframes leafFall {
    0% {
      transform: translate3d(0, 0, 0) rotate(0deg);
      opacity: 0;
    }
    12% {
      opacity: 1;
    }
    40% {
      transform: translate3d(var(--sway1, 12px), 4.5vh, 0) rotate(70deg);
    }
    70% {
      transform: translate3d(var(--sway2, -14px), 9vh, 0) rotate(160deg);
    }
    88% {
      opacity: 1;
    }
    100% {
      transform: translate3d(var(--sway3, 10px), 16vh, 0) rotate(240deg);
      opacity: 0;
    }
  }
`;

// Variation for each leaf: start column, size, autumn color, fall duration,
// negative delay (so leaves are already mid-fall when the overlay appears),
// and horizontal sway points that make each fall feel organic.
const LEAVES = [
  { left: 4,   size: 34, color: '#D94A1E', duration: 4.6, delay: -1.0, sway1: '10px',  sway2: '-14px', sway3: '12px',  sway4: '-8px' },
  { left: 30,  size: 28, color: '#B91C1C', duration: 5.2, delay: -3.0, sway1: '-12px', sway2: '14px',  sway3: '-10px', sway4: '8px' },
  { left: 56,  size: 42, color: '#D97706', duration: 5.7, delay: -1.8, sway1: '16px',  sway2: '-12px', sway3: '12px',  sway4: '-14px' },
  { left: 82,  size: 30, color: '#8B4513', duration: 4.3, delay: -0.3, sway1: '-8px',  sway2: '12px',  sway3: '-14px', sway4: '8px' },
  { left: 108, size: 40, color: '#C0392B', duration: 5.4, delay: -3.6, sway1: '12px',  sway2: '-16px', sway3: '10px',  sway4: '-10px' },
  { left: 134, size: 32, color: '#EAB308', duration: 4.8, delay: -4.4, sway1: '-14px', sway2: '10px',  sway3: '-12px', sway4: '12px' },
  { left: 158, size: 46, color: '#E8731A', duration: 5.9, delay: -1.4, sway1: '12px',  sway2: '-12px', sway3: '14px',  sway4: '-12px' },
  { left: 182, size: 30, color: '#9B2C2C', duration: 4.4, delay: -2.3, sway1: '-10px', sway2: '16px',  sway3: '-10px', sway4: '10px' },
  { left: 206, size: 38, color: '#D94A1E', duration: 5.0, delay: -0.6, sway1: '10px',  sway2: '-14px', sway3: '12px',  sway4: '-12px' },
  { left: 228, size: 32, color: '#A0522D', duration: 5.5, delay: -5.0, sway1: '-12px', sway2: '10px',  sway3: '-16px', sway4: '8px' },
  { left: 250, size: 36, color: '#D97706', duration: 4.6, delay: -2.5, sway1: '14px',  sway2: '-10px', sway3: '12px',  sway4: '-10px' },
  { left: 272, size: 26, color: '#F2A65A', duration: 5.2, delay: -3.4, sway1: '-8px',  sway2: '12px',  sway3: '-10px', sway4: '8px' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBats, setShowBats] = useState(false);
  const [showLeaves, setShowLeaves] = useState(false);
  const [lit, setLit] = useState(false);
  
  
  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  const handleLogoMouseEnter = () => setShowLeaves(true);
  const handleLogoMouseLeave = () => setShowLeaves(false);

  // Toggle the pumpkin into a lit jack-o'-lantern without navigating away.
  const handlePumpkinClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLit((prev) => !prev);
  };

  const handlePumpkinKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      setLit((prev) => !prev);
    }
  };

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
      // Remove the inline override so the stylesheet's `overflow-x: hidden`
      // (which prevents mobile horizontal scroll) takes effect again.
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <HeaderContainer>
      <div className="main-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link
            href="/"
            style={{ textDecoration: 'none' }}
            onClick={handleLogoClick}
            onMouseEnter={handleLogoMouseEnter}
            onMouseLeave={handleLogoMouseLeave}
          >
            <div className="logo">
              <div className="logo-text">Laurino&apos;s Tavern</div>
              <svg
                className={`pumpkin-icon ${lit ? 'lit' : ''}`}
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={handlePumpkinClick}
                onKeyDown={handlePumpkinKeyDown}
                role="button"
                tabIndex={0}
                aria-pressed={lit}
                aria-label={lit ? "Extinguish the jack-o'-lantern" : "Light the pumpkin"}
              >
                <defs>
                  <radialGradient id="pumpkinCenter" cx="50%" cy="42%" r="60%">
                    <stop offset="0%" stopColor="#ffd37a" />
                    <stop offset="45%" stopColor="#ffa545" />
                    <stop offset="100%" stopColor="#f2832a" />
                  </radialGradient>
                  <radialGradient id="pumpkinSide" cx="50%" cy="45%" r="65%">
                    <stop offset="0%" stopColor="#f78a2e" />
                    <stop offset="60%" stopColor="#e86f1c" />
                    <stop offset="100%" stopColor="#c34f0d" />
                  </radialGradient>
                  <radialGradient id="pumpkinBack" cx="50%" cy="45%" r="65%">
                    <stop offset="0%" stopColor="#d25c12" />
                    <stop offset="100%" stopColor="#9c3f08" />
                  </radialGradient>
                  <linearGradient id="pumpkinStem" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#8fb44a" />
                    <stop offset="100%" stopColor="#3f6b21" />
                  </linearGradient>
                  <radialGradient id="pumpkinAmbientGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffb347" stopOpacity="0.55" />
                    <stop offset="70%" stopColor="#ff8c00" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#ff8c00" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="pumpkinFaceGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffe89b" />
                    <stop offset="55%" stopColor="#ffd23f" />
                    <stop offset="100%" stopColor="#ff9e1b" />
                  </radialGradient>
                  <filter id="pumpkinGlowFilter" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="1.3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Warm ambient halo, only visible when the pumpkin is lit. */}
                <circle className="pumpkin-ambient" cx="32" cy="38" r="27" fill="url(#pumpkinAmbientGrad)" />

                {/* Curly vine and stem */}
                <path
                  d="M33.5 8 C28.5 4 21.5 3 18.5 6 C16 8.5 19 12 22.5 10.5 C25.5 9.2 26 6.5 24.5 5.2"
                  stroke="#5d8a34"
                  strokeWidth="1.7"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M30 22 C28 15 29.5 9 35 7 C39.5 5.2 42 9 40.5 11 C38.5 15.5 36.5 19.5 36.5 22.5 Z"
                  fill="url(#pumpkinStem)"
                  stroke="#2f521a"
                  strokeWidth="0.7"
                />
                <path
                  d="M33 21.5 C32 15 33.5 9.5 36.5 8"
                  stroke="#2f521a"
                  strokeWidth="0.7"
                  fill="none"
                  opacity="0.55"
                  strokeLinecap="round"
                />

                {/* Leaf on the left of the stem */}
                <path
                  d="M29 15 C25 13 20.5 10 19.5 6.5 C18.7 3.8 21.8 2.6 23.3 4.6 C25 7.3 27.2 11.5 29 15 Z"
                  fill="url(#pumpkinStem)"
                  stroke="#2f521a"
                  strokeWidth="0.6"
                />
                <path
                  d="M28.4 13.6 C25 11 22.3 8.8 20.7 6.8"
                  stroke="#2f521a"
                  strokeWidth="0.6"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.7"
                />

                {/* Smaller leaf on the right for balance */}
                <path
                  d="M35.5 13.5 C38.5 11 42 8.5 43 5.5 C43.7 3 40.9 2 39.6 3.9 C38.1 6.4 36.5 9.8 35.5 13.5 Z"
                  fill="url(#pumpkinStem)"
                  stroke="#2f521a"
                  strokeWidth="0.6"
                />
                <path
                  d="M36 12.5 C38.5 10 41 7.8 42 5.5"
                  stroke="#2f521a"
                  strokeWidth="0.6"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.7"
                />

                {/* Body lobes, drawn back-to-front for depth */}
                <ellipse cx="15.5" cy="39" rx="7.5" ry="13.5" fill="url(#pumpkinBack)" />
                <ellipse cx="48.5" cy="39" rx="7.5" ry="13.5" fill="url(#pumpkinBack)" />
                <ellipse cx="23" cy="38.5" rx="8.5" ry="15" fill="url(#pumpkinSide)" />
                <ellipse cx="41" cy="38.5" rx="8.5" ry="15" fill="url(#pumpkinSide)" />
                <ellipse cx="32" cy="38.5" rx="10" ry="16" fill="url(#pumpkinCenter)" />

                {/* Deep crease shadows between each rib for definition */}
                <path d="M19 24 C16 32 16 45 19.5 53" stroke="#8a3c06" strokeWidth="1.3" fill="none" opacity="0.6" strokeLinecap="round" />
                <path d="M27.5 23 C25.5 32 25.5 45 28 54" stroke="#9c4a0d" strokeWidth="1.3" fill="none" opacity="0.65" strokeLinecap="round" />
                <path d="M36.5 23 C38.5 32 38.5 45 36 54" stroke="#9c4a0d" strokeWidth="1.3" fill="none" opacity="0.65" strokeLinecap="round" />
                <path d="M45 24 C48 32 48 45 44.5 53" stroke="#8a3c06" strokeWidth="1.3" fill="none" opacity="0.6" strokeLinecap="round" />

                {/* Brighter highlight running down the front rib */}
                <ellipse cx="28.5" cy="33.5" rx="2.6" ry="8.5" fill="#ffffff" opacity="0.25" />
                <path d="M29.5 27 C28 33 28 44 29.5 50" stroke="#fff2c9" strokeWidth="1.5" fill="none" opacity="0.55" strokeLinecap="round" />

                {/* Carved jack-o'-lantern face, revealed and glowing when lit */}
                <g className="pumpkin-face" filter="url(#pumpkinGlowFilter)">
                  <path d="M25 31.5 L31 31.5 L28 39.5 Z" fill="url(#pumpkinFaceGlow)" stroke="#ffd23f" strokeWidth="0.4" strokeLinejoin="round" />
                  <path d="M33 31.5 L39 31.5 L36 39.5 Z" fill="url(#pumpkinFaceGlow)" stroke="#ffd23f" strokeWidth="0.4" strokeLinejoin="round" />
                  <path d="M30.2 41 L33.8 41 L32 45.5 Z" fill="url(#pumpkinFaceGlow)" stroke="#ffd23f" strokeWidth="0.4" strokeLinejoin="round" />
                  <path
                    d="M22.5 49 L25 46 L27.5 49 L30 46 L32.5 49 L35 46 L37.5 49 L40 46 L41.5 49 L41.5 53.5 L22.5 53.5 Z"
                    fill="url(#pumpkinFaceGlow)"
                    stroke="#ffd23f"
                    strokeWidth="0.4"
                    strokeLinejoin="round"
                  />
                </g>
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
            <Link href="/parties" className="nav-link">
              Parties
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
            <Link href="https://www.clover.com/online-ordering/laurinos-tavern-brewster" className="nav-link" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faUtensils} className="menu-icon" />
              Order
            </Link>
            <Link href="/parties" className="nav-link" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faGlassCheers} className="menu-icon" />
              Parties
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
    
    {/* Autumn leaves falling from the top-left logo on hover */}
    {showLeaves && (
      <LeafOverlay aria-hidden="true">
        {LEAVES.map((leaf, i) => (
          <svg
            key={i}
            className="leaf"
            style={{
              left: leaf.left,
              width: leaf.size,
              height: leaf.size,
              color: leaf.color,
              animationDuration: `${leaf.duration}s`,
              animationDelay: `${leaf.delay}s`,
              '--sway1': leaf.sway1,
              '--sway2': leaf.sway2,
              '--sway3': leaf.sway3,
              '--sway4': leaf.sway4,
            }}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 1.5C16 4 20 9 19.6 14C19.3 18 16 21 12 21C8 21 4.7 18 4.4 14C4 9 8 4 12 1.5Z" fill="currentColor" stroke="#6b3f1d" strokeWidth="0.9" strokeLinejoin="round" />
            <path d="M12 6V20" stroke="#6b3f1d" strokeWidth="1.1" strokeLinecap="round" opacity="0.85" />
            <path d="M12 9L8.5 7.5M12 9L15.5 7.5M12 13L8.5 13M12 13L15.5 13M12 17L9 17.5M12 17L15 17.5" stroke="#6b3f1d" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
            <path d="M12 21V23.5" stroke="#6b3f1d" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        ))}
      </LeafOverlay>
    )}

    {/* Bat animations */}
    {showBats && (
      <div className="bat-container">
        <svg className="bat bat1" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 5C20 5 15 8 15 12C15 16 20 20 20 20C20 20 25 16 25 12C25 8 20 5 20 5Z" fill="#3A5666"/>
          <ellipse cx="20" cy="25" rx="8" ry="6" fill="#1a1a1a"/>
          <path d="M12 20C12 20 15 22 18 22C21 22 24 20 24 20" stroke="#FF6B35" strokeWidth="1"/>
          <path d="M16 20C16 20 17 21 18 21C19 21 20 20 20 20" stroke="#FF6B35" strokeWidth="1"/>
          <circle cx="17" cy="23" r="1" fill="#FF6B35"/>
          <circle cx="23" cy="23" r="1" fill="#FF6B35"/>
        </svg>
        <svg className="bat bat2" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 5C20 5 15 8 15 12C15 16 20 20 20 20C20 20 25 16 25 12C25 8 20 5 20 5Z" fill="#3A5666"/>
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