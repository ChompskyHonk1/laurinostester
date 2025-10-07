"use client";
import styled from 'styled-components';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import { Link as ScrollLink } from 'react-scroll';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.tertiaryDark};
  color: ${({ theme }) => theme.colors.primaryLight};
  padding: 2rem;
  text-align: center;
  transition: background-color 0.3s ease, color 0.3s ease;
  
  .footer-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  /* Subtle divider line */
  .footer-divider {
    width: 100%;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.primaryLight};
    opacity: 0.2;
    margin: 1rem 0;
    transition: opacity 0.3s ease;
  }
  
  /* Social links container */
  .socials {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
    
    a {
      color: ${({ theme }) => theme.colors.primaryLight};
      text-decoration: none;
      font-size: 1.4rem; /* icon size */
      transition: color 0.3s ease, transform 0.2s ease;
      
      &:hover {
        color: ${({ theme }) => theme.colors.lighterBlue};
        transform: translateY(-2px);
      }
    }
  }
  
  .footer-nav {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    justify-content: center;
    
    a, .nav-link {
      color: ${({ theme }) => theme.colors.primaryLight};
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: color 0.3s ease, transform 0.2s ease;
      
      &:hover {
        color: ${({ theme }) => theme.colors.lighterBlue};
        transform: translateY(-1px);
      }
    }
    
    button.nav-link {
      background: none;
      border: none;
      padding: 0;
      font: inherit;
      color: ${({ theme }) => theme.colors.primaryLight};
      cursor: pointer;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: color 0.3s ease, transform 0.2s ease;
      
      &:hover {
        color: ${({ theme }) => theme.colors.lighterBlue};
        transform: translateY(-1px);
      }
    }
  }
  
  .copyright {
    margin: 0;
    font-size: 0.9rem;
    opacity: 0.8;
    transition: opacity 0.3s ease;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    .footer-content {
      gap: 1rem;
      padding: 0 1rem;
    }
    
    .footer-nav {
      gap: 1rem;
      flex-direction: column;
      align-items: center;
    }
    
    .socials {
      gap: 0.8rem;
    }
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1.5rem 1rem;
    
    .footer-nav {
      gap: 0.8rem;
    }
    
    .socials a {
      font-size: 1.2rem;
    }
    
    .footer-nav a, .footer-nav .nav-link, .footer-nav button.nav-link {
      font-size: 0.85rem;
    }
    
    .copyright {
      font-size: 0.8rem;
    }
  }
`;

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Function to handle navigation to the about section
  const handleAboutClick = (e) => {
    e.preventDefault();
    
    // If we're already on the homepage, just scroll to the section
    if (pathname === '/') {
      // Using react-scroll to scroll to the About section
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Otherwise, navigate to the homepage with the #about hash
      router.push('/?scrollTo=about');
    }
  };

  return (
    <FooterContainer>
      <div className="footer-content">
        {/* Social Links */}
        <div className="socials">
          {/* Update these links to your actual socials */}
          <a
            href="https://www.facebook.com/share/1DDB27X8jP/?mibextid=wwXIfr"
            aria-label="Facebook"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://twitter.com"
            aria-label="Twitter"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter />
          </a>
          <a
            href="https://www.instagram.com/laurinoscape?igsh=OGxmNG1nMjExMmR6"
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
          </a>
        </div>
        
        {/* Divider line */}
        
        {/* Optional site nav links, e.g., Privacy Policy, etc. */}
        <nav className="footer-nav">
          {pathname === '/' ? (
            <ScrollLink to="about" smooth={true} duration={500} className="nav-link">About Us</ScrollLink>
          ) : (
            <button type= "button"
              className="nav-link" 
              onClick={handleAboutClick}
              aria-label="Go to About Us section"
            >
              About Us
            </button>
          )}
          <Link href="/components/menu">Menu</Link>
          <Link href="/components/Contact">Contact</Link>
        </nav>
        
        {/* Another subtle divider if desired */}
        <div className="footer-divider" />
        
        {/* Copyright */}
        <p className="copyright">
          © {new Date().getFullYear()} Laurino&apos;s Tavern. All rights reserved.
        </p>
      </div>
    </FooterContainer>
  );
}