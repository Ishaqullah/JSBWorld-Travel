import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Globe, Phone, MapPin, Plane, Hotel, Ship, Briefcase, Heart, Star, Users, MessageCircle, HelpCircle } from 'lucide-react';
import Button from '../../components/UI/Button';
import { Link } from 'react-router-dom';

// FAQ Accordion Component
const FAQItem = ({ question, answer, isOpen, onClick }) => (
  <div className="border-b border-gray-200">
    <button
      onClick={onClick}
      className="w-full py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
    >
      <span className="text-lg font-semibold text-gray-900">{question}</span>
      <ChevronDown
        className={`w-5 h-5 text-secondary-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
      />
    </button>
    <motion.div
      initial={false}
      animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <p className="pb-5 text-gray-600 leading-relaxed">{answer}</p>
    </motion.div>
  </div>
);

// Service Card
const ServiceCard = ({ icon: Icon, title, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-center"
  >
    <div className="w-14 h-14 bg-gradient-to-r from-secondary-300 to-secondary-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
      <Icon className="w-7 h-7 text-white" />
    </div>
    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
  </motion.div>
);

// Testimonial Card
const TestimonialCard = ({ quote, author, location, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
  >
    <div className="flex gap-1 mb-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} size={18} className="text-yellow-400 fill-yellow-400" />
      ))}
    </div>
    <p className="text-gray-700 italic mb-4">"{quote}"</p>
    <div className="border-t pt-4">
      <p className="font-semibold text-gray-900">{author}</p>
      <p className="text-sm text-gray-500">{location}</p>
    </div>
  </motion.div>
);

export default function DallasTravelAgency() {
  const [openFAQ, setOpenFAQ] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const services = [
    { icon: Plane, title: "Flight & Hotel Bookings" },
    { icon: Hotel, title: "All-Inclusive Vacations" },
    { icon: Ship, title: "Cruises & Group Travel" },
    { icon: Briefcase, title: "Corporate & Business Trips" },
    { icon: Heart, title: "Honeymoons & Romantic Escapes" },
  ];

  const testimonials = [
    {
      quote: "JSBWORLD-TRAVEL planned our dream trip to Italy — stress-free, seamless, and unforgettable.",
      author: "Emily R.",
      location: "Dallas TX"
    },
    {
      quote: "Best service ever! They got us a better deal than anything we saw online.",
      author: "Marcus D.",
      location: "The Woodlands TX"
    }
  ];

  const faqs = [
    {
      question: "Why should I use a travel agency instead of booking online?",
      answer: "A travel agency like JSBWORLD-TRAVEL offers personalized service, 24/7 support, better deals through industry connections, and expert knowledge that online booking sites simply can't provide. We save you time and often money while ensuring a stress-free experience."
    },
    {
      question: "What areas does JSBWORLD-TRAVEL serve?",
      answer: "While we're based in Dallas, TX, we serve clients throughout Texas and across the nation. Our expertise in Dallas travel needs makes us the perfect choice for local travelers."
    },
    {
      question: "Do you offer group travel packages?",
      answer: "Yes! We specialize in group travel for families, corporate events, weddings, and special occasions. Contact us for custom group rates and itineraries."
    },
    {
      question: "How do I get started with booking my trip?",
      answer: "Simply reach out to us through our contact form or give us a call. We'll schedule a consultation to understand your travel preferences and create a personalized itinerary just for you."
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1920&auto=format&fit=crop"
            alt="Dallas Skyline"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-bold mb-6"
          >
            <span className="bg-clip-text text-white">Your Trusted</span>
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-secondary-400 to-secondary-200">Dallas TX Travel Agency</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-200 mb-8"
          >
            Making every trip from Dallas an effortless and unforgettable experience
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/custom-itinerary">
              <Button
                variant="primary"
                className="bg-gradient-to-r from-secondary-300 to-secondary-500 hover:from-secondary-400 hover:to-secondary-600 text-lg px-8 py-4"
              >
                Plan Your Trip Today
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Intro Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl shadow-sm p-6 md:p-10 mb-16"
        >
          <p className="text-xl text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
            Planning a vacation should be exciting, not stressful. At JSBWORLD-TRAVEL, we craft personalized itineraries with care, passion, and precision — because travel is more than where you go, it's how you feel along the way.
          </p>
        </motion.div>

        {/* Why Choose Us */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Why Choose a Travel Agency in Dallas Instead of Booking Online?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We know how tempting it is to book trips online. Endless searching, hidden fees, and hours wasted comparing flights and hotels. That's exactly why we built a Dallas TX travel agency that puts people first.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { emoji: "🌍", title: "Personalized Planning", text: "We take time to understand your travel style — whether it's luxury, budget-friendly, or adventure-packed." },
              { emoji: "📞", title: "24/7 Travel Support", text: "Flight delayed? Need to change plans? Our team is always just a phone call away." },
              { emoji: "🏙️", title: "Local Dallas Knowledge", text: "As a Dallas-based agency, we understand our community's needs better than any faceless website ever could." }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <span className="text-4xl mb-4 block">{item.emoji}</span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.text}</p>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-lg text-gray-600 mt-8 font-medium"
          >
            That's why so many clients call us the <span className="text-secondary-600 font-bold">best travel agency Dallas</span> has to offer.
          </motion.p>
        </div>

        {/* Services */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Services We Offer
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our Dallas travel services cover everything from a simple weekend getaway to once-in-a-lifetime adventures. Whether you're looking for custom flight deals, romantic honeymoons, family trips, or all-inclusive vacation packages — we handle every detail for you.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Real Client Experiences
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              One of our favorite parts of running this agency is hearing the stories from our travelers — couples celebrating anniversaries, families making memories, and solo explorers chasing bucket-list adventures.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                quote={testimonial.quote}
                author={testimonial.author}
                location={testimonial.location}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>

        {/* Why Best */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary-800 to-primary-700 rounded-2xl p-8 md:p-12 text-white"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Why JSBWORLD-TRAVEL Is the Best Travel Agency in Dallas
              </h2>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                What sets us apart is simple: we care more. Every trip is personal to us and our team. We know our clients by name, not by booking number. We fight for better prices, smoother itineraries, and the little extras that make your journey truly special.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <Star className="w-10 h-10 text-secondary-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-secondary-300">Expert Local Agents</h3>
                <p className="text-gray-200">Who know Dallas travelers best</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <Globe className="w-10 h-10 text-secondary-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-secondary-300">Custom Itineraries</h3>
                <p className="text-gray-200">Designed around your lifestyle</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <MessageCircle className="w-10 h-10 text-secondary-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-secondary-300">Unmatched Support</h3>
                <p className="text-gray-200">From booking to boarding</p>
              </div>
            </div>

            <p className="text-center text-gray-300 mt-8">
              That's why we're proud to be recognized as one of the <span className="text-secondary-300 font-bold">best travel agencies in Dallas Texas</span>.
            </p>
          </motion.div>
        </div>

        {/* FAQs */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <HelpCircle className="w-8 h-8 text-secondary-500" />
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
                Frequently Asked Questions
              </h2>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-sm p-6 md:p-8 max-w-3xl mx-auto"
          >
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === index}
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              />
            ))}
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-secondary-400 to-secondary-600 rounded-2xl p-8 md:p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Let JSBWORLD-TRAVEL handle all the details while you focus on making memories. Contact us today for a free consultation!
          </p>
          <Link to="/custom-itinerary">
            <Button
              variant="primary"
              className="bg-white text-secondary-600 hover:bg-gray-100 text-lg px-8 py-4 font-bold"
            >
              Get Your Free Quote
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
