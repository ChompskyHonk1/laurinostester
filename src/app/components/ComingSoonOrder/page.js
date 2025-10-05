"use client";

import styled from 'styled-components';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHamburger, 
  faPizzaSlice, 
  faBeer, 
  faMobileAlt,
  faClock,
  faHome
} from '@fortawesome/free-solid-svg-icons';

// Main container styled similarly to your other sections
const ComingSoonContainer = styled.section`
  position: relative;
  background: ${({ theme }) => theme.colors.light};
  color: ${({ theme }) => theme.colors.primaryDark};
  padding: 4rem 2rem;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  
  /* Decorative background elements */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)), 
                url('/Capecodmass.jpg');
    background-size: cover;
    background-position: center;
    opacity: 0.15;
    z-index: -1;
  }
`;

const ContentCard = styled.div`
  background: ${({ theme }) => theme.colors.primaryLight};
  border: 2px solid ${({ theme }) => theme.colors.tertiaryDark};
  border-radius: 12px;
  padding: 3rem;
  max-width: 800px;
  width: 100%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 2rem;
  }
`;

const Title = styled.h1`
  font-family: 'Aloja', serif;
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primaryDark};
  margin-bottom: 1.5rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background-color: ${({ theme }) => theme.colors.tertiaryDark};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 1.5rem auto;
  max-width: 600px;
`;

const CountdownContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin: 2.5rem 0;
  flex-wrap: wrap;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    gap: 1rem;
  }
`;

const CountdownItem = styled.div`
  background: ${({ theme }) => theme.colors.accent};
  border: 1px solid ${({ theme }) => theme.colors.tertiaryDark};
  border-radius: 8px;
  padding: 1rem;
  min-width: 90px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    min-width: 70px;
    padding: 0.75rem;
  }
`;

const CountdownNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primaryDark};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 1.8rem;
  }
`;

const CountdownLabel = styled.div`
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.colors.secondaryDark};
`;

const FeatureGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin: 2rem 0;
  flex-wrap: wrap;
`;

const FeatureItem = styled.div`
  background: ${({ theme }) => theme.colors.accent};
  border-radius: 8px;
  padding: 1.5rem;
  flex: 1;
  min-width: 200px;
  max-width: 220px;
  text-align: center;
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-5px);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    min-width: 100%;
  }
`;

const FoodIcons = styled.div`
  margin: 1.5rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
`;

const IconWrapper = styled.div`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.tertiaryDark};
`;

const FeatureIconWrapper = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.tertiaryDark};
`;

const FeatureTitle = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.primaryDark};
`;

const FeatureDescription = styled.div`
  font-size: 0.9rem;
`;

const CtaButton = styled.a`
  display: inline-block;
  background: ${({ theme }) => theme.colors.primaryDark};
  color: ${({ theme }) => theme.colors.primaryLight};
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  margin-top: 1.5rem;
  transition: background 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.lighterBlue};
  }
`;

export default function OnlineOrderingComingSoon() {
  // State for countdown timer
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  // Set launch date (April 1, 2025)
  const launchDate = new Date('April 1, 2025 12:00:00').getTime();
  
  // Update countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate - now;
      
      if (distance <= 0) {
        clearInterval(timer);
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
        return;
      }
      
      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [launchDate]);
  
  return (
    <ComingSoonContainer>
      <ContentCard>
        <Title>Online Ordering Coming Soon</Title>
        <Subtitle>
          We're excited to announce that we're working on a new online ordering system 
          to make your Laurino's experience even better. Get ready for a seamless way 
          to enjoy your favorite dishes!
        </Subtitle>
        
        <CountdownContainer>
          <CountdownItem>
            <CountdownNumber>
              {String(countdown.days).padStart(2, '0')}
            </CountdownNumber>
            <CountdownLabel>days</CountdownLabel>
          </CountdownItem>
          <CountdownItem>
            <CountdownNumber>
              {String(countdown.hours).padStart(2, '0')}
            </CountdownNumber>
            <CountdownLabel>hours</CountdownLabel>
          </CountdownItem>
          <CountdownItem>
            <CountdownNumber>
              {String(countdown.minutes).padStart(2, '0')}
            </CountdownNumber>
            <CountdownLabel>minutes</CountdownLabel>
          </CountdownItem>
          <CountdownItem>
            <CountdownNumber>
              {String(countdown.seconds).padStart(2, '0')}
            </CountdownNumber>
            <CountdownLabel>seconds</CountdownLabel>
          </CountdownItem>
        </CountdownContainer>
        
        <FoodIcons>
          <IconWrapper>
            <FontAwesomeIcon icon={faHamburger} />
          </IconWrapper>
          <IconWrapper>
            <FontAwesomeIcon icon={faPizzaSlice} />
          </IconWrapper>
          <IconWrapper>
            <FontAwesomeIcon icon={faBeer} />
          </IconWrapper>
    
        </FoodIcons>
        
        <FeatureGrid>
          <FeatureItem>
            <FeatureIconWrapper>
              <FontAwesomeIcon icon={faMobileAlt} />
            </FeatureIconWrapper>
            <FeatureTitle>Mobile-Friendly</FeatureTitle>
            <FeatureDescription>
              Order from any device, anywhere, anytime
            </FeatureDescription>
          </FeatureItem>
          <FeatureItem>
            <FeatureIconWrapper>
              <FontAwesomeIcon icon={faClock} />
            </FeatureIconWrapper>
            <FeatureTitle>Quick & Easy</FeatureTitle>
            <FeatureDescription>
              Streamlined ordering process saves you time
            </FeatureDescription>
          </FeatureItem>
          <FeatureItem>
            <FeatureIconWrapper>
              <FontAwesomeIcon icon={faHome} />
            </FeatureIconWrapper>
            <FeatureTitle>Pickup & Delivery</FeatureTitle>
            <FeatureDescription>
              Choose your preferred way to enjoy our food
            </FeatureDescription>
          </FeatureItem>
        </FeatureGrid>
        
        <Link href="/components/menu" passHref legacyBehavior>
          <CtaButton>View Our Menu</CtaButton>
        </Link>
        
      </ContentCard>
    </ComingSoonContainer>
  );
}