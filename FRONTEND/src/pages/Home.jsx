import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom'; // Will be used for navigation buttons
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';

// Components
import HeroSection from '../components/home/HeroSection';
import CategorySection from '../components/home/CategorySection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import OffersSection from '../components/home/OffersSection';
import AboutSection from '../components/home/AboutSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import LoadingScreen from '../components/common/LoadingScreen';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  // Intersection Observer for animations
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          axios.get('/categories'),
          axios.get('/products/featured')
        ]);

        setCategories(categoriesRes.data.categories || []);
        setFeaturedProducts(productsRes.data.products || []);
      } catch (error) {
        console.error('Error loading home data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  if (loading) {
    return <LoadingScreen message="Loading OrderIt..." />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Categories Section */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="py-16"
      >
        <CategorySection categories={categories} />
      </motion.div>

      {/* Featured Products Section */}
      <div className="py-16 bg-gray-50">
        <FeaturedProducts products={featuredProducts} />
      </div>

      {/* Special Offers Section */}
      <div className="py-16">
        <OffersSection />
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-gradient-to-br from-primary-50 to-secondary-50">
        <TestimonialsSection />
      </div>

      {/* About Section */}
      <div id="about" className="py-16">
        <AboutSection />
      </div>
    </div>
  );
};

export default Home;
