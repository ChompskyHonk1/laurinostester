"use client";
import React, { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft, faCheckCircle, faArrowRight, faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";

export default function FeedbackPage() {
  const [foodRating, setFoodRating] = useState(0);
  const [atmosphereRating, setAtmosphereRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showGoogleReview, setShowGoogleReview] = useState(false);
  const [showStarburst, setShowStarburst] = useState(false);

  const calculateAverageRating = () => {
    const total = foodRating + atmosphereRating + serviceRating;
    return total / 3;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowStarburst(true);

    const averageRating = calculateAverageRating();
    const feedbackData = {
      name,
      email,
      foodRating,
      atmosphereRating,
      serviceRating,
      averageRating: averageRating.toFixed(1),
      
      totalRating: averageRating.toFixed(1),
      comment,
      timestamp: new Date().toISOString(),
    };

    try {
      // Send email notification
      await sendEmailNotification(feedbackData);
      
      // Hide starburst after animation completes
      setTimeout(() => {
        setShowStarburst(false);
        setShowSuccess(true);
      }, 1500);
      
      // Show Google review option if rating is 4.3 or higher
       if (averageRating >= 4.3) {
         setTimeout(() => {
           // Automatically redirect to Google review with pre-filled rating
           handleGoogleReview();
         }, 2000);
       }

      // Reset form after 5 seconds
      setTimeout(() => {
        resetForm();
      }, 5000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("There was an error submitting your feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendEmailNotification = async (data) => {
    try {
      const response = await fetch('/api/send-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send feedback');
      }

      return result;
    } catch (error) {
      console.error('Error sending email notification:', error);
      throw error;
    }
  };

  const resetForm = () => {
    setFoodRating(0);
    setAtmosphereRating(0);
    setServiceRating(0);
    setComment("");
    setName("");
    setEmail("");
    setShowSuccess(false);
    setShowGoogleReview(false);
  };

  const handleGoogleReview = () => {
    // Create a pre-filled Google review URL with user's star rating only
    // (No comment pre-filling so they can write a fresh public review)
    const averageRating = calculateAverageRating();
    const roundedRating = Math.round(averageRating); // Round to nearest whole star
    
    // Google Maps review URL with pre-filled rating only for Laurino's Tavern
    // Using the full absolute URL to Google's servers
    const placeId = "ChIJY8f8hB9244kRnB5Q2QvJ5QI";
    const googleReviewUrl = `https://search.google.com/local/writereview?placeid=${placeId}&hl=en-US&reviewSource=gsr&rating=${roundedRating}`;
    
    // Alternative URL format using Google Maps
    const alternativeUrl = `https://maps.google.com/?cid=${placeId}&hl=en-US&reviewSource=gsr&rating=${roundedRating}`;
    
    // Fallback - direct Google Maps search for Laurino's Tavern
    const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=Laurino's+Tavern+465+Main+St+Dennis+MA+02638&hl=en-US`;
    
    // Final fallback - Google search for Laurino's Tavern reviews
    const finalFallbackUrl = `https://www.google.com/search?q=Laurino's+Tavern+Cape+Cod+reviews`;
    
    try {
      // Try to open the pre-filled review URL first
      window.open(googleReviewUrl, "_blank");
    } catch (error) {
      console.error('Error opening Google review:', error);
      try {
        // Try the alternative URL format
        window.open(alternativeUrl, "_blank");
      } catch (fallbackError) {
        console.error('Alternative URL also failed:', fallbackError);
        try {
          // Final fallback to Google Maps search
          window.open(fallbackUrl, "_blank");
        } catch (finalError) {
          console.error('All URLs failed, using final fallback:', finalError);
          // Last resort - Google search
          window.open(finalFallbackUrl, "_blank");
        }
      }
    }
    
    // Hide the Google review prompt after redirecting
    setShowGoogleReview(false);
  };

  const StarburstAnimation = () => {
    return (
      <StarburstContainer>
        {[0, 1, 2, 3, 4].map((index) => (
          <StarburstStar key={index} $index={index} $delay={index * 0.1}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
              <path d="M12 2C9.8 2 7.9 3.2 6.8 5C5.7 6.8 5.2 9.1 5.7 11.3C6.2 13.5 7.5 15.4 9.3 16.6C11.1 17.8 13.2 18.3 15.3 17.9C17.4 17.5 19.2 16.2 20.3 14.4C21.4 12.6 21.8 10.4 21.2 8.3C20.6 6.2 19.2 4.4 17.3 3.4C15.7 2.5 13.9 2 12 2Z"/>
              <path d="M12 4C13.5 4 14.9 4.6 16 5.5C17.1 6.4 17.8 7.7 18 9.1C18.2 10.5 17.9 11.9 17.1 13.1C16.3 14.3 15.1 15.2 13.7 15.6C12.3 16 10.8 15.9 9.5 15.3C8.2 14.7 7.2 13.7 6.6 12.4C6 11.1 5.9 9.6 6.3 8.2C6.7 6.8 7.6 5.6 8.8 4.8C9.8 4.2 10.9 3.9 12 4Z"/>
              <path d="M12 6C10.9 6 9.9 6.4 9.2 7.1C8.5 7.8 8.1 8.8 8.1 9.9C8.1 11 8.5 12 9.2 12.7C9.9 13.4 10.9 13.8 12 13.8C13.1 13.8 14.1 13.4 14.8 12.7C15.5 12 15.9 11 15.9 9.9C15.9 8.8 15.5 7.8 14.8 7.1C14.1 6.4 13.1 6 12 6Z"/>
              <path d="M12 8.5C11.4 8.5 10.9 8.8 10.6 9.2C10.3 9.6 10.2 10.1 10.3 10.6C10.4 11.1 10.7 11.5 11.1 11.7C11.5 11.9 12 12 12.4 11.9C12.8 11.8 13.2 11.5 13.4 11.1C13.6 10.7 13.7 10.2 13.6 9.8C13.5 9.4 13.2 9 12.8 8.8C12.6 8.6 12.3 8.5 12 8.5Z"/>
              <path d="M8 16L8 20C8 20.6 8.4 21 9 21L15 21C15.6 21 16 20.6 16 20L16 16C16 15.4 15.6 15 15 15L9 15C8.4 15 8 15.4 8 16Z"/>
              <circle cx="12" cy="9" r="0.8" fill="currentColor" opacity="0.8"/>
            </svg>
          </StarburstStar>
        ))}
      </StarburstContainer>
    );
  };

  const SeashellRating = ({ rating, setRating, label }) => {
    const [hoverRating, setHoverRating] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Handle seashell click with animation
    const handleSeashellClick = (shellValue) => {
      setIsAnimating(true);
      setRating(shellValue);
      setTimeout(() => setIsAnimating(false), 300);
    };

    const renderSeashells = () => {
      const shells = [];
      const maxRating = 5; // 5-star system
      
      for (let i = 1; i <= maxRating; i++) {
        const isFilled = rating >= i;
        
        shells.push(
          <SeashellWrapper key={i}>
            <SeashellButton
              type="button"
              onClick={() => handleSeashellClick(i)}
              onMouseEnter={() => setHoverRating(i)}
              onMouseLeave={() => setHoverRating(0)}
              $filled={isFilled}
              title={`${i} stars`}
            >
              <SeashellIcon $filled={isFilled}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36">
                  <path d="M12 2C9.8 2 7.9 3.2 6.8 5C5.7 6.8 5.2 9.1 5.7 11.3C6.2 13.5 7.5 15.4 9.3 16.6C11.1 17.8 13.2 18.3 15.3 17.9C17.4 17.5 19.2 16.2 20.3 14.4C21.4 12.6 21.8 10.4 21.2 8.3C20.6 6.2 19.2 4.4 17.3 3.4C15.7 2.5 13.9 2 12 2Z"/>
                  <path d="M12 4C13.5 4 14.9 4.6 16 5.5C17.1 6.4 17.8 7.7 18 9.1C18.2 10.5 17.9 11.9 17.1 13.1C16.3 14.3 15.1 15.2 13.7 15.6C12.3 16 10.8 15.9 9.5 15.3C8.2 14.7 7.2 13.7 6.6 12.4C6 11.1 5.9 9.6 6.3 8.2C6.7 6.8 7.6 5.6 8.8 4.8C9.8 4.2 10.9 3.9 12 4Z"/>
                  <path d="M12 6C10.9 6 9.9 6.4 9.2 7.1C8.5 7.8 8.1 8.8 8.1 9.9C8.1 11 8.5 12 9.2 12.7C9.9 13.4 10.9 13.8 12 13.8C13.1 13.8 14.1 13.4 14.8 12.7C15.5 12 15.9 11 15.9 9.9C15.9 8.8 15.5 7.8 14.8 7.1C14.1 6.4 13.1 6 12 6Z"/>
                  <path d="M12 8.5C11.4 8.5 10.9 8.8 10.6 9.2C10.3 9.6 10.2 10.1 10.3 10.6C10.4 11.1 10.7 11.5 11.1 11.7C11.5 11.9 12 12 12.4 11.9C12.8 11.8 13.2 11.5 13.4 11.1C13.6 10.7 13.7 10.2 13.6 9.8C13.5 9.4 13.2 9 12.8 8.8C12.6 8.6 12.3 8.5 12 8.5Z"/>
                  <path d="M8 16L8 20C8 20.6 8.4 21 9 21L15 21C15.6 21 16 20.6 16 20L16 16C16 15.4 15.6 15 15 15L9 15C8.4 15 8 15.4 8 16Z"/>
                  <circle cx="12" cy="9" r="0.8" fill="currentColor" opacity="0.8"/>
                </svg>
              </SeashellIcon>
            </SeashellButton>
          </SeashellWrapper>
        );
      }
      
      return shells;
    };

    return (
      <RatingContainer>
        <RatingLabel>{label}</RatingLabel>
        <SeashellsContainer className={isAnimating ? "animating" : ""}>
          {renderSeashells()}
        </SeashellsContainer>
        <RatingValue>{rating.toFixed(0)}</RatingValue>
      </RatingContainer>
    );
  };

  return (
    <FeedbackSection>
      <FeedbackContainer>
        <ModernHeader>
          <HeaderBackground>
            <WavePattern />
            <HeaderContent>
              <IconWrapper>
                <FontAwesomeIcon icon={faQuoteLeft} size="2x" />
              </IconWrapper>
              <HeaderTitle>Share Your Experience</HeaderTitle>
              <HeaderSubtitle>Your feedback helps us create memorable moments</HeaderSubtitle>
            </HeaderContent>
          </HeaderBackground>
        </ModernHeader>

        <FeedbackForm onSubmit={handleSubmit}>

          <FormSection>
            <SectionTitle>Your Information</SectionTitle>
            <FormRow>
              <FormGroup>
                <InputLabel htmlFor="name">Your Name</InputLabel>
                <InputField
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </FormGroup>
              <FormGroup>
                <InputLabel htmlFor="email">Email Address</InputLabel>
                <InputField
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </FormGroup>
            </FormRow>
          </FormSection>

          <FormSection>
            <SectionTitle>Rate Your Experience</SectionTitle>
            <RatingsGrid>
              <SeashellRating
                label="Food Quality"
                rating={foodRating}
                setRating={setFoodRating}
              />
              <SeashellRating
                label="Atmosphere"
                rating={atmosphereRating}
                setRating={setAtmosphereRating}
              />
              <SeashellRating
                label="Service"
                rating={serviceRating}
                setRating={setServiceRating}
              />
            </RatingsGrid>
          </FormSection>

          <FormSection>
            <SectionTitle>Your Comments</SectionTitle>
            <FormGroup>
              <InputLabel htmlFor="comment">Tell us about your experience</InputLabel>
              <TextAreaField
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about Laurino's Tavern..."
                rows="5"
                required
              />
            </FormGroup>
          </FormSection>

          <RatingSummary>
            <SummaryText>
              Your Overall Rating
            </SummaryText>
            <TotalRatingDisplay>
              <TotalSeashellsContainer>
                {[1, 2, 3, 4, 5].map((i) => {
                  const averageRating = calculateAverageRating();
                  const isFilled = averageRating >= i;
                  
                  return (
                    <TotalSeashellWrapper key={i}>
                      <TotalSeashell
                        $filled={isFilled}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
                          <path d="M12 2C9.8 2 7.9 3.2 6.8 5C5.7 6.8 5.2 9.1 5.7 11.3C6.2 13.5 7.5 15.4 9.3 16.6C11.1 17.8 13.2 18.3 15.3 17.9C17.4 17.5 19.2 16.2 20.3 14.4C21.4 12.6 21.8 10.4 21.2 8.3C20.6 6.2 19.2 4.4 17.3 3.4C15.7 2.5 13.9 2 12 2Z"/>
                          <path d="M12 4C13.5 4 14.9 4.6 16 5.5C17.1 6.4 17.8 7.7 18 9.1C18.2 10.5 17.9 11.9 17.1 13.1C16.3 14.3 15.1 15.2 13.7 15.6C12.3 16 10.8 15.9 9.5 15.3C8.2 14.7 7.2 13.7 6.6 12.4C6 11.1 5.9 9.6 6.3 8.2C6.7 6.8 7.6 5.6 8.8 4.8C9.8 4.2 10.9 3.9 12 4Z"/>
                          <path d="M12 6C10.9 6 9.9 6.4 9.2 7.1C8.5 7.8 8.1 8.8 8.1 9.9C8.1 11 8.5 12 9.2 12.7C9.9 13.4 10.9 13.8 12 13.8C13.1 13.8 14.1 13.4 14.8 12.7C15.5 12 15.9 11 15.9 9.9C15.9 8.8 15.5 7.8 14.8 7.1C14.1 6.4 13.1 6 12 6Z"/>
                          <path d="M12 8.5C11.4 8.5 10.9 8.8 10.6 9.2C10.3 9.6 10.2 10.1 10.3 10.6C10.4 11.1 10.7 11.5 11.1 11.7C11.5 11.9 12 12 12.4 11.9C12.8 11.8 13.2 11.5 13.4 11.1C13.6 10.7 13.7 10.2 13.6 9.8C13.5 9.4 13.2 9 12.8 8.8C12.6 8.6 12.3 8.5 12 8.5Z"/>
                          <path d="M8 16L8 20C8 20.6 8.4 21 9 21L15 21C15.6 21 16 20.6 16 20L16 16C16 15.4 15.6 15 15 15L9 15C8.4 15 8 15.4 8 16Z"/>
                          <circle cx="12" cy="9" r="0.8" fill="currentColor" opacity="0.8"/>
                        </svg>
                      </TotalSeashell>
                    </TotalSeashellWrapper>
                  );
                })}
              </TotalSeashellsContainer>
              <TotalRatingValue>{calculateAverageRating().toFixed(1)}</TotalRatingValue>
            </TotalRatingDisplay>
          </RatingSummary>

          <SubmitButton
            type="submit"
            disabled={isSubmitting || !foodRating || !atmosphereRating || !serviceRating}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
            <FontAwesomeIcon icon={faArrowRight} />
          </SubmitButton>
        </FeedbackForm>

        {showStarburst && <StarburstAnimation />}
        
        {showSuccess && (
          <SuccessMessage>
            <SuccessIcon>
              <FontAwesomeIcon icon={faCheckCircle} size="3x" />
            </SuccessIcon>
            <SuccessTitle>Thank You!</SuccessTitle>
            <SuccessText>We appreciate you taking the time to share your experience with us.</SuccessText>
          </SuccessMessage>
        )}

        {showGoogleReview && (
          <GoogleReviewPrompt>
            <PromptTitle>Love your experience?</PromptTitle>
            <PromptText>Would you consider sharing your review on Google? It helps others discover Laurino's Tavern!</PromptText>
            <GoogleReviewButton onClick={handleGoogleReview}>
              Leave a Google Review
              <FontAwesomeIcon icon={faArrowRight} />
            </GoogleReviewButton>
          </GoogleReviewPrompt>
        )}
      </FeedbackContainer>
    </FeedbackSection>
  );
}

// Styled Components
const FeedbackSection = styled.section`
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primaryDark};
  min-height: 100vh;
  padding: 0;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: radial-gradient(circle at 20% 80%, ${({ theme }) => theme.colors.bluePastel}15 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, ${({ theme }) => theme.colors.lighterBlue}15 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    min-height: 100vh;
    padding-bottom: 2rem; /* Extra padding for mobile */
  }
`;

const FeedbackContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.primaryLight};
  position: relative;
  z-index: 1;
  animation: fadeIn 0.8s ease-in;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const ModernHeader = styled.header`
  position: relative;
  height: 320px;
  overflow: hidden;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    height: 240px; /* Reduced height for mobile */
  }
`;

const HeaderBackground = styled.div`
  position: relative;
  height: 100%;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.tertiaryDark} 0%, ${({ theme }) => theme.colors.bluePastel} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WavePattern = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: ${({ theme }) => theme.colors.primaryLight};
  clip-path: polygon(
    0 40%,
    10% 30%,
    20% 35%,
    30% 25%,
    40% 30%,
    50% 20%,
    60% 25%,
    70% 15%,
    80% 20%,
    90% 10%,
    100% 15%,
    100% 100%,
    0 100%
  );
`;

const HeaderContent = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.primaryLight};
  z-index: 2;
  padding: 2rem;
`;

const IconWrapper = styled.div`
  margin-bottom: 1.5rem;
  opacity: 0.9;
  animation: float 3s ease-in-out infinite;
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
`;

const HeaderTitle = styled.h1`
  font-family: 'Aloja', sans-serif;
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  letter-spacing: -0.5px;
  line-height: 1.1;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 2.5rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.8rem;
    padding: 0 1rem;
  }
