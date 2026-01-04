import prisma from '../config/database.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// ========== Dashboard Stats ==========
export const getAdminDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalTours,
    publishedTours,
    draftTours,
    totalBookings,
    pendingBookings,
    confirmedBookings,
    totalRevenue,
    recentBookings,
  ] = await Promise.all([
    prisma.tour.count({ where: { deletedAt: null } }),
    prisma.tour.count({ where: { status: 'PUBLISHED', deletedAt: null } }),
    prisma.tour.count({ where: { status: 'DRAFT', deletedAt: null } }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.booking.count({ where: { status: 'CONFIRMED' } }),
    prisma.payment.aggregate({
      where: { paymentStatus: 'COMPLETED' },
      _sum: { amount: true },
    }),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        tour: { select: { title: true } },
      },
    }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      tours: {
        total: totalTours,
        published: publishedTours,
        draft: draftTours,
      },
      bookings: {
        total: totalBookings,
        pending: pendingBookings,
        confirmed: confirmedBookings,
      },
      revenue: {
        total: totalRevenue._sum.amount || 0,
      },
      recentBookings,
    },
  });
});

// ========== Bookings ==========
export const getAllBookings = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 50 } = req.query;
  
  const where = {};
  if (status && status !== 'all') {
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
        user: { select: { id: true, name: true, email: true, phone: true } },
        tour: { select: { id: true, title: true, location: true } },
        tourDate: { select: { startDate: true, endDate: true } },
        travelers: true,
        payment: { select: { paymentMethod: true, paymentStatus: true, amount: true } },
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
      },
    },
  });
});

// ========== Tour CRUD Operations ==========

// Get all tours for admin (includes all statuses)
export const getAdminTours = asyncHandler(async (req, res) => {
  const {
    status,
    category,
    search,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    order = 'desc',
  } = req.query;

  const where = {
    deletedAt: null,
  };

  if (status && status !== 'all') {
    where.status = status.toUpperCase();
  }

  if (category && category !== 'all') {
    const categoryRecord = await prisma.category.findFirst({
      where: { slug: category },
    });
    if (categoryRecord) {
      where.categoryId = categoryRecord.id;
    }
  }

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { location: { contains: search } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const [tours, totalCount] = await Promise.all([
    prisma.tour.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy]: order },
      include: {
        category: true,
        images: {
          orderBy: { displayOrder: 'asc' },
          take: 1,
        },
        _count: {
          select: { 
            reviews: true,
            bookings: true,
            dates: true,
          },
        },
      },
    }),
    prisma.tour.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      tours,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / take),
        totalCount,
        limit: take,
      },
    },
  });
});

// Get single tour by ID with all related data for editing
export const getAdminTourById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tour = await prisma.tour.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      category: true,
      images: {
        orderBy: { displayOrder: 'asc' },
      },
      highlights: {
        orderBy: { displayOrder: 'asc' },
      },
      inclusions: {
        orderBy: { displayOrder: 'asc' },
      },
      itinerary: {
        orderBy: { dayNumber: 'asc' },
      },
      dates: {
        orderBy: { startDate: 'asc' },
      },
      addOns: {
        orderBy: { displayOrder: 'asc' },
      },
      _count: {
        select: {
          reviews: true,
          bookings: true,
        },
      },
    },
  });

  if (!tour) {
    return res.status(404).json({
      success: false,
      message: 'Tour not found',
    });
  }

  res.status(200).json({
    success: true,
    data: { tour },
  });
});

