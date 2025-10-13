"use client";

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { format, isAfter, addDays } from 'date-fns';

const EventsCarouselContainer = styled.section`
  background: ${({ theme }) => theme.colors.background};
  padding: 4rem 2rem;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 2px solid ${({ theme }) => theme.colors.tertiaryDark};

  h2 {
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 2rem;
    font-family: 'Aloja';
    font-size: 2.5rem;
    text-align: center;
  }

  .carousel-wrapper {
    max-width: 1200px;
    width: 100%;
    position: relative;
  }

  .carousel-container {
    overflow: hidden;
    border-radius: 12px;
    padding: 1rem 0;
  }

  .carousel-track {
    display: flex;
    gap: 1.5rem;
    transition: transform 0.3s ease;
    padding: 0 1rem;
  }

  .event-card {
    flex: 0 0 280px;
    background: ${({ theme }) => theme.colors.cardBackground};
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 2px solid ${({ theme }) => theme.colors.tertiaryDark};
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
      border-color: ${({ theme }) => theme.colors.primaryDark};
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: ${({ theme }) => theme.colors.primaryDark};
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }

    &:hover::before {
      transform: scaleX(1);
    }

    .event-type-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;

      &.music {
        background: ${({ theme }) => theme.colors.tertiaryDark};
        color: ${({ theme }) => theme.colors.primaryLight};
      }

      &.event {
        background: ${({ theme }) => theme.colors.secondaryDark};
        color: ${({ theme }) => theme.colors.primaryLight};
      }
    }

    .event-date {
      font-size: 0.9rem;
      color: ${({ theme }) => theme.colors.tertiaryDark};
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .event-time {
      font-size: 0.85rem;
      color: ${({ theme }) => theme.colors.mutedText};
      margin-bottom: 1rem;
      font-weight: 500;
    }

    .event-title {
      font-size: 1.2rem;
      font-weight: 600;
      color: ${({ theme }) => theme.colors.text};
      margin-bottom: 0.75rem;
      line-height: 1.3;
      font-family: 'Aloja';
    }

    .event-description {
      font-size: 0.9rem;
      color: ${({ theme }) => theme.colors.text};
      line-height: 1.5;
      opacity: 0.85;
    }

    .event-date-display {
      background: ${({ theme }) => theme.colors.lighterBlue};
      border-radius: 8px;
      padding: 0.75rem;
      margin-bottom: 1rem;
      text-align: center;

      .day {
        font-size: 1.5rem;
        font-weight: 700;
        color: ${({ theme }) => theme.colors.primaryDark};
        display: block;
      }

      .month {
        font-size: 0.85rem;
        color: ${({ theme }) => theme.colors.tertiaryDark};
        text-transform: uppercase;
        letter-spacing: 1px;
      }
    }
  }

  .nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: ${({ theme }) => theme.colors.primaryDark};
    color: ${({ theme }) => theme.colors.primaryLight};
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.2rem;
    font-weight: 600;
    transition: all 0.3s ease;
    z-index: 10;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    &:hover {
      background: ${({ theme }) => theme.colors.secondaryDark};
      transform: translateY(-50%) scale(1.1);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
      transform: translateY(-50%);
    }

    &.prev {
      left: -25px;
    }

    &.next {
      right: -25px;
    }
  }

  .loading {
    text-align: center;
    padding: 2rem;
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.1rem;
  }

  .no-events {
    text-align: center;
    padding: 3rem;
    color: ${({ theme }) => theme.colors.mutedText};
    font-size: 1.1rem;
    background: ${({ theme }) => theme.colors.cardBackground};
    border-radius: 12px;
    border: 2px dashed ${({ theme }) => theme.colors.tertiaryDark};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 3rem 1rem;
    min-height: 50vh;

    h2 {
      font-size: 2rem;
      margin-bottom: 1.5rem;
    }

    .event-card {
      flex: 0 0 250px;
      padding: 1.25rem;

      .event-title {
        font-size: 1.1rem;
      }

      .event-description {
        font-size: 0.85rem;
      }
    }

    .nav-button {
      width: 45px;
      height: 45px;
      font-size: 1rem;

      &.prev {
        left: -20px;
      }

      &.next {
        right: -20px;
      }
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 2rem 0.5rem;
    min-height: 40vh;

    h2 {
      font-size: 1.8rem;
      margin-bottom: 1rem;
    }

    .carousel-wrapper {
      padding: 0 1rem;
    }

    .event-card {
      flex: 0 0 220px;
      padding: 1rem;

      .event-title {
        font-size: 1rem;
        margin-bottom: 0.5rem;
      }

      .event-description {
        font-size: 0.8rem;
      }

      .event-date-display {
        padding: 0.5rem;

        .day {
          font-size: 1.2rem;
        }

        .month {
          font-size: 0.75rem;
        }
      }
    }

    .nav-button {
      width: 40px;
      height: 40px;
      font-size: 0.9rem;

      &.prev {
        left: 10px;
      }

      &.next {
        right: 10px;
      }
    }

    .carousel-track {
      gap: 1rem;
      padding: 0 3rem;
    }
  }
`;