`;

const HeaderSubtitle = styled.p`
  font-size: 1.3rem;
  opacity: 0.95;
  max-width: 600px;
  margin: 0 auto;
  font-weight: 300;
  line-height: 1.4;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1rem;
    padding: 0 1rem;
    max-width: 90%;
  }
`;

const FeedbackForm = styled.form`
  padding: 4rem 3rem;
  background: ${({ theme }) => theme.colors.primaryLight};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 3rem 2rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1.5rem 1rem;
  }
`;

const FormSection = styled.div`
  margin-bottom: 3rem;
  
  &:last-of-type {
    margin-bottom: 2rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin-bottom: 2rem;
    
    &:last-of-type {
      margin-bottom: 1.5rem;
    }
  }
`;

const SectionTitle = styled.h3`
  font-family: 'Aloja', sans-serif;
  font-size: 1.8rem;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.primaryDark};
  position: relative;
  padding-bottom: 0.5rem;
  line-height: 1.2;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 3px;
    background: ${({ theme }) => theme.colors.tertiaryDark};
    border-radius: 2px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;



const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FormGroup = styled.div`
  position: relative;
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primaryDark};
  font-family: 'Aloja', sans-serif;
  font-size: 1.1rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
`;

const InputField = styled.input`
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid ${({ theme }) => theme.colors.lighterBlue};
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primaryDark};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.tertiaryDark};
    box-shadow: 0 0 0 4px rgba(58, 86, 102, 0.1);
    transform: translateY(-2px);
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.secondaryDark};
    opacity: 0.6;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0.875rem 1rem;
    font-size: 16px; /* Prevents zoom on iOS */
    border-radius: 10px;
  }
`;

