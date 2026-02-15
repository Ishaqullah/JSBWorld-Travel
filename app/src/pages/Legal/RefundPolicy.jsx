import { useEffect } from 'react';

export default function RefundPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-center mb-6">
          <span className="text-gradient">Refund Policy</span>
        </h1>
        <p className="text-lg text-gray-600 text-center mb-12">
          All refunds are subject to supplier rules (airlines, hotels, tour operators).
        </p>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">

          {/* Airline Tickets */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">Airline Tickets</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Most discounted tickets are <strong>non-refundable</strong>.</li>
              <li>Refundable tickets follow airline rules.</li>
              <li>Airline penalties and service fees may apply.</li>
            </ul>
          </section>

          {/* Hotels & Tours */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">Hotels & Tours</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Refund eligibility depends on supplier cancellation deadlines.</li>
              <li>No-show bookings are usually non-refundable.</li>
            </ul>
          </section>

          {/* Processing Time */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">Processing Time</h2>
            <p className="text-gray-700">
              Approved refunds may take <strong>4–12 weeks</strong> to process and are returned to the
              original form of payment.
            </p>
          </section>

          {/* Service Fees */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">Service Fees</h2>
            <p className="text-gray-700">
              JSB World Travel and its partners' service fees are <strong>non-refundable</strong>.
            </p>
          </section>

          {/* Contact Information */}
          <section className="border-t pt-8 mt-8">
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">Contact Us</h2>
            <p className="text-gray-700">
              If you have any questions about our Refund Policy, please contact us at:{' '}
              <a href="mailto:info@jsbworld-travel.com" className="text-secondary-500 hover:underline">
                info@jsbworld-travel.com
              </a>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
