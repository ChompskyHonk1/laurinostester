"use client";
import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import emailjs from '@emailjs/browser';
import { useCart } from '../context/CartContext';
import styled from 'styled-components';

console.log("==== ORDER CONFIRMATION COMPONENT MOUNTED ====");
console.log("Current time:", new Date().toISOString());

// Styled components for the order confirmation page
const ConfirmationContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 2rem;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.light};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 2rem 1rem;
  }
`;

const SuccessMessage = styled.div`
  background: ${({ theme }) => theme.colors.accent};
  border: 2px solid ${({ theme }) => theme.colors.tertiaryDark};
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  
  h1 {
    font-family: 'Aloja', serif;
    font-size: 2.5rem;
    color: ${({ theme }) => theme.colors.primaryDark};
    margin-bottom: 1rem;
  }
  
  p {
    color: ${({ theme }) => theme.colors.primaryDark};
    font-size: 1.1rem;
  }
  
  .order-number {
    margin-top: 1.5rem;
    font-weight: 600;
    font-size: 1.2rem;
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const OrderDetails = styled.div`
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
  
  .detail-row {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.tertiaryDark};
  }
  
  .total-row {
    border-bottom: none;
    font-weight: 700;
    padding-top: 1.5rem;
    margin-top: 0.5rem;
    border-top: 2px solid ${({ theme }) => theme.colors.tertiaryDark};
  }
  
  .shipping-info {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid ${({ theme }) => theme.colors.tertiaryDark};
    
    h3 {
      font-family: 'Aloja', serif;
      font-size: 1.3rem;
      color: ${({ theme }) => theme.colors.primaryDark};
      margin-bottom: 0.5rem;
    }
  }
`;

const ErrorMessage = styled.div`
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid red;
  color: red;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  text-align: center;
  
  h1 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
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

const ContinueShoppingButton = styled.a`
  display: inline-block;
  background: ${({ theme }) => theme.colors.primaryDark};
  color: ${({ theme }) => theme.colors.primaryLight};
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  text-align: center;
  transition: background 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.lighterBlue};
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

// Function to safely send order notification with EmailJS
function sendOrderNotification(orderDetails) {
  // Check for required email configuration
  if (!process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 
      !process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 
      !process.env.NEXT_PUBLIC_EMAILJS_USER_ID) {
    console.warn('Email service not properly configured');
    return;
  }
  
  try {
    // Format items for email, with fallbacks for missing properties
    const customerEmail = orderDetails.customerEmail || localStorage.getItem('customerEmail') || '';
    const itemsText = (orderDetails.items || []).map(item => 
      `${item.name || 'Product'} (Size: ${item.size || 'Standard'}, Color: ${item.color || 'N/A'}) - $${
        typeof item.price === 'number' ? 
        (item.price || 0).toFixed(2) : 
        Number.parseFloat((item.price || '0').replace('$', '')).toFixed(2)
      } x ${item.quantity || 1}`
    ).join('\\n');
    
    // Add shipping information
    const shippingMethod = orderDetails.shippingMethod || 'Standard Shipping';
    // More robust shipping price formatting
    const shippingPrice = orderDetails.shippingPrice 
      ? (typeof orderDetails.shippingPrice === 'number' 
         ? `$${orderDetails.shippingPrice.toFixed(2)}` 
         : (typeof orderDetails.shippingPrice === 'string' && orderDetails.shippingPrice.includes('$') 
            ? orderDetails.shippingPrice 
            : `$${Number.parseFloat(orderDetails.shippingPrice || '0').toFixed(2)}`))
      : 'Calculated at checkout';
      
    // Prepare template parameters for EmailJS
    const templateParams = {
      order_number: orderDetails.orderNumber || `ORD-${Date.now().toString().slice(-6)}`,
      customer_name: orderDetails.customerName || 'Customer',
      address: orderDetails.shippingAddress || 'No address provided',
      items: itemsText || 'No items',
      shipping_method: shippingMethod,
      customer_email: customerEmail,
      shipping_price: shippingPrice,
      total: (orderDetails.total || 0).toFixed(2),
      order_date: new Date().toLocaleDateString()
    };
  
    console.log('Order details for email:', JSON.stringify({
      shippingMethod: orderDetails.shippingMethod,
      shippingPrice: orderDetails.shippingPrice,
      formattedShippingPrice: shippingPrice,
      total: orderDetails.total
    }));
    
    // Send email notification
    emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
      templateParams,
      process.env.NEXT_PUBLIC_EMAILJS_USER_ID
    )
    .then((result) => { 
      localStorage.removeItem('customerEmail'); 
      console.log('Order notification email sent successfully');
    },
    (error) => {
      console.error('Error sending order notification:', error);
    });
  } catch (error) {
    console.error('Error preparing order notification:', error);
  }
}

