import { useEffect } from 'react';

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-center mb-6">
          <span className="text-gradient">Privacy Policy</span>
        </h1>
        <p className="text-lg text-gray-600 text-center mb-12">
          JSB World-Travel respects your privacy and protects your personal information.
        </p>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          
          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">Information We Collect</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Name, phone, email</li>
              <li>Traveler and passport details (for booking)</li>
              <li>Payment details (processed securely)</li>
              <li>Website usage data</li>
            </ul>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">How We Use Information</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Process bookings and inquiries</li>
              <li>Communicate confirmations and updates</li>
              <li>Improve services and website experience</li>
              <li>Comply with legal requirements</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">Information Sharing</h2>
            <p className="text-gray-700 mb-4">We may share information with:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Travecations (booking partner)</li>
              <li>Airlines, hotels, tour operators</li>
              <li>Payment processors</li>
              <li>Authorities when legally required</li>
            </ul>
            <p className="text-gray-700 font-semibold">We do not sell personal data.</p>
          </section>

          {/* Security & Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">Security & Cookies</h2>
            <p className="text-gray-700">
              We use standard security measures and cookies to improve user experience.
            </p>
          </section>

          {/* Contact Information */}
          <section className="border-t pt-8 mt-8">
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">Contact Us</h2>
            <p className="text-gray-700">
              If you have any questions about this Privacy Policy, please contact us at:{' '}
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
