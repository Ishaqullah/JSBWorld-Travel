import prisma from '../config/database.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = asyncHandler(async (req, res) => {
  const {
    tourId,
    tourDateId,
    numberOfTravelers,
    specialRequests,
    travelers,
  } = req.body;

  // Get tour and tour date
  const [tour, tourDate] = await Promise.all([
    prisma.tour.findUnique({ where: { id: tourId } }),
    prisma.tourDate.findUnique({ where: { id: tourDateId } }),
  ]);

  if (!tour || !tourDate) {
    return res.status(404).json({
      success: false,
      message: 'Tour or tour date not found',
    });
  }

  // Check if seats are available
  const availableSeats = tourDate.availableSlots - tourDate.bookedSlots;
  if (availableSeats < numberOfTravelers) {
    return res.status(400).json({
      success: false,
      message: `Only ${availableSeats} seats available`,
    });
  }

  // Calculate total price
  const totalPrice = tour.price * numberOfTravelers;

  // Generate booking number
  const bookingNumber = `BK${Date.now()}${Math.floor(Math.random() * 1000)}`;

  // Create booking
  const booking = await prisma.$transaction(async (tx) => {
    // Create booking
    const newBooking = await tx.booking.create({
      data: {
        bookingNumber,
        userId: req.user.id,
        tourId,
        tourDateId,
        numberOfTravelers,
        totalPrice,
        specialRequests,
        status: 'PENDING',
        travelers: {
          create: travelers?.map(traveler => ({
            fullName: traveler.fullName,
            age: traveler.age,
            gender: traveler.gender,
            passportNumber: traveler.passportNumber,
            dietaryRequirements: traveler.dietaryRequirements,
          })) || [],
        },
      },
      include: {
        tour: {
          include: {
            category: true,
            images: { take: 1 },
          },
        },
        tourDate: true,
        travelers: true,
      },
    });

    // Update tour date booked slots
    await tx.tourDate.update({
      where: { id: tourDateId },
      data: {
        bookedSlots: { increment: numberOfTravelers },
        status: tourDate.availableSlots - tourDate.bookedSlots - numberOfTravelers <= 0
          ? 'FULL'
          : 'AVAILABLE',
      },
    });

    return newBooking;
  });

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: { booking },
  });
});

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      tour: {
        include: {
          category: true,
          images: { take: 1 },
        },
      },
      tourDate: true,
      travelers: true,
      payment: true,
    },
  });

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found',
    });
  }

  // Check authorization
  if (booking.userId !== req.user.id && req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view this booking',
    });
  }

  res.status(200).json({
    success: true,
    data: { booking },
  });
});

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getMyBookings = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  const where = {
    userId: req.user.id,
  };

  if (status) {
    where.status = status.toUpperCase();
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const [bookings, totalCount] = await Promise.all([
    prisma.booking.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        tour: {
          include: {
            category: true,
            images: { take: 1 },
          },
        },
        tourDate: true,
        payment: true,
      },
    }),
    prisma.booking.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / take),
        totalCount,
        limit: take,
      },
    },
  });
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { cancellationReason } = req.body;

  const existingBooking = await prisma.booking.findUnique({
    where: { id },
    include: { tourDate: true },
  });

  if (!existingBooking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found',
    });
  }

  // Check authorization
  if (existingBooking.userId !== req.user.id && req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to cancel this booking',
    });
  }

  // Check if already cancelled
  if (existingBooking.status === 'CANCELLED') {
    return res.status(400).json({
      success: false,
      message: 'Booking is already cancelled',
    });
  }

  // Update booking and tour date
  const booking = await prisma.$transaction(async (tx) => {
    // Update booking
    const updatedBooking = await tx.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancellationReason,
      },
      include: {
        tour: true,
        tourDate: true,
      },
    });

    // Update tour date booked slots
    await tx.tourDate.update({
      where: { id: existingBooking.tourDateId },
      data: {
        bookedSlots: { decrement: existingBooking.numberOfTravelers },
        status: 'AVAILABLE',
      },
    });

    return updatedBooking;
  });

  res.status(200).json({
    success: true,
    message: 'Booking cancelled successfully',
    data: { booking },
  });
});

// @desc    Update booking status (Admin only)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const booking = await prisma.booking.update({
    where: { id },
    data: { status: status.toUpperCase() },
    include: {
      tour: true,
      tourDate: true,
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });

  res.status(200).json({
    success: true,
    message: 'Booking status updated successfully',
    data: { booking },
  });
});
