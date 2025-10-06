import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';

export async function POST(request) {
  try {
    // Initialize Stripe inside the function
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // Handle specific event types
    switch (event.type) {
        case 'payment_intent.succeeded': {
          const paymentIntent = event.data.object;
          await handleSuccessfulPayment(paymentIntent);
          break;
        }
          
        case 'payment_intent.payment_failed': {
          const failedPaymentIntent = event.data.object;
          await handleFailedPayment(failedPaymentIntent);
          break;
        }
          
        default: {
          console.log(`Unhandled event type: ${event.type}`);
          break;
        }
      }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleSuccessfulPayment(paymentIntent) {
  console.log(`Payment succeeded: ${paymentIntent.id}`);
  
  try {
    // Here you could:
    // 1. Update inventory
    // 2. Log order in database
    // 3. Track analytics
    // 4. Send additional notifications
    
    console.log('Order processed successfully');
    
  } catch (error) {
    console.error('Error processing successful payment:', error);
  }
}

async function handleFailedPayment(paymentIntent) {
  console.log(`Payment failed: ${paymentIntent.id}`);
  
  try {
    // Handle the failed payment
    console.log('Payment failure recorded');
    
  } catch (error) {
    console.error('Error processing failed payment:', error);
  }
}