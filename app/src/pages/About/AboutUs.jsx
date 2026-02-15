import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Award, Globe, TrendingUp, Clock, Star, CheckCircle } from 'lucide-react';
import Card from '../../components/UI/Card';
import CeoPhoto from '../../assets/Web_Photo_Editor.jpg';

export default function AboutUs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const whyChooseReasons = [
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
  ];

  const quickBenefits = [
    'Cheap flights from Texas & nationwide',
    'Trusted Dallas travel agency',
    'USA Umrah/Hajj travel services',
    'Family & group travel specialists',
    'Secure bookings & clear policies',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920"
            alt="Travel background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-900/80 to-primary-800/90" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4"
          >
            About <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary-400 to-secondary-200">JSB World Travel</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-200"
          >
            Your Dallas-Based Gateway to the World
          </motion.p>
        </div>
      </section>

      {/* Meet Jaffar Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={CeoPhoto}
                  alt="Jaffar Sorathia - Founder of JSB World Travel"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-secondary-400 to-secondary-600 text-white p-6 rounded-2xl shadow-xl">
                <div className="text-4xl font-bold">35+</div>
                <div className="text-sm">Years in Dallas</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
                Meet Jaffar Sorathia
              </h2>
              <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed border-l-4 border-secondary-500 pl-6 italic">
                "Hi, I'm Jaffar Sorathia. I've been a proud Dallasite for 35 years, and I started JSB World Travel because I believe every traveler deserves a journey that feels personal, not packaged. With deep roots in Pakistan and over three decades in North Texas, I offer a unique perspective that combines genuine Texas hospitality with global 'insider' knowledge. My goal is to create authentic travel experiences you simply won't find on a generic booking site."
              </blockquote>
              <div className="flex items-center gap-4 pt-4">
                <div className="h-px flex-1 bg-gradient-to-r from-secondary-300 to-transparent"></div>
                <span className="text-secondary-600 font-semibold">— Jaffar Sorathia, Founder</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Company Info Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-6">
              Who We Are
            </h2>
            <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
              <p>
                JSB World Travel is a Dallas, Texas–based travel marketing company helping travelers find
                <strong> affordable flights from US</strong>, hotel deals, vacation packages, and religious travel services.
              </p>
              <p>
                We specialize in <strong>airline tickets, hotel bookings, Umrah/Hajj packages, family vacations,
                  and group travel</strong>. JSB World Travel is a licensed travel and tours company.
              </p>
              <p>
                While JSB World Travel focuses on <strong>marketing, sales, and customer support</strong>, all reservations,
                ticketing, and tour management are handled by our trusted fulfillment partner and authorized travel suppliers.
              </p>
            </div>

            {/* Quick Benefits */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {quickBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="text-secondary-500 flex-shrink-0" size={20} />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
              Why Choose <span className="text-gradient">JSB World Travel</span> for Your Next Adventure?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              When you look for a travel agency in Dallas, you want more than a middleman—you want an advocate.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseReasons.map((feature, index) => (
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

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-br from-primary-800 to-primary-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Ready to start planning your next adventure? We're here to help.
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 inline-block">
            <div className="space-y-3 text-left">
              <p className="text-lg"><strong>JSB World Travel</strong></p>
              <p className="text-gray-300">Dallas, Texas, USA</p>
              <p>
                Email:{' '}
                <a href="mailto:info@jsbworld-travel.com" className="text-secondary-400 hover:text-secondary-300 transition-colors">
                  info@jsbworld-travel.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
