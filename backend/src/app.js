import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import 'express-async-errors';
import config from './config/index.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import tourRoutes from './routes/tour.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import reviewRoutes from './routes/review.routes.js';
import userRoutes from './routes/user.routes.js';
import categoryRoutes from './routes/category.routes.js';
import webhookRoutes from './routes/webhook.routes.js';
import customItineraryRoutes from './routes/customItinerary.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration - Allow multiple origins for dev and production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174', // Admin panel dev server
  'http://localhost:3000',
  'https://travecations.jsbworld-travel.com',
  config.clientUrl, // Fallback to env variable
].filter(Boolean); // Remove any undefined values

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Webhook route (must be before body parsers to get raw body)
app.use('/api/webhook', webhookRoutes);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Serve static files (uploaded receipts, etc.)
app.use('/uploads', express.static('uploads'));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/custom-itinerary', customItineraryRoutes);
app.use('/api/admin', adminRoutes);


// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

export default app;
