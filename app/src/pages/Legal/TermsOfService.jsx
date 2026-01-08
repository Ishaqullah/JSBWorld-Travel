import { useEffect } from 'react';

export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-center mb-6">
          <span className="text-gradient">Terms & Conditions</span>
        </h1>
        <p className="text-lg text-gray-600 text-center mb-12">
          By using this website or booking services through JSB World-Travel, you agree to the following terms.
        </p>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          
          {/* Role of JSB World-Travel */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">Role of JSB World-Travel</h2>
            <p className="text-gray-700 mb-4">
              JSB World-Travel acts solely as a <strong>marketing and sales agent</strong>. All airline tickets, 
              hotel reservations, tours, and packages are <strong>booked and fulfilled by Travecations or 
              third-party travel suppliers</strong>.
            </p>
            <p className="text-gray-700">
              We do not own or operate airlines, hotels, or tour services.
            </p>
          </section>

          {/* Prices & Payments */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">Prices & Payments</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Prices are subject to availability until confirmed.</li>
              <li>Full or partial payment may be required at booking.</li>
              <li>Failure to pay on time may result in cancellation.</li>
            </ul>
          </section>

          {/* Changes & Cancellations */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">Changes & Cancellations</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Changes and cancellations are governed by airline, hotel, and supplier rules.</li>
              <li>Fees, penalties, or fare differences may apply.</li>
              <li>Some bookings are <strong>non-refundable and non-changeable</strong>.</li>
            </ul>
          </section>

          {/* Travel Documents */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">Travel Documents</h2>
            <p className="text-gray-700">
              Travelers are responsible for passports, visas, transit permits, and health requirements.
            </p>
          </section>

          {/* Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">Liability</h2>
            <p className="text-gray-700">
              JSB World-Travel is not responsible for delays, cancellations, weather issues, airline schedule 
              changes, lost baggage, or acts beyond our control.
            </p>
          </section>

          {/* Disclaimer */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">Disclaimer</h2>
            <p className="text-gray-700 mb-4">
              JSB World-Travel is a travel marketing and sales company based in Dallas, Texas. We do not own, 
              operate, or control airlines, hotels, transportation providers, or tour operators.
            </p>
            <p className="text-gray-700 mb-4">
              All travel services are provided by independent third-party suppliers, including our booking 
              partner Travecations. JSB World-Travel is not responsible for supplier actions, schedule changes, 
              delays, cancellations, or service failures.
            </p>
            <p className="text-gray-700">
              Travel involves inherent risks. Customers assume full responsibility for travel decisions, 
              documentation, and compliance with entry requirements.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">Governing Law</h2>
            <p className="text-gray-700">
              These terms are governed by the laws of <strong>Texas, USA</strong>.
            </p>
          </section>

          {/* Contact Information */}
          <section className="border-t pt-8 mt-8">
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">Contact Us</h2>
            <p className="text-gray-700">
              If you have any questions about these Terms, please contact us at:{' '}
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
