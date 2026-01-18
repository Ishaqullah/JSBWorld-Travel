import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, X, Minus, Plus, ChevronDown } from 'lucide-react';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';
import { categoryService } from '../../services/tourService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function CustomItineraryPage() {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    departureDate: '',
    arrivalDate: '',
    departureCity: '',
    destination: '',
    totalDays: 1,
    adultsCount: 1,
    childrenCount: 0,
    infantsCount: 0,
    details: '',
    returnTicket: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories for the Tour Type dropdown
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        // Fallback categories if API fails
        setCategories([
          { id: '1', name: 'Beach' },
          { id: '2', name: 'Mountain' },
          { id: '3', name: 'Wildlife' },
          { id: '4', name: 'Culture' },
          { id: '5', name: 'Adventure' },
          { id: '6', name: 'Umrah' },
        ]);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCounterChange = (field, increment) => {
    setFormData(prev => {
      const minValue = field === 'totalDays' || field === 'adultsCount' ? 1 : 0;
      const newValue = prev[field] + increment;
      return { ...prev, [field]: Math.max(minValue, newValue) };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/custom-itinerary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit request');
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen pt-20 pb-16 bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full mx-4"
        >
          <Card className="p-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="text-green-600" size={48} />
            </motion.div>
            <h2 className="text-3xl font-bold mb-4">Request Submitted!</h2>
            <p className="text-gray-600 mb-8">
              Thank you for your custom itinerary request! Our travel experts will review your requirements
              and get back to you within 24-48 hours with a personalized proposal.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              A confirmation email has been sent to {formData.customerEmail}
            </p>
            <Button onClick={() => window.location.href = '/tours'} variant="primary">
              Browse Other Tours
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Counter Component
  const Counter = ({ label, value, onChange, min = 0 }) => (
    <div className="flex flex-col items-center">
      <label className="block text-sm font-semibold text-gray-800 mb-3 text-center">{label}</label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(-1)}
          disabled={value <= min}
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all
            bg-gradient-to-r from-secondary-300 to-secondary-500 text-white
            hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus size={18} />
        </button>
        <span className="w-8 text-center text-lg font-semibold">{value}</span>
        <button
          type="button"
          onClick={() => onChange(1)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all
            bg-gradient-to-r from-secondary-300 to-secondary-500 text-white
            hover:shadow-lg"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-16 bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-secondary-300 to-secondary-500 text-white pt-28 md:pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-bold mb-4"
          >
            Build Custom Itinerary
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90"
          >
            Tell us what you're looking for and our experts will craft the perfect itinerary for you
          </motion.p>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-8 relative">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Name and Number */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Name</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="Write your name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-400 focus:border-secondary-400 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Number</label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    placeholder="Write your number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-400 focus:border-secondary-400 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Email</label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  placeholder="Write your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-400 focus:border-secondary-400 outline-none transition-all"
                  required
                />
              </div>

              {/* Row 3: Departure Date and Return Ticket Checkbox */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Departure Date</label>
                  <input
                    type="date"
                    name="departureDate"
                    value={formData.departureDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-400 focus:border-secondary-400 outline-none transition-all"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="returnTicket"
                      checked={formData.returnTicket}
                      onChange={(e) => setFormData(prev => ({ ...prev, returnTicket: e.target.checked, arrivalDate: e.target.checked ? prev.arrivalDate : '' }))}
                      className="w-5 h-5 text-secondary-500 border-gray-300 rounded focus:ring-secondary-400"
                    />
                    <span className="ml-3 text-sm font-semibold text-gray-800">Return Ticket</span>
                  </label>
                </div>
              </div>

              {/* Arrival Date - Only shown if Return Ticket is checked */}
              {formData.returnTicket && (
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Arrival Date (Return)</label>
                  <input
                    type="date"
                    name="arrivalDate"
                    value={formData.arrivalDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-400 focus:border-secondary-400 outline-none transition-all"
                    min={formData.departureDate || new Date().toISOString().split('T')[0]}
                    required={formData.returnTicket}
                  />
                </div>
              )}

              {/* Row 3: Departure City and Destination */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Departure City</label>
                  <input
                    type="text"
                    name="departureCity"
                    value={formData.departureCity}
                    onChange={handleChange}
                    placeholder="Write your departure city"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-400 focus:border-secondary-400 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Destination</label>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="Write your destination"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-400 focus:border-secondary-400 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Row 4: Counters - Total Days, Adults, Children, Infants */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Counter
                  label="Total Days"
                  value={formData.totalDays}
                  onChange={(inc) => handleCounterChange('totalDays', inc)}
                  min={1}
                />
                <Counter
                  label="Adults"
                  value={formData.adultsCount}
                  onChange={(inc) => handleCounterChange('adultsCount', inc)}
                  min={1}
                />
                <Counter
                  label="Children"
                  value={formData.childrenCount}
                  onChange={(inc) => handleCounterChange('childrenCount', inc)}
                  min={0}
                />
                <Counter
                  label="Infants"
                  value={formData.infantsCount}
                  onChange={(inc) => handleCounterChange('infantsCount', inc)}
                  min={0}
                />
              </div>

              {/* Row 5: Details */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Details</label>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  placeholder="Write your details"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-400 focus:border-secondary-400 outline-none transition-all min-h-[120px] resize-y"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center">
                  <X size={20} className="mr-2" />
                  {error}
                </div>
              )}

              {/* Multiple Cities Note */}
              <div className="p-4 bg-secondary-50 border border-secondary-200 rounded-lg">
                <p className="text-sm text-secondary-700 text-center">
                  📍 <span className="font-semibold">For multiple cities,</span> please <a href="/contact" className="text-secondary-600 underline hover:text-secondary-800">contact us</a> directly.
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                className="w-full py-4 text-lg font-semibold"
                loading={loading}
                icon={Send}
              >
                {loading ? 'Submitting...' : 'Submit Custom Itinerary'}
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
