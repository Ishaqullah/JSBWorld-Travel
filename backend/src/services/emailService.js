import nodemailer from 'nodemailer';
import config from '../config/index.js';

// Create transporter with SMTP settings
const createTransporter = () => {
  return nodemailer.createTransport({
    host: config.smtp?.host || 'smtp.gmail.com',
    port: config.smtp?.port || 465,
    secure: config.smtp?.secure !== false, // true for 465, false for other ports
    auth: {
      user: config.smtp?.user || process.env.SMTP_USER,
      pass: config.smtp?.pass || process.env.SMTP_PASS,
    },
    tls: {
      // Allow self-signed or hostname-mismatched certificates (common on shared hosting)
      rejectUnauthorized: false,
    },
  });
};

/**
 * Send email verification code to user during signup
 */
export const sendVerificationCode = async (email, code, name) => {
  const transporter = createTransporter();
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <div style="text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);">
        <h1 style="color: #fff; margin: 0; font-size: 28px;">JSBWorld Travel</h1>
        <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 14px;">Your Journey Begins Here</p>
      </div>
      
      <div style="padding: 40px 30px;">
        <h2 style="color: #1e3a5f; margin-top: 0;">Verify Your Email Address</h2>
        
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
          Hi ${name},
        </p>
        
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
          Thank you for signing up for JSBWorld Travel! To complete your registration, please enter the verification code below:
        </p>
        
        <div style="background: linear-gradient(135deg, #f0f7ff 0%, #e8f4fd 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; border: 1px solid #bee3f8;">
          <p style="color: #64748b; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
          <div style="font-size: 42px; font-weight: bold; color: #1e3a5f; letter-spacing: 8px; font-family: 'Courier New', monospace;">
            ${code}
          </div>
          <p style="color: #94a3b8; margin: 15px 0 0 0; font-size: 13px;">This code expires in 10 minutes</p>
        </div>
        
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
          If you didn't request this code, please ignore this email. Someone may have entered your email address by mistake.
        </p>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #4a5568; margin: 0;">
            Best regards,<br>
            <strong style="color: #1e3a5f;">The JSBWorld Travel Team</strong>
          </p>
        </div>
      </div>
      
      <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} JSBWorld Travel by JSB World Travel. All rights reserved.
        </p>
        <p style="color: #94a3b8; font-size: 12px; margin: 10px 0 0 0;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: config.smtp?.from || '"JSBWorld Travel" <info@jsbworld-travel.com>',
    to: email,
    subject: `${code} - Verify your JSBWorld Travel account`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification code sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

/**
 * Send email notification to company about new custom itinerary request
 */
export const sendCustomItineraryNotification = async (itineraryData) => {
  const transporter = createTransporter();
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e3a5f; border-bottom: 2px solid #f5a623; padding-bottom: 10px;">
        New Custom Itinerary Request
      </h2>
      
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0;">Customer Details</h3>
        <p><strong>Name:</strong> ${itineraryData.customerName}</p>
        <p><strong>Email:</strong> ${itineraryData.customerEmail}</p>
        <p><strong>Phone:</strong> ${itineraryData.customerPhone || 'Not provided'}</p>
      </div>
      
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0;">Trip Details</h3>
        <p><strong>Destination:</strong> ${itineraryData.destination}</p>
        <p><strong>Travel Dates:</strong> ${itineraryData.travelDates}</p>
        <p><strong>Number of Travelers:</strong> ${itineraryData.numberOfTravelers}</p>
        <p><strong>Budget:</strong> ${itineraryData.budget || 'Not specified'}</p>
      </div>
      
      ${itineraryData.preferences ? `
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Preferences</h3>
          <p>${itineraryData.preferences}</p>
        </div>
      ` : ''}
      
      ${itineraryData.specialRequests ? `
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Special Requests</h3>
          <p>${itineraryData.specialRequests}</p>
        </div>
      ` : ''}
      
      <p style="color: #666; font-size: 12px; margin-top: 30px;">
        This request was submitted on ${new Date().toLocaleString()}
      </p>
    </div>
  `;

  const mailOptions = {
    from: config.smtp?.from || '"JSBWorld Travel" <noreply@jsbworld-travel.com>',
    to: 'info@jsbworld-travel.com',
    subject: `New Custom Itinerary Request - ${itineraryData.destination}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Custom itinerary notification sent to company');
    return true;
  } catch (error) {
    console.error('Error sending company notification:', error);
    return false;
  }
};

/**
 * Send confirmation email to customer about their custom itinerary request
 */
/**
 * Send confirmation email to customer about their custom itinerary request
 */
