"use client"; // Only necessary if using Next.js 13 App Router
import React from "react";
import styled from "styled-components";

export default function ComingSoonPage() {
  return (
    <ComingSoonSection>
      <PageHeader>
        <h1>Great stuff is brewing!</h1>
        <h2>Reef Runner</h2>
        <p>Locally sourced Cape Cod seltzers with an amazing taste</p>
        <div className="coming-soon">Coming Soon</div>
      </PageHeader>
      
      <div className="content-wrapper">
        <div className="image-wrapper">
          {/* Replace with your own image path */}
          <img
            src="/canimage3.svg"
            alt="Reef Runner Seltzer"
          />
        </div>
      </div>
    </ComingSoonSection>
  );
}

const ComingSoonSection = styled.section`
  background: ${({ theme }) => theme.colors.light};
  color: ${({ theme }) => theme.colors.primaryDark};
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  .content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    width: 100%;
    padding: 2rem;
  }

  .image-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }
     
  img {
    max-width: 100%;
    height: auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const PageHeader = styled.div`
  text-align: center;
  padding: 2rem 2rem 3rem;
  background-color: ${({ theme }) => theme.colors.bluePastel};
  position: relative;
  width: 100%;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.light};
    z-index: 1;
  }

  h1, h2, p, .coming-soon {
    position: relative;
    z-index: 2;
    color: ${({ theme }) => theme.colors.primaryLight};
    max-width: 700px;
    margin: 0 auto;
  }

  h1 {
    font-family: 'Aloja', sans-serif;
    font-size: 2.7rem;
    font-weight: 400;
    margin-bottom: 1rem;
    letter-spacing: 0.5px;
  }

  h2 {
    font-family: 'Aloja', sans-serif;
    font-size: 1.8rem;
    font-weight: 300;
    margin-bottom: 1rem;
    letter-spacing: 0.5px;
  }

  p {
    font-size: 1.2rem;
    line-height: 1.6;
    font-weight: 300;
    margin-bottom: 1rem;
  }

  .coming-soon {
    font-size: 1.2rem;
    font-weight: bold;
    margin-top: 1rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 2rem 1.5rem 2.5rem;
    
    h1 {
      font-size: 2.5rem;
    }
    
    h2 {
      font-size: 1.6rem;
    }
    
    p {
      font-size: 1.1rem;
    }
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1.5rem 1rem 2rem;
    
    h1 {
      font-size: 2rem;
    }
    
    h2 {
      font-size: 1.4rem;
    }
    
    p {
      font-size: 1rem;
    }
  }
`;
