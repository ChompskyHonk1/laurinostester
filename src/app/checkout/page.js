"use client";
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Elements, 
  LinkAuthenticationElement,
  AddressElement,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import Link from 'next/link';
import styled from 'styled-components';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Checkout container and styled components
 const CheckoutContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 4rem 2rem;
  min-height: 80vh;
  background: ${({ theme }) => theme.colors.light};
  color: ${({ theme }) => theme.colors.primaryDark};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 2rem 1rem;
  }
`;

 const CheckoutHeading = styled.h1`
  font-family: 'Aloja', serif;
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primaryDark};
  margin-bottom: 2rem;
  text-align: center;
`;

const FormSection = styled.div`
  background: ${({ theme }) => theme.colors.light};
  border: 2px solid ${({ theme }) => theme.colors.tertiaryDark};
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  
  h2 {
    font-family: 'Aloja', serif;
    font-size: 1.8rem;
    color: ${({ theme }) => theme.colors.primaryDark};
    margin-bottom: 1.5rem;
  }
  
  .element-container {
    margin-bottom: 1.5rem;
  }
`;
 const OrderSummary = styled.div`
  background: ${({ theme }) => theme.colors.accent};
  border: 2px solid ${({ theme }) => theme.colors.tertiaryDark};
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  
  h2 {
    font-family: 'Aloja', serif;
    font-size: 1.8rem;
    color: ${({ theme }) => theme.colors.primaryDark};
    margin-bottom: 1.5rem;
  }
  
  .order-items {
    margin-bottom: 1.5rem;
  }
  
  .order-item {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    
    &:last-child {
      border-bottom: none;
    }
    
    .item-details {
      display: flex;
      flex-direction: column;
      
      .item-name {
        font-weight: 600;
        color: ${({ theme }) => theme.colors.primaryDark};
      }
      
      .item-meta {
        font-size: 0.9rem;
        color: ${({ theme }) => theme.colors.primaryDark};
        opacity: 0.8;
      }
    }
    
    .item-price {
      font-weight: 600;
      color: ${({ theme }) => theme.colors.primaryDark};
    }
  }
  
  .subtotal {
    display: flex;
    justify-content: space-between;
    padding-top: 1rem;
    margin-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primaryDark};
  }
  
  .shipping-cost {
    display: flex;
    justify-content: space-between;
    padding-top: 0.5rem;
    color: ${({ theme }) => theme.colors.primaryDark};
  }
  
  .order-total {
    display: flex;
    justify-content: space-between;
    padding-top: 0.5rem;
    margin-top: 0.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    font-weight: 700;
    font-size: 1.2rem;
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;
const CheckoutButton = styled.button`
  background: ${({ theme }) => theme.colors.primaryDark};
  color: ${({ theme }) => theme.colors.primaryLight};
  border: none;
  border-radius: 4px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
  width: 100%;
  
  &:hover {
    background: ${({ theme }) => theme.colors.lighterBlue};
  }
  
  &:disabled {
    background: ${({ theme }) => theme.colors.tertiaryDark};
    cursor: not-allowed;
  }
`;

 const ErrorMessage = styled.div`
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid red;
  color: red;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
`;
 const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  color: ${({ theme }) => theme.colors.primaryLight};
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: ${({ theme }) => theme.colors.primaryLight};
    animation: spin 1s ease-in-out infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

 const ShippingOptions = styled.div`
  margin-top: 1.5rem;
`;

 const ShippingOption = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  padding: 0.75rem;
  border: 1px solid ${({ selected, theme }) => 
    selected ? theme.colors.primaryDark : theme.colors.tertiaryDark};
  border-radius: 4px;
  background: ${({ selected, theme }) => 
    selected ? 'rgba(35, 66, 98, 0.1)' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(35, 66, 98, 0.05);
  }
  
  input {
    margin-right: 1rem;
  }
  
  .option-details {
    flex: 1;
    
    .option-name {
      font-weight: ${({ selected }) => selected ? '600' : '400'};
      color: ${({ theme }) => theme.colors.primaryDark};
    }
  }
  
  .option-price {
    font-weight: 600;
  }
`;
 const ColorSwatch = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-left: 5px;
  border: ${props => props.color === '#FFFFFF' ? '1px solid #DDD' : 'none'};
  vertical-align: middle;
`;

 const BackLink = styled.a`
  display: inline-block;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.primaryDark};
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

// Main checkout page component
export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [pageMessage, setPageMessage] = useState(null);
  const { items, totalAmount } = useCart();
  
  useEffect(() => {
    // Check for all possible flags that could indicate we're in the checkout flow
    const isCheckingOut = sessionStorage.getItem('isCheckingOut');
    const completingCheckout = sessionStorage.getItem('completingCheckout');
    const pendingOrderId = localStorage.getItem('pendingOrderId');
    
    console.log("Checkout page loaded with flags:", {
      isCheckingOut,
      completingCheckout,
      pendingOrderId,
      itemsCount: items.length
    });
    
    // Only redirect to store if:
    // 1. Cart is empty AND
    // 2. We're not in checkout process AND
    // 3. We're not completing checkout (heading to confirmation)
    if (items.length === 0 && !isCheckingOut && !completingCheckout && !pendingOrderId) {
      console.log("No items and not in checkout flow, redirecting to store");
      window.location.href = "/components/laurinosstore/Store";
      return;
    }
    
    // Set flag to indicate we're in checkout process
    sessionStorage.setItem('isCheckingOut', 'true');
    
    // Create PaymentIntent only if we have items and a valid total amount
    if (items.length > 0 && totalAmount > 0) {
      console.log("Creating payment intent for amount:", totalAmount);
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          items,
          amount: totalAmount,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Server responded with status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log("Payment intent created:", data.paymentIntentId);
          setClientSecret(data.clientSecret);
          setPaymentIntentId(data.paymentIntentId);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Error creating payment intent:", err);
          setPageMessage("There was an error initializing checkout. Please try again later.");
          setIsLoading(false);
        });
    } else if (completingCheckout || pendingOrderId) {
      // If we're completing a checkout but have an empty cart, show appropriate message
      setPageMessage("Finalizing your order. Please wait...");
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  
    // Cleanup function
    return () => {
      // Only remove checkout flag if not in confirmation path and not completing checkout
      if (!window.location.pathname.includes('order-confirmation') && 
          !sessionStorage.getItem('completingCheckout')) {
        sessionStorage.removeItem('isCheckingOut');
      }
    };
  }, [items, totalAmount]);

  // Appearance settings for Stripe Elements
  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#234262', // primaryDark
      colorBackground: '#ffffff', // light
      colorText: '#234262', // primaryDark
      colorDanger: '#ef4444', // red
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      borderRadius: '4px',
    },
    rules: {
      '.Input': {
        borderColor: '#9fbad0', // tertiaryDark
      },
      '.Input:focus': {
        borderColor: '#234262', // primaryDark
      },
      '.Label': {
        color: '#234262', // primaryDark
      }
    }
  };

  const options = {
    clientSecret,
    appearance,
    loader: 'auto',
  };

  if (isLoading) {
    return (
      <div>
        <LoadingOverlay>
          <div className="spinner" />
        </LoadingOverlay>
        <CheckoutContainer>
          <CheckoutHeading>Preparing Your Checkout...</CheckoutHeading>
        </CheckoutContainer>
      </div>
    );
  }
  
  // If we have a custom message to display (e.g., from an error)
  if (pageMessage) {
    return (
      <CheckoutContainer>
        <CheckoutHeading>Checkout</CheckoutHeading>
        
        <Link href="/components/laurinosstore/Store" passHref legacyBehavior>
          <BackLink>← Back to Store</BackLink>
        </Link>
        
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>{pageMessage}</p>
        </div>
      </CheckoutContainer>
    );
  }

  return (
    <div>
      <CheckoutContainer>
        <CheckoutHeading>Checkout</CheckoutHeading>
        
        <Link href="/components/laurinosstore/Store" passHref legacyBehavior>
          <BackLink>← Back to Store</BackLink>
        </Link>
        
        {clientSecret ? (
          <Elements stripe={stripePromise} options={options}>
             <CheckoutForm paymentIntentId={paymentIntentId} />
          </Elements>
        ) : (
          <ErrorMessage>
            There was a problem starting the checkout process. Please try again.
          </ErrorMessage>
        )}
      </CheckoutContainer>
    </div>
  );
}

// Checkout form component
function CheckoutForm({ paymentIntentId: initialPaymentIntentId }) {
  const stripe = useStripe();
  const elements = useElements();
  const { items, totalAmount, setShippingOption, clearCart } = useCart();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState(null);
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [calculatingShipping, setCalculatingShipping] = useState(false);
  const [totalWithShipping, setTotalWithShipping] = useState(totalAmount);
  const [paymentIntentId, setPaymentIntentId] = useState(initialPaymentIntentId);
  const [renderKey, setRenderKey] = useState(0); // For forcing re-render

  // Debug logs for state changes
  useEffect(() => {
    console.log("Selected shipping updated:", selectedShipping);
  }, [selectedShipping]);

  useEffect(() => {
    console.log("Total with shipping updated:", totalWithShipping);
  }, [totalWithShipping]);

  // Extract payment intent ID from client secret
  useEffect(() => {
    if (!paymentIntentId && elements) {
      try {
        const paymentElement = elements.getElement(PaymentElement);
        console.log("Payment element exists:", !!paymentElement);
        
        const clientSecret = paymentElement?.options?.clientSecret;
        console.log("Client secret exists:", !!clientSecret);
        
        if (clientSecret) {
          const intentId = clientSecret.split('_secret_')[0];
          console.log("Extracted payment intent ID:", intentId);
          setPaymentIntentId(intentId);
        } else {
          console.error("Client secret is not available");
        }
      } catch (error) {
        console.error("Error extracting payment intent ID:", error);
      }
    }
  }, [elements, paymentIntentId]);
  
  // Handle address change to calculate shipping
  const handleAddressChange = async (event) => {
    console.log("Address change event:", event);
    
    // Only calculate shipping when we have a complete address
    if (event.complete) {
      const newAddress = event.value;
      console.log("Complete address:", newAddress);
      setShippingAddress(newAddress);
      
      // Calculate shipping options
      try {
        setCalculatingShipping(true);
        
        console.log("Sending to API:", {
          address: newAddress,
          items: items
        });
        
        const response = await fetch('/api/calculate-shipping', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address: newAddress,
            items: items
          })
        });
        
        const data = await response.json();
        console.log("Shipping API response:", data);
        
        if (data.shippingOptions && data.shippingOptions.length > 0) {
          console.log("Setting shipping options:", data.shippingOptions);
          setShippingOptions(data.shippingOptions);
          
          // Auto-select first option
          const firstOption = data.shippingOptions[0];
          console.log("Auto-selecting option:", firstOption);
          setSelectedShipping(firstOption);
          
          const newTotal = totalAmount + firstOption.price;
          console.log(`Updating total: ${totalAmount} + ${firstOption.price} = ${newTotal}`);
          setTotalWithShipping(newTotal);
          
          // Force re-render to ensure UI updates
          setRenderKey(prev => prev + 1);
        } else {
          console.log("No shipping options received or empty array");
        }
      } catch (error) {
        console.error('Error calculating shipping:', error);
        setErrorMessage('Unable to calculate shipping. Please try again.');
      } finally {
        setCalculatingShipping(false);
      }
    } else {
      console.log("Address is not complete yet");
    }
  };
  
  // Handle shipping option selection
  const handleShippingChange = (option) => {
    console.log("Shipping option selected:", option);
    setSelectedShipping(option);
    const newTotal = totalAmount + option.price;
    console.log(`Updating total on selection: ${totalAmount} + ${option.price} = ${newTotal}`);
    setTotalWithShipping(newTotal);
    setShippingOption(option); // Store in global cart context
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!stripe || !elements || !selectedShipping) {
      setErrorMessage('Please select a shipping method before proceeding.');
      return;
    }
    
    if (!paymentIntentId) {
      console.error("Payment intent ID not available");
      setErrorMessage('Payment session is not initialized properly. Please refresh the page.');
      return;
    }
    
    console.log("Starting payment process with intent ID:", paymentIntentId);
    setIsProcessing(true);
  
    try {
      // STEP 1: Update the payment intent with shipping information
      console.log("Updating payment intent with shipping information");
      const updateResponse = await fetch('/api/update-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId,
          shippingOption: selectedShipping,
          totalAmount: totalWithShipping,
          items: items,
          email: email
        })
      });
      
      const updateData = await updateResponse.json();
      
      if (!updateData.success) {
        throw new Error(updateData.error || 'Error updating payment information');
      }
      
      // STEP 2: Set all flags BEFORE payment confirmation
      // These need time to be fully committed to storage
      console.log("Setting checkout flags");
      sessionStorage.setItem('completingCheckout', 'true');
      sessionStorage.setItem('isCheckingOut', 'true');
      localStorage.setItem('pendingOrderId', paymentIntentId);
      if (email) {
        localStorage.setItem('customerEmail', email);
      }
      
      // STEP 3: Build confirmation URL with proper format
      const confirmationUrl = `${window.location.origin}/order-confirmation?payment_intent=${paymentIntentId}`;
      console.log("Redirect URL:", confirmationUrl);
      
      // Add a small delay to ensure storage writes complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // STEP 4: Verify flags were set properly
      console.log("Storage values before payment confirmation:", {
        sessionIsCheckingOut: sessionStorage.getItem('isCheckingOut'),
        sessionCompletingCheckout: sessionStorage.getItem('completingCheckout'),
        localPendingOrderId: localStorage.getItem('pendingOrderId')
      });
      
      // STEP 5: Confirm payment
      console.log("Confirming payment with Stripe");
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: confirmationUrl,
          receipt_email: email,
          shipping: {
            name: shippingAddress.name,
            address: {
              line1: shippingAddress.address.line1,
              line2: shippingAddress.address.line2 || '',
              city: shippingAddress.address.city,
              state: shippingAddress.address.state,
              postal_code: shippingAddress.address.postal_code,
              country: shippingAddress.address.country,
            }
          }
        },
        redirect: 'if_required',
      });
  
      if (error) {
        // Clear flags on payment error
        sessionStorage.removeItem('completingCheckout');
        localStorage.removeItem('pendingOrderId');
        throw error;
      }
      
      // STEP 6: If payment succeeded without redirect, handle it here
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log("Payment succeeded without redirect, performing manual navigation");
        
        // Ensure flags are still set correctly
        if (!sessionStorage.getItem('completingCheckout') || !localStorage.getItem('pendingOrderId')) {
          console.log("Flags were lost, resetting them");
          sessionStorage.setItem('completingCheckout', 'true');
          sessionStorage.setItem('isCheckingOut', 'true');
          localStorage.setItem('pendingOrderId', paymentIntentId);
        }
        
        // Add a small delay to ensure storage commits before redirect
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Use window.location.replace for a cleaner navigation
        window.location.replace(confirmationUrl);
        return;
      }
      
      console.log("Payment requires additional actions or redirect happened automatically");
    } catch (error) {
      console.error("Checkout error:", error);
      setErrorMessage(error.message || 'An error occurred during checkout');
      setIsProcessing(false);
    }
  };
  
  const handleEmailChange = (event) => {
    if (event.value.email) {
      setEmail(event.value.email);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormSection>
        <h2>Contact Information</h2>
        <div className="element-container">
          <LinkAuthenticationElement 
            onChange={handleEmailChange}
          />
        </div>
      </FormSection>
      
      <FormSection>
        <h2>Shipping Address</h2>
        <div className="element-container">
          <AddressElement 
            options={{
              mode: 'shipping',
              allowedCountries: ['US', 'CA'],
            }} 
            onChange={handleAddressChange}
          />
        </div>
        
        {calculatingShipping && (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            Calculating shipping options...
          </div>
        )}
        
        {shippingOptions.length > 0 ? (
          <ShippingOptions key={renderKey}>
            <h3>Shipping Method</h3>
            {shippingOptions.map((option) => (
              <ShippingOption 
                key={option.id}
                selected={selectedShipping && selectedShipping.id === option.id}
                onClick={() => handleShippingChange(option)}
              >
                <input 
                  type="radio" 
                  name="shipping" 
                  checked={selectedShipping && selectedShipping.id === option.id}
                  onChange={() => {}} // React requires onChange handler
                />
                <div className="option-details">
                  <div className="option-name">{option.name}</div>
                </div>
                <div className="option-price">${option.price.toFixed(2)}</div>
              </ShippingOption>
            ))}
          </ShippingOptions>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem', display: calculatingShipping ? 'none' : 'block' }}>
            {shippingAddress ? 'No shipping options available for this address.' : 'Enter your address to see shipping options.'}
          </div>
        )}
      </FormSection>
      
      <FormSection>
        <h2>Payment Method</h2>
        <div className="element-container">
          <PaymentElement />
        </div>
      </FormSection>
      
      <OrderSummary>
        <h2>Order Summary</h2>
        <div className="order-items">
          {items.map((item) => (
            <div key={`${item.id}-${item.size}-${item.color}`} className="order-item">
              <div className="item-details">
                <span className="item-name">{item.name}</span>
                <span className="item-meta">
                  Size: {item.size} | Quantity: {item.quantity}
                  {item.color && ` | Color: ${item.color}`}
                  {item.colorCode && <ColorSwatch color={item.colorCode} />}
                </span>
              </div>
              <span className="item-price">
                ${typeof item.price === 'number' ?
                  (item.price * item.quantity).toFixed(2) :
                  ((Number.parseFloat(item.price.replace('$', ''))) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        
        <div className="subtotal">
          <span>Subtotal</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
        
        {selectedShipping ? (
          <div className="shipping-cost">
            <span>Shipping ({selectedShipping.name})</span>
            <span>${selectedShipping.price.toFixed(2)}</span>
          </div>
        ) : (
          <div className="shipping-cost">
            <span>Shipping</span>
            <span>Not calculated yet</span>
          </div>
        )}
        
        <div className="order-total">
          <span>Total</span>
          <span>${totalWithShipping.toFixed(2)}</span>
        </div>
      </OrderSummary>
      
      {errorMessage && (
        <ErrorMessage>{errorMessage}</ErrorMessage>
      )}
      
      <CheckoutButton
        type="submit"
        disabled={isProcessing || !stripe || !elements || !selectedShipping}
      >
        {isProcessing ? "Processing..." : "Complete Purchase"}
      </CheckoutButton>
    </form>
  );
}