const TextAreaField = styled.textarea`
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid ${({ theme }) => theme.colors.lighterBlue};
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primaryDark};
  resize: vertical;
  min-height: 140px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.tertiaryDark};
    box-shadow: 0 0 0 4px rgba(58, 86, 102, 0.1);
    transform: translateY(-2px);
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.secondaryDark};
    opacity: 0.6;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0.875rem 1rem;
    font-size: 16px; /* Prevents zoom on iOS */
    border-radius: 10px;
    min-height: 120px;
  }
`;

const RatingsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 16px;
  border: 2px solid ${({ theme }) => theme.colors.lighterBlue};
  transition: all 0.3s ease;
  position: relative;
  overflow: visible; /* Changed from hidden to visible */
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.tertiaryDark}, ${({ theme }) => theme.colors.bluePastel});
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    border-color: ${({ theme }) => theme.colors.tertiaryDark};
    
    &::before {
      transform: scaleX(1);
    }
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: center; /* Changed from flex-start to center */
    gap: 1rem;
    padding: 1.25rem;
    min-width: 100%; /* Ensure full width */
    
    &:hover {
      transform: translateY(-2px); /* Less dramatic on mobile */
    }
  }
`;

const RatingLabel = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primaryDark};
  font-family: 'Aloja', sans-serif;
  font-size: 1.2rem;
  min-width: 140px;
  text-align: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.1rem;
    min-width: auto;
    width: 100%;
    text-align: center;
  }
`;

