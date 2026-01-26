import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Star, Phone, ChevronDown } from 'lucide-react';
import { tourService } from '../../services/tourService';
import Card from '../../components/UI/Card';
import banner from '../../assets/umrahBanner.png';
import bbqTonight1 from '../../assets/bbqTonight1.jpg';
import bbqTonight2 from '../../assets/bbqTonight2.jpg';
export default function UmrahHajj() {
  const [umrahTours, setUmrahTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const packagesSectionRef = useRef(null);


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const scrollToPackages = () => {
    if (packagesSectionRef.current) {
      packagesSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchUmrahTours = async () => {
      try {
        const response = await tourService.getToursByCategory('umrah');
        setUmrahTours(response.tours || []);
      } catch (error) {
        console.error('Failed to fetch Umrah tours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUmrahTours();
  }, []);

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Section */}
      <div className="relative h-[80vh] min-h-[500px] flex flex-col overflow-hidden pt-20 md:pt-24">
              <div className="absolute inset-0">
                <img
                  src={banner}
                  alt="Hajj Pilgrimage"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 " />
              </div>
              
              {/* Ayat & Heading - Top Center */}
              <div className="relative z-10 flex-1 flex items-start justify-center pt-8 md:pt-12">
                <div className="text-center text-white px-4 max-w-4xl">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                  >
                    <p className="text-4xl md:text-5xl font-arabic mb-3" style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}>
                      وَأَتِمُّوا الْحَجَّ وَالْعُمْرَةَ لِلَّهِ
                    </p>
                    <p className="text-xl md:text-2xl text-gray-200 italic mb-2">
                      "And complete the Hajj and Umrah for Allah."
                    </p>
                    <p className="text-xl text-gray-300">
                      Al-Baqarah (The Cow) 2:196
                    </p>
                  </motion.div>
      
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-5xl font-display font-bold"
                  >
                    <span className="bg-clip-text text-white">Umrah</span>
                    <span className="ml-3 bg-clip-text text-transparent bg-gradient-to-r from-secondary-400 to-secondary-200">Packages 2026</span>
                  </motion.h1>
                </div>
              </div>

              {/* Scroll Indicator - Clickable */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer z-50"
                onClick={scrollToPackages}
              >
                <ChevronDown 
                  size={32} 
                  className="text-white/80 hover:text-white transition-colors drop-shadow-lg" 
                />
              </motion.div>
            </div>


        
      {/* Intro Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
  <div className="relative py-20 overflow-hidden rounded-2xl">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-2 bg-secondary-500/20 backdrop-blur-sm rounded-full text-secondary-300 text-sm font-semibold mb-4">
              🤝 Exclusive Partnership
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Trusted Halal Dining Partner
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col gap-4"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-secondary-400 to-secondary-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
                <img
                  src={bbqTonight1}
                  alt="BBQ King Halal Food"
                  className="relative rounded-xl w-full h-auto object-contain shadow-2xl transform group-hover:scale-[1.02] transition duration-300"
                />
              </div>
            

              <div
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-secondary-400 to-secondary-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🍖</span>
                </div>
                <h3 className="text-2xl font-bold text-white">BBQ King Partnership</h3>
              </div>
              
              <p className="text-lg text-gray-200 leading-relaxed mb-6">
                JSB World-Travel provides tours, cruises, and Umrah & Hajj, supported by its partnership with <span className="text-secondary-300 font-semibold">BBQ King</span>—bringing trusted halal dining with dedicated hotel delivery for travelers in <span className="text-secondary-300 font-semibold">Madina</span> and <span className="text-secondary-300 font-semibold">DFW</span>.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">🕌</div>
                  <p className="text-white font-semibold">Madina Delivery</p>
                  <p className="text-gray-300 text-sm">Hotel doorstep service</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">✈️</div>
                  <p className="text-white font-semibold">DFW Service</p>
                  <p className="text-gray-300 text-sm">Premium halal catering</p>
                </div>
              </div>

              {/* Phone Contact */}
              <a 
                href="tel:+966558182560" 
                className="mt-6 flex items-center justify-center gap-3 bg-gradient-to-r from-secondary-400 to-secondary-600 hover:from-secondary-500 hover:to-secondary-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <Phone size={20} />
                <span>+966 55 818 2560</span>
              </a>
            </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              // className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
            >
               <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-secondary-600 to-secondary-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
                <img
                  src={bbqTonight2}
                  alt="BBQ King Restaurant"
                  className="relative rounded-xl w-full h-auto object-contain shadow-2xl transform group-hover:scale-[1.02] transition duration-300"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
        <div className="text-center max-w-3xl mx-auto mb-16 mt-20">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Why Choose JSB WORLD-TRAVEL for Your Pilgrimage?
          </h2> 
          <p className="text-lg text-gray-600">
            We understand the spiritual significance of your journey. Our dedicated team ensures every detail is taken care of, allowing you to focus on your worship.
          </p>
        </div>

        {/* Tours Grid */}
        <div ref={packagesSectionRef}>
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-96"></div>
            ))}
          </div>
        ) : umrahTours.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">No Umrah packages available at the moment.</p>
            <p className="text-gray-400 mt-2">Please check back soon for new offerings.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {umrahTours.map((tour, index) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/tours/${tour.id}`}>
                  <Card hover className="h-full flex flex-col group">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={tour.featuredImage}
                        alt={tour.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-secondary-600">
                        {tour.duration} days
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                        <div className="flex items-center text-white text-sm">
                          <MapPin size={16} className="mr-1" />
                          {tour.location}
                        </div>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-secondary-600 transition-colors">
                          {tour.title}
                        </h3>
                        <div className="flex items-center bg-amber-50 px-2 py-1 rounded text-amber-600 text-sm font-semibold">
                          <Star size={14} fill="currentColor" className="mr-1" />
                          {tour.rating}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                        {tour.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                        <div>
                          <span className="text-sm text-gray-500">Starting from</span>
                          <div className="text-2xl font-bold text-secondary-600">${tour.price}</div>
                        </div>
                        <span className="text-secondary-600 font-semibold text-sm group-hover:underline">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
        </div>
      </div>

      {/* BBQ King Partnership Section */}
  
    </div>
  );
}
