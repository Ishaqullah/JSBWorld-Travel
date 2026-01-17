import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Plane, Globe, Star, Gift, Users, MapPin, Clock, HelpCircle, CreditCard, Briefcase } from 'lucide-react';
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
const ServiceCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
  >
    <div className="w-14 h-14 bg-gradient-to-r from-secondary-300 to-secondary-500 rounded-lg flex items-center justify-center mb-4">
      <Icon className="w-7 h-7 text-white" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

export default function AirlineTicketsPage() {
  const [openFAQ, setOpenFAQ] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqs = [
    {
      question: "Can you help me find cheaper flights?",
      answer: "Absolutely! We have access to exclusive fares, consolidator rates, and group discounts that aren't available on public booking sites. We'll search multiple options to find you the best deal."
    },
    {
      question: "Do you charge booking fees?",
      answer: "Our service fees are competitive and transparent. In many cases, the savings we find you more than offset any fees. We'll always give you a clear breakdown before booking."
    },
    {
      question: "Can you book flights for groups?",
      answer: "Yes! Group bookings are one of our specialties. We can arrange flights for family reunions, corporate travel, religious pilgrimages, and more with special group rates."
    },
    {
      question: "What if I need to change my flight?",
      answer: "We're here to help with changes and cancellations. We'll work with airlines on your behalf to find the best options and minimize any fees."
    },
    {
      question: "Do you handle international flights?",
      answer: "International flights are our specialty! From complex multi-city itineraries to simple round-trips, we handle destinations worldwide with expertise in visa requirements and travel documentation."
    }
  ];

  const services = [
    {
      icon: Globe,
      title: "International Flights",
      description: "Expert booking for international destinations with the best connections and competitive pricing worldwide."
    },
    {
      icon: Plane,
      title: "Domestic Flights",
      description: "Quick and easy domestic flight bookings across all major US carriers with flexible options."
    },
    {
      icon: Users,
      title: "Group Travel",
      description: "Special rates and coordinated bookings for groups, families, and corporate travel."
    },
    {
      icon: Briefcase,
      title: "Business Class",
      description: "Premium cabin bookings with exclusive perks, lounge access, and priority services."
    },
    {
      icon: MapPin,
      title: "Multi-City Routes",
      description: "Complex itineraries made simple. We'll optimize your multi-destination travel plans."
    },
    {
      icon: Clock,
      title: "Last-Minute Deals",
      description: "Need to fly urgently? We find the best last-minute fares and expedite your booking."
    }
  ];

  const benefits = [
    { icon: Gift, title: "Exclusive Fares", description: "Access to rates not available online" },
    { icon: Star, title: "Price Match", description: "We'll match or beat competitor prices" },
    { icon: CreditCard, title: "Flexible Payment", description: "Multiple payment options available" },
    { icon: Users, title: "24/7 Support", description: "Always here when you need us" }
  ];

  return (
    <div className="min-h-screen pb-16 bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden pt-20 md:pt-24">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1920&auto=format&fit=crop"
            alt="Airplane in Flight"
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
            <span className="bg-clip-text text-white">Airline</span>
            <span className="ml-3 bg-clip-text text-transparent bg-gradient-to-r from-secondary-400 to-secondary-200">Tickets</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-200 mb-8"
          >
            Your Flight, Our Expertise — Best Fares Guaranteed
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
                Enquire Now
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
            Skip the endless tabs and confusing prices. At JSB World-Travel, we leverage our airline partnerships and industry expertise to find you the perfect flight at the best price — every time.
          </p>
        </motion.div>

        {/* Why Book With Us */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Why Book Flights Through a Travel Agent?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Online booking sites show you what's available. We show you what's best — and often find deals you'd never discover on your own.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { emoji: "💰", text: "Access to exclusive consolidator fares and airline deals" },
              { emoji: "🎯", text: "Expert advice on routes, layovers, and timing" },
              { emoji: "✈️", text: "All airlines compared in one place — major carriers and budget" },
              { emoji: "🛡️", text: "A real person to call when things go wrong" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-lg transition-shadow"
              >
                <span className="text-4xl mb-4 block">{item.emoji}</span>
                <p className="text-gray-700 font-medium">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Our Services */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Our Flight Services
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Whether you're flying across the country or around the world, we've got you covered with comprehensive booking services.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>

        {/* Why Book With JSB World-Travel */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary-800 to-primary-700 rounded-2xl p-8 md:p-12 text-white mb-12"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                The JSB World-Travel Difference
              </h2>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                With 35 years of experience in the Dallas-Fort Worth area, we combine local expertise with global connections to deliver exceptional flight booking services.
              </p>
            </div>

            {/* Benefits */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
              <h3 className="text-2xl font-bold mb-6 text-secondary-300">What You Get</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
                    <benefit.icon className="w-6 h-6 text-secondary-300" />
                    <span className="font-medium">{benefit.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3 text-secondary-300">Airline Partnerships</h3>
                <p className="text-gray-200">
                  Our relationships with major carriers mean better fares, easier upgrades, and priority service when you need changes.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3 text-secondary-300">Complete Trip Planning</h3>
                <p className="text-gray-200">
                  Bundle your flights with hotels, tours, and transfers. We create complete travel packages tailored to your needs.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3 text-secondary-300">Real Support</h3>
                <p className="text-gray-200">
                  When flights are delayed or cancelled, you have a real person on your side advocating with airlines.
                </p>
              </div>
            </div>
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
            Ready to Book Your Flight?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Tell us where you want to go, and we'll find you the best flight options. No obligation, no hassle — just great fares.
          </p>
          <Link to="/custom-itinerary">
            <Button
              variant="primary"
              className="bg-white text-secondary-600 hover:bg-gray-100 text-lg px-8 py-4 font-bold"
            >
              Get a Free Quote
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
