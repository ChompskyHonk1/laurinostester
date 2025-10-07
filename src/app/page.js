"use client";

import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense, useState } from 'react';
import Calendar from './components/Calendar/Calendar';


// HERO SECTION


// Updated Hero Section with optional background image or overlay
const HeroSection = styled.section`
  position: relative; /* for absolutely positioned elements */
  overflow: hidden;   /* hides any overflow from the image */
  color: ${({ theme }) => theme.colors.primaryLight};
  padding: 6rem 2rem;
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  transition: color 0.3s ease;

  .background-image {
    position: absolute;
    top: 0;
    left: 0;
    /* Make sure the image covers the section */
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -2; /* behind everything */
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    /* A subtle dark overlay to improve text contrast */
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: -1; /* between the image and the text */
    transition: background 0.3s ease;
  }

  .hero-content {
    max-width: 800px;
    margin: 0 auto;
    z-index: 1; /* above overlay */
    padding: 2rem;
  }

  h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    letter-spacing: 1px;
       font-family: 'Aloja';
    line-height: 1.2;
  }

  p {
    font-size: 1.2rem;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .hero-cta {
    margin-top: 2rem;
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background-color: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primaryDark};
    text-decoration: none;
    border-radius: 4px;
    font-weight: 600;
    transition: background-color 0.3s ease, transform 0.2s ease;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.6), transparent);
      transform: translateY(-50%);
      transition: left 0.6s ease;
      z-index: -1;
    }

    &:hover {
      background-color: ${({ theme }) => theme.colors.lighterBlue};
      transform: translateY(-2px);
      
      &::before {
        left: 100%;
      }
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 4rem 1.5rem;
    min-height: 70vh;

    h1 {
      font-size: 2.2rem;
    }
    p {
      font-size: 1rem;
    }
    
    .hero-content {
      padding: 1.5rem;
    }
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 3rem 1rem;
    min-height: 60vh;

    h1 {
      font-size: 1.8rem;
      margin-bottom: 0.8rem;
    }
    p {
      font-size: 0.95rem;
      margin-bottom: 1.5rem;
    }
    
    .hero-cta {
      padding: 0.6rem 1.2rem;
      font-size: 0.9rem;
    }
    
    .hero-content {
      padding: 1rem;
    }
  }
`;

// ABOUT SECTION (with tertiaryDark border)
const AboutSection = styled.section`
  background: ${({ theme }) => theme.colors.light};
  color: ${({ theme }) => theme.colors.primaryDark};
  padding: 4rem 2rem;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center; 
  /* Border using tertiaryDark */
  border: 2px solid ${({ theme }) => theme.colors.tertiaryDark};

  .about-content {
    flex: 1;
    padding-right: 2rem;
  }

  h2 {
    
    font-family: 'Aloja';
  }
  .about-image {
    flex: 1;
    text-align: center;
    img {
      max-width: 100%;
      border-radius: 8px;
      height: 70vh;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    min-height: auto;

    .about-content {
      padding-right: 0;
      margin-bottom: 2rem;
    }
  }
`;

// CAROUSEL SECTION (Food) - Slightly larger
const CarouselSection = styled.section`
  background: ${({ theme }) => theme.colors.secondaryDark};
  padding: 4rem 2rem;
  text-align: center;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h2 {
    color: ${({ theme }) => theme.colors.primaryLight};
    margin-bottom: 2rem;
    font-family: 'Aloja';
}
  .subtext  {
    color: ${({ theme }) => theme.colors.primaryDark};
    margin-bottom: .25rem;
       
  }




  /* The carousel of items */
  .carousel {
    margin-top: 2rem;
    display: flex;
    gap: 2rem;
    overflow-x: auto;
    padding-bottom: 1rem;

    .food-item {
      width: 300px;
      background: ${({ theme }) => theme.colors.accent};
      border: 2px solid ${({ theme }) => theme.colors.tertiaryDark};
      border-radius: 8px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: 1rem;
      color: ${({ theme }) => theme.colors.primaryLight};

      h3 {
        margin-bottom: 0.75rem;
        font-size: 1.2rem;
        
      }

      img {
        width: 100%;
        height: 200px;
        object-fit: cover; 
        border-radius: 6px;
      }
    }
  }

  /* A separate container for a single CTA button below the carousel */
  .order-cta {
    margin-top: 2rem;
    display: flex;
    justify-content: center; /* Centers the button horizontally */
    width: 100%;

    .order-now-btn {
      background: ${({ theme }) => theme.colors.primaryDark};
      color: #fff;
      text-decoration: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      font-weight: 600;
      transition: background 0.3s ease;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.6), transparent);
        transform: translateY(-50%);
        transition: left 0.6s ease;
        z-index: -1;
      }

      &:hover {
        background: ${({ theme }) => theme.colors.secondaryDark};
        
        &::before {
          left: 100%;
        }
      }
    }
  }
`;


