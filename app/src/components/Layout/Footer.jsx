import { Link } from 'react-router-dom';
import { Plane, Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', to: '/about' },
      { label: 'Our Team', to: '/team' },
      { label: 'Careers', to: '/careers' },
      { label: 'Press', to: '/press' },
    ],
    support: [
      { label: 'Help Center', to: '/help' },
      { label: 'Safety', to: '/safety' },
      { label: 'Cancellation', to: '/cancellation' },
      { label: 'Contact Us', to: '/contact' },
    ],
    legal: [
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
      { label: 'Cookie Policy', to: '/cookies' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'Youtube' },
  ];

  return (
    <footer className="bg-primary-600 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-br from-secondary-500 to-primary-800 p-2 rounded-lg">
                <Plane className="text-white" size={24} />
              </div>
              <span className="text-2xl font-display font-bold">Travecations</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Discover the world with expertly curated tours. From beaches to mountains,
              culture to adventure - your perfect journey awaits.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-primary-700 flex items-center justify-center hover:bg-gradient-to-br hover:from-secondary-500 hover:to-secondary-600 transition-all duration-300 transform hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="max-w-md mx-auto text-center">
            <Mail className="mx-auto mb-4 text-primary-400" size={32} />
            <h3 className="text-xl font-semibold mb-2">Subscribe to our newsletter</h3>
            <p className="text-gray-400 mb-4">
              Get travel tips, deals, and inspiration delivered to your inbox.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} Travecations. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
