import prisma from '../config/database.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// @desc    Create a new booking (or return existing pending one)
// @route   POST /api/bookings
// @access  Private
export const createBooking = asyncHandler(async (req, res) => {
  let {
    tourId,
    tourDateId,
    startDate,
    numberOfTravelers,
    adults,
    children,
    infants,
    flightOption = 'without',
    specialRequests,
    travelers,
    name,
    email,
    phone,
    selectedAddOns, // Array of { addOnId, quantity }
    isDepositPayment = false,
    depositAmount = null,
    remainingBalance = null,
  } = req.body;

  // 1. Calculate Number of Travelers if missing
  if (!numberOfTravelers) {
    numberOfTravelers = (parseInt(adults) || 1) + (parseInt(children) || 0);
  }

  // 2. Resolve Tour Date
  let tourDate;
  if (tourDateId) {
    tourDate = await prisma.tourDate.findUnique({ where: { id: tourDateId } });
    console.log("here it is",tourDate);
  } else if (startDate) {
    const dateObj = new Date(startDate);
    
    tourDate = await prisma.tourDate.findFirst({
      where: {
        tourId,
        startDate: {
          gte: new Date(dateObj.setHours(0,0,0,0)),
          lt: new Date(dateObj.setHours(23,59,59,999))
        }
      }
    });
  }

  const tour = await prisma.tour.findUnique({ where: { id: tourId } });

  if (!tour) {
    return res.status(404).json({
      success: false,
      message: 'Tour not found',
    });
  }

  if (!tourDate) {
     return res.status(404).json({
      success: false,
      message: `No available tour date found for ${startDate}`,
    });
  }

  // ========== CHECK FOR EXISTING PENDING BOOKING ==========
  // This makes the booking flow idempotent - retries won't create duplicates
  const existingBooking = await prisma.booking.findFirst({
    where: {
      userId: req.user.id,
      tourId: tourId,
      tourDateId: tourDate.id,
      status: {
        in: ['PENDING', 'CONFIRMED'], // Don't create new if pending or already confirmed
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
      addOns: {
        include: {
          addOn: true,
        },
      },
      payment: true,
    },
  });

  // If there's an existing CONFIRMED booking, return error
  if (existingBooking && existingBooking.status === 'CONFIRMED') {
    return res.status(400).json({
      success: false,
      message: 'You already have a confirmed booking for this tour date',
      data: { booking: existingBooking },
    });
  }

  // If there's an existing PENDING booking, update deposit settings and return it
  if (existingBooking && existingBooking.status === 'PENDING') {
    console.log('Found existing pending booking:', existingBooking.bookingNumber);
    
    // Update the booking with the new deposit settings (user may have changed their choice)
    const updatedBooking = await prisma.booking.update({
      where: { id: existingBooking.id },
      data: {
        isDepositPayment: isDepositPayment || false,
        depositAmount: isDepositPayment && depositAmount ? parseFloat(depositAmount) : null,
        remainingBalance: isDepositPayment && remainingBalance ? parseFloat(remainingBalance) : null,
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
        addOns: {
          include: {
            addOn: true,
          },
        },
        payment: true,
      },
    });
    
    console.log('Updated existing booking with deposit settings - isDepositPayment:', isDepositPayment);
    return res.status(200).json({
      success: true,
      message: 'Existing pending booking updated',
      data: { booking: updatedBooking, isExisting: true },
    });
  }
  
  // 3. Check availability
  const availableSeats = tourDate.availableSlots - tourDate.bookedSlots;
  if (availableSeats < numberOfTravelers) {
    return res.status(400).json({
      success: false,
      message: `Only ${availableSeats} seats available on this date, please select another date`,
    });
  }

  // 4. Calculate add-ons total if any
  let addOnsTotal = 0;
  let addOnsData = [];
  
  if (selectedAddOns && selectedAddOns.length > 0) {
    // Fetch all selected add-ons from database
    const addOnIds = selectedAddOns.map(ao => ao.addOnId);
    const addOns = await prisma.tourAddOn.findMany({
      where: {
        id: { in: addOnIds },
        tourId: tourId,
        isActive: true,
      },
    });

    // Calculate total and prepare data
    for (const selected of selectedAddOns) {
      const addOn = addOns.find(a => a.id === selected.addOnId);
      if (addOn) {
        const quantity = parseInt(selected.quantity) || 1;
        const price = parseFloat(addOn.price) * quantity;
        addOnsTotal += price;
        addOnsData.push({
          addOnId: addOn.id,
          quantity: quantity,
          price: price,
        });
      }
    }
  }

  // 5. Calculate total price (base + add-ons)
  const basePrice = parseFloat(tour.price) * numberOfTravelers;
  const totalPrice = basePrice + addOnsTotal;

  // 6. Build Travelers Array if missing
  if (!travelers || travelers.length === 0) {
    travelers = [{
        fullName: name || req.user.name,
        age: 30,
        gender: 'Not Specified',
    }];
  }

  // Generate booking number
  const bookingNumber = `BK${Date.now()}${Math.floor(Math.random() * 1000)}`;

  // Create booking without transaction to avoid deadlocks with remote DB
  // Step 1: Create the booking
  const newBooking = await prisma.booking.create({
    data: {
      bookingNumber,
      userId: req.user.id,
      tourId,
      tourDateId: tourDate.id,
      numberOfTravelers,
      adultsCount: parseInt(adults) || 1,
      childrenCount: parseInt(children) || 0,
      infantsCount: parseInt(infants) || 0,
      flightOption: flightOption || 'without',
      totalPrice,
      isDepositPayment: isDepositPayment || false,
      depositAmount: isDepositPayment && depositAmount ? parseFloat(depositAmount) : null,
      remainingBalance: isDepositPayment && remainingBalance ? parseFloat(remainingBalance) : null,
      addOnsTotal: addOnsTotal > 0 ? addOnsTotal : null,
      specialRequests,
      status: 'PENDING',
      travelers: {
        create: travelers.map(traveler => ({
          travelerType: traveler.type || 'adult',
          fullName: traveler.fullName || 'Guest',
          dateOfBirth: traveler.dateOfBirth ? new Date(traveler.dateOfBirth) : null,
          age: traveler.age || null,
          gender: traveler.gender || null,
          nationality: traveler.nationality || null,
          passportNumber: traveler.passportNumber || null,
          passportExpiry: traveler.passportExpiry ? new Date(traveler.passportExpiry) : null,
          email: traveler.email || null,
          phone: traveler.phone || null,
          dietaryRequirements: traveler.dietaryRequirements || null,
        })),
      },
      // Create add-on records if any
      ...(addOnsData.length > 0 && {
        addOns: {
          create: addOnsData,
        },
      }),
    },
  });

  // Step 2: Update tour date booked slots separately
  await prisma.tourDate.update({
    where: { id: tourDate.id },
    data: {
      bookedSlots: { increment: numberOfTravelers },
      status: tourDate.availableSlots - tourDate.bookedSlots - numberOfTravelers <= 0
        ? 'FULL'
        : 'AVAILABLE',
    },
  });

  // Step 3: Fetch the complete booking with all relations
  const booking = await prisma.booking.findUnique({
    where: { id: newBooking.id },
    include: {
      tour: {
        include: {
          category: true,
          images: { take: 1 },
        },
      },
      tourDate: true,
      travelers: true,
      addOns: {
        include: {
          addOn: true,
        },
      },
    },
  });

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: { booking, isExisting: false },
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
