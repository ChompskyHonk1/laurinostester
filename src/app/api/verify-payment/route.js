import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(request) {
  try {
    // Extract payment_intent from URL parameters
    const url = new URL(request.url);
    const payment_intent_id = url.searchParams.get('payment_intent');

    if (!payment_intent_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing payment intent ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Verifying payment intent: ${payment_intent_id}`);

    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id, {
      expand: ['customer', 'shipping', 'payment_method']
    });

    console.log(`Payment intent status: ${paymentIntent.status}`);

    // Check if the payment was successful
    if (paymentIntent.status === 'succeeded') {
      // Extract necessary details from the payment intent for order details
      const shippingDetails = paymentIntent.shipping || {};
      const customerDetails = paymentIntent.customer || {};
      const metadata = paymentIntent.metadata || {};
      const customerEmail = metadata.customerEmail || paymentIntent.receipt_email || '';
      
      
      let items = [];
      let subtotal = 0;
      
      // Try to parse items from metadata
      try {
        if (metadata.items) {
          items = JSON.parse(metadata.items);
        }
      } catch (error) {
        console.error('Failed to parse items from metadata:', error);
      }
      
      // Extract shipping method and price from metadata
      const shippingMethod = metadata.shippingMethod || 'Standard Shipping';
      const shippingPrice = Number.parseFloat(metadata.shippingPrice || '0');
      
      // Calculate subtotal from amount minus shipping
      subtotal = (paymentIntent.amount / 100) - shippingPrice;
      
      // Create order details object
      const orderDetails = {
        orderNumber: `ORD-${payment_intent_id.slice(-6)}`,
        items: items,
        subtotal: subtotal,
        shippingMethod: shippingMethod,
        shippingPrice: shippingPrice,
        total: paymentIntent.amount / 100,
        customerEmail: customerEmail,
        customerName: shippingDetails.name || customerDetails.name || '',
        shippingAddress: shippingDetails.address ? 
          `${shippingDetails.name}\n${shippingDetails.address.line1}${shippingDetails.address.line2 ? `\n${shippingDetails.address.line2}` : ''}\n${shippingDetails.address.city}, ${shippingDetails.address.state} ${shippingDetails.address.postal_code}\n${shippingDetails.address.country}` 
          : ''
      };
      
      // Return successful response with order details
      return new Response(
        JSON.stringify({
          success: true,
          orderDetails: orderDetails
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }if (paymentIntent.status === 'processing') {
      // Payment is still processing
      return new Response(
        JSON.stringify({ success: false, status: 'processing' }),
        { status: 202, headers: { 'Content-Type': 'application/json' } }
      );
    }if (paymentIntent.status === 'requires_action') {
      // Payment requires additional action
      return new Response(
        JSON.stringify({ success: false, status: 'requires_action' }),
        { status: 202, headers: { 'Content-Type': 'application/json' } }
      );
    }
      // Payment failed or was canceled
      return new Response(
        JSON.stringify({ success: false, status: paymentIntent.status }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
  } catch (error) {
    console.error('Error verifying payment:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}