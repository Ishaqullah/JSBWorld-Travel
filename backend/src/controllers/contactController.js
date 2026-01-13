import { sendContactFormMessage } from '../services/emailService.js';

/**
 * Handle contact form submission
 */
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (name, email, subject, message).',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    // Send email
    const emailSent = await sendContactFormMessage({
      name,
      email,
      phone,
      subject,
      message,
    });

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send message. Please try again later.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while sending your message.',
    });
  }
};

export default {
  submitContactForm,
};
