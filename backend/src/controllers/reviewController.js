import prisma from '../config/database.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
export const createReview = asyncHandler(async (req, res) => {
  const { tourId, bookingId, rating, title, comment, images } = req.body;

  // Check if user has booked this tour
  let isVerified = false;
  if (bookingId) {
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId: req.user.id,
        tourId,
        status: 'COMPLETED',
      },
    });

    isVerified = !!booking;
  }

  // Check if user has already reviewed this tour
  const existingReview = await prisma.review.findFirst({
    where: {
      tourId,
      userId: req.user.id,
    },
  });

  if (existingReview) {
    return res.status(400).json({
      success: false,
      message: 'You have already reviewed this tour',
    });
  }

  // Create review
  const review = await prisma.review.create({
    data: {
      tourId,
      userId: req.user.id,
      bookingId: bookingId || null,
      rating,
      title,
      comment,
      isVerified,
      status: 'PENDING',
      images: {
        create: images?.map(imageUrl => ({ imageUrl })) || [],
      },
    },
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
  });

  // Update tour rating (will be recalculated when review is approved)
  // For now, we'll keep reviews in pending status

  res.status(201).json({
    success: true,
    message: 'Review submitted successfully and is pending approval',
    data: { review },
  });
});

// @desc    Get reviews for a tour
// @route   GET /api/reviews/tour/:tourId
// @access  Public
export const getTourReviews = asyncHandler(async (req, res) => {
  const { tourId } = req.params;
  const { page = 1, limit = 10, rating } = req.query;

  const where = {
    tourId,
    status: 'APPROVED',
  };

  if (rating) {
    where.rating = parseInt(rating);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const [reviews, totalCount] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
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
    }),
    prisma.review.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / take),
        totalCount,
        limit: take,
      },
    },
  });
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, title, comment } = req.body;

  const existingReview = await prisma.review.findUnique({
    where: { id },
  });

  if (!existingReview) {
    return res.status(404).json({
      success: false,
      message: 'Review not found',
    });
  }

  // Check authorization
  if (existingReview.userId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this review',
    });
  }

  const review = await prisma.review.update({
    where: { id },
    data: {
      rating,
      title,
      comment,
      status: 'PENDING', // Reset to pending after edit
    },
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
  });

  res.status(200).json({
    success: true,
    message: 'Review updated successfully',
    data: { review },
  });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const review = await prisma.review.findUnique({
    where: { id },
  });

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found',
    });
  }

  // Check authorization
  if (review.userId !== req.user.id && req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this review',
    });
  }

  await prisma.review.delete({
    where: { id },
  });

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully',
  });
});

// @desc    Approve review (Admin only)
// @route   PUT /api/reviews/:id/approve
// @access  Private/Admin
export const approveReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const review = await prisma.review.findUnique({
    where: { id },
    include: { tour: true },
  });

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found',
    });
  }

  // Update review status and recalculate tour rating
  await prisma.$transaction(async (tx) => {
    // Approve review
    await tx.review.update({
      where: { id },
      data: { status: 'APPROVED' },
    });

    // Recalculate tour rating
    const approvedReviews = await tx.review.findMany({
      where: {
        tourId: review.tourId,
        status: 'APPROVED',
      },
      select: { rating: true },
    });

    const totalRating = approvedReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = approvedReviews.length > 0
      ? totalRating / approvedReviews.length
      : 0;

    await tx.tour.update({
      where: { id: review.tourId },
      data: {
        rating: averageRating,
        reviewCount: approvedReviews.length,
      },
    });
  });

  res.status(200).json({
    success: true,
    message: 'Review approved successfully',
  });
});

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
export const markReviewHelpful = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const review = await prisma.review.update({
    where: { id },
    data: {
      helpfulCount: { increment: 1 },
    },
  });

  res.status(200).json({
    success: true,
    message: 'Review marked as helpful',
    data: { review },
  });
});