// Create new tour
export const createAdminTour = asyncHandler(async (req, res) => {
  const {
    title,
    categoryId,
    location,
    price,
    depositFee,
    duration,
    maxGroupSize,
    difficulty,
    featuredImage,
    description,
    status = 'DRAFT',
    images,
    highlights,
    inclusions,
    exclusions,
    itinerary,
    dates,
  } = req.body;

  // Generate slug from title
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Check if slug already exists and make it unique
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.tour.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const tour = await prisma.tour.create({
    data: {
      title,
      slug,
      categoryId,
      location,
      price: parseFloat(price),
      duration: parseInt(duration),
      maxGroupSize: parseInt(maxGroupSize),
      difficulty: difficulty.toUpperCase(),
      featuredImage: featuredImage || '',
      description,
      depositFee: depositFee ? parseFloat(depositFee) : null,
      status: status.toUpperCase(),
      createdById: req.user.id,
      images: {
        create: images?.map((img, index) => ({
          imageUrl: img.url || img.imageUrl,
          altText: img.alt || img.altText || title,
          displayOrder: index,
        })) || [],
      },
      highlights: {
        create: highlights?.map((h, index) => ({
          highlight: typeof h === 'string' ? h : h.highlight,
          displayOrder: index,
        })) || [],
      },
      inclusions: {
        create: [
          ...(inclusions?.map((item, index) => ({
            item: typeof item === 'string' ? item : item.item,
            type: 'INCLUDED',
            displayOrder: index,
          })) || []),
          ...(exclusions?.map((item, index) => ({
            item: typeof item === 'string' ? item : item.item,
            type: 'EXCLUDED',
            displayOrder: (inclusions?.length || 0) + index,
          })) || []),
        ],
      },
      itinerary: {
        create: itinerary?.map((day, index) => ({
          dayNumber: day.dayNumber || index + 1,
          title: day.title,
          description: day.description,
          imageUrl: day.imageUrl || null,
          displayOrder: index,
        })) || [],
      },
      dates: {
        create: dates?.map(date => ({
          startDate: new Date(date.startDate),
          endDate: date.endDate ? new Date(date.endDate) : new Date(new Date(date.startDate).getTime() + parseInt(duration) * 24 * 60 * 60 * 1000),
          availableSlots: parseInt(date.availableSlots) || parseInt(maxGroupSize),
          priceWithoutFlight: parseFloat(date.priceWithoutFlight) || parseFloat(price),
          priceWithFlight: parseFloat(date.priceWithFlight) || parseFloat(price),
          earlyBirdPriceWithout: date.earlyBirdPriceWithout ? parseFloat(date.earlyBirdPriceWithout) : null,
          earlyBirdPriceWith: date.earlyBirdPriceWith ? parseFloat(date.earlyBirdPriceWith) : null,
          earlyBirdDeadline: date.earlyBirdDeadline ? new Date(date.earlyBirdDeadline) : null,
          childPriceWithout: parseFloat(date.childPriceWithout) || parseFloat(price) * 0.7,
          childPriceWithFlight: parseFloat(date.childPriceWithFlight) || parseFloat(price) * 0.7,
          singleSupplement: parseFloat(date.singleSupplement) || 0,
          status: 'AVAILABLE',
        })) || [],
      },
    },
    include: {
      category: true,
      images: true,
      highlights: true,
      inclusions: true,
      itinerary: true,
      dates: true,
    },
  });

  res.status(201).json({
    success: true,
    message: 'Tour created successfully',
    data: { tour },
  });
});

