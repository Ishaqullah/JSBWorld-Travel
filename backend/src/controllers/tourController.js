import prisma from '../config/database.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// @desc    Get all tours with filters and pagination
// @route   GET /api/tours
// @access  Public
export const getAllTours = asyncHandler(async (req, res) => {
  const {
    category,
    minPrice,
    maxPrice,
    minRating,
    minDuration,
    maxDuration,
    difficulty,
    search,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    order = 'desc',
  } = req.query;

  // Build filter object
  const where = {
    status: 'PUBLISHED',
    deletedAt: null,
  };

  if (category && category !== 'all') {
    const categoryRecord = await prisma.category.findFirst({
      where: { slug: category },
    });
    if (categoryRecord) {
      where.categoryId = categoryRecord.id;
    }
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  if (minRating) {
    where.rating = { gte: parseFloat(minRating) };
  }

  if (minDuration || maxDuration) {
    where.duration = {};
    if (minDuration) where.duration.gte = parseInt(minDuration);
    if (maxDuration) where.duration.lte = parseInt(maxDuration);
  }

  if (difficulty) {
    where.difficulty = difficulty.toUpperCase();
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { location: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  // Get tours with related data
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
        addOns: {
          where: { isActive: true },
          select: { id: true, name: true, price: true },
        },
        _count: {
          select: { reviews: true },
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

// @desc    Get single tour by ID or slug
// @route   GET /api/tours/:identifier
// @access  Public
export const getTourById = asyncHandler(async (req, res) => {
  const { identifier } = req.params;

  // Try to find by ID first, then by slug
  const tour = await prisma.tour.findFirst({
    where: {
      OR: [{ id: identifier }, { slug: identifier }],
      status: 'PUBLISHED',
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
        where: {
          startDate: { gte: new Date() },
          status: 'AVAILABLE',
        },
        orderBy: { startDate: 'asc' },
      },
      addOns: {
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      },
      tourCategories: {
        orderBy: { displayOrder: 'asc' },
      },
      roomTypes: {
        orderBy: { displayOrder: 'asc' },
      },
      accommodations: {
        orderBy: { displayOrder: 'asc' },
        include: {
          images: {
            orderBy: { displayOrder: 'asc' },
          },
        },
      },
      reviews: {
        where: { status: 'APPROVED' },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          images: true,
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

  // Fetch related tours (same category, exclude current, limit 6)
  const relatedTours = await prisma.tour.findMany({
    where: {
      categoryId: tour.categoryId,
      id: { not: tour.id },
      status: 'PUBLISHED',
      deletedAt: null,
    },
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: {
      category: { select: { name: true, slug: true } },
      images: { orderBy: { displayOrder: 'asc' }, take: 1 },
    },
  });

  const tourWithRelated = {
    ...tour,
    relatedTours: relatedTours.map((t) => ({
      id: t.id,
      slug: t.slug,
      title: t.title,
      location: t.location,
      price: t.price,
      duration: t.duration,
      featuredImage: t.featuredImage,
      category: t.category,
      images: t.images,
    })),
  };

  res.status(200).json({
    success: true,
    data: { tour: tourWithRelated },
  });
});

// @desc    Create new tour
// @route   POST /api/tours
// @access  Private/Admin
export const createTour = asyncHandler(async (req, res) => {
  const {
    title,
    categoryId,
    location,
    price,
    duration,
    maxGroupSize,
    difficulty,
    featuredImage,
    description,
    images,
    highlights,
    inclusions,
    exclusions,
    itinerary,
    availableDates,
  } = req.body;

  // Generate slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Create tour with related data
  const tour = await prisma.tour.create({
    data: {
      title,
      slug,
      categoryId,
      location,
      price,
      duration,
      maxGroupSize,
      difficulty: difficulty.toUpperCase(),
      featuredImage,
      description,
      createdById: req.user.id,
      status: 'PUBLISHED',
      images: {
        create: images?.map((img, index) => ({
          imageUrl: img.url,
          altText: img.alt || title,
          displayOrder: index,
        })) || [],
      },
      highlights: {
        create: highlights?.map((h, index) => ({
          highlight: h,
          displayOrder: index,
        })) || [],
      },
      inclusions: {
        create: [
          ...(inclusions?.map((item, index) => ({
            item,
            type: 'INCLUDED',
            displayOrder: index,
          })) || []),
          ...(exclusions?.map((item, index) => ({
            item,
            type: 'EXCLUDED',
            displayOrder: inclusions?.length + index || index,
          })) || []),
        ],
      },
      itinerary: {
        create: itinerary?.map((day, index) => ({
          dayNumber: day.dayNumber || index + 1,
          title: day.title,
          description: day.description,
          displayOrder: index,
        })) || [],
      },
      dates: {
        create: availableDates?.map(date => ({
          startDate: new Date(date.startDate),
          endDate: new Date(new Date(date.startDate).getTime() + duration * 24 * 60 * 60 * 1000),
          availableSlots: date.availableSlots || maxGroupSize,
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

// @desc    Update tour
// @route   PUT /api/tours/:id
// @access  Private/Admin
export const updateTour = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Check if tour exists
  const existingTour = await prisma.tour.findUnique({
    where: { id },
  });

  if (!existingTour) {
    return res.status(404).json({
      success: false,
      message: 'Tour not found',
    });
  }

  // Update tour
  const tour = await prisma.tour.update({
    where: { id },
    data: {
      ...updateData,
      updatedAt: new Date(),
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

  res.status(200).json({
    success: true,
    message: 'Tour updated successfully',
    data: { tour },
  });
});

// @desc    Delete tour (soft delete)
// @route   DELETE /api/tours/:id
// @access  Private/Admin
export const deleteTour = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tour = await prisma.tour.update({
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
