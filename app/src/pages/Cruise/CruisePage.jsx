import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Ship, Anchor, Star, Gift, Users, Compass, Heart, HelpCircle } from 'lucide-react';
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

// Cruise Type Card
const CruiseTypeCard = ({ icon: Icon, title, description, delay }) => (
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

// Perk Card
const PerkCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="flex items-start gap-4 bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
      <Icon className="w-5 h-5 text-secondary-600" />
    </div>
    <div>
      <h4 className="font-semibold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </motion.div>
);

export default function CruisePage() {
  const [openFAQ, setOpenFAQ] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqs = [
    {
      question: "Can I transfer my cruise booking to JSBWORLD-TRAVEL?",
      answer: "Yes — if your booking is within a certain timeframe, we can take over and offer added perks."
    },
    {
      question: "Do you charge extra fees?",
      answer: "Nope. Our services are usually free — we're paid by the cruise lines, not our clients."
    },
    {
      question: "Do I get better prices with a travel agent?",
      answer: "Often yes — thanks to exclusive rates and group deals you won't find online."
    },
    {
      question: "What if something goes wrong during my trip?",
      answer: "We're with you every step of the way — before, during, and after your cruise."
    }
  ];

  const cruiseTypes = [
    {
      icon: Ship,
      title: "Ocean Cruises",
      description: "Floating resorts with pools, theaters, casinos, and dining options. Perfect for families and first-time cruisers."
    },
    {
      icon: Compass,
      title: "River Cruises",
      description: "Smaller, scenic, and culturally immersive experiences through famous rivers."
    },
    {
      icon: Star,
      title: "Luxury Cruises",
      description: "High-end, all-suite ships with fine dining and white-glove service."
    },
    {
      icon: Anchor,
      title: "Expedition Cruises",
      description: "Adventure voyages to places like Antarctica or the Galápagos."
    },
    {
      icon: Heart,
      title: "Themed Cruises",
      description: "From wine to wellness to pop culture — travel with your tribe."
    }
  ];

  const perks = [
    { icon: Gift, title: "Onboard Credit", description: "Extra spending money for your cruise experience" },
    { icon: Star, title: "Room Upgrades", description: "Better cabins at no extra cost" },
    { icon: Compass, title: "Free Shore Excursions", description: "Explore destinations without added fees" },
    { icon: Users, title: "Dining Packages", description: "Premium dining experiences included" }
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=1920&auto=format&fit=crop"
            alt="Cruise Ship at Sea"
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
            <span className="bg-clip-text text-white">Best Cruise</span>
            <span className="ml-3 bg-clip-text text-transparent bg-gradient-to-r from-secondary-400 to-secondary-200">Deals</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-200 mb-8"
          >
            Why JSBWORLD-TRAVEL Is Your Go-To Cruise Travel Agency
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
                Plan Your Cruise
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
            Planning a cruise should feel exciting — not overwhelming. With JSBWORLD-TRAVEL, you'll enjoy expert planning, exclusive perks, and real savings on every voyage.
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
              Why Should You Book Your Cruise with the Best Cruise Travel Agency?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Cruise lines offer direct booking — sure. But what they don't offer is the kind of personalized service, added value, and insider access you'll get from a cruise-focused travel agency.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { emoji: "🌟", text: "Exclusive deals and upgrades not available to the public" },
              { emoji: "💰", text: "Bundled packages that save you time and money" },
              { emoji: "🛳️", text: "Experienced planners who know the ships, routes, and best times to book" },
              { emoji: "👨‍💼", text: "Real people who've actually sailed — not just call center scripts" }
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

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-lg text-gray-600 mt-8 font-medium"
          >
            With a top-tier cruise agency, you're not just getting a ticket — you're getting a better vacation from start to finish.
          </motion.p>
        </div>

        {/* Types of Cruises */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              What Are the Different Types of Cruises?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Cruises are not one-size-fits-all. From massive ocean liners to intimate river ships, here's a quick guide to the most popular types of cruises we book every day:
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cruiseTypes.map((type, index) => (
              <CruiseTypeCard
                key={index}
                icon={type.icon}
                title={type.title}
                description={type.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>

        {/* Why Book With JSBWORLD-TRAVEL */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary-800 to-primary-700 rounded-2xl p-8 md:p-12 text-white mb-12"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Why Book Your Cruise with Us (JSBWORLD-TRAVEL)?
              </h2>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                We're not generalists — we're cruise specialists. And we built JSBWORLD-TRAVEL around one simple mission: make cruising better, easier, and more rewarding for our clients.
              </p>
            </div>

            {/* Exclusive Perks */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
              <h3 className="text-2xl font-bold mb-6 text-secondary-300">Exclusive Perks</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {perks.map((perk, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
                    <perk.icon className="w-6 h-6 text-secondary-300" />
                    <span className="font-medium">{perk.title}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-300 mt-4 text-center">
                These perks often aren't available when booking direct.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3 text-secondary-300">Expert Knowledge</h3>
                <p className="text-gray-200">
                  We don't just sell cruises — we sail on them. Our firsthand experience means we can recommend the right cruise line, ship, cabin, and itinerary based on what you want.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3 text-secondary-300">Air and Cruise Bundles</h3>
                <p className="text-gray-200">
                  We'll help you bundle flights, transfers, and hotel stays to make your trip smooth and cost-effective.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3 text-secondary-300">Stress-Free Planning</h3>
                <p className="text-gray-200">
                  From planning to booking to sailing, we handle it all — so you can just enjoy the ride.
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
            Let's Plan Your Cruise — And Get You the Best Deal
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            You deserve a cruise that's not just good — but amazing. With JSBWORLD-TRAVEL, you'll get expert advice, added value, and a smoother experience from start to finish.
          </p>
          <Link to="/custom-itinerary">
            <Button
              variant="primary"
              className="bg-white text-secondary-600 hover:bg-gray-100 text-lg px-8 py-4 font-bold"
            >
              Start Planning Now
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
