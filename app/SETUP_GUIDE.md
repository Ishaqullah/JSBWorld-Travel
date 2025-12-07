# Travecations - Complete Application Setup Guide

## 🎯 Overview

This guide will help you set up the complete Travecations application with:
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + Prisma + PostgreSQL
- **Database**: PostgreSQL with 16 tables
- **Payments**: Stripe integration
- **Authentication**: JWT-based auth

---

## 📋 Prerequisites

Before starting, ensure you have:

1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **PostgreSQL** (v13 or higher) - [Download](https://www.postgresql.org/download/)
3. **npm** or **yarn**
4. **Stripe Account** (for payments) - [Sign up](https://stripe.com/)
5. **Git** (optional)

---

## 🚀 Quick Start

### Step 1: Install Frontend Dependencies

```bash
# Navigate to project root
cd d:\Travecations

# Install dependencies
npm install

# Add axios for API calls
npm install axios
```

### Step 2: Set Up Frontend Environment

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Step 3: Set Up PostgreSQL Database

1. **Start PostgreSQL** service

2. **Create a new database**:
   ```bash
   # Using psql
   psql -U postgres
   CREATE DATABASE travecations;
   \q
   ```

   Or using pgAdmin - create a new database named `travecations`

### Step 4: Install Backend Dependencies

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

### Step 5: Set Up Backend Environment

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Update `backend/.env` file with your configuration:

   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=5000
   CLIENT_URL=http://localhost:5173

   # Database Configuration (UPDATE THIS)
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/travecations?schema=public"

   # JWT Configuration (CHANGE THESE IN PRODUCTION)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   JWT_REFRESH_SECRET=your-refresh-token-secret
   JWT_REFRESH_EXPIRE=30d

   # Stripe Configuration (GET FROM STRIPE DASHBOARD)
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

   # Email Configuration (OPTIONAL - for password reset)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   EMAIL_FROM=Travecations <noreply@travecations.com>

   # File Upload Configuration
   MAX_FILE_SIZE=5242880
   UPLOAD_PATH=./uploads
   ```

   **Important:** Replace:
   - `YOUR_PASSWORD` with your PostgreSQL password
   - `your_stripe_secret_key` with your Stripe secret key from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
   - Email credentials if you want password reset functionality

### Step 6: Set Up Database Schema

```bash
# Still in backend directory

# Generate Prisma Client
npm run prisma:generate

# Run database migrations (creates all tables)
npm run prisma:migrate

# Seed the database with sample data
npm run prisma:seed
```

This will:
- Create all 16 database tables
- Add sample categories (Beach, Mountain, Wildlife, Culture, Adventure)
- Add 2 sample tours with images, highlights, itinerary, etc.
- Create an admin user (see credentials below)

### Step 7: Start the Backend Server

```bash
# Still in backend directory
npm run dev
```

You should see:
```
✅ Database connected successfully
🚀 Server running on port 5000 in development mode
📍 API available at http://localhost:5000/api
```

### Step 8: Start the Frontend

Open a **new terminal** window:

```bash
# Navigate to project root
cd d:\Travecations

# Start frontend development server
npm run dev
```

You should see:
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 9: Access the Application

Visit **http://localhost:5173** in your browser!

---

## 👤 Default Login Credentials

After seeding the database, you can log in with:

**Admin Account:**
- Email: `admin@travecations.com`
- Password: `admin123`

---

## 🧪 Testing the Setup

### 1. Test Backend API

Visit http://localhost:5000/health

You should see:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-12-02T00:00:00.000Z"
}
```

### 2. Test Database Connection

In backend directory:
```bash
npm run prisma:studio
```

This opens Prisma Studio at http://localhost:5555 where you can browse your database.

### 3. Test Frontend-Backend Integration

1. Go to http://localhost:5173
2. Navigate to Tours page
3. You should see the sample tours loaded from the API
4. Try logging in with the admin credentials
5. Test creating a booking

---

## 📁 Project Structure

```
Travecations/
├── backend/                    # Backend API
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.js            # Sample data
│   ├── src/
│   │   ├── config/            # Configuration
│   │   ├── controllers/       # API controllers
│   │   ├── middleware/        # Express middleware
│   │   ├── routes/            # API routes
│   │   ├── app.js             # Express app
│   │   └── server.js          # Server entry point
│   ├── .env                   # Environment variables
│   ├── package.json
│   └── README.md
│
├── src/                       # Frontend source
│   ├── components/
│   ├── contexts/
│   ├── pages/
│   ├── services/              # API services (NEW)
│   │   ├── api.js            # Axios instance
│   │   ├── authService.js    # Auth API calls
│   │   ├── tourService.js    # Tour API calls
│   │   ├── bookingService.js # Booking API calls
│   │   ├── paymentService.js # Payment API calls
│   │   └── userService.js    # User API calls
│   └── utils/
│
├── .env                       # Frontend environment variables
├── package.json
└── README.md
```

---

## 🔧 Common Issues & Solutions

### Issue: "Connection refused" when starting backend

**Solution:**
1. Make sure PostgreSQL is running
2. Check DATABASE_URL in backend/.env
3. Verify database exists: `psql -U postgres -l`

### Issue: "Module not found: axios"

**Solution:**
```bash
npm install axios
```

### Issue: Prisma migration fails

**Solution:**
```bash
# Reset the database and start fresh
cd backend
npm run db:reset
npm run prisma:seed
```

### Issue: CORS errors in browser console

**Solution:**
- Make sure CLIENT_URL in backend/.env matches your frontend URL
- Default is `http://localhost:5173`

### Issue: Stripe payments not working

**Solution:**
1. Get test API keys from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Use test card: `4242 4242 4242 4242`
3. Any future date and any 3-digit CVC

---

## 📚 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:seed` - Seed database
- `npm run db:reset` - Reset database completely

---

## 🔐 Security Notes

**For Production:**

1. **Change JWT secrets** in backend/.env
2. **Use environment secrets manager** (AWS Secrets Manager, etc.)
3. **Enable HTTPS**
4. **Set up proper CORS** origins
5. **Use production Stripe keys**
6. **Set NODE_ENV=production**
7. **Enable rate limiting** on API endpoints
8. **Set up database backups**

---

## 📖 API Documentation

Full API documentation is available in the backend README:
- **Path:** `backend/README.md`
- Lists all 30+ available endpoints
- Includes request/response examples
- Authentication requirements
- Error handling details

---

## 🎨 Features Implemented

### Backend ✅
- Complete REST API with 30+ endpoints
- PostgreSQL database with 16 tables
- JWT authentication & authorization
- Stripe payment integration
- Booking system with seat management
- Review system with moderation
- Wishlist functionality
- Notification system
- File upload support
- Comprehensive error handling
- Database seeding

### Frontend (Ready for Integration) 🔄
- Complete API service layer
- React contexts (need updating to use API)
- Responsive UI components
- Tour browsing and filtering
- Booking flow
- Payment processing UI
- User dashboard

---

## 🆘 Need Help?

1. Check the README files in `/backend` and `/`
2. Review the implementation plan: `implementation_plan.md` (in artifacts)
3. Check console logs for errors
4. Ensure all services are running on correct ports
5. Verify environment variables are set correctly

---

## 🎯 Next Development Steps

1. **Update AuthContext** to use `authService` instead of localStorage
2. **Update BookingContext** to use `bookingService` 
3. **Replace tours.js** with API calls using `tourService`
4. **Add loading states** and error handling to UI
5. **Implement Stripe Elements** for payment forms
6. **Add toast notifications** for user feedback
7. **Deploy to production** (Vercel for frontend, Railway/Render for backend)

---

## 📝 License

MIT

---

**🎉 You're all set! Start building amazing tour experiences!**
