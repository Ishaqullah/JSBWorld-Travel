import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, Clock, Users, SlidersHorizontal } from 'lucide-react';
import { categories } from '../../data/tours';
import { tourService } from '../../services/tourService';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

export default function ToursListing() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        const filters = {
          minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
          maxPrice: priceRange[1] < 5000 ? priceRange[1] : undefined,
          minRating: minRating > 0 ? minRating : undefined,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
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

        const data = await tourService.getAllTours({ ...filters, ...sortParams });
        setTours(data.tours);
      } catch (error) {
        console.error('Error fetching tours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [selectedCategory, priceRange, minRating, sortBy]);

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <div className="gradient-ocean py-16">
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
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64">
            <div className="lg:sticky lg:top-24">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden w-full btn-outline mb-4"
              >
                <SlidersHorizontal className="mr-2" size={20} />
                {showFilters ? 'Hide' : 'Show'} Filters
              </button>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Categories */}
                <div className="glass p-6 rounded-xl">
                  <h3 className="font-bold text-lg mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          selectedCategory === cat.id
                            ? 'bg-primary-500 text-white'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="glass p-6 rounded-xl">
                  <h3 className="font-bold text-lg mb-4">Price Range</h3>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-600">
                      ${priceRange[0]} - ${priceRange[1]}
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="glass p-6 rounded-xl">
                  <h3 className="font-bold text-lg mb-4">Minimum Rating</h3>
                  <div className="space-y-2">
                    {[0, 3, 4, 4.5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setMinRating(rating)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center ${
                          minRating === rating
                            ? 'bg-primary-500 text-white'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <Star size={16} fill={minRating === rating ? 'white' : '#f59e0b'} className={minRating === rating ? 'text-white' : 'text-amber-500'} />
                        <span className="ml-2">{rating === 0 ? 'All' : `${rating}+`}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tours Grid */}
          <div className="flex-1">
            {/* Sort Controls */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{tours.length}</span> tours
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

            {/* Tours Grid */}
            {loading ? (
                <div className="text-center py-20">Loading tours...</div>
            ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {tours.map((tour, index) => (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/tours/${tour.id}`}>
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

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="flex items-center text-amber-500">
                            <Star size={18} fill="currentColor" className="mr-1" />
                            <span className="font-semibold">{tour.rating}</span>
                            <span className="text-gray-500 ml-1 text-sm">
                              ({tour.reviewCount})
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500">From</div>
                            <div className="text-2xl font-bold text-primary-600">
                              ${tour.price}
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

            {!loading && tours.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl text-gray-600 mb-4">
                  No tours found matching your filters
                </p>
                <Button onClick={() => {
                  setSelectedCategory('all');
                  setPriceRange([0, 5000]);
                  setMinRating(0);
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