const SeashellsContainer = styled.div`
  display: flex;
  gap: 0.25rem;
  
  &.animating {
    animation: bounce 0.4s ease;
  }
  
  @keyframes bounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: 0.1rem;
    justify-content: center;
    width: 100%;
    flex-wrap: nowrap; /* Ensure all stars stay on one line */
    overflow: visible; /* Make sure all stars are visible */
  }
`;

const SeashellWrapper = styled.div`
  position: relative;
  display: flex;
`;

const SeashellButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
  
  &:hover {
    transform: scale(1.15) rotate(5deg);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0.3rem;
    flex-shrink: 0; /* Prevent shrinking on mobile */
    
    &:hover {
      transform: scale(1.1); /* Less dramatic on mobile for better UX */
    }
  }
`;



const SeashellIcon = styled.div`
  color: ${({ $filled, theme }) => $filled ? theme.colors.tertiaryDark : theme.colors.lighterBlue};
  opacity: ${({ $filled }) => $filled ? 1 : 0.4};
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
  
  ${SeashellButton}:hover & {
    color: ${({ theme }) => theme.colors.tertiaryDark};
    opacity: 1;
    transform: scale(1.1);
  }
`;

const RatingValue = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.tertiaryDark};
  font-size: 1.3rem;
  min-width: 50px;
  text-align: center;
  background: ${({ theme }) => theme.colors.bluePastel}20;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.1rem;
    padding: 0.4rem 0.8rem;
    align-self: center;
  }
`;

