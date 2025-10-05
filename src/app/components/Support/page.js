"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import emailjs from "emailjs-com";

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [formError, setFormError] = useState("");
  const [openFAQ, setOpenFAQ] = useState(null);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init("aeG2vJZ7bnOk3l7oF"); // Replace with your actual EmailJS user ID
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");
    
    // Prepare template parameters for EmailJS
    const templateParams = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message
    };

    emailjs
      .send(
        "service_x69mezl", // Replace with your EmailJS service ID
        "template_x8u2b24", // Replace with your EmailJS template ID for support inquiries
        templateParams
      )
      .then(
        (result) => {
          console.log("Email successfully sent!", result.text);
          setShowNotification(true);
          setIsSubmitting(false);
          setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: ""
          });
          
          // Hide notification after 5 seconds
          setTimeout(() => {
            setShowNotification(false);
          }, 5000);
        },
        (error) => {
          console.error("Failed to send email:", error.text);
          setFormError("There was a problem submitting your inquiry. Please try again or call us directly.");
          setIsSubmitting(false);
        }
      );
  };

  // Toggle FAQ accordion
  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <SupportSection>
      <PageHeader>
        <h1>Customer Support</h1>
        <p>Have a question or need assistance? We're here to help.</p>
      </PageHeader>

      <SupportContentSection>
        <SupportInfo>
          <h2>How Can We Help?</h2>
          <p>
            Our team is standing by to assist you with any questions or concerns you might have. Whether you're inquiring about our menu, making a reservation, or providing feedback, we value your communication.
          </p>
          
          <InfoList>
            <InfoItem>
              <span className="icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <title>Clock</title>
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12.5 12.5H7.5V11H11.5V5.5H13V12.5H12.5Z" fill="currentColor" />
                </svg>
              </span>
              <span>
                <strong>Response Time:</strong> We aim to respond to all inquiries within 24 hours.
              </span>
            </InfoItem>
            
            <InfoItem>
              <span className="icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <title>Phone</title>
                  <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="currentColor" />
                </svg>
              </span>
              <span>
                <strong>Phone Support:</strong> For immediate assistance, call us at (508) 896-6134 during business hours.
              </span>
            </InfoItem>
            
            <InfoItem>
              <span className="icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <title>Location</title>
                  <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor" />
                </svg>
              </span>
              <span>
                <strong>Visit Us:</strong> 3668 Main Street, Brewster, MA 02631
              </span>
            </InfoItem>
          </InfoList>
        </SupportInfo>

        <FormContainer>
          <h2>Send Us a Message</h2>
          {formError && <ErrorNotification>{formError}</ErrorNotification>}
          
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">Name</Label>
              <Input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name" 
                required 
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email" 
                required 
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input 
                type="tel" 
                id="phone" 
                name="phone" 
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your Phone Number" 
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="subject">Subject</Label>
              <Select 
                id="subject" 
                name="subject" 
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">Select a subject</option>
                <option value="Menu Question">Menu Question</option>
                <option value="Reservation Help">Reservation Help</option>
                <option value="Feedback">Feedback</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Other">Other</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message" 
                name="message" 
                value={formData.message}
                onChange={handleChange}
                rows="5" 
                placeholder="How can we help you?" 
                required 
              />
            </FormGroup>
            
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </SubmitButton>
          </Form>
          
          {showNotification && (
            <SuccessNotification>
              Thank you for your message! We'll be in touch with you shortly.
            </SuccessNotification>
          )}
        </FormContainer>
      </SupportContentSection>

      <FAQSection>
        <h2>Frequently Asked Questions</h2>
        
        <FAQContainer>
          <FAQItem>
            <FAQQuestion onClick={() => toggleFAQ(0)}>
              <h3>Do you take reservations?</h3>
              <span className="icon">{openFAQ === 0 ? '−' : '+'}</span>
            </FAQQuestion>
            <FAQAnswer style={{ display: openFAQ === 0 ? 'block' : 'none' }}>
              Yes, we accept reservations for parties of 10 or more. We recommend making reservations in advance, especially for weekend dining. You can make a reservation by calling us directly at (508) 896-6134.
            </FAQAnswer>
          </FAQItem>
          
          <FAQItem>
            <FAQQuestion onClick={() => toggleFAQ(1)}>
              <h3>Are you able to accommodate dietary restrictions?</h3>
              <span className="icon">{openFAQ === 1 ? '−' : '+'}</span>
            </FAQQuestion>
            <FAQAnswer style={{ display: openFAQ === 1 ? 'block' : 'none' }}>
              Absolutely! We offer various options for guests with dietary restrictions, including gluten-free, vegetarian, and vegan choices. Please inform your server about any allergies or dietary needs when ordering.
            </FAQAnswer>
          </FAQItem>
          
          <FAQItem>
            <FAQQuestion onClick={() => toggleFAQ(2)}>
              <h3>What are your hours of operation?</h3>
              <span className="icon">{openFAQ === 2 ? '−' : '+'}</span>
            </FAQQuestion>
            <FAQAnswer style={{ display: openFAQ === 2 ? 'block' : 'none' }}>
              We are open seven days a week from 11:00 AM to 10:00 PM.
            </FAQAnswer>
          </FAQItem>
          
          <FAQItem>
            <FAQQuestion onClick={() => toggleFAQ(3)}>
              <h3>Do you have a children's menu?</h3>
              <span className="icon">{openFAQ === 3 ? '−' : '+'}</span>
            </FAQQuestion>
            <FAQAnswer style={{ display: openFAQ === 3 ? 'block' : 'none' }}>
              Yes, we offer a special menu for our younger guests with kid-friendly options at affordable prices.
            </FAQAnswer>
          </FAQItem>
        </FAQContainer>
      </FAQSection>
    </SupportSection>
  );
}