// Update tour
export const updateAdminTour = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    categoryId,
    location,
    price,
    depositFee,
    duration,
    maxGroupSize,
    difficulty,
    featuredImage,
    description,
    status,
  } = req.body;

  const existingTour = await prisma.tour.findUnique({
    where: { id },
  });

  if (!existingTour) {
    return res.status(404).json({
      success: false,
      message: 'Tour not found',
    });
  }

  // Build update data
  const updateData = {};
  
  if (title !== undefined) {
    updateData.title = title;
    // Update slug if title changed
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Check if new slug already exists (excluding current tour)
    const existingSlug = await prisma.tour.findFirst({
      where: { slug: baseSlug, id: { not: id } },
    });
    
    if (!existingSlug) {
      updateData.slug = baseSlug;
    }
  }
  
  if (categoryId !== undefined) updateData.categoryId = categoryId;
  if (location !== undefined) updateData.location = location;
  if (price !== undefined) updateData.price = parseFloat(price);
  if (duration !== undefined) updateData.duration = parseInt(duration);
  if (maxGroupSize !== undefined) updateData.maxGroupSize = parseInt(maxGroupSize);
  if (difficulty !== undefined) updateData.difficulty = difficulty.toUpperCase();
  if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
  if (description !== undefined) updateData.description = description;
  if (depositFee !== undefined) updateData.depositFee = depositFee ? parseFloat(depositFee) : null;
  if (status !== undefined) updateData.status = status.toUpperCase();

  const tour = await prisma.tour.update({
    where: { id },
    data: updateData,
    include: {
      category: true,
      images: true,
      highlights: true,
      inclusions: true,
      itinerary: true,
      dates: true,
    },
  });

  res.status(200).json({
    success: true,
    message: 'Tour updated successfully',
    data: { tour },
  });
});

// Delete tour (soft delete)
export const deleteAdminTour = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tour = await prisma.tour.findUnique({
    where: { id },
  });

  if (!tour) {
    return res.status(404).json({
      success: false,
      message: 'Tour not found',
    });
  }

  await prisma.tour.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      status: 'ARCHIVED',
    },
  });

  res.status(200).json({
    success: true,
    message: 'Tour deleted successfully',
  });
});

// ========== Tour Dates ==========

export const getTourDates = asyncHandler(async (req, res) => {
  const { tourId } = req.params;

  const dates = await prisma.tourDate.findMany({
    where: { tourId },
    orderBy: { startDate: 'asc' },
  });

  res.status(200).json({
    success: true,
    data: { dates },
  });
});

export const createTourDate = asyncHandler(async (req, res) => {
  const { tourId } = req.params;
  const {
    startDate,
    endDate,
    availableSlots,
    priceWithoutFlight,
    priceWithFlight,
    earlyBirdPriceWithout,
    earlyBirdPriceWith,
    earlyBirdDeadline,
    childPriceWithout,
    childPriceWithFlight,
    singleSupplement,
  } = req.body;

  // Verify tour exists
  const tour = await prisma.tour.findUnique({
    where: { id: tourId },
  });

  if (!tour) {
    return res.status(404).json({
      success: false,
      message: 'Tour not found',
    });
  }

  const date = await prisma.tourDate.create({
    data: {
      tourId,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : new Date(new Date(startDate).getTime() + tour.duration * 24 * 60 * 60 * 1000),
      availableSlots: parseInt(availableSlots),
      priceWithoutFlight: parseFloat(priceWithoutFlight),
      priceWithFlight: parseFloat(priceWithFlight),
      earlyBirdPriceWithout: earlyBirdPriceWithout ? parseFloat(earlyBirdPriceWithout) : null,
      earlyBirdPriceWith: earlyBirdPriceWith ? parseFloat(earlyBirdPriceWith) : null,
      earlyBirdDeadline: earlyBirdDeadline ? new Date(earlyBirdDeadline) : null,
      childPriceWithout: parseFloat(childPriceWithout),
      childPriceWithFlight: parseFloat(childPriceWithFlight),
      singleSupplement: singleSupplement ? parseFloat(singleSupplement) : 0,
      status: 'AVAILABLE',
    },
  });

  res.status(201).json({
    success: true,
    message: 'Tour date created successfully',
    data: { date },
  });
});

