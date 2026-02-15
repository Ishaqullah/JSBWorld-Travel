import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Star, TrendingUp, Award, Globe, Clock, ChevronLeft, ChevronRight, ChevronDown, Phone, MessageCircle, Mail, X } from 'lucide-react';
import { tourService } from '../services/tourService';
import { testimonials, stats } from '../data/testimonials';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';

// Partner logo imports
import PartnerLogo1 from '../assets/image1.png';
import PartnerLogo2 from '../assets/image2.png';
import PartnerLogo3 from '../assets/image3.png';
import PartnerLogo6 from '../assets/image6.png';
import PartnerLogo7 from '../assets/image7.png';
import PartnerLogo8 from '../assets/image8.png';
import PartnerLogo9 from '../assets/image9.png';
import PartnerLogo10 from '../assets/image10.png';
import PartnerLogo11 from '../assets/image11.png';
import PartnerLogo12 from '../assets/image12.png';
import PartnerLogo13 from '../assets/image13.jpg';
import PartnerLogo14 from '../assets/image14.png';
import PartnerLogo15 from '../assets/image15.jpeg';
import PartnerLogo18 from '../assets/image18.png';
import PartnerLogo19 from '../assets/image19.png';
import PartnerLogo20 from '../assets/image20.png';
import PartnerLogo21 from '../assets/image21.png';
import PartnerLogo22 from '../assets/image22.png';

// Hero video import
import HeroVideo from '../assets/hero-vid.mov';

// Partner logos array for easy mapping
const partnerLogos = [
  { src: PartnerLogo1, alt: 'Travel Agents Association of Pakistan' },
  { src: PartnerLogo2, alt: 'Saudia Airlines' },
  { src: PartnerLogo3, alt: 'American Airlines' },
  { src: PartnerLogo6, alt: 'Etihad Airways' },
  { src: PartnerLogo7, alt: 'IATA' },
  { src: PartnerLogo8, alt: 'Qatar Airways' },
  { src: PartnerLogo9, alt: 'United Airlines' },
  { src: PartnerLogo10, alt: 'Lufthansa' },
  { src: PartnerLogo11, alt: 'SWISS' },
  { src: PartnerLogo12, alt: 'KLM' },
  { src: PartnerLogo13, alt: 'Iberia' },
  { src: PartnerLogo14, alt: 'Air France' },
  { src: PartnerLogo15, alt: 'Marriott' },
  { src: PartnerLogo18, alt: 'IHG Hotels' },
  { src: PartnerLogo19, alt: 'World of Hyatt' },
  { src: PartnerLogo20, alt: 'CLIA' },
  { src: PartnerLogo21, alt: 'ARC' },
  { src: PartnerLogo22, alt: 'ASTA' },
];

