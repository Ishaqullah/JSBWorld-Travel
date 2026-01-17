import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { tourService } from '../../services/tourService';
import Card from '../../components/UI/Card';
import banner from '../../assets/WhatsApp Image 2026-01-17 at 12.49.23 AM.jpeg';
export default function UmrahHajj() {
  const [umrahTours, setUmrahTours] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className="relative pt-10 md:pt-20">
        <div className="relative">
          <img
            src={banner}
            alt="Kaaba in Mecca"
            className="w-full h-auto"
          />
          {/* Gradient overlay at bottom for text readability */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-6 left-0 right-0 text-center z-10 px-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-7xl font-display font-bold"
            >
              <span className="text-white">Spiritual</span>
              <span className="ml-3 md:ml-5 bg-clip-text text-transparent bg-gradient-to-r from-secondary-400 to-secondary-200">Journeys</span>
            </motion.h1>
          </div>
        </div>
      </div>

      {/* Intro Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Why Choose JSBWORLD TRAVEL for Your Pilgrimage?
          </h2> 
          <p className="text-lg text-gray-600">
            We understand the spiritual significance of your journey. Our dedicated team ensures every detail is taken care of, allowing you to focus on your worship.
          </p>
        </div>

        {/* Tours Grid */}
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
  );
}