const RatingSummary = styled.div`
  margin: 2rem 0 3rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.bluePastel}20, ${({ theme }) => theme.colors.lighterBlue}20);
  border-radius: 16px;
  border: 2px solid ${({ theme }) => theme.colors.lighterBlue};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin: 1.5rem 0 2rem;
    padding: 1.25rem;
  }
`;

const SummaryText = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primaryDark};
  font-size: 1.1rem;
  margin-bottom: 1rem;
  text-align: center;
`;





const SubmitButton = styled.button`
  width: 100%;
  padding: 1.25rem 2rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.tertiaryDark}, ${({ theme }) => theme.colors.bluePastel});
  color: ${({ theme }) => theme.colors.primaryLight};
  border: none;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Aloja', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(58, 86, 102, 0.3);
    
    &::before {
      left: 100%;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1rem 1.5rem;
    font-size: 1.1rem;
    border-radius: 10px;
    min-height: 50px; /* Better touch target */
    
    &:hover:not(:disabled) {
      transform: translateY(-2px); /* Less dramatic on mobile */
    }
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 3rem;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  margin: 2rem;
  border-radius: 16px;
  animation: slideInUp 0.5s ease, pulse 2s infinite;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: rotate 10s linear infinite;
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); }
    70% { box-shadow: 0 0 0 20px rgba(76, 175, 80, 0); }
    100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 2rem 1.5rem;
    margin: 1rem;
    border-radius: 12px;
  }
