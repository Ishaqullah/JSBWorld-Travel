import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import config from '../config/index.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, config.jwt.secret, {
    expiresIn: config.jwt.expire,
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email',
    });
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0ea5e9&color=fff`,
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      role: true,
      isVerified: true,
      createdAt: true,
    },
  });

  // Generate token
  const token = generateToken(user.id);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user,
      token,
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.deletedAt) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  // Generate token
  const token = generateToken(user.id);

  // Return user without password
  const { passwordHash, ...userWithoutPassword } = user;

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: userWithoutPassword,
      token,
    },
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = asyncHandler(async (req, res) => {
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

// @desc    Logout user (client-side will remove token)
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
});

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Don't reveal if user exists
    return res.status(200).json({
      success: true,
      message: 'If the email exists, a password reset link has been sent',
    });
  }

  // Generate reset token
  const resetToken = jwt.sign({ userId: user.id }, config.jwt.secret, {
    expiresIn: '1h',
  });

  // Save reset token to database
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: resetToken,
      resetPasswordExpires: new Date(Date.now() + 3600000), // 1 hour
    },
  });

  // TODO: Send email with reset link
  // For now, just return the token in development
  if (config.nodeEnv === 'development') {
    return res.status(200).json({
      success: true,
      message: 'Password reset token generated',
      data: { resetToken }, // Remove in production
    });
  }

  res.status(200).json({
    success: true,
    message: 'If the email exists, a password reset link has been sent',
  });
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, config.jwt.secret);

    const user = await prisma.user.findFirst({
      where: {
        id: decoded.userId,
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired reset token',
    });
  }
});
