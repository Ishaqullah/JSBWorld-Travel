import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, LayoutDashboard, Phone, Mail, Clock, Facebook, Instagram } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../UI/Button';
import Logo from '../../assets/cropped_circle_image.png';

// Custom TikTok icon since lucide doesn't have one
const TikTokIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [selectedSocialType, setSelectedSocialType] = useState(null);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/tours', label: 'Tours' },
    { to: '/hajj', label: 'Hajj' },
    { to: '/umrah', label: 'Umrah' },
    { to: '/custom-itinerary', label: 'Custom Trip' },
    { to: '/cruise', label: 'Cruise' },
    { to: '/airline-tickets', label: 'Airline Tickets' },
    { to: '/about', label: 'About' },
  ];

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', type: 'facebook' },
    { icon: TikTokIcon, href: 'https://www.tiktok.com/@jsbworldtravel?_r=1&_t=ZS-92qsJnsrmCL', label: 'TikTok' },
    { icon: Instagram, label: 'Instagram', type: 'instagram' },
  ];

  const handleSocialClick = (e, social) => {
    if (social.type === 'facebook' || social.type === 'instagram') {
      e.preventDefault();
      setSelectedSocialType(social.type);
      setIsSocialModalOpen(true);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar - Design Handoff */}
      <div className="bg-primary-600 text-white py-2.5 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            {/* Left: Phone & Email */}
            <div className="flex items-center space-x-6">
              <a href="tel:+1234567890" className="flex items-center space-x-2 hover:text-secondary-400 transition-colors">
                <Phone size={16} />
                <span>+1 (682) 877-2835</span>
              </a>
              <a href="mailto:info@jsbworld-travel.com" className="flex items-center space-x-2 hover:text-secondary-400 transition-colors">
                <Mail size={16} />
                <span>info@jsbworld-travel.com</span>
              </a>
              <div className="flex items-center space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href || '#'}
                    target={social.href ? "_blank" : undefined}
                    rel={social.href ? "noopener noreferrer" : undefined}
                    className="hover:text-secondary-400 transition-colors cursor-pointer"
                    aria-label={social.label}
                    onClick={(e) => handleSocialClick(e, social)}
                  >
                    {typeof social.icon === 'function' ? <social.icon size={16} /> : <social.icon size={16} />}
                  </a>
                ))}
              </div>
            </div>

            {/* Right: Hours & Social */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Clock size={16} />
                <span>Mon-Fri: 10AM to 7PM , Sat: 12PM to 5PM</span>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo - Increased Size */}
            <Link to="/" className="flex items-center space-x-3 group"> {/* Increased space-x */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="py-2"
              >
                <img
                  src={Logo}
                  alt="JSBWORLD TRAVEL Logo"
                  className="h-16 w-16 object-contain rounded-full"
                />
              </motion.div>

            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-10"> {/* Increased space-x */}
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative font-medium text-lg transition-colors ${ /* Added text-lg */
                    isActive(link.to)
                      ? 'text-primary-600'
                      : 'text-gray-700 hover:text-primary-500'
                    }`}
                >
                  {link.label}
                  {isActive(link.to) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-secondary-300 to-secondary-500" /* Increased from -bottom-2 and h-0.5 */
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-6"> {/* Increased space-x */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors" /* Increased p-2 to p-3 */
                  >
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-10 h-10 rounded-full ring-2 ring-primary-500" /* Increased from w-8 h-8 to w-10 h-10 */
                    />
                    <span className="font-medium text-gray-700 text-lg">{user.name}</span> {/* Added text-lg */}
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-64 glass rounded-lg shadow-xl overflow-hidden" /* Increased w-56 to w-64 */
                      >
                        <Link
                          to="/dashboard"
                          className="flex items-center space-x-3 px-5 py-4 hover:bg-primary-50 transition-colors text-lg" /* Increased padding */
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <LayoutDashboard size={20} className="text-primary-600" /> {/* Increased size */}
                          <span>Dashboard</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-5 py-4 hover:bg-red-50 transition-colors text-red-600 text-lg" /* Increased padding */
                        >
                          <LogOut size={20} /> {/* Increased size */}
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/login')}
                    className="text-lg px-6 py-3" /* Added className for size */
                  >
                    Login
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => navigate('/signup')}
                    className="text-lg px-6 py-3" /* Added className for size */
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button - Increased size */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 rounded-lg hover:bg-gray-100 transition-colors" /* Increased p-2 to p-3 */
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />} {/* Increased from size={24} to size={28} */}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass border-t border-white/20"
            >
              <div className="px-4 py-4 space-y-4"> {/* Increased space-y */}
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`block px-5 py-3 rounded-lg font-medium text-lg transition-colors ${ /* Increased padding and text-lg */
                      isActive(link.to)
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="block px-5 py-3 rounded-lg font-medium text-lg text-gray-700 hover:bg-gray-50" /* Increased padding */
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-5 py-3 rounded-lg font-medium text-lg text-red-600 hover:bg-red-50" /* Increased padding */
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      className="w-full py-3 text-lg" /* Added text-lg and py-3 */
                      onClick={() => {
                        navigate('/login');
                        setIsMenuOpen(false);
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      variant="primary"
                      className="w-full py-3 text-lg" /* Added text-lg and py-3 */
                      onClick={() => {
                        navigate('/signup');
                        setIsMenuOpen(false);
                      }}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Social Links Modal */}
      <AnimatePresence>
        {isSocialModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4"
            onClick={() => {
              setIsSocialModalOpen(false);
              setSelectedSocialType(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedSocialType === 'facebook' ? 'Facebook' : 'Instagram'}
                </h2>
                <button
                  onClick={() => {
                    setIsSocialModalOpen(false);
                    setSelectedSocialType(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Facebook Section */}
                {selectedSocialType === 'facebook' && (
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                        <Facebook className="text-white" size={20} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Facebook</h3>
                    </div>
                    <div className="space-y-2">
                      <a
                        href="https://www.facebook.com/share/18CRVFNRco/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">Hajj/Umrah With JSB World Travel</p>
                          <p className="text-xs text-gray-500 mt-1">Click to visit</p>
                        </div>
                      </a>
                      <a
                        href="https://www.facebook.com/share/16ZmNMPGS5/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">JSB World Travel</p>
                          <p className="text-xs text-gray-500 mt-1">Click to visit</p>
                        </div>
                      </a>
                    </div>
                  </div>
                )}

                {/* Instagram Section */}
                {selectedSocialType === 'instagram' && (
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-full flex items-center justify-center">
                        <Instagram className="text-white" size={20} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Instagram</h3>
                    </div>
                    <div className="space-y-2">
                      <a
                        href="https://www.instagram.com/hajjumrahjsb?igsh=MXkyc2tkYW1uYnZk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">Hajj/Umrah With JSB World Travel</p>
                          <p className="text-xs text-gray-500 mt-1">Click to visit</p>
                        </div>
                      </a>
                      <a
                        href="https://www.instagram.com/jsbworld_travel?igsh=MTAybW1odDFnajN1NA=="
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">JSB World Travel</p>
                          <p className="text-xs text-gray-500 mt-1">Click to visit</p>
                        </div>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}