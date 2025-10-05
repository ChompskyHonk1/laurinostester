"use client";
import React from "react";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";

export default function ContactPage() {
  return (
    <ContactSection>
      <PageHeader>
        <h1>Get in Touch</h1>
        <p>We'd love to hear from you. How can we help?</p>
      </PageHeader>

      <ContactOptions>
      <ContactCard>
          <div className="image-container">
            <img src="/EventsImage.jpg" alt="Elegantly catered event with table settings and food displays" />
            <div className="overlay" />
          </div>
          <div className="content">
            <h2>Events & Catering</h2>
            <p>
              Planning a special celebration, corporate event, or wedding? Let our experienced team create a memorable occasion with our event services.
            </p>
            <ul>
              <li>In House Events </li>
              <li>Private Functions</li>
              <li>Weddings & celebrations</li>
              <li>Corporate events</li>
              <li>Custom Catering Packages</li>

            </ul>
            <Link href="/components/catering">
              <CTAButton>Plan Your Event</CTAButton>
            </Link>
          </div>
        </ContactCard>
        <ContactCard>
          <div className="image-container">
            <img src="/ContactSupport.svg" alt="Customer support representative assisting a client" />
            <div className="overlay" />
          </div>
          <div className="content">
            <h2>Questions & Support</h2>
            <p>
              Have a question about our menu, hours, or need assistance? Our team is here to help with any inquiries you might have.
            </p>
            <ul>
              <li>Menu Questions</li>
              <li>Reservation Assistance</li>
              <li>General Inquiries</li>
              <li>Feedback & Suggestions</li>
              <li>Comments or Concerns</li>

            </ul>
            <Link href="/components/Support">
              <CTAButton>Contact Support</CTAButton>
            </Link>
          </div>
        </ContactCard>

   
      </ContactOptions>

      <QuickInfoSection>
        <div className="info-container">
          <InfoCard>
            <div className="icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <title>Location Pin</title>
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor" />
              </svg>
            </div>
            <div className="text">
              <h3>Location</h3>
              <p>3668 Main Street,<br />Brewster, MA 02601</p>
            </div>
          </InfoCard>

          <InfoCard>
            <div className="icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <title>Clock</title>
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12.5 12.5H7.5V11H11.5V5.5H13V12.5H12.5Z" fill="currentColor" />
              </svg>
            </div>
            <div className="text">
              <h3>Hours</h3>
              <p>Mon-Thurs: 11:30am to ~9pm<br />Fri-Sat: 12pm to ~9pm<br />Sunday: 12pm to ~9pm</p>
            </div>
          </InfoCard>

          <InfoCard>
            <div className="icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <title>Phone</title>
                <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="currentColor" />
              </svg>
            </div>
            <div className="text">
              <h3>Phone</h3>
              <p><a href="tel:+15088966135" className="phone-link">(508) 896-6135</a></p>
            </div>
          </InfoCard>

          <InfoCard>
            <div className="icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <title>Email</title>
                <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor" />
              </svg>
            </div>
            <div className="text">
              <h3>Email</h3>
              <p><a href="mailto:laurinosfeedback@gmail.com" className="email-link">laurinosfeedback@  gmail.com</a></p>
            </div>
          </InfoCard>
        </div>
      </QuickInfoSection>

      <MapSection>
  <h2>Find Us</h2>
  <div className="map-container">
    <iframe 
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d95482.89676118834!2d-70.17850061240222!3d41.75227636511202!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89fb43e851abdf3d%3A0x9e88614e8dbb58df!2s3668%20Main%20St%2C%20Brewster%2C%20MA%2002631!5e0!3m2!1sen!2sus!4v1710429174775!5m2!1sen!2sus" 
      width="600" 
      height="450" 
      style={{ border: 0 }} 
      allowFullScreen={true} 
      loading="lazy" 
      referrerPolicy="no-referrer-when-downgrade"
      title="Map to Laurino's Tavern in Brewster, MA"
    />
  </div>
</MapSection>
    </ContactSection>
  );
}

