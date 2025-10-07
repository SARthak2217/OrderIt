import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const CategorySection = ({ categories = [] }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const defaultCategories = [
    {
      _id: '1',
      name: 'Daily Use Products',
      description: 'Essential items for daily use',
      icon: 'fas fa-home',
      image: { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop' }
    },
    {
      _id: '2',
      name: 'Electronics',
      description: 'Latest electronic gadgets',
      icon: 'fas fa-laptop',
      image: { url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=200&fit=crop' }
    },
    {
      _id: '3',
      name: 'Groceries',
      description: 'Fresh groceries and food',
      icon: 'fas fa-shopping-basket',
      image: { url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=200&fit=crop' }
    },
    {
      _id: '4',
      name: 'Clothing',
      description: 'Fashion and clothing',
      icon: 'fas fa-tshirt',
      image: { url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop' }
    },
    {
      _id: '5',
      name: 'Books',
      description: 'Books and education',
      icon: 'fas fa-book',
      image: { url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop' }
    },
    {
      _id: '6',
      name: 'Sports & Fitness',
      description: 'Sports and fitness gear',
      icon: 'fas fa-dumbbell',
      image: { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop' }
    }
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-4">
          Shop by <span className="text-gradient">Category</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Discover our wide range of categories, each carefully curated to meet your specific needs
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayCategories.map((category, index) => (
          <motion.div
            key={category._id}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="group"
          >
            <Link
              to={`/categories/${category._id}`}
              className="block h-full"
            >
              <div className="relative h-full glass rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500">
                {/* Background Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image?.url}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                  
                  {/* Icon Overlay */}
                  <div className="absolute top-4 right-4">
                    <div className="w-12 h-12 glass rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <i className={`${category.icon} text-xl text-primary-600`}></i>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-heading font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-primary-600 font-semibold group-hover:text-primary-700 transition-colors">
                      Explore Products
                    </span>
                    <svg 
                      className="w-5 h-5 text-primary-600 group-hover:translate-x-1 transition-transform" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-300 rounded-2xl transition-all duration-300"></div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* View All Categories Button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center mt-12"
      >
        <Link
          to="/categories"
          className="group inline-flex items-center px-8 py-4 glass-button text-gray-800 font-bold rounded-xl hover:shadow-lg transition-all duration-300"
        >
          View All Categories
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
    </section>
  );
};

export default CategorySection;
