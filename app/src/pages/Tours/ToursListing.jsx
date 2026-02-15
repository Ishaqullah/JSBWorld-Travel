import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users } from 'lucide-react';
import { tourService } from '../../services/tourService';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

const TOURS_PER_PAGE = 12;

export default function ToursListing() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('popular');
  const [visibleCount, setVisibleCount] = useState(TOURS_PER_PAGE);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        const filters = {
          minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
          maxPrice: priceRange[1] < 5000 ? priceRange[1] : undefined,
          minRating: minRating > 0 ? minRating : undefined,
        };

        // Map frontend sort to backend sort
        let sortParams = {};
        switch (sortBy) {
          case 'price-low':
            sortParams = { sortBy: 'price', order: 'asc' };
            break;
          case 'price-high':
            sortParams = { sortBy: 'price', order: 'desc' };
            break;
          case 'rating':
            sortParams = { sortBy: 'rating', order: 'desc' };
            break;
          case 'popular':
          default:
            sortParams = { sortBy: 'reviewCount', order: 'desc' };
            break;
        }

        const data = await tourService.getAllTours({ ...filters, ...sortParams, limit: 1000 });
        setTours(data.tours);
        setVisibleCount(TOURS_PER_PAGE);
      } catch (error) {
        console.error('Error fetching tours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [priceRange, minRating, sortBy]);

  const handleLoadMore = () => {
    setLoadingMore(true);
    // Simulate a small delay for UX
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + TOURS_PER_PAGE, tours.length));
      setLoadingMore(false);
    }, 300);
  };

  const visibleTours = tours.slice(0, visibleCount);
  const hasMoreTours = visibleCount < tours.length;

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="gradient-ocean pt-28 md:pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Explore Our Tours
          </h1>
          <p className="text-xl text-white/90">
            Discover {tours.length} amazing adventures worldwide
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Sort Controls */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{visibleTours.length}</span> of <span className="font-semibold">{tours.length}</span> tours
          </p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {/* Tours Grid - 4 columns on xl screens */}
        {loading ? (
          <div className="text-center py-20">Loading tours...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleTours.map((tour, index) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Link to={`/tours/${tour.slug}/${tour.id}`}>
                  <Card hover className="group h-full">
                    <div className="relative overflow-hidden h-56">
                      <img
                        src={tour.featuredImage}
                        alt={tour.title}
                        className="w-full h-full object-cover image-zoom"
                      />
                      <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-sm font-semibold">
                        {tour.category.name}
                      </div>
                      <div className="absolute top-3 right-3 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {tour.duration} days
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <div className="flex items-center text-white text-sm">
                          <MapPin size={16} className="mr-1" />
                          {tour.location}
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">
                        {tour.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {tour.description}
                      </p>

                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock size={16} className="mr-1" />
                          {tour.duration} days
                        </div>
                        <div className="flex items-center">
                          <Users size={16} className="mr-1" />
                          Max {tour.maxGroupSize}
                        </div>
                      </div>

                      {/* Add-ons Badge */}
                      {tour.addOns && tour.addOns.length > 0 && (
                        <div className="mb-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-700">
                            +{tour.addOns.length} Add-on{tour.addOns.length > 1 ? 's' : ''} available
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-end pt-4 border-t border-gray-200">
                        <div className="text-right">
                          <div className="text-xs text-gray-500">From</div>
                          <div className="text-2xl font-bold text-primary-600">
                            ${tour.price}<span className="text-sm font-normal text-gray-500 ml-1">/ person</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!loading && hasMoreTours && (
          <div className="text-center mt-12">
            <Button
              onClick={handleLoadMore}
              variant="primary"
              size="lg"
              loading={loadingMore}
            >
              {loadingMore ? 'Loading...' : `Load More Tours (${tours.length - visibleCount} remaining)`}
            </Button>
          </div>
        )}

        {!loading && tours.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 mb-4">
              No tours found matching your filters
            </p>
            <Button onClick={() => {
              setPriceRange([0, 5000]);
              setMinRating(0);
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
