import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail } from 'lucide-react';
import Logo from '../../assets/cropped_circle_image.png';

// Custom TikTok icon (lucide doesn't have one)
const TikTokIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', to: '/about' },
      { label: 'Our Team', to: '/' },
      { label: 'Careers', to: '/' },
      { label: 'Press', to: '/' },
    ],
    support: [
      { label: 'Help Center', to: '/' },
      { label: 'Safety', to: '/' },
      { label: 'Cancellation', to: '/' },
      { label: 'Contact Us', to: '/' },
    ],
    legal: [
      { label: 'Privacy Policy', to: '/' },
      { label: 'Terms of Service', to: '/' },
      { label: 'Refund Policy', to: '/' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/share/16ZmNMPGS5/', label: 'Facebook' },
    { icon: TikTokIcon, href: 'https://www.tiktok.com/@jsbworldtravel?_r=1&_t=ZS-92qsJnsrmCL', label: 'TikTok' },
    { icon: Instagram, href: 'https://www.instagram.com/jsbworld_travel?igsh=MTAybW1odDFnajN1NA==', label: 'Instagram' },
  ];

  return (
    <footer className="bg-primary-600 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src={Logo} 
                alt="JSBWORLD TRAVEL Logo" 
                className="h-14 w-14 object-contain rounded-full"
              />
              <span className="text-2xl font-display font-bold">JSBWORLD TRAVEL</span>
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
                className="px-6 py-3 bg-gradient-to-r from-secondary-300 to-secondary-500 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} JSBWORLD TRAVEL. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
