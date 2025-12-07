import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import prisma from '../config/database.js';

// Middleware to verify JWT token
export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwt.secret);
      
      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
          role: true,
          isVerified: true,
        },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token. User not found.',
        });
      }

      // Check if user is deleted (soft delete)
      if (user.deletedAt) {
        return res.status(401).json({
          success: false,
          message: 'User account has been deactivated.',
        });
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired.',
        });
      }
      
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Middleware to check user roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action.',
      });
    }

    next();
  };
};

// Optional authentication (for routes that can work with or without auth)
export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, config.jwt.secret);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
      },
    });

    if (user && !user.deletedAt) {
      req.user = user;
    }
  } catch (error) {
    // Silently fail for optional auth
  }
  
  next();
};
