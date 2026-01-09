import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Signup from './pages/Auth/Signup';
import ToursListing from './pages/Tours/ToursListing';
import TourDetails from './pages/Tours/TourDetails';
import BookingPage from './pages/Booking/BookingPage';
import PaymentPage from './pages/Payment/PaymentPage';
import Dashboard from './pages/Dashboard/Dashboard';
import UmrahHajj from './pages/UmrahHajj/UmrahHajj';
import HajjPage from './pages/Hajj/HajjPage';
import CustomItineraryPage from './pages/CustomItinerary/CustomItineraryPage';
import PrivacyPolicy from './pages/Legal/PrivacyPolicy';
import TermsOfService from './pages/Legal/TermsOfService';
import RefundPolicy from './pages/Legal/RefundPolicy';

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
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/tours" element={<ToursListing />} />
                <Route path="/tours/:id" element={<TourDetails />} />
                <Route path="/umrah" element={<UmrahHajj />} />
                <Route path="/hajj" element={<HajjPage />} />
                <Route path="/custom-itinerary" element={<CustomItineraryPage />} />
                <Route
                  path="/booking/:id"
                  element={<BookingPage />}
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
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}

// About Page with JSB World-Travel content
function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-center mb-6">
          About <span className="text-gradient">JSB World-Travel</span>
        </h1>
        <p className="text-lg text-gray-600 text-center mb-12">
          Affordable travel, trusted partners, and transparent service.
        </p>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          
          <section>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              JSB World-Travel is a Dallas, Texas–based travel marketing company helping travelers find 
              <strong> affordable flights from US</strong>, hotel deals, vacation packages, and religious travel services.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              We specialize in <strong>airline tickets, hotel bookings, Umrah/Hajj packages, family vacations, 
              and group travel</strong>. To ensure professional booking and fulfillment, JSB World-Travel partners 
              with <strong>Travecations</strong>, a licensed travel and tours company located in Houston, Texas.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              While JSB World-Travel focuses on <strong>marketing, sales, and customer support</strong>, all reservations, 
              ticketing, and tour management are handled by our trusted fulfillment partner and authorized travel suppliers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <span className="text-secondary-500 text-xl">✓</span>
                <span className="text-gray-700">Cheap flights from Texas & nationwide</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-secondary-500 text-xl">✓</span>
                <span className="text-gray-700">Trusted Dallas travel agency</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-secondary-500 text-xl">✓</span>
                <span className="text-gray-700">USA Umrah/Hajj travel services</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-secondary-500 text-xl">✓</span>
                <span className="text-gray-700">Family & group travel specialists</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-secondary-500 text-xl">✓</span>
                <span className="text-gray-700">Secure bookings & clear policies</span>
              </div>
            </div>
          </section>

          <section className="border-t pt-8 mt-8">
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">Contact Us</h2>
            <div className="text-gray-700 space-y-2">
              <p><strong>JSB World-Travel</strong></p>
              <p>Dallas, Texas, USA</p>
              <p>
                Email:{' '}
                <a href="mailto:info@jsbworld-travel.com" className="text-secondary-500 hover:underline">
                  info@jsbworld-travel.com
                </a>
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

export default App;
