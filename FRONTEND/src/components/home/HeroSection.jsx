import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, ShoppingBagIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const HeroSection = () => {
  const features = [
    {
      icon: ShoppingBagIcon,
      title: 'Wide Selection',
      description: '10,000+ products'
    },
    {
      icon: TruckIcon,
      title: 'Fast Delivery',
      description: 'Same day delivery'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure Payment',
      description: '100% safe & secure'
    }
  ];

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern opacity-30 dark:opacity-10"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary-300 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center glass-button px-4 py-2 rounded-full"
              >
                <span className="text-primary-600 dark:text-primary-400 font-medium text-sm">
                  🎉 Welcome to OrderIt - Your Shopping Paradise
                </span>
              </motion.div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight">
                <span className="text-gray-900 dark:text-white">Shop </span>
                <span className="text-gradient">Everything</span>
                <br />
                <span className="text-gray-900 dark:text-white">You Need</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                Discover amazing products at unbeatable prices. From daily essentials to luxury items, 
                we have everything you need delivered right to your doorstep.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/products"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Shopping
                  <ArrowRightIcon className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/categories"
                  className="group inline-flex items-center justify-center px-8 py-4 glass-button text-gray-800 dark:text-gray-200 font-bold rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  Browse Categories
                </Link>
              </motion.div>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-8 pt-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                  className="flex items-center space-x-3"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-xl flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Hero Image/Animation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Hero Graphic */}
              <div className="relative w-full h-96 md:h-[500px] rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-200 via-secondary-200 to-accent-200"></div>
                
                {/* Floating Product Cards */}
                {[
                  { name: 'Electronics', icon: '💻', x: 10, y: 20, delay: 0.2 },
                  { name: 'Fashion', icon: '👕', x: 70, y: 15, delay: 0.4 },
                  { name: 'Books', icon: '📚', x: 15, y: 70, delay: 0.6 },
                  { name: 'Sports', icon: '⚽', x: 75, y: 75, delay: 0.8 },
                  { name: 'Groceries', icon: '🛒', x: 50, y: 50, delay: 1.0 },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      y: 0,
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      delay: item.delay,
                      duration: 0.6,
                      rotate: {
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                    className="absolute glass p-4 rounded-xl shadow-lg"
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">{item.icon}</div>
                      <div className="text-xs font-semibold text-gray-700">{item.name}</div>
                    </div>
                  </motion.div>
                ))}

                {/* Central Shopping Cart */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 glass p-8 rounded-2xl shadow-2xl"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center"
                  >
                    <ShoppingBagIcon className="w-8 h-8 text-white" />
                  </motion.div>
                </motion.div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-secondary-400 to-accent-400 rounded-full opacity-20 animate-pulse"></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center text-gray-500"
        >
          <span className="text-sm font-medium mb-2">Scroll to explore</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
