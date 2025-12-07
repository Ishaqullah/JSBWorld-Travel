# Travecations Backend API

Backend API for the Travecations tour booking application built with Node.js, Express, Prisma, and PostgreSQL.

## Features

- 🔐 **Authentication & Authorization** - JWT-based auth with role-based access control
- 🗄️ **Database** - PostgreSQL with Prisma ORM
- 🎫 **Tour Management** - Complete CRUD operations with filtering and pagination
- 📅 **Booking System** - Real-time seat availability management
- 💳 **Payments** - Stripe integration for secure payments
- ⭐ **Reviews & Ratings** - User reviews with admin moderation
- 🔔 **Notifications** - User notification system
- ❤️ **Wishlist** - Save favorite tours
- 📁 **File Upload** - Image upload support with Multer

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Payment Processing**: Stripe
- **Validation**: express-validator
- **File Upload**: Multer

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```

   Required environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `JWT_SECRET` - Secret key for JWT tokens
   - `STRIPE_SECRET_KEY` - Stripe secret key
   - `PORT` - Server port (default: 5000)
   - `CLIENT_URL` - Frontend URL for CORS

3. **Set up the database**:
   ```bash
   # Generate Prisma Client
   npm run prisma:generate

   # Run migrations
   npm run prisma:migrate

   # Seed the database with initial data
   npm run prisma:seed
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5000`

## Database Schema

The application uses 16 database models:

- **User** - User accounts and authentication
- **Category** - Tour categories
- **Tour** - Tour information
- **TourImage** - Tour gallery images
- **TourHighlight** - Tour highlights/features
- **TourInclusion** - What's included/excluded
- **TourItinerary** - Day-by-day schedule
- **TourDate** - Available tour dates
- **Booking** - Tour bookings
- **BookingTraveler** - Traveler information
- **Payment** - Payment transactions
- **Review** - Customer reviews
- **ReviewImage** - Review photos
- **Wishlist** - Saved tours
- **Notification** - User notifications
- **ContactMessage** - Contact form submissions

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Tours
- `GET /api/tours` - Get all tours (with filters)
- `GET /api/tours/:id` - Get single tour
- `POST /api/tours` - Create tour (Admin)
- `PUT /api/tours/:id` - Update tour (Admin)
- `DELETE /api/tours/:id` - Delete tour (Admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Payments
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/:id` - Get payment details

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/tour/:tourId` - Get tour reviews
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `PUT /api/reviews/:id/approve` - Approve review (Admin)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/change-password` - Change password
- `GET /api/users/wishlist` - Get wishlist
- `POST /api/users/wishlist/:tourId` - Add to wishlist
- `DELETE /api/users/wishlist/:tourId` - Remove from wishlist
- `GET /api/users/notifications` - Get notifications

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:seed` - Seed database with initial data
- `npm run db:push` - Push schema changes (development)
- `npm run db:reset` - Reset database

## Default Credentials

After seeding, you can login with:
- **Email**: admin@travecations.com
- **Password**: admin123

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.js            # Database seeding script
├── src/
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── routes/            # API routes
│   ├── app.js             # Express app setup
│   └── server.js          # Server entry point
├── .env.example           # Environment variables template
├── .gitignore
└── package.json
```

## Error Handling

The API uses a centralized error handling middleware that:
- Handles Prisma errors (unique constraints, not found, etc.)
- Validates JWT tokens
- Formats validation errors
- Handles file upload errors
- Returns consistent error responses

## Security Features

- Helmet.js for security headers
- CORS configuration
- JWT authentication
- Password hashing with bcrypt
- Input validation with express-validator
- Role-based access control (RBAC)
- Soft deletes for sensitive data

## License

MIT
