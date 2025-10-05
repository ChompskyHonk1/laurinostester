// Optimized shipping rate calculator based on zones

// US States grouped by shipping zones
const US_ZONES = {
    // Zone 1: East Coast
    ZONE_1: ['NY', 'NJ', 'CT', 'PA', 'MA', 'RI', 'NH', 'VT', 'ME', 'DE', 'MD', 'DC'],
    
    // Zone 2: Midwest
    ZONE_2: ['OH', 'MI', 'IN', 'IL', 'WI', 'MN', 'IA', 'MO', 'KS', 'NE', 'SD', 'ND'],
    
    // Zone 3: South
    ZONE_3: ['VA', 'WV', 'KY', 'TN', 'NC', 'SC', 'GA', 'FL', 'AL', 'MS', 'LA', 'AR', 'OK', 'TX'],
    
    // Zone 4: West
    ZONE_4: ['CO', 'WY', 'MT', 'ID', 'WA', 'OR', 'NV', 'UT', 'CA', 'AZ', 'NM', 'HI', 'AK']
  };
  
  // State name to state code mapping
  const STATE_NAME_TO_CODE = {
    'ALABAMA': 'AL',
    'ALASKA': 'AK',
    'ARIZONA': 'AZ',
    'ARKANSAS': 'AR',
    'CALIFORNIA': 'CA',
    'COLORADO': 'CO',
    'CONNECTICUT': 'CT',
    'DELAWARE': 'DE',
    'DISTRICT OF COLUMBIA': 'DC',
    'FLORIDA': 'FL',
    'GEORGIA': 'GA',
    'HAWAII': 'HI',
    'IDAHO': 'ID',
    'ILLINOIS': 'IL',
    'INDIANA': 'IN',
    'IOWA': 'IA',
    'KANSAS': 'KS',
    'KENTUCKY': 'KY',
    'LOUISIANA': 'LA',
    'MAINE': 'ME',
    'MARYLAND': 'MD',
    'MASSACHUSETTS': 'MA',
    'MICHIGAN': 'MI',
    'MINNESOTA': 'MN',
    'MISSISSIPPI': 'MS',
    'MISSOURI': 'MO',
    'MONTANA': 'MT',
    'NEBRASKA': 'NE',
    'NEVADA': 'NV',
    'NEW HAMPSHIRE': 'NH',
    'NEW JERSEY': 'NJ',
    'NEW MEXICO': 'NM',
    'NEW YORK': 'NY',
    'NORTH CAROLINA': 'NC',
    'NORTH DAKOTA': 'ND',
    'OHIO': 'OH',
    'OKLAHOMA': 'OK',
    'OREGON': 'OR',
    'PENNSYLVANIA': 'PA',
    'RHODE ISLAND': 'RI',
    'SOUTH CAROLINA': 'SC',
    'SOUTH DAKOTA': 'SD',
    'TENNESSEE': 'TN',
    'TEXAS': 'TX',
    'UTAH': 'UT',
    'VERMONT': 'VT',
    'VIRGINIA': 'VA',
    'WASHINGTON': 'WA',
    'WEST VIRGINIA': 'WV',
    'WISCONSIN': 'WI',
    'WYOMING': 'WY'
  };
  
  // Canadian province name to code mapping
  const PROVINCE_NAME_TO_CODE = {
    'ALBERTA': 'AB',
    'BRITISH COLUMBIA': 'BC',
    'MANITOBA': 'MB',
    'NEW BRUNSWICK': 'NB',
    'NEWFOUNDLAND AND LABRADOR': 'NL',
    'NORTHWEST TERRITORIES': 'NT',
    'NOVA SCOTIA': 'NS',
    'NUNAVUT': 'NU',
    'ONTARIO': 'ON',
    'PRINCE EDWARD ISLAND': 'PE',
    'QUEBEC': 'QC',
    'SASKATCHEWAN': 'SK',
    'YUKON': 'YT'
  };
  
  // Shipping rates by weight and zone
  const SHIPPING_RATES = {
    // Rates for US
    US: {
      ZONE_1: {
        standard: { base: 5.99, perPound: 0.5, days: '2-3' },
        express: { base: 12.99, perPound: 0.8, days: '1-2' },
        overnight: { base: 24.99, perPound: 1.2, days: '1' }
      },
      ZONE_2: {
        standard: { base: 6.99, perPound: 0.6, days: '2-4' },
        express: { base: 13.99, perPound: 0.9, days: '1-2' },
        overnight: { base: 26.99, perPound: 1.3, days: '1' }
      },
      ZONE_3: {
        standard: { base: 7.99, perPound: 0.7, days: '3-5' },
        express: { base: 14.99, perPound: 1.0, days: '2' },
        overnight: { base: 28.99, perPound: 1.4, days: '1' }
      },
      ZONE_4: {
        standard: { base: 8.99, perPound: 0.8, days: '3-7' },
        express: { base: 16.99, perPound: 1.1, days: '2-3' },
        overnight: { base: 32.99, perPound: 1.6, days: '1-2' }
      }
    },
    
    // Rates for Canada
    CA: {
      standard: { base: 12.99, perPound: 1.2, days: '5-10' },
      express: { base: 24.99, perPound: 1.8, days: '3-5' }
    },
    
    // Rates for International
    INTL: {
      standard: { base: 19.99, perPound: 2.0, days: '7-14' },
      express: { base: 39.99, perPound: 3.0, days: '5-7' }
    }
  };
  
  // Product weight estimates in pounds
  const PRODUCT_WEIGHTS = {
    'T-Shirts': 0.3,
    'Sweatshirts': 0.8,
    'Hats': 0.2,
    'Gear': 0.5 // Default for unspecified items
  };
  
  /**
   * Normalize a state or province value to a standard code
   * @param {string} state - State or province name or code
   * @param {string} country - Country code ('US' or 'CA')
   * @returns {string} - Normalized state or province code
   */
  export function normalizeState(state, country) {
    if (!state) return '';
    
    // If it's already a 2-letter code, just return it uppercase
    if (state.length === 2) {
      return state.toUpperCase();
    }
    
    const stateUpper = state.toUpperCase();
    
    if (country === 'US') {
      return STATE_NAME_TO_CODE[stateUpper] || state;
    }if (country === 'CA') {
      return PROVINCE_NAME_TO_CODE[stateUpper] || state;
    }
    
    return state;
  }
  
  /**
   * Calculate the total weight of items in the order
   * @param {Array} items - Array of order items
   * @returns {number} - Total weight in pounds
   */
  export function calculateTotalWeight(items) {
    if (!items || !items.length) {
      return 0;
    }
    
    return items.reduce((totalWeight, item) => {
      // Skip invalid items
      if (!item) return totalWeight;
      
      const quantity = item.quantity || 1;
      const category = item.category || 'Gear'; // Default to Gear if no category
      const weightPerItem = PRODUCT_WEIGHTS[category] || PRODUCT_WEIGHTS.Gear;
      
      return totalWeight + (weightPerItem * quantity);
    }, 0);
  }
  
  /**
   * Get the shipping zone for a US state
   * @param {string} state - State code (2 letters)
   * @returns {string} - Zone identifier (e.g., 'ZONE_1')
   */
  function getZoneForState(state) {
    // Ensure we're working with an uppercase state code
    const stateCode = state.toUpperCase();
    
    for (const [zone, states] of Object.entries(US_ZONES)) {
      if (states.includes(stateCode)) {
        return zone;
      }
    }
    
    console.warn(`No shipping zone found for state: ${state}, defaulting to ZONE_4`);
    return 'ZONE_4'; // Default to Zone 4 (furthest) if not found
  }
  
  /**
   * Calculate shipping options based on address and items
   * @param {Object} address - Address object with country and state properties
   * @param {Array} items - Array of order items
   * @returns {Array} - Array of shipping options with id, name, and price
   */
  export function calculateShippingOptions(address, items) {
    // Validate inputs
    if (!address || !address.country || !items || !Array.isArray(items)) {
      console.error('Invalid address or items:', { address, itemsLength: items?.length });
      return [];
    }
    
    const totalWeight = calculateTotalWeight(items);
    console.log(`Calculated total weight: ${totalWeight} pounds`);
    
    const shippingOptions = [];
    const country = address.country.toUpperCase();
    
    try {
      if (country === 'US') {
        // Normalize state to a 2-letter code
        const stateCode = normalizeState(address.state, 'US');
        console.log(`Normalized state from "${address.state}" to "${stateCode}"`);
        
        if (!stateCode) {
          console.error('Missing state code for US address');
          return [];
        }
        
        const zone = getZoneForState(stateCode);
        console.log(`Shipping zone for ${stateCode}: ${zone}`);
        
        const zoneRates = SHIPPING_RATES.US[zone];
        
        // Create shipping options for this zone
        for (const [service, rates] of Object.entries(zoneRates)) {
          const price = rates.base + (totalWeight * rates.perPound);
          const roundedPrice = Math.round(price * 100) / 100; // Round to 2 decimal places
          
          shippingOptions.push({
            id: service,
            name: `${service.charAt(0).toUpperCase() + service.slice(1)} (${rates.days} days)`,
            price: roundedPrice
          });
        }
      } else if (country === 'CA') {
        // Canada shipping options
        for (const [service, rates] of Object.entries(SHIPPING_RATES.CA)) {
          const price = rates.base + (totalWeight * rates.perPound);
          
          shippingOptions.push({
            id: service,
            name: `${service.charAt(0).toUpperCase() + service.slice(1)} (${rates.days} days)`,
            price: Math.round(price * 100) / 100
          });
        }
      } else {
        // International shipping options
        for (const [service, rates] of Object.entries(SHIPPING_RATES.INTL)) {
          const price = rates.base + (totalWeight * rates.perPound);
          
          shippingOptions.push({
            id: service,
            name: `${service.charAt(0).toUpperCase() + service.slice(1)} (${rates.days} days)`,
            price: Math.round(price * 100) / 100
          });
        }
      }
      
      // Sort by price (cheapest first)
      shippingOptions.sort((a, b) => a.price - b.price);
      
      console.log(`Calculated ${shippingOptions.length} shipping options for ${country}`);
      return shippingOptions;
    } catch (error) {
      console.error('Error calculating shipping options:', error);
      return [];
    }
  }