export const updateTourDate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const existingDate = await prisma.tourDate.findUnique({
    where: { id },
  });

  if (!existingDate) {
    return res.status(404).json({
      success: false,
      message: 'Tour date not found',
    });
  }

  // Parse numeric values
  const parsedData = {};
  if (updateData.startDate) parsedData.startDate = new Date(updateData.startDate);
  if (updateData.endDate) parsedData.endDate = new Date(updateData.endDate);
  if (updateData.availableSlots !== undefined) parsedData.availableSlots = parseInt(updateData.availableSlots);
  if (updateData.priceWithoutFlight !== undefined) parsedData.priceWithoutFlight = parseFloat(updateData.priceWithoutFlight);
  if (updateData.priceWithFlight !== undefined) parsedData.priceWithFlight = parseFloat(updateData.priceWithFlight);
  if (updateData.earlyBirdPriceWithout !== undefined) parsedData.earlyBirdPriceWithout = updateData.earlyBirdPriceWithout ? parseFloat(updateData.earlyBirdPriceWithout) : null;
  if (updateData.earlyBirdPriceWith !== undefined) parsedData.earlyBirdPriceWith = updateData.earlyBirdPriceWith ? parseFloat(updateData.earlyBirdPriceWith) : null;
  if (updateData.earlyBirdDeadline !== undefined) parsedData.earlyBirdDeadline = updateData.earlyBirdDeadline ? new Date(updateData.earlyBirdDeadline) : null;
  if (updateData.childPriceWithout !== undefined) parsedData.childPriceWithout = parseFloat(updateData.childPriceWithout);
  if (updateData.childPriceWithFlight !== undefined) parsedData.childPriceWithFlight = parseFloat(updateData.childPriceWithFlight);
  if (updateData.singleSupplement !== undefined) parsedData.singleSupplement = parseFloat(updateData.singleSupplement);
  if (updateData.status) parsedData.status = updateData.status;

  const date = await prisma.tourDate.update({
    where: { id },
    data: parsedData,
  });

  res.status(200).json({
    success: true,
    message: 'Tour date updated successfully',
    data: { date },
  });
});

export const deleteTourDate = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const existingDate = await prisma.tourDate.findUnique({
    where: { id },
  });

  if (!existingDate) {
    return res.status(404).json({
      success: false,
      message: 'Tour date not found',
    });
  }

  await prisma.tourDate.delete({
    where: { id },
  });

  res.status(200).json({
    success: true,
    message: 'Tour date deleted successfully',
  });
});

// ========== Tour Itinerary ==========

export const updateTourItinerary = asyncHandler(async (req, res) => {
  const { tourId } = req.params;
  const { itinerary } = req.body;

  // Verify tour exists
  const tour = await prisma.tour.findUnique({
    where: { id: tourId },
  });

  if (!tour) {
    return res.status(404).json({
      success: false,
      message: 'Tour not found',
    });
  }

  // Delete existing itinerary and recreate
  await prisma.tourItinerary.deleteMany({
    where: { tourId },
  });

  const createdItinerary = await prisma.tourItinerary.createMany({
    data: itinerary.map((day, index) => ({
      tourId,
      dayNumber: day.dayNumber || index + 1,
      title: day.title,
      description: day.description,
      imageUrl: day.imageUrl || null,
      displayOrder: index,
    })),
  });

  const updatedItinerary = await prisma.tourItinerary.findMany({
    where: { tourId },
    orderBy: { dayNumber: 'asc' },
  });

  res.status(200).json({
    success: true,
    message: 'Itinerary updated successfully',
    data: { itinerary: updatedItinerary },
  });
});

export const deleteTourItineraryItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.tourItinerary.delete({
    where: { id },
  });

  res.status(200).json({
    success: true,
    message: 'Itinerary item deleted successfully',
  });
});

// ========== Tour Images ==========

export const updateTourImages = asyncHandler(async (req, res) => {
  const { tourId } = req.params;
  const { images } = req.body;

  // Verify tour exists
  const tour = await prisma.tour.findUnique({
    where: { id: tourId },
  });

  if (!tour) {
    return res.status(404).json({
      success: false,
      message: 'Tour not found',
    });
  }

  // Delete existing images and recreate
  await prisma.tourImage.deleteMany({
    where: { tourId },
  });

  await prisma.tourImage.createMany({
    data: images.map((img, index) => ({
      tourId,
      imageUrl: img.url || img.imageUrl,
      altText: img.alt || img.altText || tour.title,
      displayOrder: index,
    })),
  });

  const updatedImages = await prisma.tourImage.findMany({
    where: { tourId },
    orderBy: { displayOrder: 'asc' },
  });

  res.status(200).json({
    success: true,
    message: 'Images updated successfully',
    data: { images: updatedImages },
  });
});

