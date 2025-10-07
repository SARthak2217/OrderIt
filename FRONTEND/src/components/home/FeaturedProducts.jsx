import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

// Icons
import { 
  StarIcon, 
  ShoppingCartIcon, 
  HeartIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const FeaturedProducts = ({ products = [] }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const { addToCart, getItemQuantity } = useCart();
  const [loadingProduct, setLoadingProduct] = useState(null);

  const defaultProducts = [
    {
      _id: '1',
      name: 'Wireless Bluetooth Earbuds',
      description: 'Premium quality wireless earbuds with noise cancellation',
      price: 2499,
      originalPrice: 3999,
      discount: 38,
      images: [{ url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop' }],
      ratings: 4.5,
      numOfReviews: 128,
      category: { name: 'Electronics' },
      brand: 'TechSound',
      isFeatured: true
    },
    {
      _id: '2',
      name: 'Organic Basmati Rice',
      description: 'Premium quality organic basmati rice, aged for perfect aroma',
      price: 299,
      originalPrice: 399,
      discount: 25,
      images: [{ url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop' }],
      ratings: 4.8,
      numOfReviews: 89,
      category: { name: 'Groceries' },
      brand: 'OrganicFields',
      isFeatured: true
    },
    {
      _id: '3',
      name: 'Premium Hand Soap',
      description: 'Antibacterial hand soap with moisturizing formula',
      price: 149,
      originalPrice: 199,
      discount: 25,
      images: [{ url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop' }],
      ratings: 4.3,
      numOfReviews: 67,
      category: { name: 'Daily Use' },
      brand: 'CleanHands',
      isFeatured: true
    },
    {
      _id: '4',
      name: 'Yoga Mat Premium',
      description: 'Anti-slip yoga mat with perfect cushioning for all exercises',
      price: 899,
      originalPrice: 1299,
      discount: 31,
      images: [{ url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop' }],
      ratings: 4.6,
      numOfReviews: 45,
      category: { name: 'Sports' },
      brand: 'FitLife',
      isFeatured: true
    }
  ];

  const displayProducts = products.length > 0 ? products : defaultProducts;

  const handleAddToCart = async (productId) => {
    setLoadingProduct(productId);
    const result = await addToCart(productId, 1);
    setLoadingProduct(null);
    
    if (!result.success) {
      toast.error(result.message);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIconSolid key={i} className="w-4 h-4 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative w-4 h-4">
            <StarIcon className="absolute inset-0 w-4 h-4 text-yellow-400" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <StarIconSolid className="w-4 h-4 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <StarIcon key={i} className="w-4 h-4 text-gray-300" />
        );
      }
    }

    return stars;
  };

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
          Featured <span className="text-gradient">Products</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Discover our handpicked selection of premium products with amazing deals and discounts
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {displayProducts.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group"
          >
            <div className="relative glass rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 card-hover">
              {/* Discount Badge */}
              {product.discount > 0 && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                    {product.discount}% OFF
                  </span>
                </div>
              )}

              {/* Wishlist & Quick View */}
              <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                >
                  <HeartIcon className="w-4 h-4 text-gray-600 hover:text-red-500" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-primary-50 transition-colors"
                >
                  <EyeIcon className="w-4 h-4 text-gray-600 hover:text-primary-500" />
                </motion.button>
              </div>

              {/* Product Image */}
              <div className="relative h-48 overflow-hidden">
                <Link to={`/products/${product._id}`}>
                  <img
                    src={product.images[0]?.url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </Link>
              </div>

              {/* Product Info */}
              <div className="p-6">
                {/* Category & Brand */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-primary-600 font-semibold uppercase tracking-wide">
                    {product.category?.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {product.brand}
                  </span>
                </div>

                {/* Product Name */}
                <Link to={`/products/${product._id}`}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>

                {/* Ratings */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex">
                    {renderStars(product.ratings)}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({product.numOfReviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-xl font-bold text-gray-900">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAddToCart(product._id)}
                  disabled={loadingProduct === product._id}
                  className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loadingProduct === product._id ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <ShoppingCartIcon className="w-5 h-5" />
                      <span>
                        {getItemQuantity(product._id) > 0 
                          ? `In Cart (${getItemQuantity(product._id)})` 
                          : 'Add to Cart'
                        }
                      </span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View All Products Button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center mt-12"
      >
        <Link
          to="/products"
          className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300"
        >
          View All Products
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

export default FeaturedProducts;
