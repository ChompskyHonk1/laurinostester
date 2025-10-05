import { NextResponse } from 'next/server';
import { calculateShippingOptions, normalizeState } from '../../checkout/ShippingRates';

export async function POST(request) {
    try {
      // Clone the request to avoid read stream issues
      const clonedRequest = request.clone();
      const body = await clonedRequest.json();
      
      // Validate required parameters
      if (!body || !body.address || !body.items) {
        return NextResponse.json(
          { 
            error: 'Missing required fields: address or items',
            shippingOptions: [] 
          },
          { status: 400 }
        );
      }
      
      // Extract address from nested structure
      let addressData = body.address;
      
      // Handle Stripe's nested address structure
      if (addressData.address && typeof addressData.address === 'object') {
        addressData = {
          ...addressData,
          ...addressData.address
        };
      }
      
      // Validate address has required fields
      if (!addressData.country) {
        return NextResponse.json(
          { 
            error: 'Incomplete address: missing country',
            shippingOptions: [] 
          },
          { status: 400 }
        );
      }
      
      // For US addresses, ensure we have a state
      if (addressData.country === 'US' && !addressData.state) {
        return NextResponse.json(
          { 
            error: 'Incomplete US address: missing state',
            shippingOptions: [] 
          },
          { status: 400 }
        );
      }
      
      // Validate items is an array
      if (!Array.isArray(body.items) || body.items.length === 0) {
        return NextResponse.json(
          { 
            error: 'Invalid or empty items array',
            shippingOptions: [] 
          },
          { status: 400 }
        );
      }
      
      // Log the normalized address for debugging
      console.log('Normalized address:', addressData);
      
      // Normalize the state code if it's a US address
      if (addressData.country === 'US' && addressData.state) {
        // Use the normal address here with proper state/country fields
        const normalizedAddress = { ...addressData };
        normalizedAddress.state = normalizeState(addressData.state, 'US');
        
        // Calculate shipping options with the normalized address
        const shippingOptions = calculateShippingOptions(normalizedAddress, body.items);
        
        // Check if we got any shipping options
        if (shippingOptions.length === 0) {
          console.warn('No shipping options found for address:', {
            country: normalizedAddress.country,
            state: normalizedAddress.state
          });
          
          return NextResponse.json({ 
            shippingOptions: [],
            message: 'No shipping options available for this address'
          });
        }
        
        // Return the shipping options
        return NextResponse.json({ shippingOptions });
      }
        // For non-US addresses, just use the normalized address
        const shippingOptions = calculateShippingOptions(addressData, body.items);
        
        // Return the shipping options
        return NextResponse.json({ shippingOptions });
    } catch (error) {
      console.error('Error calculating shipping:', error);
      return NextResponse.json(
        { 
          error: `Error calculating shipping rates: ${error.message}`,
          shippingOptions: [] 
        },
        { status: 500 }
      );
    }
  }