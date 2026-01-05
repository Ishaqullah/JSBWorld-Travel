import { motion } from 'framer-motion';
import { MapPin, Calendar, Check, Star } from 'lucide-react';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';

const packages = [
  {
    id: 1,
    title: 'Economy Umrah Package',
    duration: '10 Days',
    price: 1200,
    rating: 4.5,
    reviews: 120,
    features: ['3 Star Hotel', 'Visa Processing', 'Transport', 'Ziyarat'],
    image: 'https://images.unsplash.com/photo-1565552629477-0df601205e96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 2,
    title: 'Premium Hajj Package',
    duration: '21 Days',
    price: 8500,
    rating: 5.0,
    reviews: 85,
    features: ['5 Star Hotel near Haram', 'VIP Transport', 'Full Board Meals', 'Guided Tours'],
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 3,
    title: 'Ramadan Umrah Special',
    duration: '15 Days',
    price: 2500,
    rating: 4.8,
    reviews: 200,
    features: ['4 Star Hotel', 'Iftar & Suhoor', 'Visa & Transport', 'Group Guide'],
    image: 'https://images.unsplash.com/photo-1537181534458-76d640269894?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  },
];

export default function UmrahHajj() {
  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1564121211835-e88c852648ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Kaaba in Mecca"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-bold mb-6"
          >
            Spiritual Journeys
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-200 mb-8"
          >
            Experience the sacred pilgrimage of Umrah and Hajj with peace of mind and comfort.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button variant="primary" size="lg">
              View Packages
            </Button>
          </motion.div>
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

        {/* Packages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="h-full flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-primary-600">
                    {pkg.duration}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{pkg.title}</h3>
                    <div className="flex items-center bg-amber-50 px-2 py-1 rounded text-amber-600 text-sm font-semibold">
                      <Star size={14} fill="currentColor" className="mr-1" />
                      {pkg.rating}
                    </div>
                  </div>
                  
                  <ul className="space-y-3 mb-6 flex-1">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-600 text-sm">
                        <Check size={16} className="text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <div>
                      <span className="text-sm text-gray-500">Starting from</span>
                      <div className="text-2xl font-bold text-primary-600">${pkg.price}</div>
                    </div>
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
