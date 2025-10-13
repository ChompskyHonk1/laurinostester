"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay } from 'date-fns';


const CalendarContainer = styled.section`
  background: ${({ theme }) => theme.colors.background};
  padding: 4rem 2rem;
  min-height: 80vh;
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

  .calendar-wrapper {
    max-width: 1200px;
    width: 100%;
    background: ${({ theme }) => theme.colors.cardBackground};
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 1px solid ${({ theme }) => theme.colors.border};
  }

  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding: 0 1rem;

    .month-year {
      font-size: 1.5rem;
      font-weight: 600;
      color: ${({ theme }) => theme.colors.text};
      font-family: sans-serif;
    }

    .nav-button {
      background: ${({ theme }) => theme.colors.primaryDark};
      color: ${({ theme }) => theme.colors.primaryLight};
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;

      &:hover {
        background: ${({ theme }) => theme.colors.secondaryDark};
        transform: translateY(-2px);
      }
    }
  }

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
    background: ${({ theme }) => theme.colors.border};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 8px;
    overflow: hidden;
  }

  .day-header {
    background: ${({ theme }) => theme.colors.tertiaryDark};
    color: ${({ theme }) => theme.colors.primaryLight};
    padding: 1rem;
    text-align: center;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .day-cell {
    background: ${({ theme }) => theme.colors.cardBackground};
    min-height: 100px;
    padding: 0.5rem;
    position: relative;
    transition: background-color 0.3s ease;

    &:hover {
      background: ${({ theme }) => theme.colors.lighterBlue};
    }

    &.other-month {
      background: ${({ theme }) => theme.colors.background};
      color: ${({ theme }) => theme.colors.mutedText};
      opacity: 0.5;
    }

    &.today {
      background: ${({ theme }) => theme.colors.bluePastel};
      font-weight: 600;
    }

    &.has-event {
      background: ${({ theme }) => theme.colors.lighterBlue};
      border: 2px solid ${({ theme }) => theme.colors.tertiaryDark};
    }

    .day-number {
      font-weight: 600;
      margin-bottom: 0.25rem;
      color: ${({ theme }) => theme.colors.text};
    }

    .event {
      background: ${({ theme }) => theme.colors.primaryDark};
      color: ${({ theme }) => theme.colors.primaryLight};
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      margin-bottom: 0.25rem;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: ${({ theme }) => theme.colors.secondaryDark};
        transform: scale(1.05);
      }

      &.music {
        background: ${({ theme }) => theme.colors.tertiaryDark};
      }

      &.event {
        background: ${({ theme }) => theme.colors.secondaryDark};
      }
    }
  }

  .events-list {
    margin-top: 2rem;
    padding: 1.5rem;
    background: ${({ theme }) => theme.colors.cardBackground};
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

    h3 {
      color: ${({ theme }) => theme.colors.text};
      margin-bottom: 1.5rem;
      font-family: sans-serif;
      font-size: 1.3rem;
      font-weight: 600;
    }

    .event-item {
      background: ${({ theme }) => theme.colors.background};
      padding: 1.25rem;
      margin-bottom: 1rem;
      border-radius: 8px;
      border-left: 4px solid ${({ theme }) => theme.colors.tertiaryDark};
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      &:hover {
        transform: translateX(5px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        background: ${({ theme }) => theme.colors.lighterBlue};
      }

      .event-title {
        font-weight: 600;
        color: ${({ theme }) => theme.colors.text};
        margin-bottom: 0.5rem;
        font-size: 1.1rem;
        line-height: 1.3;
      }

      .event-date-time {
        color: ${({ theme }) => theme.colors.tertiaryDark};
        font-size: 0.9rem;
        margin-bottom: 0.75rem;
        font-weight: 500;
        opacity: 0.9;
      }

      .event-description {
        color: ${({ theme }) => theme.colors.text};
        font-size: 0.95rem;
        line-height: 1.5;
        opacity: 0.85;
      }
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 2rem 1rem;

    .calendar-wrapper {
      padding: 1rem;
    }

    .calendar-header {
      .month-year {
        font-size: 1.2rem;
      }

      .nav-button {
        padding: 0.4rem 0.8rem;
        font-size: 0.9rem;
      }
    }

    .day-cell {
      min-height: 80px;
      padding: 0.25rem;
    }

    .event {
      font-size: 0.7rem;
      padding: 0.2rem 0.4rem;
    }

    .events-list {
      padding: 1rem;
      
      h3 {
        font-size: 1.1rem;
        margin-bottom: 1rem;
      }
      
      .event-item {
        padding: 1rem;
        
        .event-title {
          font-size: 1rem;
        }
        
        .event-date-time {
          font-size: 0.85rem;
        }
        
        .event-description {
          font-size: 0.9rem;
        }
      }
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1rem 0.5rem;

    h2 {
      font-size: 1.8rem;
      margin-bottom: 1rem;
    }

    .calendar-wrapper {
      padding: 0.75rem;
    }

    .calendar-header {
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1rem;

      .month-year {
        font-size: 1.1rem;
        text-align: center;
      }

      .nav-button {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
        width: 100%;
        max-width: 150px;
      }
    }

    .calendar-grid {
      gap: 0.5px;
    }

    .day-header {
      padding: 0.5rem;
      font-size: 0.8rem;
    }

    .day-cell {
      min-height: 60px;
      padding: 0.2rem;
    }

    .day-number {
      font-size: 0.9rem;
    }

    .event {
      font-size: 0.65rem;
      padding: 0.15rem 0.3rem;
      margin-bottom: 0.1rem;
    }

    .events-list {
      padding: 0.75rem;
      margin-top: 1.5rem;
      
      h3 {
        font-size: 1rem;
        margin-bottom: 0.75rem;
      }
      
      .event-item {
        padding: 0.75rem;
        margin-bottom: 0.75rem;
        
        .event-title {
          font-size: 0.95rem;
          margin-bottom: 0.3rem;
        }
        
        .event-date-time {
          font-size: 0.8rem;
          margin-bottom: 0.5rem;
        }
        
        .event-description {
          font-size: 0.85rem;
        }
      }
    }
  }
`;

