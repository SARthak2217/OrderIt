import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import DarkModeToggle from '../common/DarkModeToggle';
// import toast from 'react-hot-toast'; // Will be used for notifications

// Icons
import { 
  ShoppingCartIcon, 
  UserIcon, 
  Bars3Icon, 
  XMarkIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  ClipboardDocumentListIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Categories data (you can move this to a context or fetch from API)
  const categories = [
    { id: 1, name: 'Daily Use Products', icon: 'fas fa-home' },
    { id: 2, name: 'Electronics', icon: 'fas fa-laptop' },
    { id: 3, name: 'Groceries', icon: 'fas fa-shopping-basket' },
    { id: 4, name: 'Clothing', icon: 'fas fa-tshirt' },
    { id: 5, name: 'Books', icon: 'fas fa-book' },
    { id: 6, name: 'Sports & Fitness', icon: 'fas fa-dumbbell' }
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
    setIsCategoriesOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileMenuOpen(false);
  };

  const profileMenuItems = [
    { icon: UserCircleIcon, label: 'Profile', path: '/profile' },
    { icon: ClipboardDocumentListIcon, label: 'My Orders', path: '/orders' },
    { icon: HeartIcon, label: 'Wishlist', path: '/wishlist' },
  ];

  const adminMenuItems = user?.role === 'admin' ? [
    { icon: Cog6ToothIcon, label: 'Admin Dashboard', path: '/admin' },
  ] : [];

  return (
    <>
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-nav dark:bg-gray-900/80 shadow-lg py-2' : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-xl"
              >
                <ShoppingCartIcon className="w-8 h-8 text-white" />
              </motion.div>
              <span className="text-2xl font-heading font-bold text-gradient">
                OrderIt
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`font-medium transition-colors duration-200 ${
                  location.pathname === '/' 
                    ? 'text-primary-600 dark:text-primary-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                Home
              </Link>
              
              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-200"
                >
                  <span>Categories</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>
                
                <AnimatePresence>
                  {isCategoriesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 mt-2 w-64 glass dark:bg-gray-800/80 rounded-xl shadow-xl py-2 z-50"
                    >
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          to={`/categories/${category.id}`}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-white hover:bg-opacity-20 dark:hover:bg-gray-700/50 transition-colors"
                          onClick={() => setIsCategoriesOpen(false)}
                        >
                          <i className={`${category.icon} text-primary-500`}></i>
                          <span>{category.name}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link 
                to="/products" 
                className={`font-medium transition-colors duration-200 ${
                  location.pathname === '/products' 
                    ? 'text-primary-600 dark:text-primary-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                Products
              </Link>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="input-glass dark:bg-gray-800/50 dark:text-white dark:placeholder-gray-400 w-full pl-10 pr-4"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
            </form>

            {/* Right Side Navigation */}
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <DarkModeToggle className="hidden sm:block" />

              {/* Cart */}
              <Link to="/cart" className="relative">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-button p-2 rounded-lg"
                >
                  <ShoppingCartIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </motion.div>
              </Link>

              {/* Authentication */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 glass-button p-2 rounded-lg"
                  >
                    {user?.avatar?.url ? (
                      <img
                        src={user.avatar.url}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-6 h-6 text-gray-700" />
                    )}
                    <span className="hidden lg:block text-gray-700 font-medium">
                      {user?.name}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full right-0 mt-2 w-48 glass rounded-xl shadow-xl py-2 z-50"
                      >
                        {[...profileMenuItems, ...adminMenuItems].map((item, index) => (
                          <Link
                            key={index}
                            to={item.path}
                            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-white hover:bg-opacity-20 transition-colors"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                          </Link>
                        ))}
                        <hr className="border-white border-opacity-20 my-2" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 hover:bg-opacity-20 transition-colors w-full text-left"
                        >
                          <ArrowRightOnRectangleIcon className="w-5 h-5" />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden lg:flex items-center space-x-2">
                  <Link to="/login" className="btn-outline">
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary">
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden glass-button p-2 rounded-lg"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Bars3Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden glass dark:bg-gray-800/80 border-t border-white border-opacity-20 dark:border-gray-700"
            >
              <div className="px-4 py-6 space-y-4">
                {/* Dark Mode Toggle for Mobile */}
                <div className="flex items-center justify-between sm:hidden">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Dark Mode</span>
                  <DarkModeToggle />
                </div>

                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="md:hidden">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="input-glass dark:bg-gray-800/50 dark:text-white dark:placeholder-gray-400 w-full pl-12 pr-4"
                    />
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </form>

                {/* Mobile Navigation Links */}
                <Link to="/" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                  Home
                </Link>
                <Link to="/products" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                  Products
                </Link>
                <Link to="/categories" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                  Categories
                </Link>

                {/* Mobile Auth */}
                {!isAuthenticated && (
                  <div className="pt-4 border-t border-white border-opacity-20 dark:border-gray-700">
                    <Link to="/login" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                      Login
                    </Link>
                    <Link to="/register" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-20"></div>
    </>
  );
};

export default Navbar;