// ========== Tour Highlights ==========

export const updateTourHighlights = asyncHandler(async (req, res) => {
  const { tourId } = req.params;
  const { highlights } = req.body;

  // Verify tour exists
  const tour = await prisma.tour.findUnique({
    where: { id: tourId },
  });

  if (!tour) {
    return res.status(404).json({
      success: false,
      message: 'Tour not found',
    });
  }

  // Delete existing highlights and recreate
  await prisma.tourHighlight.deleteMany({
    where: { tourId },
  });

  await prisma.tourHighlight.createMany({
    data: highlights.map((h, index) => ({
      tourId,
      highlight: typeof h === 'string' ? h : h.highlight,
      displayOrder: index,
    })),
  });

  const updatedHighlights = await prisma.tourHighlight.findMany({
    where: { tourId },
    orderBy: { displayOrder: 'asc' },
  });

  res.status(200).json({
    success: true,
    message: 'Highlights updated successfully',
    data: { highlights: updatedHighlights },
  });
});

// ========== Tour Inclusions ==========

export const updateTourInclusions = asyncHandler(async (req, res) => {
  const { tourId } = req.params;
  const { inclusions, exclusions } = req.body;

  // Verify tour exists
  const tour = await prisma.tour.findUnique({
    where: { id: tourId },
  });

  if (!tour) {
    return res.status(404).json({
      success: false,
      message: 'Tour not found',
    });
  }

  // Delete existing inclusions and recreate
  await prisma.tourInclusion.deleteMany({
    where: { tourId },
  });

  const allInclusions = [
    ...(inclusions?.map((item, index) => ({
      tourId,
      item: typeof item === 'string' ? item : item.item,
      type: 'INCLUDED',
      displayOrder: index,
    })) || []),
    ...(exclusions?.map((item, index) => ({
      tourId,
      item: typeof item === 'string' ? item : item.item,
      type: 'EXCLUDED',
      displayOrder: (inclusions?.length || 0) + index,
    })) || []),
  ];

  await prisma.tourInclusion.createMany({
    data: allInclusions,
  });

  const updatedInclusions = await prisma.tourInclusion.findMany({
    where: { tourId },
    orderBy: { displayOrder: 'asc' },
  });

  res.status(200).json({
    success: true,
    message: 'Inclusions updated successfully',
    data: { inclusions: updatedInclusions },
  });
});

// ========== Tour Add-ons ==========
export const updateTourAddOns = asyncHandler(async (req, res) => {
  const { tourId } = req.params;
  const { addOns } = req.body;

  // Verify tour exists
  const tour = await prisma.tour.findUnique({
    where: { id: tourId },
  });

  if (!tour) {
    return res.status(404).json({
      success: false,
      message: 'Tour not found',
    });
  }

  // Get existing add-ons to determine which to delete
  const existingAddOns = await prisma.tourAddOn.findMany({
    where: { tourId },
  });

  const existingIds = existingAddOns.map(a => a.id);
  const incomingIds = addOns.filter(a => a.id).map(a => a.id);
  
  // Delete add-ons that are no longer in the list
  const toDelete = existingIds.filter(id => !incomingIds.includes(id));
  if (toDelete.length > 0) {
    await prisma.tourAddOn.deleteMany({
      where: { id: { in: toDelete } },
    });
  }

  // Upsert each add-on
  for (const addOn of addOns) {
    if (addOn.id && existingIds.includes(addOn.id)) {
      // Update existing
      await prisma.tourAddOn.update({
        where: { id: addOn.id },
        data: {
          name: addOn.name,
          description: addOn.description,
          price: parseFloat(addOn.price) || 0,
          imageUrl: addOn.imageUrl,
          displayOrder: addOn.displayOrder || 0,
          isActive: addOn.isActive !== false,
        },
      });
    } else {
      // Create new
      await prisma.tourAddOn.create({
        data: {
          tourId,
          name: addOn.name,
          description: addOn.description,
          price: parseFloat(addOn.price) || 0,
          imageUrl: addOn.imageUrl,
          displayOrder: addOn.displayOrder || 0,
          isActive: addOn.isActive !== false,
        },
      });
    }
  }

  const updatedAddOns = await prisma.tourAddOn.findMany({
    where: { tourId },
    orderBy: { displayOrder: 'asc' },
  });

  res.status(200).json({
    success: true,
    message: 'Add-ons updated successfully',
    data: { addOns: updatedAddOns },
  });
});