// Styled components for the support page
const SupportSection = styled.section`
  background: ${({ theme }) => theme.colors.light};
  color: ${({ theme }) => theme.colors.primaryDark};
  min-height: 100vh;
  width: 100%;
`;

const PageHeader = styled.div`
  text-align: center;
  padding: 4rem 2rem 2rem;
  background: ${({ theme }) => theme.colors.tertiaryDark};
  color: ${({ theme }) => theme.colors.primaryLight};

  h1 {
    font-family: 'Aloja', sans-serif;
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const SupportContentSection = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  padding: 3rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SupportInfo = styled.div`
  flex: 1;
  
  h2 {
    font-family: 'Aloja', sans-serif;
    font-size: 1.8rem;
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.tertiaryDark};
  }
  
  p {
    color: ${({ theme }) => theme.colors.tertiaryDark};
    line-height: 1.6;
    margin-bottom: 2rem;
  }
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0;
`;

const InfoItem = styled.li`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: ${({ theme }) => theme.colors.tertiaryDark};
    color: ${({ theme }) => theme.colors.primaryLight};
    border-radius: 50%;
    margin-right: 1rem;
    flex-shrink: 0;
  }
  
  span {
    color: ${({ theme }) => theme.colors.tertiaryDark};
    line-height: 1.5;
    
    strong {
      font-weight: 600;
    }
  }
`;

const FormContainer = styled.div`
  flex: 1;
  background: ${({ theme }) => theme.colors.light};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.tertiaryDark};
  
  h2 {
    font-family: 'Aloja', sans-serif;
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    color: ${({ theme }) => theme.colors.tertiaryDark};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.tertiaryDark};
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.tertiaryDark};
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primaryDark};
    box-shadow: 0 0 0 2px rgba(58, 86, 102, 0.2);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.tertiaryDark};
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primaryDark};
    box-shadow: 0 0 0 2px rgba(58, 86, 102, 0.2);
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.tertiaryDark};
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primaryDark};
    box-shadow: 0 0 0 2px rgba(58, 86, 102, 0.2);
  }
`;

const SubmitButton = styled.button`
  align-self: center;
  background: ${({ theme }) => theme.colors.tertiaryDark};
  color: ${({ theme }) => theme.colors.primaryLight};
  padding: 0.75rem 2rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  margin-top: 1rem;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-2px);
  }
  
  &:disabled {
    background: #aaa;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorNotification = styled.div`
  background: #ffedee;
  color: #d32f2f;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  text-align: center;
  border-left: 4px solid #d32f2f;
`;

const SuccessNotification = styled.div`
  background: #edf7ed;
  color: #2e7d32;
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1.5rem;
  text-align: center;
  border-left: 4px solid #2e7d32;
`;

const FAQSection = styled.section`
  background: ${({ theme }) => theme.colors.accent};
  padding: 3rem 2rem;
  margin: 0;
  
  h2 {
    font-family: 'Aloja', sans-serif;
    font-size: 2rem;
    text-align: center;
    margin-bottom: 2.5rem;
    color: ${({ theme }) => theme.colors.tertiaryDark};
  }
`;

const FAQContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const FAQItem = styled.div`
  background: ${({ theme }) => theme.colors.light};
  border-radius: 8px;
  margin-bottom: 1rem;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const FAQQuestion = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  cursor: pointer;
  transition: background 0.3s ease;
  
  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
    color: ${({ theme }) => theme.colors.tertiaryDark};
  }
  
  .icon {
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.tertiaryDark};
    transition: transform 0.3s ease;
  }
  
  &:hover {
    background: rgba(58, 86, 102, 0.05);
  }
`;

const FAQAnswer = styled.div`
  padding: 0 1.25rem 1.25rem;
  color: ${({ theme }) => theme.colors.tertiaryDark};
  line-height: 1.6;
`;