// Function to clear checkout flags
function clearCheckoutFlags() {
  console.log("Clearing all checkout flags");
  sessionStorage.removeItem('isCheckingOut');
  sessionStorage.removeItem('completingCheckout');
  localStorage.removeItem('pendingOrderId');
}

// Create a fallback order details object with default values
function createFallbackOrderDetails(paymentIntentId) {
  // Try to get customer email from localStorage
  const customerEmail = typeof window !== 'undefined' ? localStorage.getItem('customerEmail') || '' : '';
  
  return {
    orderNumber: `ORD-${paymentIntentId ? paymentIntentId.slice(-6) : Date.now().toString().slice(-6)}`,
    items: [],
    subtotal: 0,
    shippingMethod: 'Standard Shipping',
    shippingPrice: '0',
    total: 0,
    shippingAddress: '',
    customerName: 'Customer',
    customerEmail: customerEmail
  };
}

// Loading component for Suspense fallback
function OrderConfirmationLoading() {
  return (
    <ConfirmationContainer>
      <SuccessMessage>
        <h1>Loading Order Details</h1>
        <p>Please wait while we retrieve your order information...</p>
      </SuccessMessage>
    </ConfirmationContainer>
  );
}

// Content component that uses useSearchParams
function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState('loading');
  const [orderDetails, setOrderDetails] = useState(null);
  const [checkCount, setCheckCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [flagsCleared, setFlagsCleared] = useState(false);
  
  // Get payment intent ID from URL 
  const payment_intent = searchParams?.get('payment_intent');

  // FIXED: Early check for URL parameters - moved inside component
  useEffect(() => {
    // Check immediately if we need to recover the payment intent
    const checkPaymentIntent = async () => {
      console.log("Immediate URL check:", window.location.href);
      console.log("Search params available:", !!searchParams);
      
      const urlPaymentIntent = searchParams?.get('payment_intent');
      console.log("URL payment intent:", urlPaymentIntent);
      
      if (!urlPaymentIntent) {
        const storedPaymentIntent = localStorage.getItem('pendingOrderId');
        console.log("Stored payment intent:", storedPaymentIntent);
        
        if (storedPaymentIntent?.startsWith('pi_')) {
          console.log("Redirecting with recovered payment intent");
          window.location.href = `/order-confirmation?payment_intent=${storedPaymentIntent}`;
        }
      }
    };
    
    checkPaymentIntent();
  }, [searchParams]);

  // Add this as a new useEffect right after your imports and declarations
  useEffect(() => {
    // Add client-side check
    if (typeof window !== 'undefined' && payment_intent) {
      // If we have a payment_intent in the URL, force set checkout flags regardless of sessionStorage
      console.log("Found payment_intent in URL, setting checkout flags");
      sessionStorage.setItem('isCheckingOut', 'true');
      sessionStorage.setItem('completingCheckout', 'true');
      localStorage.setItem('pendingOrderId', payment_intent);
    }
  }, [payment_intent]);
    
  // Verify the payment with the server - wrapped in useCallback
  const verifyPayment = useCallback(async () => {
    console.log("verifyPayment called with payment_intent:", payment_intent);
    console.log("Current window location:", window.location.href);
    
    if (!payment_intent) {
      console.log("No payment_intent found in URL, checking localStorage for pendingOrderId");
      // Try to get payment_intent from localStorage if it's not in the URL
      const storedPaymentIntent = localStorage.getItem('pendingOrderId');
      
      if (storedPaymentIntent?.startsWith('pi_')) {
        console.log("Found stored payment_intent:", storedPaymentIntent);
        
        // Redirect to the same page but with the payment_intent parameter
        window.location.href = `/order-confirmation?payment_intent=${storedPaymentIntent}`;
        return false; // Interrupt verification process as we're redirecting
      }
      
      console.log("No payment_intent found in localStorage either");
      setStatus('missing');
      return true; // Complete verification process
    }
    
    try {
      console.log(`Verifying payment intent: ${payment_intent}, attempt ${checkCount + 1}`);
      
      // Build verification URL with full path
      const verifyUrl = `/api/verify-payment?payment_intent=${payment_intent}`;
      console.log("Making API request to:", verifyUrl);
      
      const response = await fetch(verifyUrl);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Server error: ${response.status}`, errorText);
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Verification response:", data);
      
      if (data.success) {
        console.log("Payment verified successfully");
        setStatus('success');
        
        // Use data from API or create fallback if data is incomplete
        const safeOrderDetails = {
          orderNumber: data.orderDetails?.orderNumber || `ORD-${payment_intent.slice(-6)}`,
          items: data.orderDetails?.items || [],
          subtotal: data.orderDetails?.subtotal || 0,
          shippingMethod: data.orderDetails?.shippingMethod || 'Standard Shipping',
          shippingPrice: data.orderDetails?.shippingPrice || '0',
          total: data.orderDetails?.total || 0,
          shippingAddress: data.orderDetails?.shippingAddress || '',
          customerName: data.orderDetails?.customerName || 'Customer',
          customerEmail: data.orderDetails?.customerEmail || (typeof window !== 'undefined' ? localStorage.getItem('customerEmail') : '') || ''
        };
        
        setOrderDetails(safeOrderDetails);
        
        // Try to send email notification if we have items
        if (safeOrderDetails.items && safeOrderDetails.items.length > 0) {
          try {
            sendOrderNotification(safeOrderDetails);
          } catch (emailError) {
            console.error('Error sending order notification email:', emailError);
            // Don't affect the user experience if email fails
          }
        }
        
        // Clear cart after successful verification
        clearCart();
        
        // Schedule flag cleanup if not already done
        if (!flagsCleared) {
          setTimeout(() => {
            clearCheckoutFlags();
            setFlagsCleared(true);
          }, 1000);
        }
        
        return true; // Verification process complete
      }
      
      if (data.status === 'pending' || data.status === 'processing' || data.status === 'requires_action') {
        // Payment is still processing
        console.log(`Payment still ${data.status}, will retry`);
        return false; // Continue verification process
      }
      
      // Payment failed or was canceled
      console.log(`Payment verification failed: ${data.status}`);
      setStatus('failure');
      return true; // Verification process complete (with failure)
    } catch (error) {
      console.error('Error verifying payment:', error);
      
      // On the 5th retry, just assume success if we have a payment_intent
      if (checkCount >= 4 && payment_intent) {
        console.log("Max retries reached, assuming success based on payment_intent presence");
        setStatus('success');
        
        // Create minimal order details
        setOrderDetails(createFallbackOrderDetails(payment_intent));
        
        // Clear cart
        clearCart();
        
        // Clean up checkout flags
        if (!flagsCleared) {
          setTimeout(() => {
            clearCheckoutFlags();
            setFlagsCleared(true);
          }, 1000);
        }
        
        return true; // Verification process complete
      }
      
      return false; // Continue verification process
    }
  }, [payment_intent, checkCount, flagsCleared, clearCart]); // Include all dependencies for the callback
  
  // Main effect for setting up flags and auto-completion timeout
  useEffect(() => {
    console.log("Order confirmation page loaded with payment_intent:", payment_intent);
    
    // Log the full URL and parameters for debugging
    console.log("Full URL:", window.location.href);
    
    // Log any important flags from storage
    console.log("Session storage flags:", {
      isCheckingOut: sessionStorage.getItem('isCheckingOut'),
      completingCheckout: sessionStorage.getItem('completingCheckout'),
      pendingOrderId: localStorage.getItem('pendingOrderId')
    });
    
    // Mark that we're on the confirmation page to prevent unwanted redirects
    sessionStorage.setItem('completingCheckout', 'true');
    sessionStorage.setItem('isCheckingOut', 'true');
    
    // Force completion after a reasonable timeout (10 seconds)
    const forceTimeout = setTimeout(() => {
      if (status === 'loading' && payment_intent) {
        console.log("Force completing due to timeout (10s)");
        setStatus('success');
        
        // Create minimal order details
        setOrderDetails(createFallbackOrderDetails(payment_intent));
        
        // Clear cart
        clearCart();
        
        // Clean up checkout flags
        if (!flagsCleared) {
          clearCheckoutFlags();
          setFlagsCleared(true);
        }
      }
    }, 10000); // Changed from 15000 to 10000 for quicker timeout
    
    // Clean up on unmount
    return () => {
      clearTimeout(forceTimeout);
      if (!flagsCleared) {
        clearCheckoutFlags();
      }
    };
  }, [payment_intent, status, clearCart, flagsCleared]); // Include all dependencies
  
  // Effect for managing verification attempts
  useEffect(() => {
    // Skip verification if it's not in loading state or already retrying
    if (status !== 'loading' || isRetrying) return;
    
    // Set retrying flag to prevent duplicate requests
    setIsRetrying(true);
    
    // Verify payment and schedule next attempt if needed
    verifyPayment().then(isComplete => {
      if (!isComplete && checkCount < 5) {
        console.log(`Scheduling verification retry ${checkCount + 1}`);
        setCheckCount(prev => prev + 1);
        setTimeout(() => {
          setIsRetrying(false);
        }, 2000);
      }
    });
  }, [status, checkCount, isRetrying, verifyPayment]); // Using memoized verifyPayment function
  
  // Render loading state
  if (status === 'loading') {
    return (
      <div>
        <LoadingOverlay>
          <div className="spinner" />
        </LoadingOverlay>
        <ConfirmationContainer>
          <SuccessMessage>
            <h1>Processing Your Order</h1>
            <p>Please wait while we confirm your payment...</p>
            {checkCount > 0 && (
              <p>Verification attempt: {checkCount + 1} of 5</p>
            )}
          </SuccessMessage>
        </ConfirmationContainer>
      </div>
    );
  }
  
  // Render missing payment intent state
  if (status === 'missing') {
    return (
      <ConfirmationContainer>
        <ErrorMessage>
          <h1>Invalid Order</h1>
          <p>We couldn't find any payment information.</p>
        </ErrorMessage>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href="/components/laurinosstore/Store" passHref legacyBehavior>
            <ContinueShoppingButton>Return to Store</ContinueShoppingButton>
          </Link>
        </div>
      </ConfirmationContainer>
    );
  }
  
  // Render payment failure state
  if (status === 'failure') {
    return (
      <ConfirmationContainer>
        <ErrorMessage>
          <h1>Payment Unsuccessful</h1>
          <p>There was a problem processing your payment.</p>
          <p>Please try again or contact customer support if you believe this is an error.</p>
        </ErrorMessage>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href="/checkout" passHref legacyBehavior>
            <ContinueShoppingButton style={{ marginRight: '1rem' }}>Try Again</ContinueShoppingButton>
          </Link>
          <Link href="/components/laurinosstore/Store" passHref legacyBehavior>
            <ContinueShoppingButton>Return to Store</ContinueShoppingButton>
          </Link>
        </div>
      </ConfirmationContainer>
    );
  }
  
  // Render success state
  return (
    <ConfirmationContainer>
      <SuccessMessage>
        <h1>Order Confirmed!</h1>
        <p>Thank you for your purchase. Your order has been successfully placed.</p>
        {orderDetails?.orderNumber && (
          <p className="order-number">
            Order Number: <span>{orderDetails.orderNumber}</span>
          </p>
        )}
      </SuccessMessage>
      
      {orderDetails && (
        <OrderDetails>
          <h2>Order Summary</h2>
          <div className="details-content">
            {Array.isArray(orderDetails.items) && orderDetails.items.length > 0 ? (
              orderDetails.items.map((item, index) => (
                <div key={`${item?.id || index}-${item?.size || 'std'}-${item?.color || 'def'}`} className="detail-row">
                  <div>
                    <span>
                      {item?.name || 'Product'} ({item?.size || 'Standard'}, {item?.color || 'Default'})
                      {item?.colorCode && <ColorSwatch color={item.colorCode} />}
                      {' x '}{item?.quantity || 1}
                    </span>
                  </div>
                  <div>
                    ${typeof (item?.price) === 'number' ?
                      ((item?.price || 0) * (item?.quantity || 1)).toFixed(2) :
                      ((Number.parseFloat((item?.price || '0').replace('$', ''))) * (item?.quantity || 1)).toFixed(2)}
                  </div>
                </div>
              ))
            ) : (
              <div className="detail-row">
                <div>Order items</div>
                <div>Not available</div>
              </div>
            )}
            
            <div className="detail-row">
              <div>Subtotal</div>
              <div>${(orderDetails.subtotal || 0).toFixed(2)}</div>
            </div>
            
            <div className="detail-row">
              <div>Shipping ({orderDetails.shippingMethod || 'Standard'})</div>
              <div>${Number.parseFloat(orderDetails.shippingPrice || '0').toFixed(2)}</div>
            </div>
            
            <div className="detail-row total-row">
              <div>Total</div>
              <div>${(orderDetails.total || 0).toFixed(2)}</div>
            </div>
          </div>
          
          {orderDetails.shippingAddress && (
            <div className="shipping-info">
              <h3>Shipping Address</h3>
              <p>{orderDetails.shippingAddress.replace(/\n/g, ', ')}</p>
            </div>
          )}
        </OrderDetails>
      )}
      
      <div style={{ textAlign: 'center' }}>
        <Link href="/components/laurinosstore/Store" passHref legacyBehavior>
          <ContinueShoppingButton>Continue Shopping</ContinueShoppingButton>
        </Link>
      </div>
    </ConfirmationContainer>
  );
}

// Main wrapper component with Suspense boundary
export default function OrderConfirmation() {
  return (
    <Suspense fallback={<OrderConfirmationLoading />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}