// ========== Bank Transfer Management ==========

// Get pending bank transfers awaiting verification
export const getPendingBankTransfers = asyncHandler(async (req, res) => {
  const pendingPayments = await prisma.payment.findMany({
    where: {
      paymentMethod: 'BANK_TRANSFER',
      paymentStatus: 'AWAITING_VERIFICATION',
    },
    include: {
      booking: {
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          tour: {
            select: { id: true, title: true, featuredImage: true },
          },
          tourDate: true,
        },
      },
      user: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({
    success: true,
    data: { payments: pendingPayments },
  });
});

// Approve bank transfer
export const approveBankTransfer = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const payment = await prisma.payment.findUnique({
    where: { id },
    include: { booking: true },
  });

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment not found',
    });
  }

  if (payment.paymentStatus !== 'AWAITING_VERIFICATION') {
    return res.status(400).json({
      success: false,
      message: 'Payment is not awaiting verification',
    });
  }

  // Update payment and booking status
  await prisma.payment.update({
    where: { id },
    data: {
      paymentStatus: 'COMPLETED',
      paidAt: new Date(),
    },
  });

  await prisma.booking.update({
    where: { id: payment.bookingId },
    data: {
      status: 'CONFIRMED',
    },
  });

  // Create notification for user
  try {
    await prisma.notification.create({
      data: {
        userId: payment.userId,
        type: 'PAYMENT',
        title: 'Payment Approved',
        message: `Your bank transfer payment for booking ${payment.booking.bookingNumber} has been approved. Your booking is now confirmed!`,
      },
    });
  } catch (err) {
    console.error('Failed to create notification:', err);
  }

  res.status(200).json({
    success: true,
    message: 'Bank transfer approved. Booking is now confirmed.',
  });
});

// Reject bank transfer
export const rejectBankTransfer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const payment = await prisma.payment.findUnique({
    where: { id },
    include: { booking: true },
  });

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment not found',
    });
  }

  if (payment.paymentStatus !== 'AWAITING_VERIFICATION') {
    return res.status(400).json({
      success: false,
      message: 'Payment is not awaiting verification',
    });
  }

  // Update payment status
  await prisma.payment.update({
    where: { id },
    data: {
      paymentStatus: 'FAILED',
      metadata: {
        ...(payment.metadata || {}),
        rejectionReason: reason,
        rejectedAt: new Date().toISOString(),
        rejectedBy: req.user.id,
      },
    },
  });

  // Create notification for user
  try {
    await prisma.notification.create({
      data: {
        userId: payment.userId,
        type: 'PAYMENT',
        title: 'Payment Rejected',
        message: `Your bank transfer payment for booking ${payment.booking.bookingNumber} has been rejected. Reason: ${reason || 'No reason provided'}`,
      },
    });
  } catch (err) {
    console.error('Failed to create notification:', err);
  }

  res.status(200).json({
    success: true,
    message: 'Bank transfer rejected.',
  });
});
