import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Star, TrendingUp, Award, Globe, Clock } from 'lucide-react';
import { tourService } from '../services/tourService';
import { testimonials, stats } from '../data/testimonials';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';

export default function Home() {
  const [featuredTours, setFeaturedTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedTours = async () => {
      try {
        // Fetch top rated tours
        const response = await tourService.getAllTours({ 
          limit: 3, 
          sortBy: 'rating', 
          order: 'desc' 
        });
        setFeaturedTours(response.tours);
      } catch (error) {
        console.error('Failed to fetch featured tours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTours();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {/* Hero Section - Design Handoff: 650-850px */}
      <section className="relative h-[700px] md:h-[800px] flex items-center justify-center overflow-hidden pt-20 md:pt-10">
        {/* Background Image with Navy Gradient Overlay */}
        <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920')"}}></div>
        <div className="absolute inset-0 gradient-navy-overlay"></div>
        {/* Navy gradient: top to bottom, 60-75% opacity */}
        
        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full backdrop-blur-sm"
        />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6"
          >
            Discover Your Next
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary-400 to-secondary-200">Adventure</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto"
          >
            Explore breathtaking destinations with expert guides. From tropical paradises
            to mountain peaks, your dream journey starts here.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-4xl mx-auto glass rounded-2xl p-2"
          >
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center px-4 py-3 bg-white/50 rounded-xl">
                <MapPin className="text-secondary-600 mr-3" size={20} />
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-600"
                />
              </div>
              <div className="flex items-center px-4 py-3 bg-white/50 rounded-xl">
                <Calendar className="text-secondary-600 mr-3" size={20} />
                <input
                  type="text"
                  placeholder="When?"
                  className="bg-transparent outline-none text-gray-900 placeholder-gray-600"
                />
              </div>
              <div className="flex items-center px-4 py-3 bg-white/50 rounded-xl">
                <Users className="text-secondary-600 mr-3" size={20} />
                <input
                  type="number"
                  placeholder="Guests"
                  className="w-20 bg-transparent outline-none text-gray-900 placeholder-gray-600"
                />
              </div>
              <Button size="lg" icon={Search}>
                Search
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-white">
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* Featured Tours */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-display font-bold mb-4"
            >
              Featured <span className="text-gradient">Adventures</span>
            </motion.h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked experiences for unforgettable journeys
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredTours.map((tour, index) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/tours/${tour.id}`}>
                  <Card hover className="group">
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
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-amber-500">
                          <Star size={18} fill="currentColor" className="mr-1" />
                          <span className="font-semibold">{tour.rating}</span>
                          <span className="text-gray-500 ml-1">({tour.reviewCount})</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">From</div>
                          <div className="text-2xl font-bold text-secondary-600">
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

          <div className="text-center">
            <Link to="/tours">
              <Button size="lg" variant="primary">
                View All Tours
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Design Handoff: 4 columns, 100-140px padding */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Why Choose <span className="text-gradient">Travecations</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: TrendingUp,
                title: 'Best Price Guarantee',
                description: `Find a lower price? We'll match it and give you an extra 5% off.`,
              },
              {
                icon: Award,
                title: 'Expert Local Guides',
                description: 'Our guides are passionate locals who know every hidden gem.',
              },
              {
                icon: Globe,
                title: 'Worldwide Coverage',
                description: '150+ tours in 25+ countries across all continents.',
              },
              {
                icon: Clock,
                title: '24/7 Support',
                description: 'Our dedicated team is always here to help you, anytime, anywhere.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-8 text-center h-full">
                  <div className="inline-flex p-4 bg-gradient-to-br from-secondary-500 to-primary-600 rounded-2xl mb-4">
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
