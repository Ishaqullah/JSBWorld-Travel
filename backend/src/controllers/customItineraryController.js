import prisma from '../config/database.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import { 
  sendCustomItineraryNotification, 
  sendCustomItineraryConfirmation 
} from '../services/emailService.js';

// @desc    Create a new custom itinerary request
// @route   POST /api/custom-itinerary
// @access  Public
export const createCustomItinerary = asyncHandler(async (req, res) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    destination,
    travelDates,
    numberOfTravelers,
    budget,
    preferences,
    specialRequests,
  } = req.body;

  // Validate required fields
  if (!customerName || !customerEmail || !destination || !travelDates || !numberOfTravelers) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields: name, email, destination, travel dates, and number of travelers',
    });
  }

  // Create the custom itinerary record
  const customItinerary = await prisma.customItinerary.create({
    data: {
      customerName,
      customerEmail,
      customerPhone,
      destination,
      travelDates,
      numberOfTravelers: parseInt(numberOfTravelers),
      budget,
      preferences,
      specialRequests,
      status: 'PENDING',
    },
  });

  // Send notification email to company
  const companyNotificationSent = await sendCustomItineraryNotification(customItinerary);
  
  // Send confirmation email to customer
  const customerConfirmationSent = await sendCustomItineraryConfirmation(customItinerary);

  res.status(201).json({
    success: true,
    message: 'Your custom itinerary request has been submitted successfully!',
    data: {
      id: customItinerary.id,
      emailsSent: {
        companyNotification: companyNotificationSent,
        customerConfirmation: customerConfirmationSent,
      },
    },
  });
});

// @desc    Get all custom itinerary requests (Admin)
// @route   GET /api/custom-itinerary
// @access  Private/Admin
export const getCustomItineraries = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  const where = {};
  if (status) {
    where.status = status.toUpperCase();
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const [itineraries, totalCount] = await Promise.all([
    prisma.customItinerary.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.customItinerary.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      itineraries,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / take),
        totalCount,
        limit: take,
      },
    },
  });
});

// @desc    Get single custom itinerary request (Admin)
// @route   GET /api/custom-itinerary/:id
// @access  Private/Admin
export const getCustomItineraryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const itinerary = await prisma.customItinerary.findUnique({
    where: { id },
  });

  if (!itinerary) {
    return res.status(404).json({
      success: false,
      message: 'Custom itinerary request not found',
    });
  }

  res.status(200).json({
    success: true,
    data: { itinerary },
  });
});

// @desc    Update custom itinerary status (Admin)
// @route   PUT /api/custom-itinerary/:id
// @access  Private/Admin
export const updateItineraryStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
  if (!validStatuses.includes(status?.toUpperCase())) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
    });
  }

  const itinerary = await prisma.customItinerary.update({
    where: { id },
    data: { status: status.toUpperCase() },
  });

  res.status(200).json({
    success: true,
    message: 'Status updated successfully',
    data: { itinerary },
  });
});
