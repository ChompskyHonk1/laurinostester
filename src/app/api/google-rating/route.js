import { NextResponse } from 'next/server';
import FirecrawlApp from '@mendable/firecrawl-js';

// Simple in-memory cache (for production, consider using Redis or Vercel KV)
let cache = {
  data: null,
  timestamp: null,
  ttl: 2 * 24 * 60 * 60 * 1000 // 2 days in milliseconds (172800000 ms)
};

export async function GET() {
  try {
    const now = Date.now();
    
    // Check if we have cached data that's still valid
    if (cache.data && cache.timestamp && (now - cache.timestamp) < cache.ttl) {
      console.log('Using cached Google rating data');
      return NextResponse.json({
        success: true,
        ...cache.data,
        cached: true
      });
    }

    // Fetch fresh data
    const ratingData = await fetchGoogleRating();
    
    // Update cache
    cache = {
      data: ratingData,
      timestamp: now,
      ttl: cache.ttl
    };

    return NextResponse.json({
      success: true,
      ...ratingData,
      cached: false
    });

  } catch (error) {
    console.error('Error fetching Google rating:', error);
    
    // If we have cached data, return it even if expired
    if (cache.data) {
      console.log('Using expired cached data due to error');
      return NextResponse.json({
        success: true,
        ...cache.data,
        cached: true,
        expired: true,
        warning: 'Using expired data due to API error'
      });
    }

    // Fallback to default values
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch Google rating',
      currentRating: 4.1,
      threshold: 4.3,
      fallback: true
    }, { status: 500 });
  }
}

async function fetchGoogleRating() {
  const firecrawlApiKey = process.env.FIRECRAWL_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID || 'ChIJY8f8hB9244kRnB5Q2QvJ5QI';
  const defaultThreshold = parseFloat(process.env.DEFAULT_THRESHOLD || '4.3');

  if (!firecrawlApiKey) {
    throw new Error('Firecrawl API key not configured');
  }

  const app = new FirecrawlApp({ apiKey: firecrawlApiKey });

  // Google Maps URL for Laurino's Tavern
  const googleMapsUrl = `https://www.google.com/maps/place/?place_id=${placeId}`;
  
  console.log('Fetching Google rating for:', googleMapsUrl);

  try {
    const response = await app.scrapeUrl(googleMapsUrl, {
      formats: ['markdown'],
      includeTags: ['span', 'div', 'section'],
      waitFor: 2000, // Wait 2 seconds for page to load
      screenshot: false
    });

    if (!response.success) {
      throw new Error(`Firecrawl failed: ${response.error}`);
    }

    // Parse the rating from the scraped content
    const rating = parseRatingFromContent(response.markdown);
    
    if (!rating) {
      throw new Error('Could not parse rating from Google Maps content');
    }

    // Calculate threshold: current rating + 0.2 (to help improve the rating)
    const threshold = Math.min(5.0, rating + 0.2);
    
    console.log(`Successfully fetched rating: ${rating}, threshold: ${threshold}`);

    return {
      currentRating: rating,
      threshold: threshold,
      placeId: placeId,
      fetchedAt: new Date().toISOString(),
      source: 'firecrawl'
    };

  } catch (error) {
    console.error('Firecrawl error:', error);
    throw error;
  }
}

function parseRatingFromContent(content) {
  try {
    // Look for rating patterns in the content
    // Google Maps typically shows ratings in formats like "4.1" or "4.1 stars"
    
    // Pattern 1: Look for rating in the main content
    const ratingMatch = content.match(/(\d\.\d)\s*(?:stars?|★)?/i);
    if (ratingMatch) {
      const rating = parseFloat(ratingMatch[1]);
      if (rating >= 1 && rating <= 5) {
        return rating;
      }
    }

    // Pattern 2: Look for structured data patterns
    const structuredDataMatch = content.match(/rating["\s:]+(\d\.\d)/i);
    if (structuredDataMatch) {
      const rating = parseFloat(structuredDataMatch[1]);
      if (rating >= 1 && rating <= 5) {
        return rating;
      }
    }

    // Pattern 3: Look for aria-label patterns (common in Google Maps)
    const ariaLabelMatch = content.match(/aria-label[^>]*?(\d\.\d)\s*stars?/i);
    if (ariaLabelMatch) {
      const rating = parseFloat(ariaLabelMatch[1]);
      if (rating >= 1 && rating <= 5) {
        return rating;
      }
    }

    console.warn('Could not find rating in content, sample:', content.substring(0, 500));
    return null;

  } catch (error) {
    console.error('Error parsing rating from content:', error);
    return null;
  }
}

// Endpoint to manually refresh the cache
export async function POST() {
  try {
    // Clear cache
    cache = {
      data: null,
      timestamp: null,
      ttl: cache.ttl
    };

    // Fetch fresh data
    const ratingData = await fetchGoogleRating();
    
    // Update cache
    const now = Date.now();
    cache = {
      data: ratingData,
      timestamp: now,
      ttl: cache.ttl
    };

    return NextResponse.json({
      success: true,
      ...ratingData,
      cached: false,
      refreshed: true
    });

  } catch (error) {
    console.error('Error refreshing Google rating:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to refresh Google rating'
    }, { status: 500 });
  }
}