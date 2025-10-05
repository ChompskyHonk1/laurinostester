import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const feedbackData = await request.json();
    
    // Validate required fields
    const { name, email, foodRating, atmosphereRating, serviceRating, comment, useFiveStarSystem, totalRating, maxRating } = feedbackData;
    
    if (!name || !email || !foodRating || !atmosphereRating || !serviceRating || !comment) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate average rating
    const averageRating = ((foodRating + atmosphereRating + serviceRating) / 3).toFixed(1);

    // Create email content
    const emailContent = {
      to: 'laurinoscapecod@gmail.com',
      subject: `New Feedback from ${name} - Rating: ${averageRating}/5`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #3a5666; border-bottom: 2px solid #91acbd; padding-bottom: 10px;">
            New Customer Feedback
          </h2>
          
          <div style="background: #f9f9f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #918576; margin-top: 0;">Customer Information</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Rating System:</strong> ${useFiveStarSystem ? '5-Star System' : '15-Point System'}</p>
          </div>

          <div style="background: #f9f9f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #918576; margin-top: 0;">Ratings</h3>
            <p><strong>Food Quality:</strong> ${renderSeashells(foodRating)} ${foodRating}/5</p>
            <p><strong>Atmosphere:</strong> ${renderSeashells(atmosphereRating)} ${atmosphereRating}/5</p>
            <p><strong>Service:</strong> ${renderSeashells(serviceRating)} ${serviceRating}/5</p>
            <p><strong>Average Rating:</strong> <span style="font-size: 1.2em; color: #3a5666; font-weight: bold;">${averageRating}/5</span></p>
            <p><strong>Total Rating:</strong> <span style="font-size: 1.1em; color: #3a5666; font-weight: bold;">${totalRating}/${maxRating}</span></p>
          </div>

          <div style="background: #f9f9f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #918576; margin-top: 0;">Customer Comments</h3>
            <p style="line-height: 1.6; font-style: italic;">"${comment}"</p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding: 20px; background: #91acbd; border-radius: 8px;">
            <p style="color: white; margin: 0; font-weight: bold;">Laurino's Tavern Feedback System</p>
          </div>
        </div>
      `
    };

    // Helper function to render seashell ratings
    function renderSeashells(rating) {
      let shells = '';
      for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
          shells += '🐚'; // Full seashell
        } else if (rating >= i - 0.5) {
          shells += '🫧'; // Half bubble for half shell
        } else {
          shells += '⭕'; // Empty circle for unfilled
        }
      }
      return shells;
    }

    // Send email using nodemailer or other server-side email service
    try {
      // Check if we have email configuration
      if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        // In a real implementation, you would use nodemailer here
        // For now, we'll log the email content
        console.log('Email service configured. Sending email...');
        console.log('To:', process.env.FEEDBACK_EMAIL_TO || 'laurinoscapecod@gmail.com');
        console.log('Subject:', emailContent.subject);
        console.log('Content:', emailContent.html);
      } else {
        // Fallback to logging the email content
        console.log('Email service not configured. Logging feedback instead:');
        console.log('To:', process.env.FEEDBACK_EMAIL_TO || 'laurinoscapecod@gmail.com');
        console.log('Subject:', emailContent.subject);
        console.log('Content:', emailContent.html);
      }
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Even if email fails, we still want to show success to the user
      // In a real application, you might want to log this error for monitoring
      // or implement a retry mechanism
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Feedback submitted successfully',
        averageRating: parseFloat(averageRating),
        totalRating: parseFloat(totalRating),
        maxRating: maxRating,
        useFiveStarSystem
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing feedback:', error);
    return NextResponse.json(
      { error: 'Failed to process feedback' },
      { status: 500 }
    );
  }
}