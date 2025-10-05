import Stripe from 'stripe';
// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { paymentIntentId, shippingOption, totalAmount, email } = body;
    
    if (!paymentIntentId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing payment intent ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (!shippingOption) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing shipping option' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Convert items to a format that can be stored in metadata
    const items = body.items || [];
    const stringifiedItems = JSON.stringify(items.map(item => ({
      id: item.id,
      name: item.name,
      price: typeof item.price === 'number' ? item.price : Number.parseFloat(item.price.replace('$', '')),
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      colorCode: item.colorCode
    })));
    
    console.log(`Updating payment intent ${paymentIntentId} with shipping method ${shippingOption.name} and total ${totalAmount}`);
    
    // Create metadata object with all required fields
    const metadata = {
      items: stringifiedItems,
      shippingMethod: shippingOption.name,
      shippingPrice: shippingOption.price.toString()
    };
    
    // Add customer email to metadata if available
    if (email) {
      metadata.customerEmail = email;
    }
    
    // Update options for payment intent
    const updateOptions = {
      amount: Math.round(totalAmount * 100), // Convert to cents
      metadata: metadata
    };
    
    // Also set receipt_email if email is provided
    if (email) {
      updateOptions.receipt_email = email;
    }
    
    // Update the payment intent with the new amount and metadata
    const updatedPaymentIntent = await stripe.paymentIntents.update(
      paymentIntentId, 
      updateOptions
    );
    
    console.log(`Payment intent updated successfully: ${updatedPaymentIntent.id}`);
    
    return new Response(
      JSON.stringify({
        success: true,
        paymentIntentId: updatedPaymentIntent.id,
        amount: updatedPaymentIntent.amount
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating payment intent:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}