const EventsCarousel = ({ onEasterEggTrigger }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/calendar');
      const data = await response.json();
      
      // Filter for future events and sort by date
      const futureEvents = (data.events || [])
        .filter(event => {
          const eventDate = new Date(event.date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return isAfter(eventDate, today) || eventDate.toDateString() === today.toDateString();
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      
      setEvents(futureEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const visibleEvents = events.slice(currentIndex, currentIndex + 4);
  const canGoNext = currentIndex + 4 < events.length;
  const canGoPrev = currentIndex > 0;

  const handleNext = () => {
    if (canGoNext) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (canGoPrev) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const getEventDateDisplay = (dateString) => {
    const date = new Date(dateString);
    return {
      day: format(date, 'd'),
      month: format(date, 'MMM')
    };
  };

  if (loading) {
    return (
      <EventsCarouselContainer>
        <h2>Upcoming Events</h2>
        <div className="loading">Loading events...</div>
      </EventsCarouselContainer>
    );
  }

  if (events.length === 0) {
    return (
      <EventsCarouselContainer>
        <h2>Upcoming Events</h2>
        <div className="no-events">
          No upcoming events scheduled. Check back soon!
        </div>
      </EventsCarouselContainer>
    );
  }

  return (
    <EventsCarouselContainer>
      <h2>Upcoming Events</h2>
      {onEasterEggTrigger && (
        <div
          onClick={onEasterEggTrigger}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            opacity: '0.6',
            transition: 'all 0.3s ease',
            background: 'rgba(255, 215, 0, 0.3)',
            border: '2px solid rgba(255, 215, 0, 0.5)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(255, 215, 0, 0.2)',
          }}
          onMouseEnter={(e) => {
            e.target.style.opacity = '1';
            e.target.style.background = 'rgba(255, 215, 0, 0.5)';
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 0 25px rgba(255, 215, 0, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = '0.6';
            e.target.style.background = 'rgba(255, 215, 0, 0.3)';
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.2)';
          }}
          title="Click me for a surprise!"
        >
          <span style={{ fontSize: '25px' }}>🍺</span>
        </div>
      )}
      
      <div className="carousel-wrapper">
        <button 
          className="nav-button prev" 
          onClick={handlePrev}
          disabled={!canGoPrev}
        >
          ←
        </button>
        
        <button 
          className="nav-button next" 
          onClick={handleNext}
          disabled={!canGoNext}
        >
          →
        </button>

        <div className="carousel-container">
          <div 
            className="carousel-track"
            ref={trackRef}
            style={{
              transform: `translateX(-${currentIndex * (100 / events.length)}%)`
            }}
          >
            {events.map((event, index) => {
              const dateDisplay = getEventDateDisplay(event.date);
              return (
                <div key={event.id} className="event-card">
                  <div className="event-date-display">
                    <span className="day">{dateDisplay.day}</span>
                    <span className="month">{dateDisplay.month}</span>
                  </div>
                  
                  <span className={`event-type-badge ${event.type}`}>
                    {event.type}
                  </span>
                  
                  <div className="event-time">{event.time}</div>
                  
                  <h3 className="event-title">{event.title}</h3>
                  
                  <p className="event-description">{event.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </EventsCarouselContainer>
  );
};

export default EventsCarousel;