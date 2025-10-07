import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Icons
import {
  TruckIcon,
  ShieldCheckIcon,
  CurrencyRupeeIcon,
  PhoneIcon,
  ClockIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const AboutSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const features = [
    {
      icon: TruckIcon,
      title: 'Free Delivery',
      description: 'Free delivery on orders above ₹500 across India',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure Payments',
      description: 'Your payments are safe with bank-level security',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: CurrencyRupeeIcon,
      title: 'Best Prices',
      description: 'Competitive pricing with regular discounts',
      gradient: 'from-purple-500 to-indigo-500'
    },
    {
      icon: PhoneIcon,
      title: '24/7 Support',
      description: 'Round-the-clock customer support via phone & chat',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: ClockIcon,
      title: 'Quick Delivery',
      description: 'Same-day delivery available in major cities',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      icon: SparklesIcon,
      title: 'Quality Assured',
      description: '100% genuine products with quality guarantee',
      gradient: 'from-yellow-500 to-amber-500'
    }
  ];

  const stats = [
    { label: 'Happy Customers', value: '50K+', icon: '😊' },
    { label: 'Products Available', value: '10K+', icon: '📦' },
    { label: 'Cities Served', value: '100+', icon: '🏙️' },
    { label: 'Daily Orders', value: '1K+', icon: '🚀' }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-white via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-4">
            Why Choose <span className="text-gradient">OrderIt</span>?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            We're committed to providing you with the best online shopping experience with quality products and exceptional service
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="text-center"
            >
              <div className="glass rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="group"
              >
                <div className="glass rounded-2xl p-8 hover:shadow-xl transition-all duration-500 card-hover h-full">
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* About Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          {/* Text Content */}
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Your Trusted Shopping Partner
            </h3>
            <div className="space-y-4 text-gray-600">
              <p className="leading-relaxed">
                OrderIt is India's fastest-growing e-commerce platform, dedicated to bringing you the best shopping experience right to your doorstep. We believe that shopping should be convenient, affordable, and enjoyable.
              </p>
              <p className="leading-relaxed">
                Our carefully curated selection includes everything from daily essentials and groceries to the latest electronics and fashion. Each product is sourced directly from trusted suppliers and brands to ensure authenticity and quality.
              </p>
              <p className="leading-relaxed">
                With our user-friendly platform, secure payment options, and reliable delivery network, we're committed to making online shopping as seamless as possible for millions of customers across India.
              </p>
            </div>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Founded in 2023 with a vision to transform online shopping</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Serving customers in 100+ cities across India</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700">Partnership with 1000+ trusted brands and suppliers</span>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8"
            >
              <Link
                to="/about"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300"
              >
                Learn More About Us
                <svg 
                  className="ml-2 w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </div>

          {/* Image/Visual Content */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="relative"
            >
              <div className="glass rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop"
                  alt="Shopping Experience"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
                
                {/* Floating Elements */}
                <div className="absolute bottom-6 left-6 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Order Delivered!</div>
                      <div className="text-sm text-gray-600">Within 24 hours</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-3xl opacity-20"></div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
