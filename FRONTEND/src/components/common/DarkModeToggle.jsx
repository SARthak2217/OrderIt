import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const DarkModeToggle = ({ className = '' }) => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleDarkMode}
      className={`group relative p-2 rounded-xl glass hover:shadow-lg transition-all duration-300 ${className}`}
      aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: darkMode ? -180 : 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-6 h-6"
      >
        {darkMode ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.2 }}
          >
            <MoonIcon className="w-6 h-6 text-blue-400 transform rotate-90" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: 30 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.2 }}
          >
            <SunIcon className="w-6 h-6 text-yellow-500" />
          </motion.div>
        )}
      </motion.div>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {darkMode ? 'Light mode' : 'Dark mode'}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
      </div>
    </motion.button>
  );
};

export default DarkModeToggle;