`;

const SuccessIcon = styled.div`
  margin-bottom: 1.5rem;
  animation: bounceIn 0.6s ease;
  
  @keyframes bounceIn {
    0% { transform: scale(0); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
`;

const SuccessTitle = styled.h3`
  font-family: 'Aloja', sans-serif;
  font-size: 2rem;
  margin: 1rem 0;
  position: relative;
  z-index: 1;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.6rem;
  }
`;

const SuccessText = styled.p`
  font-size: 1.1rem;
  opacity: 0.95;
  position: relative;
  z-index: 1;
  line-height: 1.4;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1rem;
  }
`;

const GoogleReviewPrompt = styled.div`
  text-align: center;
  padding: 3rem;
  background: linear-gradient(135deg, #4285F4, #34A853);
  color: white;
  margin: 2rem;
  border-radius: 16px;
  animation: slideInUp 0.5s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    animation: movePattern 20s linear infinite;
  }
  
  @keyframes movePattern {
    from { transform: translateX(0); }
    to { transform: translateX(60px); }
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 2rem 1.5rem;
    margin: 1rem;
    border-radius: 12px;
  }
`;

const PromptTitle = styled.h3`
  font-family: 'Aloja', sans-serif;
  font-size: 2rem;
  margin: 1rem 0;
  position: relative;
  z-index: 1;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.6rem;
  }