// CATERING SECTION (with tertiaryDark border)

const CateringSection = styled.section`
  background: ${({ theme }) => theme.colors.light};
  padding: 4rem 2rem;
  min-height: 70vh;
  border: 2px solid ${({ theme }) => theme.colors.tertiaryDark};
  display: flex;
  justify-content: center;

  /* Outer container for text + image side by side */
  .content {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
  }

  /* Text content on the left */
  .text-content {
    flex: 1;
    text-align: left; /* or center, if you prefer */
  }

  h2 {
    color: ${({ theme }) => theme.colors.primaryDark};
    margin-bottom: 0.5rem;
    font-family: 'Aloja';
  }

  .subheading {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.primaryDark};
    margin-bottom: 1.5rem;
  }

  p {
    color: ${({ theme }) => theme.colors.primaryDark};
    margin-bottom: 2rem;
  }

  .cta-button {
    display: inline-block;
    width: fit-content;
    padding: 0.75rem 1.25rem;
    background: ${({ theme }) => theme.colors.primaryDark};
    color: ${({ theme }) => theme.colors.primaryLight};
    text-decoration: none;
    border-radius: 2px;
    font-weight: 500;
    margin-top: 1rem;

    &:hover {
      background: ${({ theme }) => theme.colors.lighterBlue};
    }
  }

  /* Image container on the right */
  .image-container {
    flex: 1;
    display: flex;
    justify-content: center; 
    align-items: center;

    /* The SVG or img inside here */
    img,
    svg {
      max-width: 900px;
      height: 100vh;
      display: block;
    }
  }

  /* Responsive: stack in a column on smaller screens */
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    .content {
      flex-direction: column;
      text-align: center; /* center text on mobile if desired */
    }

    .text-content {
      order: 2; /* put text below the image on smaller devices */
    }

    .image-container {
      order: 1;
      margin-bottom: 2rem; /* space between image and text */
      overflow: hidden;
    }
  }

  /* Make the SVG a bit bigger on mobile but avoid overflow */
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    .image-container img,
    .image-container svg {
      max-width: 140%; 
      gap: 1rem;
      height: auto;   /* remove fixed height to prevent overflow */
    }
  }
`;


// MERCH SECTION (unchanged)


const Section = styled.section`
  background: ${({ theme }) => theme.colors?.light || '#f9f9f9'};
  text-align: center;
  padding: 4rem 2rem;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h2 {
    color: ${({ theme }) => theme.colors?.primaryDark || '#333'};
    margin-bottom: 1rem;
    font-family: 'Aloja';
  }

  p {
    color: ${({ theme }) => theme.colors?.highlight || '#666'};
    margin-bottom: 2rem;
  }

.merch-grid {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;

  .merch-item {
    background: ${({ theme }) => theme.colors?.accent || '#e5e5e5'};
    color: ${({ theme }) => theme.colors?.primaryDark || '#333'};
-   width: 200px;
-   height: 250px;
+   width: 250px;
+   height: 300px; 
    border-radius: 8px;
    display: flex;
    flex-direction: column;
+   justify-content: space-between; /* Keep image & text from crowding each other */
    align-items: center;
    font-weight: bold;
    padding: 1rem;
    transition: background 0.3s, color 0.3s;

    &:hover {
      background: ${({ theme }) => theme.colors?.lighterBlue || '#cce0ff'};
      color: ${({ theme }) => theme.colors?.primaryLight || '#fff'};
    }

    span {
      margin-top: 0.5rem;
    }

+   /* Responsive tweak for small screens */
+   @media (max-width: 768px) {
+     width: 150px;
+     height: 200px;
+   }
  }
}
    }
  }
`;

// The styled button
const CTAButton = styled.button`
  background: ${({ theme }) => theme.colors?.primaryDark || '#333'};
  color: #fff;
  padding: 0.75rem 1.5rem;
  margin-bottom: 2rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors?.secondaryDark || '#555'};
  }
`;

