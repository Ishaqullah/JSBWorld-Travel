import prisma from '../config/database.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import {
  sendHajjRegistrationNotification,
  sendHajjRegistrationConfirmation
} from '../services/emailService.js';

// @desc    Create a new Hajj pre-registration
// @route   POST /api/hajj-registration
// @access  Public
export const createHajjRegistration = asyncHandler(async (req, res) => {
  const {
    // Step 1: Contact Information
    package: selectedPackage,
    name,
    phone,
    email,
    streetAddress,
    addressLine2,
    postalCode,
    country,
    state,
    city,
    referralSource,
    teamMember,
    // Step 2: Travel Details
    roomType,
    preferredGateway,
    hajjBefore,
    lastHajjYear,
    manasikCamp,
    // Step 3: Travelers
    travelers,
    // Step 4: Finalize
    dietaryRestrictions,
    physicalDisabilities,
    travelingAlone,
    over65Alone,
    profession,
    firstLanguage,
    localMasjid,
    additionalNotes,
    documentUrls,
  } = req.body;

  // Validate required fields
  if (!selectedPackage || !name || !phone || !email || !country) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields: package, name, phone, email, and country',
    });
  }

  // Create the Hajj registration record with travelers
  const registration = await prisma.hajjRegistration.create({
    data: {
      package: selectedPackage,
      name,
      phone,
      email,
      streetAddress,
      addressLine2,
      postalCode,
      country,
      state,
      city,
      referralSource,
      teamMember,
      roomType,
      preferredGateway,
      hajjBefore: hajjBefore || false,
      lastHajjYear: lastHajjYear ? parseInt(lastHajjYear) : null,
      manasikCamp,
      dietaryRestrictions: dietaryRestrictions || false,
      physicalDisabilities: physicalDisabilities || false,
      travelingAlone: travelingAlone || false,
      over65Alone: over65Alone || false,
      profession,
      firstLanguage,
      localMasjid,
      additionalNotes,
      documentUrls: documentUrls ? JSON.stringify(documentUrls) : null,
      status: 'PENDING',
      travelers: {
        create: (travelers || []).map(traveler => ({
          firstName: traveler.firstName || '',
          middleName: traveler.middleName || null,
          lastName: traveler.lastName || '',
          dateOfBirth: traveler.dateOfBirth ? new Date(traveler.dateOfBirth) : null,
          gender: traveler.gender || null,
          email: traveler.email || null,
          passportNumber: traveler.passportNumber || null,
          passportIssueDate: traveler.passportIssueDate ? new Date(traveler.passportIssueDate) : null,
          passportExpiryDate: traveler.passportExpiryDate ? new Date(traveler.passportExpiryDate) : null,
        })),
      },
    },
    include: {
      travelers: true,
    },
  });

  // Send notification email to company
  const companyNotificationSent = await sendHajjRegistrationNotification(registration);

  // Send confirmation email to customer
  const customerConfirmationSent = await sendHajjRegistrationConfirmation(registration);

  res.status(201).json({
    success: true,
    message: 'Your Hajj pre-registration has been submitted successfully!',
    data: {
      id: registration.id,
      emailsSent: {
        companyNotification: companyNotificationSent,
        customerConfirmation: customerConfirmationSent,
      },
    },
  });
});
