# Dynamic Star Rating Threshold System

This document explains how to set up and configure the dynamic star rating threshold system that automatically adjusts based on your current Google rating.

## Overview

The dynamic threshold system:
- Fetches your current Google rating in real-time using Firecrawl
- Calculates an optimal threshold (current rating + 0.2) to help improve your rating
- Automatically adjusts as your Google rating changes
- Includes caching to minimize API calls and costs

## Setup Instructions

### 1. Get Firecrawl API Key

1. Visit [Firecrawl.dev](https://www.firecrawl.dev/)
2. Sign up for an account
3. Navigate to your dashboard to get your API key
4. Copy the API key (it starts with `fc_`)

### 2. Configure Environment Variables

Create a `.env.local` file in your project root (if it doesn't exist) and add:

```env
# Firecrawl Configuration
FIRECRAWL_API_KEY=fc_your_actual_firecrawl_api_key_here
GOOGLE_PLACE_ID=ChIJY8f8hB9244kRnB5Q2QvJ5QI
DEFAULT_THRESHOLD=4.3
RATING_CACHE_TTL=172800
```

**Important:**
- Replace `fc_your_actual_firecrawl_api_key_here` with your real Firecrawl API key
- `GOOGLE_PLACE_ID` is already set to Laurino's Tavern place ID
- `DEFAULT_THRESHOLD` is used as fallback if the API fails
- `RATING_CACHE_TTL` is cache duration in seconds (172800 = 2 days)

### 3. Vercel Deployment Setup

If deploying to Vercel, you need to add the environment variables to your Vercel project:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:
   - `FIRECRAWL_API_KEY`: Your Firecrawl API key
   - `GOOGLE_PLACE_ID`: `ChIJY8f8hB9244kRnB5Q2QvJ5QI`
   - `DEFAULT_THRESHOLD`: `4.3`
   - `RATING_CACHE_TTL`: `172800`

### 4. Testing the System

#### Local Testing
1. Start your development server: `npm run dev`
2. Visit the feedback page: `http://localhost:3000/feedback`
3. Open browser console to see threshold loading logs
4. Test the API endpoint directly: `http://localhost:3000/api/google-rating`

#### API Testing
Run the test script:
```bash
node test-google-rating.js
```

Or test with curl:
```bash
curl http://localhost:3000/api/google-rating
```

## How It Works

### Threshold Calculation
The threshold is calculated as: `current_google_rating + 0.2`

Examples:
- If Google rating is 4.1 → threshold = 4.3
- If Google rating is 4.3 → threshold = 4.5  
- If Google rating drops to 3.9 → threshold = 4.1

This ensures you're always asking for ratings that will help improve your overall score.

### Caching System
- Google rating is cached for 2 days to minimize API calls and save Firecrawl credits
- Cache automatically refreshes after expiration
- If API fails, system uses expired cached data as fallback
- If no cache exists, uses default threshold (4.3)

### Error Handling
- Multiple fallback mechanisms ensure the system always works
- Detailed logging for monitoring and debugging
- Graceful degradation when scraping fails

## Monitoring

### Console Logs
The system logs important events:
- `Using cached Google rating data` - when using cached data
- `Successfully fetched rating: X, threshold: Y` - when fresh data is fetched
- `Using expired cached data due to error` - when API fails but cache exists

### API Response Format
```json
{
  "success": true,
  "currentRating": 4.1,
  "threshold": 4.3,
  "placeId": "ChIJY8f8hB9244kRnB5Q2QvJ5QI",
  "fetchedAt": "2025-01-06T02:30:00.000Z",
  "source": "firecrawl",
  "cached": false
}
```

### Manual Cache Refresh
To force refresh the cache, make a POST request:
```bash
curl -X POST http://localhost:3000/api/google-rating
```

## Cost Considerations

- Firecrawl API calls are cached for 2 days to minimize costs and save credits
- Each cache miss results in one API call
- Typical usage: 15 calls per month maximum (1 every 2 days)
- Check Firecrawl pricing for current rates

## Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify your Firecrawl API key is correct
   - Check if you have sufficient credits in your Firecrawl account

2. **Rating Not Found**
   - Google may have changed their page structure
   - Check the console logs for parsing errors
   - The system includes multiple parsing patterns for robustness

3. **High Response Time**
   - First request may be slower (no cache)
   - Subsequent requests should be fast (cached)
   - Firecrawl scraping typically takes 2-5 seconds

4. **Deployment Issues**
   - Ensure all environment variables are set in Vercel
   - Check Vercel function logs for errors
   - Verify API key is correctly configured

### Debug Mode
To enable detailed logging, the system already includes comprehensive console logging. Check your browser console and Vercel logs for debugging information.

## Benefits

✅ **Automatic Optimization**: Always targets the right threshold to improve your rating
✅ **Cost Effective**: Caching minimizes API calls  
✅ **Reliable**: Multiple fallback mechanisms ensure the system always works
✅ **Scalable**: Works with Vercel's serverless functions
✅ **Monitorable**: Built-in logging for tracking performance

## Support

If you encounter issues:
1. Check the console logs for error messages
2. Verify your Firecrawl API key and credits
3. Ensure all environment variables are correctly set
4. Test the API endpoint directly

The system is designed to be robust and will continue working even if some components fail, using fallback values and cached data when necessary.