// WEBCAM SECTION (with tertiaryDark border)
 const WebcamSection = styled.section`
  background: ${({ theme }) => theme.colors.light};
  text-align: center;
  padding: 4rem 2rem;
  min-height: 80vh; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 2px solid ${({ theme }) => theme.colors.tertiaryDark};

  h2 {
    color: ${({ theme }) => theme.colors.primaryDark};
    margin-bottom: 1rem;
       font-family: 'Aloja';
  }



  .webcam-wrapper {
    /* Center the container and give it a max width for desktop */
    max-width: 1200px; 
    margin: 0 auto; 
    width: 90%;

    iframe {
      /* Fill the container's width, automatically scale height */
      width: 100%;
      /* Use aspect-ratio for a fixed proportion (16:9 or ~610:343) */
      aspect-ratio: 610 / 343;
      border: none;
      border-radius: 8px;
      display: block; /* Removes default inline spacing */
    }
  }

  /* Mobile-friendly adjustments */
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 2rem 1rem;
  }
`;

// Easter Egg styled component
const EasterEggContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .easter-egg-content {
    text-align: center;
    color: ${({ theme }) => theme.colors.primaryLight};
    animation: bounce 1s ease-in-out infinite alternate;

    @keyframes bounce {
      from { transform: translateY(0px); }
      to { transform: translateY(-20px); }
    }

    h1 {
      font-size: 4rem;
      margin-bottom: 1rem;
      font-family: 'Aloja';
      color: #FFD700;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }

    p {
      font-size: 1.5rem;
      margin-bottom: 2rem;
    }

    .close-btn {
      background: ${({ theme }) => theme.colors.primaryDark};
      color: white;
      border: none;
      padding: 1rem 2rem;
      font-size: 1.2rem;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s ease;

      &:hover {
        background: ${({ theme }) => theme.colors.secondaryDark};
      }
    }

    .secret-message {
      font-size: 1.2rem;
      color: #FFD700;
      margin-top: 1rem;
      font-style: italic;
    }
  }
`;

// Hidden clickable element for easter egg
const SecretTrigger = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.3s ease;
  background: rgba(255, 215, 0, 0.3);
  border: 2px solid rgba(255, 215, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);
  
  &:hover {
    opacity: 1;
    background: rgba(255, 215, 0, 0.5);
    transform: scale(1.1);
    box-shadow: 0 0 25px rgba(255, 215, 0, 0.4);
  }
  
  /* Make it look like a clickable beer mug */
  &::after {
    content: '🍺';
    font-size: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

// Simple loading fallback component
const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    Loading...
  </div>
);

// Simple Easter Egg Hook
const useEasterEgg = () => {
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  
  const triggerEasterEgg = () => {
    setShowEasterEgg(true);
    
    // Play a fun sound effect
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      console.log('🎉 Easter Egg Activated!');
    }
  };
  
  const closeEasterEgg = () => {
    setShowEasterEgg(false);
  };
  
  return { showEasterEgg, triggerEasterEgg, closeEasterEgg };
};

// This component handles the scroll functionality with useSearchParams
const ScrollHandler = ({ children }) => {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Check if we should scroll to a section based on URL param
    const scrollTo = searchParams.get('scrollTo');
    
    if (scrollTo) {
      // Add a small delay to ensure the page is fully loaded
      setTimeout(() => {
        const element = document.getElementById(scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [searchParams]);

  return children;
};

export default function HomePage() {
  const { showEasterEgg, triggerEasterEgg, closeEasterEgg } = useEasterEgg();
  
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ScrollHandler>
        <>
          {showEasterEgg && (
            <EasterEggContainer>
              <div className="easter-egg-content">
                <h1>🍺 You Found the Secret! 🍺</h1>
                <p>You've discovered the hidden treasure of Laurino's Tavern!</p>
                <p>Here's a special message just for you:</p>
                <p className="secret-message">
                  "Life is uncertain, but the best clam chowder is always at Laurino's!"
                </p>
                <button className="close-btn" onClick={closeEasterEgg}>
                  Close Secret Portal
                </button>
              </div>
            </EasterEggContainer>
          )}
          
          <HeroSection>
          {/* The background image in the DOM */}
          <img
            className="background-image"
            src="/Capecodmass.jpg"
            alt="Cape Cod ocean background"
          />
          {/* A dark overlay to ensure text is legible */}
          <div className="overlay" />

          {/* Your main hero content */}
          <div className="hero-content">
            <h1>Welcome to Laurino&apos;s Tavern</h1>
            <p>Serving up local favorites on Cape Cod for generations</p>
            <a href="https://www.clover.com/online-ordering/laurinos-tavern-brewster" className="hero-cta">Order Now</a>
          </div>
        </HeroSection>
        <Calendar onEasterEggTrigger={triggerEasterEgg} />


       
          <AboutSection id="about">
            <div className="about-content">
              <h2>About Laurino&apos;s</h2>
              <p>
                For decades, Laurino&apos;s Tavern has been a staple of Cape Cod dining,
                offering fresh seafood, hearty comfort food, and a warm, welcoming atmosphere.
              </p>
              <p>
                Whether you&apos;re here for a casual lunch, a family dinner, or a 
                celebration, our friendly staff and cozy tavern vibes make every visit special.
              </p>
            </div>
            <div className="about-image">
              <img
                src="/barimage.jpg"
                alt="Laurino's Tavern Front"
              />
            </div>
          </AboutSection>

          <CarouselSection>
          <SecretTrigger onClick={triggerEasterEgg} />
          <h2>Try Our Favorites</h2>
          <div className="carousel">
            <div className="food-item">
              <h3>Lobster Roll</h3>
              <img src="/LobsterRoll.jpg" alt="Lobster Roll" />
           
            </div>
            <div className="food-item">
              <h3> Fish Tacos</h3>
              <img src="/FishTacos.jpg" alt="Fish Tacos" />
            </div>
            <div className="food-item">
              <h3>Home Made Pan Pizza</h3>
              <img src="/Pizza.png" alt="Pizza" />
            </div>
            <div className="food-item">
              <h3>Fish &amp; Chips</h3>
              <img src="/FishandChips.jpg" alt="Fish &amp; Chips" />
            </div>
            <div className="food-item">
              <h3>Burgers</h3>
              <img src="/Burger.jpg" alt="Oysters"  />
            </div>
            <div className="food-item">
              <h3>Oysters</h3>
              <img src="/Oysters.jpg" alt="Clam Chowder" />
            </div>
            <div className="food-item">
              <h3>Steak</h3>
              <img src="/Steak.jpg" alt="Steak" />
            </div>
          </div>
          <div className="order-cta">
            <a href="https://www.clover.com/online-ordering/laurinos-tavern-brewster" className="order-now-btn">Order Now</a>
          </div>
        </CarouselSection>

        <CateringSection>
          <div className="content">
            {/* Left: text content */}
            <div className="text-content">
              <h2>Catering Services</h2>
              <div className="subheading">
                Professional on-site catering for every occasion
              </div>
              <p>
                Our friendly team is ready to bring the party to you, complete with
                custom menus, bar service, and more.
              </p>
              <a href="/components/catering" className="cta-button">
                Learn More
              </a>
            </div>

            {/* Right: SVG or image container */}
            <div className="image-container">
              <img
                src="/Catering.svg"
                alt="Mobile bar illustration"
              />
            </div>
          </div>
        </CateringSection>


        <Section>
          <h2>Our Merch</h2>
          <p>Check out our official merchandise below!</p>

          {/* CTA button linking to "/store" */}
          <Link href="../components/laurinosstore/Store">
            <CTAButton>Go to Store</CTAButton>
          </Link>

          <div className="merch-grid">
            {/* Hat */}
            <div className="merch-item">
            <Link href="../components/laurinosstore/Store?category=Gear">
              <Image
                src="/Gear.svg"
                alt="Gear"
                width={275}
                height={275}
                style={{
                  objectFit: 'contain',
                  margin: '0 auto',
                }}
              />
               </Link>
              <span>Gear</span>
            </div>

            {/* T-Shirt */}

           
            <div className="merch-item">
            <Link href="../components/laurinosstore/Store?category=T-Shirts">
              <Image
                src="/Tshirts.svg"
                alt="T-Shirts"
                width={275}
                height={275}
                style={{
                  objectFit: 'contain',
                  margin: '0 auto',
                }}
              />
               </Link>
              <span>T-Shirts</span>
            </div>

            {/* Sweatshirt */}
            <div className="merch-item">
            <Link href="../components/laurinosstore/Store?category=Sweatshirts">
              <Image
                src="/Hoodiefront.svg"
                alt="Sweatshirts"
                width={275}
                height={275}
                style={{
                  objectFit: 'contain',
                  margin: '0 auto',
                }}
              />
              </Link>
              <span>Sweatshirts</span>
            </div>

            {/* Gear */}
            <div className="merch-item">
            <Link href="../components/laurinosstore/Store?category=Hats">
              <Image
                src="/Hats.svg"
                alt="Hats"
                width={275}
                height={275}
                style={{
                  objectFit: 'contain',
                  margin: '0 auto',
                }}
              />
                 </Link>
              <span>Hats</span>
            </div>
          </div>
        </Section>


          <WebcamSection>
      <h2>Live Webcam</h2>
      <p>Check out what's happening locally!</p>
      <div className="webcam-wrapper">
        <iframe
          src="https://streampros.net/player/live/rvm2php9"
          allowFullScreen
          title="Live Stream"
        />
      </div>
    </WebcamSection>
        </>
      </ScrollHandler>
    </Suspense>
  );
}