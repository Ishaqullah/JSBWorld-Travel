import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, MapPin, Calendar, Users, DollarSign, Heart, AlertCircle } from 'lucide-react';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function CustomItineraryPage() {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    destination: '',
    travelDates: '',
    numberOfTravelers: 2,
    budget: '',
    preferences: '',
    specialRequests: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-bold mb-4"
          >
            Create Your Dream Trip
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Users className="text-primary-600" size={24} />
                  Your Details
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name *"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                  <Input
                    label="Email Address *"
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>

              {/* Trip Details */}
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <MapPin className="text-primary-600" size={24} />
                  Trip Details
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Where would you like to go? *"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="e.g., Dubai, Maldives, Paris..."
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Calendar className="inline mr-1" size={16} />
                      When do you want to travel? *
                    </label>
                    <input
                      type="text"
                      name="travelDates"
                      value={formData.travelDates}
                      onChange={handleChange}
                      className="input"
                      placeholder="e.g., March 2025, 10-15 April..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Users className="inline mr-1" size={16} />
                      Number of Travelers *
                    </label>
                    <input
                      type="number"
                      name="numberOfTravelers"
                      value={formData.numberOfTravelers}
                      onChange={handleChange}
                      min="1"
                      max="50"
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <DollarSign className="inline mr-1" size={16} />
                      Budget Range (Optional)
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="">Select budget range</option>
                      <option value="Under $1,000">Under $1,000 per person</option>
                      <option value="$1,000 - $2,500">$1,000 - $2,500 per person</option>
                      <option value="$2,500 - $5,000">$2,500 - $5,000 per person</option>
                      <option value="$5,000 - $10,000">$5,000 - $10,000 per person</option>
                      <option value="$10,000+">$10,000+ per person</option>
                      <option value="Flexible">Flexible / Not sure</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Heart className="text-primary-600" size={24} />
                  Preferences & Special Requests
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      What type of experiences are you interested in?
                    </label>
                    <textarea
                      name="preferences"
                      value={formData.preferences}
                      onChange={handleChange}
                      className="input min-h-[100px]"
                      placeholder="e.g., Adventure activities, cultural experiences, beach relaxation, luxury hotels, local cuisine..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Any special requests or requirements?
                    </label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      className="input min-h-[100px]"
                      placeholder="e.g., Dietary restrictions, accessibility needs, special occasions, must-see attractions..."
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center">
                  <AlertCircle size={20} className="mr-2" />
                  {error}
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full md:w-auto"
                  loading={loading}
                  icon={Send}
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </Button>
                <p className="text-sm text-gray-500 mt-4">
                  We'll review your request and get back to you within 24-48 hours with a personalized itinerary proposal.
                </p>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
