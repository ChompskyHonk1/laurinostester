import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request) {
  try {
    // Initialize Stripe inside the function
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Missing Stripe secret key');
    }
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    const body = await request.json();
    const { amount, items, email, shippingOption } = body;
    
    // Normalize prices - handle both string "$25" and number prices
    const normalizedItems = items.map(item => ({
      ...item,
      price: typeof item.price === 'string'
        ? Number.parseFloat(item.price.replace('$', ''))
        : item.price
    }));
    
    // Calculate amount if not provided
    const itemsTotal = normalizedItems.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
    
    // Add shipping cost if provided
    const shippingCost = shippingOption ? shippingOption.price : 0;
    
    // Use provided amount or calculated amount
    const finalAmount = amount || (itemsTotal + shippingCost);
    
    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(finalAmount * 100), // Convert to cents
      currency: 'usd',
      receipt_email: email, // Enable receipt emails from Stripe
      
      // Store order details in metadata for retrieval later
      metadata: {
        order_items: JSON.stringify(normalizedItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color || 'N/A',
          colorCode: item.colorCode || null,
          category: item.category || 'Gear'
        }))),
        ...(shippingOption && {
          shipping_method: shippingOption.name,
          shipping_price: shippingOption.price.toString()
        })
      }
    });
    
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id 
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}