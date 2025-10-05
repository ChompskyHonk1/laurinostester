# Feedback System Setup

## Email Configuration

To enable the feedback system to send emails, you need to configure one of the following email services:

### Option 1: EmailJS (Recommended for simplicity)

1. Go to [EmailJS](https://www.emailjs.com/) and create an account
2. Create a new service (e.g., Gmail, Outlook, etc.)
3. Create a new template with the following variables:
   - `to_email` - recipient email address
   - `from_name` - sender's name
   - `from_email` - sender's email
   - `food_rating` - food rating (1-5)
   - `atmosphere_rating` - atmosphere rating (1-5)
   - `service_rating` - service rating (1-5)
   - `average_rating` - average rating
   - `comment` - customer's comment
   - `reply_to` - reply-to email address

4. Update your `.env.local` file with your EmailJS credentials:
   ```
   EMAILJS_SERVICE_ID=your_service_id
   EMAILJS_TEMPLATE_ID=your_template_id
   EMAILJS_PUBLIC_KEY=your_public_key
   FEEDBACK_EMAIL_TO=laurinoscapecod@gmail.com
   ```

### Option 2: Other Email Services

If you prefer to use other email services like SendGrid, AWS SES, or Nodemailer, you can modify the `src/app/api/send-feedback/route.js` file to implement your preferred solution.

## Testing

To test the feedback system locally:

1. Make sure you have all dependencies installed:
   ```
   npm install
   ```

2. Run the development server:
   ```
   npm run dev
   ```

3. Navigate to the feedback page and submit a test form

4. Check the server console for email logs

## Google Review Integration

The system automatically prompts users to leave a Google review if their average rating is 4.2 stars or higher. The Google review link is configured in the feedback component.

## Customization

You can customize the feedback form by modifying:
- `src/app/components/Feedback/page.js` - Main feedback component
- `src/app/api/send-feedback/route.js` - Email sending logic
- Styling is done with styled-components in the feedback page component

## Troubleshooting

If you're having issues with the feedback form:

1. Check that all required fields are filled out
2. Verify that the EmailJS configuration is correct in `.env.local`
3. Check the browser console for any JavaScript errors
4. Check the server console for any API errors
5. Ensure that the form is not being blocked by browser extensions

## Styling

The feedback form uses the website's theme colors:
- Primary dark: #918576 (warm brown)
- Secondary dark: #c0ab9a (lighter brown)
- Tertiary dark: #3a5666 (ocean blue)
- Blue pastel: #91acbd (baby blue)
- Lighter blue: #b1c5d0 (lightest pastel blue)
- Background: #FAF9F6 (off-white)

The form is fully responsive and will adapt to different screen sizes.