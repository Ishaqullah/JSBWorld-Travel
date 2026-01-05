import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import ToursListing from './pages/Tours/ToursListing';
import TourDetails from './pages/Tours/TourDetails';
import BookingPage from './pages/Booking/BookingPage';
import PaymentPage from './pages/Payment/PaymentPage';
import Dashboard from './pages/Dashboard/Dashboard';
import UmrahHajj from './pages/UmrahHajj/UmrahHajj';
import CustomItineraryPage from './pages/CustomItinerary/CustomItineraryPage';

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <div className="flex flex-col min-h-screen pt-10 md:pt-10">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/tours" element={<ToursListing />} />
                <Route path="/tours/:id" element={<TourDetails />} />
                <Route path="/umrah-hajj" element={<UmrahHajj />} />
                <Route path="/custom-itinerary" element={<CustomItineraryPage />} />
                <Route
                  path="/booking/:id"
                  element={
                    <ProtectedRoute>
                      <BookingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payment/:id"
                  element={
                    <ProtectedRoute>
                      <PaymentPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/about" element={<About />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}

// Simple About Page
function About() {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-display font-bold text-center mb-6">
          About <span className="text-gradient">JSBWORLD TRAVEL</span>
        </h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          Your gateway to extraordinary adventures around the world
        </p>
        <div className="prose prose-lg max-w-none">
          <p>
            JSBWORLD TRAVEL is your trusted partner in creating unforgettable travel experiences.
            We believe that travel is more than just visiting new places—it's about creating
            memories, discovering cultures, and connecting with people from around the world.
          </p>
          <p>
            Our team of expert guides and travel planners work tirelessly to curate exceptional
            tours that showcase the best each destination has to offer. From pristine beaches
            to towering mountains, ancient cultures to modern marvels, we've got you covered.
          </p>
          <p>
            Join thousands of satisfied travelers who have discovered the world with us.
            Your next adventure awaits!
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