`;

const PromptText = styled.p`
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.95;
  position: relative;
  z-index: 1;
  line-height: 1.4;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const GoogleReviewButton = styled.button`
  background: white;
  color: #4285F4;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Aloja', sans-serif;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  z-index: 1;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(-1px);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
    border-radius: 10px;
    min-height: 44px; /* Better touch target */
    
    &:hover {
      transform: translateY(-2px); /* Less dramatic on mobile */
    }
  }
`;

// New styled components for total rating display
const TotalRatingDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const TotalSeashellsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
`;

const TotalSeashellWrapper = styled.div`
  position: relative;
  display: flex;
`;

const TotalSeashell = styled.div`
  color: ${({ $filled, theme }) => $filled ? theme.colors.tertiaryDark : theme.colors.lighterBlue};
  opacity: ${({ $filled }) => $filled ? 1 : 0.4};
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
`;



const TotalRatingValue = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.tertiaryDark};
  font-size: 1.5rem;
  text-align: center;
  background: ${({ theme }) => theme.colors.bluePastel}20;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  min-width: 80px;
`;

// Starburst Animation Styled Components
const StarburstContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  pointer-events: none;
  z-index: 9999;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 280px;
    height: 280px;
  }
  
  @media (max-width: 480px) {
    width: 260px;
    height: 260px;
  }
`;

const StarburstStar = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${({ theme }) => theme.colors.tertiaryDark};
  animation: starburst-burst 1.5s ease-out forwards;
  animation-delay: ${({ $delay }) => $delay}s;
  opacity: 0;
  
  /* Calculate different angles for each star to create burst effect */
  ${({ $index }) => {
    const angle = ($index * 72); // 360 / 5 stars = 72 degrees apart
    const distance = 120; // Distance from center
    const x = Math.cos(angle * Math.PI / 180) * distance;
    const y = Math.sin(angle * Math.PI / 180) * distance;
    
    return `
      --end-x: ${x}px;
      --end-y: ${y}px;
    `;
  }}
  
  @keyframes starburst-burst {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0) rotate(0deg);
    }
    20% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1.2) rotate(90deg);
    }
    40% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(0.9) rotate(180deg);
    }
    60% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1.1) rotate(270deg);
    }
    100% {
      opacity: 0;
      transform: translate(calc(-50% + var(--end-x)), calc(-50% + var(--end-y))) scale(0.3) rotate(360deg);
    }
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    ${({ $index }) => {
      const angle = ($index * 72);
      const distance = 85; // Slightly smaller distance for mobile
      const x = Math.cos(angle * Math.PI / 180) * distance;
      const y = Math.sin(angle * Math.PI / 180) * distance;
      
      return `
        --end-x: ${x}px;
        --end-y: ${y}px;
      `;
    }}
    
    svg {
      width: 36px;
      height: 36px;
    }
  }
  
  @media (max-width: 380px) {
    ${({ $index }) => {
      const angle = ($index * 72);
      const distance = 75; // Even smaller distance for very small screens
      const x = Math.cos(angle * Math.PI / 180) * distance;
      const y = Math.sin(angle * Math.PI / 180) * distance;
      
      return `
        --end-x: ${x}px;
        --end-y: ${y}px;
      `;
    }}
    
    svg {
      width: 32px;
      height: 32px;
    }
  }
`;