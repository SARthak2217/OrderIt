import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Icons
import {
  FireIcon,
  GiftIcon,
  ClockIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

const OffersSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // Timer state for flash sale
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const offers = [
    {
      id: 1,
      title: 'Flash Sale',
      subtitle: 'Up to 70% OFF',
      description: 'Limited time mega sale on electronics and gadgets',
      buttonText: 'Shop Now',
      buttonLink: '/flash-sale',
      icon: BoltIcon,
      gradient: 'from-orange-500 to-red-500',
      bgImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=300&fit=crop',
      hasTimer: true
    },
    {
      id: 2,
      title: 'Daily Deals',
      subtitle: 'Fresh Offers Every Day',
      description: 'New deals on groceries and daily essentials',
      buttonText: 'Explore Deals',
      buttonLink: '/daily-deals',
      icon: GiftIcon,
      gradient: 'from-green-500 to-teal-500',
      bgImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=300&fit=crop',
      hasTimer: false
    },
    {
      id: 3,
      title: 'Bulk Orders',
      subtitle: 'Extra 15% OFF',
      description: 'Special discounts on orders above ₹2,000',
      buttonText: 'Order Now',
      buttonLink: '/bulk-orders',
      icon: FireIcon,
      gradient: 'from-purple-500 to-pink-500',
      bgImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=300&fit=crop',
      hasTimer: false
    }
  ];

  const TimerDisplay = () => (
    <div className="flex items-center space-x-4 bg-black bg-opacity-20 rounded-lg p-3 backdrop-blur-sm">
      <ClockIcon className="w-5 h-5 text-white" />
      <div className="flex space-x-2 text-white font-mono">
        <div className="text-center">
          <div className="bg-white bg-opacity-20 rounded px-2 py-1 text-sm font-bold">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div className="text-xs mt-1">HRS</div>
        </div>
        <div className="text-white font-bold self-center">:</div>
        <div className="text-center">
          <div className="bg-white bg-opacity-20 rounded px-2 py-1 text-sm font-bold">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div className="text-xs mt-1">MIN</div>
        </div>
        <div className="text-white font-bold self-center">:</div>
        <div className="text-center">
          <div className="bg-white bg-opacity-20 rounded px-2 py-1 text-sm font-bold">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <div className="text-xs mt-1">SEC</div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-4">
            Amazing <span className="text-gradient">Offers</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Don't miss out on these incredible deals and limited-time offers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {offers.map((offer, index) => {
            const IconComponent = offer.icon;
            
            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group relative overflow-hidden rounded-2xl"
              >
                {/* Background Image with Overlay */}
                <div className="relative h-80 lg:h-96">
                  <img
                    src={offer.bgImage}
                    alt={offer.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${offer.gradient} opacity-85`}></div>
                  
                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-between p-8 text-white">
                    {/* Header */}
                    <div>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold">{offer.title}</h3>
                      </div>
                      
                      <h4 className="text-3xl md:text-4xl font-black mb-2">
                        {offer.subtitle}
                      </h4>
                      
                      <p className="text-white text-opacity-90 mb-6">
                        {offer.description}
                      </p>
                    </div>

                    {/* Timer (only for flash sale) */}
                    {offer.hasTimer && (
                      <div className="mb-6">
                        <TimerDisplay />
                      </div>
                    )}

                    {/* Action Button */}
                    <div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          to={offer.buttonLink}
                          className="inline-flex items-center px-6 py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          {offer.buttonText}
                          <svg 
                            className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </motion.div>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-white bg-opacity-10 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white bg-opacity-10 rounded-full blur-xl"></div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Offer Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16"
        >
          <div className="relative glass rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-90"></div>
            
            <div className="relative px-8 py-12 text-center text-white">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  🎉 Grand Opening Sale! 🎉
                </h3>
                <p className="text-lg md:text-xl mb-6 text-white text-opacity-90">
                  Get <span className="font-black text-yellow-300">FREE DELIVERY</span> on your first order above ₹500
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <span className="text-sm font-semibold">Use Code:</span>
                    <span className="ml-2 font-black text-yellow-300">WELCOME500</span>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/signup"
                      className="px-8 py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-opacity-90 transition-all duration-300 shadow-lg"
                    >
                      Sign Up Now
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-4 left-4 w-8 h-8 bg-yellow-400 rounded-full animate-pulse opacity-60"></div>
            <div className="absolute top-8 right-16 w-4 h-4 bg-pink-400 rounded-full animate-bounce opacity-60"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
            <div className="absolute bottom-8 left-16 w-5 h-5 bg-green-400 rounded-full animate-bounce opacity-60"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OffersSection;
