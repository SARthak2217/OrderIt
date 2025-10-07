import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { StarIcon } from '@heroicons/react/24/solid';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const TestimonialsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      location: 'Mumbai, Maharashtra',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      text: 'OrderIt has completely changed how I shop online. The delivery is always on time, and the quality of products is excellent. The groceries section is my favorite!',
      category: 'Groceries & Daily Use',
      date: '2 weeks ago'
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      location: 'Delhi, NCR',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      text: 'I ordered a smartphone and the whole experience was seamless. From browsing to delivery, everything was perfect. Great customer service too!',
      category: 'Electronics',
      date: '1 month ago'
    },
    {
      id: 3,
      name: 'Anita Desai',
      location: 'Bangalore, Karnataka',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      text: 'The variety of products is amazing and the prices are very competitive. I especially love the coupon system - saved so much money on my bulk orders!',
      category: 'Bulk Orders',
      date: '3 weeks ago'
    },
    {
      id: 4,
      name: 'Vikram Singh',
      location: 'Jaipur, Rajasthan',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      text: 'Fast delivery, genuine products, and excellent customer support. OrderIt has become my go-to platform for all shopping needs. Highly recommended!',
      category: 'Daily Use Products',
      date: '1 week ago'
    },
    {
      id: 5,
      name: 'Meera Patel',
      location: 'Ahmedabad, Gujarat',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      text: 'The user interface is so clean and easy to navigate. Finding products is effortless, and the checkout process is super smooth. Love the glassmorphism design!',
      category: 'User Experience',
      date: '5 days ago'
    },
    {
      id: 6,
      name: 'Arjun Nair',
      location: 'Chennai, Tamil Nadu',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      text: 'Outstanding service! The free delivery on orders above ₹500 is a great deal. Quality products and timely delivery make OrderIt my preferred choice.',
      category: 'Delivery Service',
      date: '2 months ago'
    }
  ];

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);

  // Auto-slide functionality
  React.useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 3 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 3 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 3 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-blue-50">
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
            What Our <span className="text-gradient">Customers</span> Say
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it - hear from thousands of satisfied customers who love shopping with OrderIt
          </p>
        </motion.div>

        {/* Testimonials Slider */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="overflow-hidden"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <motion.div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  className="w-1/3 flex-shrink-0 px-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                >
                  <div className="glass rounded-2xl p-8 h-full hover:shadow-2xl transition-all duration-500 card-hover">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">
                            {testimonial.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {testimonial.location}
                          </p>
                          <p className="text-xs text-primary-600 font-semibold mt-1">
                            {testimonial.category}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex space-x-1 mb-1">
                          {renderStars(testimonial.rating)}
                        </div>
                        <p className="text-xs text-gray-500">
                          {testimonial.date}
                        </p>
                      </div>
                    </div>

                    {/* Testimonial Text */}
                    <div className="relative">
                      <div className="absolute -top-2 -left-2 text-4xl text-primary-200 font-serif">
                        "
                      </div>
                      <p className="text-gray-700 leading-relaxed pl-6 italic">
                        {testimonial.text}
                      </p>
                      <div className="absolute -bottom-4 -right-2 text-4xl text-primary-200 font-serif">
                        "
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20 blur-sm"></div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
          >
            <ChevronLeftIcon className="w-6 h-6 text-gray-600 group-hover:text-primary-600" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
          >
            <ChevronRightIcon className="w-6 h-6 text-gray-600 group-hover:text-primary-600" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {Array.from({ length: testimonials.length - 2 }, (_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? 'bg-primary-500 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="glass rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Join Our Happy Customers Community
            </h3>
            <p className="text-gray-600 mb-6">
              Experience the OrderIt difference and see why thousands of customers trust us for their shopping needs
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300"
            >
              Start Shopping Today
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
