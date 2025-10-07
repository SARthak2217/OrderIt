import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Icons
import { 
  ShoppingCartIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Quick Links',
      links: [
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
        { name: 'Categories', path: '/categories' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' }
      ]
    },
    {
      title: 'Customer Service',
      links: [
        { name: 'Help Center', path: '/help' },
        { name: 'Return Policy', path: '/returns' },
        { name: 'Shipping Info', path: '/shipping' },
        { name: 'Size Guide', path: '/size-guide' },
        { name: 'Track Order', path: '/orders' }
      ]
    },
    {
      title: 'Account',
      links: [
        { name: 'My Account', path: '/profile' },
        { name: 'Order History', path: '/orders' },
        { name: 'Wishlist', path: '/wishlist' },
        { name: 'Shopping Cart', path: '/cart' },
        { name: 'Compare', path: '/compare' }
      ]
    }
  ];

  const categories = [
    'Daily Use Products',
    'Electronics',
    'Groceries',
    'Clothing',
    'Books',
    'Sports & Fitness'
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-xl">
                <ShoppingCartIcon className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-heading font-bold text-gradient">
                OrderIt
              </span>
            </Link>
            
            <p className="text-gray-300 text-sm leading-relaxed">
              Your one-stop destination for all your shopping needs. We offer quality products 
              at competitive prices with fast delivery and excellent customer service.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <MapPinIcon className="w-5 h-5 text-primary-500" />
                <span>123 Shopping Street, Delhi, India - 110001</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <PhoneIcon className="w-5 h-5 text-primary-500" />
                <span>+91 9876543210</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <EnvelopeIcon className="w-5 h-5 text-primary-500" />
                <span>support@orderit.com</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                { icon: 'fab fa-facebook-f', href: '#', color: 'hover:text-blue-400' },
                { icon: 'fab fa-twitter', href: '#', color: 'hover:text-blue-300' },
                { icon: 'fab fa-instagram', href: '#', color: 'hover:text-pink-400' },
                { icon: 'fab fa-linkedin-in', href: '#', color: 'hover:text-blue-600' },
                { icon: 'fab fa-youtube', href: '#', color: 'hover:text-red-500' }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.2, y: -2 }}
                  className={`w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 transition-all duration-300 ${social.color} hover:bg-gray-700`}
                >
                  <i className={social.icon}></i>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-heading font-semibold text-white">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-300 hover:text-primary-400 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Categories Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-gray-700"
        >
          <h3 className="text-lg font-heading font-semibold text-white mb-6">
            Shop by Category
          </h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/categories/${category.toLowerCase().replace(/\s+/g, '-')}`}
                className="glass-button px-4 py-2 rounded-full text-sm text-gray-300 hover:text-white hover:scale-105 transition-all duration-300"
              >
                {category}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Newsletter Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 pt-8 border-t border-gray-700"
        >
          <div className="glass p-8 rounded-2xl">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-heading font-bold text-white mb-2">
                Stay Updated
              </h3>
              <p className="text-gray-300 mb-6">
                Subscribe to our newsletter and get exclusive offers, new product updates, and shopping tips.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 input-glass"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary whitespace-nowrap"
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700 bg-black bg-opacity-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} OrderIt. All rights reserved. Made with{' '}
              <HeartIcon className="w-4 h-4 inline text-red-500" /> in India
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-primary-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-primary-400 transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="hover:text-primary-400 transition-colors">
                Cookie Policy
              </Link>
              <Link to="/sitemap" className="hover:text-primary-400 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40"
      >
        <i className="fas fa-arrow-up"></i>
      </motion.button>
    </footer>
  );
};

export default Footer;
