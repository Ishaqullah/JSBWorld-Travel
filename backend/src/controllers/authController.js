import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import config from '../config/index.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import { sendVerificationCode, sendPasswordResetOTP } from '../services/emailService.js';

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

// Helper function to generate 6-digit verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Send verification code to email for signup
// @route   POST /api/auth/send-verification-code
// @access  Public
export const sendVerificationCodeHandler = asyncHandler(async (req, res) => {
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

  // Generate verification code
  const verificationCode = generateVerificationCode();

  // Hash password for storage
  const passwordHash = await bcrypt.hash(password, 12);

  // Set expiry to 10 minutes from now
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  // Upsert pending verification (update if exists, create if not)
  await prisma.pendingVerification.upsert({
    where: { email },
    update: {
      verificationCode,
      name,
      passwordHash,
      expiresAt,
    },
    create: {
      email,
      verificationCode,
      name,
      passwordHash,
      expiresAt,
    },
  });

  // Send verification email
  const emailSent = await sendVerificationCode(email, verificationCode, name);

  if (!emailSent) {
    return res.status(500).json({
      success: false,
      message: 'Failed to send verification email. Please try again.',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Verification code sent to your email',
    data: {
      email,
      expiresIn: 600, // 10 minutes in seconds
    },
  });
});

// @desc    Verify code and complete signup
// @route   POST /api/auth/verify-code
// @access  Public
export const verifyCodeAndSignup = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  // Find pending verification
  const pendingVerification = await prisma.pendingVerification.findUnique({
    where: { email },
  });

  if (!pendingVerification) {
    return res.status(400).json({
      success: false,
      message: 'No verification pending for this email. Please start the signup process again.',
    });
  }

  // Check if code matches
  if (pendingVerification.verificationCode !== code) {
    return res.status(400).json({
      success: false,
      message: 'Invalid verification code. Please check and try again.',
    });
  }

  // Check if code has expired
  if (new Date() > pendingVerification.expiresAt) {
    // Delete expired verification
    await prisma.pendingVerification.delete({
      where: { email },
    });

    return res.status(400).json({
      success: false,
      message: 'Verification code has expired. Please request a new one.',
    });
  }

  // Create the actual user
  const user = await prisma.user.create({
    data: {
      email: pendingVerification.email,
      passwordHash: pendingVerification.passwordHash,
      name: pendingVerification.name,
      isVerified: true,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(pendingVerification.name)}&background=0ea5e9&color=fff`,
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

  // Delete pending verification
  await prisma.pendingVerification.delete({
    where: { email },
  });

  // Generate token
  const token = generateToken(user.id);

  res.status(201).json({
    success: true,
    message: 'Email verified and account created successfully',
    data: {
      user,
      token,
    },
  });
});

// @desc    Send OTP for password reset
// @route   POST /api/auth/send-password-reset-otp
// @access  Public
export const sendPasswordResetOTPHandler = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Don't reveal if user exists for security
    return res.status(200).json({
      success: true,
      message: 'If an account with that email exists, we have sent a password reset code.',
    });
  }

  // Generate 6-digit OTP
  const otpCode = generateVerificationCode();

  // Set expiry to 10 minutes from now
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  // Upsert password reset OTP (update if exists, create if not)
  await prisma.passwordResetOTP.upsert({
    where: { email },
    update: {
      otpCode,
      expiresAt,
    },
    create: {
      email,
      otpCode,
      expiresAt,
    },
  });

  // Send OTP email
  const emailSent = await sendPasswordResetOTP(email, otpCode);

  if (!emailSent) {
    return res.status(500).json({
      success: false,
      message: 'Failed to send password reset email. Please try again.',
    });
  }

  res.status(200).json({
    success: true,
    message: 'If an account with that email exists, we have sent a password reset code.',
    data: {
      email,
      expiresIn: 600, // 10 minutes in seconds
    },
  });
});

// @desc    Verify OTP and reset password
// @route   POST /api/auth/verify-otp-reset-password
// @access  Public
export const verifyOTPAndResetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  // Find password reset OTP record
  const resetRecord = await prisma.passwordResetOTP.findUnique({
    where: { email },
  });

  if (!resetRecord) {
    return res.status(400).json({
      success: false,
      message: 'No password reset request found for this email. Please request a new code.',
    });
  }

  // Check if OTP matches
  if (resetRecord.otpCode !== otp) {
    return res.status(400).json({
      success: false,
      message: 'Invalid verification code. Please check and try again.',
    });
  }

  // Check if OTP has expired
  if (new Date() > resetRecord.expiresAt) {
    // Delete expired OTP
    await prisma.passwordResetOTP.delete({
      where: { email },
    });

    return res.status(400).json({
      success: false,
      message: 'Verification code has expired. Please request a new one.',
    });
  }

  // Find the user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'User not found.',
    });
  }

  // Hash the new password
  const passwordHash = await bcrypt.hash(newPassword, 12);

  // Update user password
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    },
  });

  // Delete the OTP record
  await prisma.passwordResetOTP.delete({
    where: { email },
  });

  res.status(200).json({
    success: true,
    message: 'Password has been reset successfully. You can now login with your new password.',
  });
});