export const sendCustomItineraryConfirmation = async (itineraryData) => {
  const transporter = createTransporter();
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <div style="text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);">
        <h1 style="color: #fff; margin: 0; font-size: 28px;">JSBWorld Travel</h1>
        <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 14px;">Your Dream Trip Awaits</p>
      </div>
      
      <div style="padding: 40px 30px;">
        <h2 style="color: #1e3a5f; margin-top: 0; font-size: 24px;">Request Received!</h2>
        
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
          Dear ${itineraryData.customerName},
        </p>
        
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
          Thank you for choosing JSBWorld Travel! We have received your custom itinerary request and our travel experts are already excited to start planning your perfect getaway to <strong>${itineraryData.destination}</strong>.
        </p>
        
        <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #e2e8f0;">
          <h3 style="color: #1e3a5f; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #cbd5e1; padding-bottom: 10px;">Trip Summary</h3>
          
          <div style="margin-bottom: 10px;">
            <p style="margin: 5px 0; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Destination</p>
            <p style="margin: 0; color: #334155; font-weight: 600; font-size: 16px;">${itineraryData.destination}</p>
          </div>
          
          <div style="margin-bottom: 10px;">
            <p style="margin: 5px 0; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Dates</p>
            <p style="margin: 0; color: #334155; font-weight: 600; font-size: 16px;">${itineraryData.travelDates}</p>
          </div>
          
          <div style="margin-bottom: 10px;">
            <p style="margin: 5px 0; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Travelers</p>
            <p style="margin: 0; color: #334155; font-weight: 600; font-size: 16px;">${itineraryData.numberOfTravelers}</p>
          </div>
          
          ${itineraryData.budget ? `
          <div>
            <p style="margin: 5px 0; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Budget</p>
            <p style="margin: 0; color: #334155; font-weight: 600; font-size: 16px;">${itineraryData.budget}</p>
          </div>
          ` : ''}
        </div>
        
        <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 20px; border-radius: 4px;">
          <h4 style="color: #15803d; margin: 0 0 10px 0; font-size: 16px;">What Happens Next?</h4>
          <ul style="margin: 0; padding-left: 20px; color: #166534; font-size: 15px;">
            <li style="margin-bottom: 8px;">Our experts will review your preferences within 24 hours.</li>
            <li style="margin-bottom: 8px;">We'll craft a personalized itinerary just for you.</li>
            <li>We'll contact you to refine the details until it's perfect.</li>
          </ul>
        </div>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #4a5568; margin: 0; font-size: 16px;">
            Best regards,<br>
            <strong style="color: #1e3a5f;">The JSBWorld Travel Team</strong>
          </p>
          <p style="color: #64748b; font-size: 14px; margin-top: 10px;">
            Questions? Reply to this email or contact us at <a href="mailto:info@jsbworld-travel.com" style="color: #2563eb; text-decoration: none;">info@jsbworld-travel.com</a>
          </p>
        </div>
      </div>
      
      <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} JSBWorld Travel by JSB World Travel. All rights reserved.
        </p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: '"JSBWorld Travel" <info@jsbworld-travel.com>',
    to: itineraryData.customerEmail,
    subject: 'We Received Your Custom Tour Request! 🌍',
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent to customer (Appealing Version)');
    return true;
  } catch (error) {
    console.error('Error sending customer confirmation:', error);
    return false;
  }
};

/**
 * Send booking confirmation email
 */
export const sendBookingConfirmation = async (booking, user) => {
  const transporter = createTransporter();
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);">
        <h1 style="color: #fff; margin: 0;">JSBWorld Travel</h1>
      </div>
      
      <div style="padding: 30px;">
        <h2 style="color: #27ae60;">Booking Confirmed!</h2>
        
        <p>Dear ${user.name},</p>
        
        <p>Your booking has been confirmed. Here are your booking details:</p>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Booking Number:</strong> ${booking.bookingNumber}</p>
          <p><strong>Tour:</strong> ${booking.tour?.title}</p>
          <p><strong>Date:</strong> ${new Date(booking.tourDate?.startDate).toLocaleDateString()}</p>
          <p><strong>Travelers:</strong> ${booking.numberOfTravelers}</p>
          <p><strong>Total Amount:</strong> $${booking.totalPrice}</p>
        </div>
        
        <p>Thank you for choosing JSBWorld Travel!</p>
        
        <p style="margin-top: 30px;">
          Best regards,<br>
          <strong>The JSBWorld Travel Team</strong>
        </p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: config.smtp?.from || '"JSBWorld Travel" <noreply@jsbworld-travel.com>',
    to: user.email,
    subject: `Booking Confirmed - ${booking.bookingNumber}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending booking confirmation:', error);
    return false;
  }
};

/**
 * Send booking pending email (for bank transfer payments awaiting verification)
 */
export const sendBookingPendingEmail = async (booking, user) => {
  const transporter = createTransporter();
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);">
        <h1 style="color: #fff; margin: 0;">JSBWorld Travel</h1>
      </div>
      
      <div style="padding: 30px;">
        <h2 style="color: #f59e0b;">Booking Pending Verification</h2>
        
        <p>Dear ${user.name},</p>
        
        <p>Thank you for your booking! We have received your bank transfer receipt and it is currently being reviewed by our team.</p>
        
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e;"><strong>Status:</strong> Awaiting Verification</p>
          <p style="margin: 5px 0 0 0; color: #92400e; font-size: 14px;">We will notify you once your payment has been verified.</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Booking Number:</strong> ${booking.bookingNumber}</p>
          <p><strong>Tour:</strong> ${booking.tour?.title}</p>
          <p><strong>Date:</strong> ${booking.tourDate?.startDate ? new Date(booking.tourDate.startDate).toLocaleDateString() : 'TBD'}</p>
          <p><strong>Travelers:</strong> ${booking.numberOfTravelers || (booking.adultsCount + booking.childrenCount)}</p>
          <p><strong>Total Amount:</strong> $${booking.totalPrice}</p>
        </div>
        
        <p>If you have any questions, please contact us at <a href="mailto:info@jsbworld-travel.com">info@jsbworld-travel.com</a></p>
        
        <p style="margin-top: 30px;">
          Best regards,<br>
          <strong>The JSBWorld Travel Team</strong>
        </p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: config.smtp?.from || '"JSBWorld Travel" <noreply@jsbworld-travel.com>',
    to: user.email,
    subject: `Booking Pending Verification - ${booking.bookingNumber}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Booking pending email sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error('Error sending booking pending email:', error);
    return false;
  }
};

