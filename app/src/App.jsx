import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import GeneralConditions from './pages/Legal/GeneralConditions';
import CookiesPolicy from './pages/Legal/CookiesPolicy';
import AboutUs from './pages/About/AboutUs';
import CruisePage from './pages/Cruise/CruisePage';
import AirlineTicketsPage from './pages/AirlineTickets/AirlineTicketsPage';
import HoustonTravelAgency from './pages/TravelAgency/DallasTravelAgency';
import DallasTravelAgency from './pages/TravelAgency/DallasTravelAgency';
import BlogPage from './pages/Blog/BlogPage';
import BlogDetail from './pages/Blog/BlogDetail';
import ContactPage from './pages/Contact/ContactPage';
import WhatsAppButton from './components/UI/WhatsAppButton';

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
                <Route path="/tours/:slug/:id" element={<TourDetails />} />
                <Route path="/umrah" element={<UmrahHajj />} />
                <Route path="/hajj" element={<HajjPage />} />
                <Route path="/custom-itinerary" element={<CustomItineraryPage />} />
                <Route path="/cruise" element={<CruisePage />} />
                <Route path="/airline-tickets" element={<AirlineTicketsPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/contact" element={<ContactPage />} />

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
                <Route path="/about" element={<AboutUs />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/general-conditions" element={<GeneralConditions />} />
                <Route path="/cookies-policy" element={<CookiesPolicy />} />
                <Route path="/dallas-travel-agency" element={<DallasTravelAgency />} />
              </Routes>
            </main>
            <Footer />
            <WhatsAppButton />
          </div>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}


export default App;
