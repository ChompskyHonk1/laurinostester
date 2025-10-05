"use client"; // Only necessary if using Next.js 13 App Router
import React from "react";
import styled from "styled-components";

export default function ComingSoonPage() {
  return (
    <ComingSoonSection>
      <div className="content-wrapper">
        <h1>Great stuff is brewing!</h1>
        <h2>Reef Runner</h2>
        <p>Locally sourced Cape Cod seltzers with an amazing taste</p>
        <div className="coming-soon">Coming Soon</div>
      </div>

      <div className="image-wrapper">
        {/* Replace with your own image path */}
        <img
          src="/canimage3.svg"
          alt="Reef Runner Seltzer"
        />
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
  justify-content: center;
  text-align: center;
  padding: 2rem;

  .content-wrapper {
    margin-bottom: 2rem;
    max-width: 600px;

    h1 {
      font-family: 'Aloja', sans-serif;
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: ${({ theme }) => theme.colors.primaryDark};
    }

    h2 {
      font-size: 1.8rem;
      margin-bottom: 0.5rem;
      color: ${({ theme }) => theme.colors.secondaryDark};
    }

    p {
      font-size: 1.2rem;
      margin-bottom: 1rem;
      color: ${({ theme }) => theme.colors.highlight};
    }

    .coming-soon {
      font-size: 1.2rem;
      font-weight: bold;
      color: ${({ theme }) => theme.colors.accent};
    }
  }

  .image-wrapper {
   display: flex;
  justify-content: center; /* horizontal center */
  align-items: center; 
}
    

    img {
     max-width: 100%;
      height: auto;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      
         
    
  }
`;