/**
 * Send booking notification to admin/company
 */
export const sendBookingNotificationToAdmin = async (booking, user, paymentStatus) => {
  const transporter = createTransporter();
  
  const statusLabel = paymentStatus === 'COMPLETED' ? 'CONFIRMED' : 'PENDING VERIFICATION';
  const statusColor = paymentStatus === 'COMPLETED' ? '#22c55e' : '#f59e0b';
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);">
        <h1 style="color: #fff; margin: 0;">New Booking Received</h1>
      </div>
      
      <div style="padding: 30px;">
        <div style="background: ${statusColor}20; border-left: 4px solid ${statusColor}; padding: 15px; margin-bottom: 20px;">
          <p style="margin: 0; color: ${statusColor}; font-weight: bold; font-size: 18px;">Status: ${statusLabel}</p>
        </div>
        
        <h3 style="color: #1e3a5f; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Customer Details</h3>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p><strong>Name:</strong> ${user.name}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Phone:</strong> ${user.phone || 'Not provided'}</p>
        </div>
        
        <h3 style="color: #1e3a5f; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Booking Details</h3>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p><strong>Booking Number:</strong> ${booking.bookingNumber}</p>
          <p><strong>Tour:</strong> ${booking.tour?.title}</p>
          <p><strong>Tour Date:</strong> ${booking.tourDate?.startDate ? new Date(booking.tourDate.startDate).toLocaleDateString() : 'TBD'}</p>
          <p><strong>Adults:</strong> ${booking.adultsCount || 0}</p>
          <p><strong>Children:</strong> ${booking.childrenCount || 0}</p>
          <p><strong>Flight Option:</strong> ${booking.flightOption === 'with' ? 'With Flight' : 'Without Flight'}</p>
        </div>
        
        <h3 style="color: #1e3a5f; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Payment Details</h3>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p><strong>Total Price:</strong> $${booking.totalPrice}</p>
          ${booking.isDepositPayment ? `
            <p><strong>Payment Type:</strong> Deposit</p>
            <p><strong>Deposit Amount:</strong> $${booking.depositAmount}</p>
            <p><strong>Remaining Balance:</strong> $${booking.remainingBalance}</p>
          ` : `
            <p><strong>Payment Type:</strong> Full Payment</p>
          `}
          <p><strong>Payment Method:</strong> ${paymentStatus === 'COMPLETED' ? 'Card' : 'Bank Transfer'}</p>
        </div>
        
        ${booking.specialRequests ? `
          <h3 style="color: #1e3a5f; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Special Requests</h3>
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p>${booking.specialRequests}</p>
          </div>
        ` : ''}
        
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This booking was received on ${new Date().toLocaleString()}
        </p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: config.smtp?.from || '"JSBWorld Travel" <noreply@jsbworld-travel.com>',
    to: 'info@jsbworld-travel.com',
    subject: `New Booking: ${booking.bookingNumber} - ${statusLabel}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Booking notification sent to admin');
    return true;
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return false;
  }
};

export default {
  sendVerificationCode,
  sendCustomItineraryNotification,
  sendCustomItineraryConfirmation,
  sendBookingConfirmation,
  sendBookingPendingEmail,
  sendBookingNotificationToAdmin,
};