export default function Home() {
  const navigate = useNavigate();
  const [allTours, setAllTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);
  const autoPlayRef = useRef(null);
  const nextSectionRef = useRef(null);

  // Search state
  const [activeTab, setActiveTab] = useState('tour');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredTours, setFilteredTours] = useState([]);
  const searchRef = useRef(null);

  // Enquire modal state
  const [enquireModalOpen, setEnquireModalOpen] = useState(false);

  // Handle responsive cards per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCardsToShow(1);
      } else if (window.innerWidth < 1024) {
        setCardsToShow(2);
      } else {
        setCardsToShow(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchAllTours = async () => {
      try {
        // Fetch all tours
        const response = await tourService.getAllTours({
          sortBy: 'rating',
          order: 'desc',
          limit: 1000
        });
        setAllTours(response.tours);
      } catch (error) {
        console.error('Failed to fetch tours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTours();
  }, []);

  // Filter tours based on search query
  useEffect(() => {
    if (searchQuery.trim() && allTours.length > 0) {
      const query = searchQuery.toLowerCase();
      const filtered = allTours.filter(tour =>
        tour.title?.toLowerCase().includes(query) ||
        tour.subtitle?.toLowerCase().includes(query) ||
        tour.location?.toLowerCase().includes(query) ||
        tour.description?.toLowerCase().includes(query)
      );
      setFilteredTours(filtered);
      setShowDropdown(true);
    } else {
      setFilteredTours([]);
      setShowDropdown(false);
    }
  }, [searchQuery, allTours]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle tour selection from dropdown
  const handleTourSelect = (tourId) => {
    setShowDropdown(false);
    setSearchQuery('');
    navigate(`/tours/${tourId}`);
  };

  // Scroll to next section
  const scrollToNextSection = () => {
    if (nextSectionRef.current) {
      nextSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Auto-scroll carousel
  useEffect(() => {
    if (allTours.length <= cardsToShow) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = allTours.length - cardsToShow;
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 5000);

    return () => clearInterval(autoPlayRef.current);
  }, [allTours.length, cardsToShow]);

  const nextSlide = () => {
    const maxIndex = allTours.length - cardsToShow;
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    const maxIndex = allTours.length - cardsToShow;
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="min-h-screen">
      {/* Enquire Modal */}
      <AnimatePresence>
        {enquireModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4"
            onClick={() => setEnquireModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
                <button
                  onClick={() => setEnquireModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <a
                  href="tel:+16828772835"
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-secondary-400 to-secondary-500 rounded-full flex items-center justify-center">
                    <Phone className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-semibold text-gray-900">+1 (682) 877-2835</p>
                  </div>
                </a>

                <a
                  href="https://wa.me/14697990834"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">WhatsApp</p>
                    <p className="font-semibold text-gray-900">+1 (469) 799-0834</p>
                  </div>
                </a>

                <a
                  href="mailto:info@jsbworld-travel.com"
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-400 to-primary-500 rounded-full flex items-center justify-center">
                    <Mail className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-gray-900">info@jsbworld-travel.com</p>
                  </div>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-[750px] md:h-[650px] flex items-start md:items-center justify-center pt-36 md:pt-10 z-0">
        {/* Video Background */}
        <div className="absolute inset-0 -z-10">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={HeroVideo} type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0  -z-10"></div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm hidden md:block"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full backdrop-blur-sm hidden md:block"
        />

        {/* Content */}
        <div className="relative z-[60] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6"
          >
            Navigate Your Next Adventure
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary-400 to-secondary-200">with JSB WORLD</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 mb-10 max-w-3xl mx-auto"
          >
            Explore breathtaking destinations with expert guides. From tropical paradises
            to mountain peaks, your dream journey starts here.
          </motion.p>

          {/* Enquire Now Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-6"
          >
            <button
              onClick={() => setEnquireModalOpen(true)}
              className="px-8 py-3 bg-gradient-to-r from-secondary-400 to-secondary-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Enquire Now
            </button>
          </motion.div>

          {/* Search Bar with Tour/Flight Tabs */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-3xl mx-auto"
          >
            {/* Tabs */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setActiveTab('tour')}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'tour'
                  ? 'bg-gradient-to-r from-secondary-400 to-secondary-500 text-white shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
              >
                Tour
              </button>
              <button
                onClick={() => setActiveTab('flight')}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'flight'
                  ? 'bg-gradient-to-r from-secondary-400 to-secondary-500 text-white shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
              >
                Flight
              </button>
            </div>

            {/* Search Input with Dropdown */}
            <div ref={searchRef} className="relative z-[1000]">
              <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="flex items-center px-4 py-4">
                  <Search className="text-gray-400 mr-3 flex-shrink-0" size={20} />
                  <input
                    type="text"
                    placeholder={activeTab === 'tour' ? "Search tours by title, subtitle or country..." : "Search flights by destination..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500 text-base"
                  />
                </div>
              </div>

              {/* Dropdown Results */}
              <AnimatePresence>
                {showDropdown && filteredTours.length > 0 && activeTab === 'tour' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl overflow-hidden z-[100000] max-h-80 overflow-y-auto"
                  >
                    {filteredTours.map((tour) => (
                      <div
                        key={tour.id}
                        onClick={() => handleTourSelect(tour.id)}
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <img
                          src={tour.featuredImage}
                          alt={tour.title}
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="text-left flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">{tour.title}</h4>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <MapPin size={14} className="mr-1 flex-shrink-0" />
                            <span className="truncate">{tour.location}</span>
                            <span className="mx-2">•</span>
                            <span className="text-secondary-600 font-semibold">${tour.price}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
                {showDropdown && searchQuery.trim() && filteredTours.length === 0 && activeTab === 'tour' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl p-6 text-center z-50"
                  >
                    <p className="text-gray-500">No tours found matching "{searchQuery}"</p>
                    <Link to="/tours" className="text-secondary-600 font-semibold hover:underline mt-2 inline-block">
                      Browse all tours →
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator - Clickable */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer z-50"
          onClick={scrollToNextSection}
        >
          <ChevronDown
            size={32}
            className="text-white/80 hover:text-white transition-colors drop-shadow-lg"
          />
        </motion.div>
      </section>

      {/* Partner Logos Marquee - FIXED */}
      <section ref={nextSectionRef} className="py-8 bg-white border-b overflow-hidden relative z-[-30]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <h3 className="text-center text-gray-500 text-4xl font-medium uppercase tracking-wider">
            Our Trusted Partners
          </h3>
        </div>
        <div className="relative">
          {/* Gradient overlays with lower z-index */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-20" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-20" />

          {/* Marquee container with lower z-index */}
          <div className="flex animate-marquee relative z-10">
            {/* First set of logos */}
            <div className="flex items-center gap-12 md:gap-16 px-8 shrink-0">
              {partnerLogos.map((logo, index) => (
                <img key={index} src={logo.src} alt={logo.alt} className="h-10 md:h-12 object-contain opacity-70 hover:opacity-100 transition-opacity" />
              ))}
            </div>
            {/* Duplicate set for seamless loop */}
            <div className="flex items-center gap-12 md:gap-16 px-8 shrink-0">
              {partnerLogos.map((logo, index) => (
                <img key={`dup-${index}`} src={logo.src} alt={logo.alt} className="h-10 md:h-12 object-contain opacity-70 hover:opacity-100 transition-opacity" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All Tours Carousel */}
      <section style={{ marginTop: '50px' }} className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-display font-bold mb-4"
            >
              Explore Our <span className="text-gradient">Adventures</span>
            </motion.h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover unforgettable experiences across the world
            </p>
          </div>

          {/* Carousel Container */}
          <div className="relative px-12 md:px-16">
            {/* Navigation Arrows */}
            {allTours.length > cardsToShow && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 shadow-lg rounded-full p-3 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-secondary-500 bg-gradient-to-br from-secondary-300 to-secondary-500"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="text-white" size={24} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 shadow-lg rounded-full p-3 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-secondary-500 bg-gradient-to-br from-secondary-300 to-secondary-500"
                  aria-label="Next slide"
                >
                  <ChevronRight className="text-white" size={24} />
                </button>
              </>
            )}

            {/* Carousel Track */}
            <div className="overflow-hidden px-2 py-10">
              <motion.div
                className={`flex ${cardsToShow === 1 ? 'gap-0' : 'gap-6'}`}
                animate={{ x: `-${currentIndex * (100 / cardsToShow)}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                {allTours.map((tour) => (
                  <motion.div
                    key={tour.id}
                    className="flex-shrink-0 px-1"
                    style={{
                      width: cardsToShow === 1
                        ? '100%'
                        : `calc(${100 / cardsToShow}% - ${(cardsToShow - 1) * 24 / cardsToShow}px)`
                    }}
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link to={`/tours/${tour.slug}/${tour.id}`}>
                      <Card hover className="group h-full">
                        <div className="relative overflow-hidden h-64">
                          <img
                            src={tour.featuredImage}
                            alt={tour.title}
                            className="w-full h-full object-cover image-zoom"
                          />
                          <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-secondary-600">
                            {tour.duration} days
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                            <div className="flex items-center text-white text-sm mb-2">
                              <MapPin size={16} className="mr-1" />
                              {tour.location}
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-2xl font-bold mb-2 group-hover:text-secondary-600 transition-colors">
                            {tour.title}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">{tour.description}</p>
                          <div className="flex items-center justify-end">
                            <div className="text-right">
                              <div className="text-sm text-gray-500">From</div>
                              <div className="text-2xl font-bold text-secondary-600">
                                ${tour.price} <span className="text-sm font-normal text-gray-500">/ person</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Dot Indicators */}
            {allTours.length > cardsToShow && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: allTours.length - cardsToShow + 1 }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === index
                      ? 'bg-secondary-500 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Link to="/tours">
              <Button size="lg" variant="primary">
                View All Tours
              </Button>
            </Link>
          </div>
        </div>
      </section>




      {/* Where to Next? - Destinations Grid */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold">
                Where to <span className="text-gradient">next?</span>
              </h2>
              <p className="text-gray-600 mt-2">Explore our most popular destinations</p>
            </div>
            <Link to="/tours" className="text-secondary-600 font-semibold hover:underline hidden md:block">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: 'Egypt', image: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=400' },
              { name: 'Spain', image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=400' },
              { name: 'UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400' },
              { name: 'Morocco', image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=400' },
              { name: 'Italy', image: 'https://images.unsplash.com/photo-1515859005217-8a1f08870f59?w=400' },
            ].map((destination, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link to={`/tours?destination=${destination.name.toLowerCase()}`}>
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/5] group cursor-pointer">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{destination.name}</h3>
                      <p className="text-sm text-white/80"></p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Breathtaking Moments */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold">
                Live <span className="text-gradient">breathtaking</span> moments!
              </h2>
              <p className="text-gray-600 mt-2">Experience unforgettable adventures across the globe</p>
            </div>
            <Link to="/tours" className="text-secondary-600 font-semibold hover:underline hidden md:block">
              View All →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Pyramids of Giza', location: 'Egypt', price: 899, image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=400' },
              { title: 'Eiffel Tower Sunset', location: 'France', price: 1299, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400' },
              { title: 'Dubai Skyline', location: 'UAE', price: 1499, image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400' },
              { title: 'Greek Islands', location: 'Greece', price: 1599, image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400' },
            ].map((moment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="overflow-hidden group">
                  <div className="relative h-48">
                    <img
                      src={moment.image}
                      alt={moment.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 right-3 bg-secondary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      ${moment.price} <span className="text-[10px] font-normal opacity-80">/ person</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg group-hover:text-secondary-600 transition-colors">{moment.title}</h3>
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                      <MapPin size={14} className="mr-1" />
                      {moment.location}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Multi-Country Tours */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold">
                Multi-country <span className="text-gradient">tours</span>
              </h2>
              <p className="text-gray-600 mt-2">Explore multiple destinations in one epic journey</p>
            </div>
            <Link to="/tours" className="text-secondary-600 font-semibold hover:underline hidden md:block">
              View All →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Europe Adventure', countries: 'France, Italy & Spain', days: 14, price: 3499, image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400' },
              { title: 'Middle East Explorer', countries: 'UAE, Jordan & Egypt', days: 12, price: 2999, image: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=400' },
              { title: 'Mediterranean Dream', countries: 'Greece, Turkey & Italy', days: 10, price: 2799, image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400' },
              { title: 'North Africa Tour', countries: 'Morocco, Tunisia & Egypt', days: 11, price: 2599, image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=400' },
            ].map((tour, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="overflow-hidden group h-full">
                  <div className="relative h-52">
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3 bg-primary-800 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {tour.days} Days
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg group-hover:text-secondary-600 transition-colors">{tour.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">{tour.countries}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-secondary-600 font-bold text-xl">${tour.price}</span>
                      <span className="text-gray-400 text-sm">per person</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Tours */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary-900 to-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
                Luxury <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary-400 to-secondary-200">Tours</span>
              </h2>
              <p className="text-gray-300 mt-2">Premium experiences for the discerning traveler</p>
            </div>
            <Link to="/tours" className="text-secondary-400 font-semibold hover:underline hidden md:block">
              View All →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Classic Turkey Premium', location: 'Turkey', price: 4999, image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=400' },
              { title: 'Safari Adventure Deluxe', location: 'Kenya', price: 5499, image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400' },
              { title: 'Maldives Paradise', location: 'Maldives', price: 6999, image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400' },
              { title: 'Swiss Alps Retreat', location: 'Switzerland', price: 5999, image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400' },
            ].map((tour, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative rounded-2xl overflow-hidden group cursor-pointer aspect-[3/4]">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center text-white/80 text-sm mb-2">
                      <MapPin size={14} className="mr-1" />
                      {tour.location}
                    </div>
                    <h3 className="font-bold text-xl text-white mb-2">{tour.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-secondary-400 font-bold text-xl">${tour.price}</span>
                      <span className="bg-secondary-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Premium
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>





      {/* Why Choose Us - Design Handoff: 6 columns, 100-140px padding */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Why Choose <span className="text-gradient">JSB World Travel</span> for Your Next Adventure?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              When you look for a travel agency in Dallas, you want more than a middleman—you want an advocate.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: '35 Years of Local Trust',
                description: 'Based right here in the DFW metroplex, we aren\'t a faceless online booking engine. We are your neighbors, committed to the Dallas-Fort Worth community for over three decades.',
              },
              {
                icon: Globe,
                title: 'Global Insider Knowledge',
                description: 'Specializing in custom tours to US and beyond, we offer "insider" access and cultural insights that generic agencies miss. We bridge the gap between East and West.',
              },
              {
                icon: TrendingUp,
                title: 'The "Anti-Algorithm" Approach',
                description: 'We don\'t use bots or automated templates. Every hand-crafted itinerary is designed by a human expert who understands your specific needs, pace, and preferences.',
              },
              {
                icon: MapPin,
                title: 'Seamless International Logistics',
                description: 'We handle the complex details—visa assistance, private transport, and local guides—from your US departure to your international arrival, ensuring a stress-free journey.',
              },
              {
                icon: Clock,
                title: 'Personal Accountability & Support',
                description: 'When you book with us, you have a direct line to a real person. We provide end-to-end support from the moment you start planning until you return home safely.',
              },
              {
                icon: Star,
                title: 'Vetted Global Partners',
                description: 'We only work with local vendors and guides that we have personally vetted for safety, quality, and authentic cultural immersion.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-8 h-full hover:shadow-xl transition-shadow duration-300">
                  <div className="inline-flex p-4 bg-gradient-to-br from-secondary-300 to-secondary-500 rounded-2xl mb-4">
                    <feature.icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-20 md:py-24 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Traveler <span className="text-gradient">Stories</span>
            </h2>
            <p className="text-xl text-gray-600">Hear from our happy adventurers</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card glass className="p-6 h-full">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-3"
                    />
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.location}</div>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#f59e0b" className="text-amber-500" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm mb-2">"{testimonial.comment}"</p>
                  <div className="text-xs text-primary-600 font-medium">{testimonial.tour}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Design Handoff: 250-350px height */}
      <section className="h-80 md:h-96 gradient-ocean text-white relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-lg md:text-xl mb-6 text-white/90">
            Join thousands of travelers who have discovered the world with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tours">
              <Button size="lg" className="bg-white text-secondary-600 hover:bg-gray-100 font-semibold">
                Explore Tours
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-semibold">
                Sign Up Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
