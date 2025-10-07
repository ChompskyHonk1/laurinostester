# Vercel Deployment Guide for Laurino's Tavern

## Overview
Your application is now configured to deploy successfully to Vercel, even without all the API keys configured. The app will use fallback/mock data when environment variables are missing.

## What's Been Fixed
- ✅ Added placeholder environment variables to `vercel.json`
- ✅ All API routes handle missing keys gracefully
- ✅ Application builds successfully without breaking

## Environment Variables Setup

### Required for Full Functionality
After deployment, you can add these environment variables in your Vercel dashboard:

#### Notion Calendar Integration
```
NOTION_API_KEY=secret_your_actual_notion_api_key
NOTION_DATABASE_ID=your_actual_notion_database_id
```

#### Email Service (for feedback)
```
EMAIL_HOST=your_email_host
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
FEEDBACK_EMAIL_TO=laurinoscapecod@gmail.com
```

#### Google Ratings
```
FIRECRAWL_API_KEY=fc_your_actual_firecrawl_api_key
GOOGLE_PLACE_ID=ChIJY8f8hB9244kRnB5Q2QvJ5QI
DEFAULT_THRESHOLD=4.3
RATING_CACHE_TTL=172800
```

#### Stripe Payments
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## How to Add Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the variables you want to configure
5. **Redeploy** your project to apply the changes

## What Works Out of the Box
- ✅ Website deploys successfully
- ✅ Calendar shows mock events when Notion isn't configured
- ✅ Feedback form works (logs to console when email isn't configured)
- ✅ Google ratings shows fallback values when Firecrawl isn't configured
- ✅ All pages and navigation work perfectly

## Deployment Steps
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy - it will work immediately with placeholder values
4. Add real API keys in Vercel dashboard when ready
5. Redeploy to activate full functionality

## Note on Calendar
The calendar will show sample events like "Live Music Night" and "Trivia Night" when the Notion API isn't configured. Once you add your Notion credentials, it will display your actual events.

## Support
If you encounter any issues during deployment, the application is designed to fail gracefully and will still provide a good user experience with mock data.