import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      phone: true,
      role: true,
      isVerified: true,
      createdAt: true,
    },
  });

  res.status(200).json({
    success: true,
    data: { user },
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatarUrl } = req.body;

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      ...(name && { name }),
      ...(phone && { phone }),
      ...(avatarUrl && { avatarUrl }),
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      phone: true,
      role: true,
      isVerified: true,
      createdAt: true,
    },
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: { user },
  });
});

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  // Verify current password
  const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect',
    });
  }

  // Hash new password
  const newPasswordHash = await bcrypt.hash(newPassword, 12);

  // Update password
  await prisma.user.update({
    where: { id: req.user.id },
    data: { passwordHash: newPasswordHash },
  });

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
export const getUserWishlist = asyncHandler(async (req, res) => {
  const wishlists = await prisma.wishlist.findMany({
    where: { userId: req.user.id },
    include: {
      tour: {
        include: {
          category: true,
          images: {
            orderBy: { displayOrder: 'asc' },
            take: 1,
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const tours = wishlists.map(w => w.tour);

  res.status(200).json({
    success: true,
    data: { tours },
  });
});

// @desc    Add tour to wishlist
// @route   POST /api/users/wishlist/:tourId
// @access  Private
export const addToWishlist = asyncHandler(async (req, res) => {
  const { tourId } = req.params;

  // Check if tour exists
  const tour = await prisma.tour.findUnique({
    where: { id: tourId },
  });

  if (!tour) {
    return res.status(404).json({
      success: false,
      message: 'Tour not found',
    });
  }

  // Check if already in wishlist
  const existingWishlist = await prisma.wishlist.findUnique({
    where: {
      userId_tourId: {
        userId: req.user.id,
        tourId,
      },
    },
  });

  if (existingWishlist) {
    return res.status(400).json({
      success: false,
      message: 'Tour is already in wishlist',
    });
  }

  // Add to wishlist
  await prisma.wishlist.create({
    data: {
      userId: req.user.id,
      tourId,
    },
  });

  res.status(201).json({
    success: true,
    message: 'Tour added to wishlist',
  });
});

// @desc    Remove tour from wishlist
// @route   DELETE /api/users/wishlist/:tourId
// @access  Private
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { tourId } = req.params;

  await prisma.wishlist.delete({
    where: {
      userId_tourId: {
        userId: req.user.id,
        tourId,
      },
    },
  });

  res.status(200).json({
    success: true,
    message: 'Tour removed from wishlist',
  });
});

// @desc    Add tour to wishlist by email (for logged-out users)
// @route   POST /api/users/wishlist-by-email
// @access  Public
export const addToWishlistByEmail = asyncHandler(async (req, res) => {
  const { email, tourId } = req.body;

  if (!email || !tourId) {
    return res.status(400).json({
      success: false,
      message: 'Email and tourId are required',
    });
  }

  // Check if tour exists
  const tour = await prisma.tour.findUnique({
    where: { id: tourId },
  });

  if (!tour) {
    return res.status(404).json({
      success: false,
      message: 'Tour not found',
    });
  }

  // Find user by email
  let user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  // If user doesn't exist, we can't add to wishlist (they need to register)
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'No account found with this email. Please sign up first.',
    });
  }

  // Check if already in wishlist
  const existingWishlist = await prisma.wishlist.findUnique({
    where: {
      userId_tourId: {
        userId: user.id,
        tourId,
      },
    },
  });

  if (existingWishlist) {
    return res.status(200).json({
      success: true,
      message: 'Tour is already in your wishlist',
      alreadyExists: true,
    });
  }

  // Add to wishlist
  await prisma.wishlist.create({
    data: {
      userId: user.id,
      tourId,
    },
  });

  res.status(201).json({
    success: true,
    message: 'Tour added to wishlist! Login to view your wishlist.',
  });
});

// @desc    Get user notifications
// @route   GET /api/users/notifications
// @access  Private
export const getUserNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const [notifications, totalCount, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: req.user.id },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.notification.count({
      where: { userId: req.user.id },
    }),
    prisma.notification.count({
      where: {
        userId: req.user.id,
        isRead: false,
      },
    }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      notifications,
      unreadCount,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / take),
        totalCount,
        limit: take,
      },
    },
  });
});

// @desc    Mark notification as read
// @route   PUT /api/users/notifications/:id/read
// @access  Private
export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.notification.update({
    where: {
      id,
      userId: req.user.id, // Ensure user owns the notification
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });

  res.status(200).json({
    success: true,
    message: 'Notification marked as read',
  });
});

// @desc    Mark all notifications as read
// @route   PUT /api/users/notifications/read-all
// @access  Private
export const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  await prisma.notification.updateMany({
    where: {
      userId: req.user.id,
      isRead: false,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read',
  });
});