const Calendar = ({ onEasterEggTrigger }) => {
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/calendar');
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get days from previous and next months to fill the calendar grid
  const startDayOfWeek = getDay(monthStart);
  const endDayOfWeek = getDay(monthEnd);
  
  const previousMonthDays = [];
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    previousMonthDays.push(new Date(monthStart.getFullYear(), monthStart.getMonth(), -i));
  }

  const nextMonthDays = [];
  for (let i = 1; i < 7 - endDayOfWeek; i++) {
    nextMonthDays.push(new Date(monthEnd.getFullYear(), monthEnd.getMonth(), monthEnd.getDate() + i));
  }

  const allDays = [...previousMonthDays, ...monthDays, ...nextMonthDays];

  const getEventsForDay = (day) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return isSameDay(eventDate, day);
    });
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const isToday = (day) => {
    return isSameDay(day, new Date());
  };

  if (loading) {
    return (
      <CalendarContainer>
        <h2>Events Calendar</h2>
        <div>Loading events...</div>
      </CalendarContainer>
    );
  }

  return (
    <CalendarContainer>
      <h2>Events Calendar</h2>
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
      <div className="calendar-wrapper">
        <div className="calendar-header">
          <button className="nav-button" onClick={handlePreviousMonth}>
            ← Previous
          </button>
          <div className="month-year">
            {format(currentMonth, 'MMMM yyyy')}
          </div>
          <button className="nav-button" onClick={handleNextMonth}>
            Next →
          </button>
        </div>

        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="day-header">
              {day}
            </div>
          ))}
          
          {allDays.map((day, index) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const hasEvent = dayEvents.length > 0;

            return (
              <div
                key={index}
                className={`day-cell ${!isCurrentMonth ? 'other-month' : ''} ${isToday(day) ? 'today' : ''} ${hasEvent ? 'has-event' : ''}`}
              >
                <div className="day-number">{format(day, 'd')}</div>
                {dayEvents.slice(0, 2).map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className={`event ${event.type}`}
                    title={`${event.title} - ${event.time}`}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="event" style={{ fontSize: '0.7rem' }}>
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="events-list">
          <h3>Upcoming Events</h3>
          {events
            .filter(event => new Date(event.date) >= new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5)
            .map(event => (
              <div key={event.id} className="event-item">
                <div className="event-title">{event.title}</div>
                <div className="event-date-time">
                  {format(new Date(event.date), 'MMMM d, yyyy')} at {event.time}
                </div>
                <div className="event-description">{event.description}</div>
              </div>
            ))}
          {events.filter(event => new Date(event.date) >= new Date()).length === 0 && (
            <div style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
              No upcoming events scheduled. Check back soon!
            </div>
          )}
        </div>
      </div>
    </CalendarContainer>
  );
};

export default Calendar;