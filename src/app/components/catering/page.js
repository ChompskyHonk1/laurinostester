"use client"; // Only necessary if using Next.js 13 App Router
import React from "react";
import styled from "styled-components";


export default function CateringPage() {
  return (
    <CateringSection>
      <SectionHeader>
        <h2> Event Services for Every Occasion</h2>
        <p>Let Laurino's Tavern bring the perfect touch to your special event with our personalized catering services. From intimate gatherings to grand celebrations, we provide fresh, locally sourced cuisine paired with impeccable service.</p>
        <MobileCTAButton>
          <a href="/components/moreinfo">Contact Us for More Details</a>
        </MobileCTAButton>
      </SectionHeader>

      <EventTypes>
        <EventCard>
          <img src="/weddingpic.jpg" alt="Wedding Catering" />
          <h3>Weddings</h3>
          <p>Whether you’re planning a cozy beachside ceremony or a grand ballroom reception, our wedding catering service offers a memorable dining experience for your guests.</p>
        </EventCard>

        <EventCard>
          <img src="/Events.jpg" alt="Corporate Events" />
          <h3>Corporate Events</h3>
          <p>From business luncheons to conferences, Laurino's Tavern provides customized catering to fit your company's needs, ensuring your event is both professional and enjoyable.</p>
        </EventCard>

        <EventCard>
          <img src="/FamilyEvent2.jpg" alt="Family Gatherings" />
          <h3>Family Gatherings</h3>
          <p>Celebrate with your loved ones while we take care of the food. Our family-style menus and homey atmosphere make every family event feel special.</p>
        </EventCard>
      </EventTypes>

      <AdditionalServices>
        <h3>Additional Services</h3>
        <p>We also offer various setups, from casual buffet-style arrangements to elegant plated dinners. All our menus are customizable to fit your theme and dietary preferences. Let us know your vision, and we'll make it a reality!</p>
      </AdditionalServices>

      <CTAButton>
        <a href="/components/moreinfo">Contact Us for More Details</a>
      </CTAButton>
    </CateringSection>
  );
}

const CateringSection = styled.section`
  background: ${({ theme }) => theme.colors.light};
  color: ${({ theme }) => theme.colors.primaryDark};
  padding: 4rem 2rem;
  text-align: center;
`;

const SectionHeader = styled.div`
  margin-bottom: 3rem;

  h2 {
    font-family: 'Aloja', sans-serif;
    font-size: 2.5rem;
    color: ${({ theme }) => theme.colors.primaryDark};
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    color: ${({ theme }) => theme.colors.secondaryDark};
  }
`;

const EventTypes = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
`;

const EventCard = styled.div`
  background: ${({ theme }) => theme.colors.accent};
  padding: 1rem;
  border-radius: 8px;
  max-width: 350px;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }

  h3 {
    font-size: 1.5rem;
    margin-top: 1rem;
    color: ${({ theme }) => theme.colors.primaryDark};
  }

  p {
    color: ${({ theme }) => theme.colors.secondaryDark};
    font-size: 1rem;
    margin-top: 0.5rem;
  }
`;

const AdditionalServices = styled.div`
  margin-top: 3rem;

  h3 {
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.primaryDark};
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    color: ${({ theme }) => theme.colors.secondaryDark};
  }
`;


const MobileCTAButton = styled.div`
  display: none; /* Hidden by default */
  margin-top: 1.5rem;
  text-align: center;

  a {
    display: inline-block;
    background: ${({ theme }) => theme.colors.primaryDark};
    color: #fff;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    border-radius: 4px;
    text-decoration: none;
    font-weight: 600;
    white-space: nowrap;

    &:hover {
      background: ${({ theme }) => theme.colors.bluePastel};
    }
  }

  /* Only show on mobile */
  @media (max-width: 768px) {
    display: block;
  }

  @media (max-width: 480px) {
    a {
      font-size: 1rem;
      padding: 0.75rem 1rem;
    }
  }
`;

const CTAButton = styled.div`
  margin-top: 3rem;
  text-align: center;

  a {
    display: inline-block;
    background: ${({ theme }) => theme.colors.primaryDark};
    color: #fff;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    border-radius: 4px;
    text-decoration: none;
    font-weight: 600;
    white-space: nowrap; /* Force single line */

    &:hover {
      background: ${({ theme }) => theme.colors.bluePastel};
    }
  }

  @media (max-width: 480px) {
    a {
      font-size: 1rem;
      padding: 0.75rem 1rem;
      /* If you need wrapping:
         white-space: normal; 
      */
    }
  }
`;