// Styled components for the contact page
const ContactSection = styled.section`
  background: ${({ theme }) => theme.colors.light};
  color: ${({ theme }) => theme.colors.primaryDark};
  min-height: 100vh;
  width: 100%;
`;

const PageHeader = styled.div`
  text-align: center;
  padding: 2rem 2rem 3rem;
  background-color: ${({ theme }) => theme.colors.bluePastel};
  position: relative;

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

  h1, p {
    position: relative;
    z-index: 2;
    color: ${({ theme }) => theme.colors.primaryLight};
  }

  h1 {
    font-family: 'Aloja', sans-serif;
    font-size: 2.7rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const ContactOptions = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 3rem 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 2rem 1rem;
  }
`;

const ContactCard = styled.div`
  background: ${({ theme }) => theme.colors.light};
  border: 1px solid ${({ theme }) => theme.colors.tertiaryDark};
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  max-width: 500px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  .image-container {
    position: relative;
    height: 250px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 30%;
      background: linear-gradient(to top, rgba(0, 0, 0, .5), transparent);
    }
  }

  &:hover .image-container img {
    transform: scale(1.05);
  }

  .content {
    padding: 2rem;
    text-align: left;

    h2 {
      font-family: 'Aloja', sans-serif;
      font-size: 1.8rem;
      margin-bottom: 1rem;
      color: ${({ theme }) => theme.colors.primaryDark};
    }

    p {
      color: ${({ theme }) => theme.colors.secondaryDark};
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }

    ul {
      list-style-type: disc;
      margin-left: 1.5rem;
      margin-bottom: 1.5rem;
      color: ${({ theme }) => theme.colors.secondaryDark};

      li {
        margin-bottom: 0.5rem;
      }
    }
  }
`;

const CTAButton = styled.button`
  display: inline-block;
  background: ${({ theme }) => theme.colors.tertiaryDark};
  color: ${({ theme }) => theme.colors.primaryLight};
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
  text-decoration: none;

  &:hover {
    background: ${({ theme }) => theme.colors.bluePastel};
  }
`;

const QuickInfoSection = styled.section`
  background: ${({ theme }) => theme.colors.accent};
  padding: 3rem 2rem;
  margin: 3rem 0;

  .info-container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const InfoCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: ${({ theme }) => theme.colors.light};
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 240px;
  flex: 1;

  .icon {
    color: ${({ theme }) => theme.colors.primaryDark};
    padding: 0.5rem;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.accent};
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .text {
    h3 {
      font-family: 'Aloja', sans-serif;
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
      color: ${({ theme }) => theme.colors.primaryDark};
    }

    p {
      color: ${({ theme }) => theme.colors.secondaryDark};
      line-height: 1.5;
    }

      .phone-link {
      color: ${({ theme }) => theme.colors.secondaryDark};
      text-decoration: none;
      transition: color 0.3s ease;

       &:hover {
        color: ${({ theme }) => theme.colors.tertiaryDark};
        text-decoration: underline;
      }
  }
        .email-link {
      color: ${({ theme }) => theme.colors.secondaryDark};
      text-decoration: none;
      transition: color 0.3s ease;
      
      &:hover {
        color: ${({ theme }) => theme.colors.tertiaryDark};
        text-decoration: underline;
      }
    }

}
  @media (max-width: 480px) {
    width: 100%;
  }
`;

const MapSection = styled.section`
  padding: 3rem 2rem;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto 4rem;

  h2 {
    font-family: 'Aloja', sans-serif;
    font-size: 2rem;
    margin-bottom: 2rem;
    color: ${({ theme }) => theme.colors.primaryDark};
  }

  .map-container {
    width: 100%;
    height: 450px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    iframe {
      width: 100%;
      height: 100%;
    }
  }

  @media (max-width: 768px) {
    padding: 2rem 1rem;
    
    .map-container {
      height: 350px;
    }
  }
`;