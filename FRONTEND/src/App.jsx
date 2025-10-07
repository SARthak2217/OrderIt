import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
// import Products from './pages/Products';
// import ProductDetail from './pages/ProductDetail';
// import Categories from './pages/Categories';
// import CategoryProducts from './pages/CategoryProducts';
// import Profile from './pages/Profile';
// import Orders from './pages/Orders';
// import OrderDetail from './pages/OrderDetail';

// Admin Pages (to be implemented)
// import AdminDashboard from './pages/admin/Dashboard';
// import AdminProducts from './pages/admin/Products';
// import AdminCategories from './pages/admin/Categories';
// import AdminOrders from './pages/admin/Orders';
// import AdminUsers from './pages/admin/Users';
// import AdminCoupons from './pages/admin/Coupons';

// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Error Boundary
import ErrorBoundary from './components/common/ErrorBoundary';

// Loading Screen - will be used for future features
// import LoadingScreen from './components/common/LoadingScreen';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
              <div className="App min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
                <Navbar />
              
              <main className="flex-grow">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl text-gray-500">Products Page - Coming Soon!</h1></div>} />
                  <Route path="/products/:id" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl text-gray-500">Product Detail - Coming Soon!</h1></div>} />
                  <Route path="/categories" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl text-gray-500">Categories - Coming Soon!</h1></div>} />
                  <Route path="/categories/:id" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl text-gray-500">Category Products - Coming Soon!</h1></div>} />
                  <Route path="/cart" element={<Cart />} />
                  
                  {/* Auth Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Protected Routes */}
                  <Route path="/checkout" element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } />
                  <Route path="/order-success/:orderId" element={
                    <ProtectedRoute>
                      <OrderSuccess />
                    </ProtectedRoute>
                  } />
                  <Route path="/orders" element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl text-gray-500">Profile - Coming Soon!</h1></div>
                    </ProtectedRoute>
                  } />
                  <Route path="/orders" element={
                    <ProtectedRoute>
                      <div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl text-gray-500">Orders - Coming Soon!</h1></div>
                    </ProtectedRoute>
                  } />
                  <Route path="/orders/:id" element={
                    <ProtectedRoute>
                      <div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl text-gray-500">Order Detail - Coming Soon!</h1></div>
                    </ProtectedRoute>
                  } />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={
                    <AdminRoute>
                      <AdminPanel />
                    </AdminRoute>
                  } />
                  <Route path="/admin/products" element={
                    <AdminRoute>
                      <div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl text-gray-500">Admin Products - Coming Soon!</h1></div>
                    </AdminRoute>
                  } />
                  <Route path="/admin/categories" element={
                    <AdminRoute>
                      <div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl text-gray-500">Admin Categories - Coming Soon!</h1></div>
                    </AdminRoute>
                  } />
                  <Route path="/admin/orders" element={
                    <AdminRoute>
                      <div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl text-gray-500">Admin Orders - Coming Soon!</h1></div>
                    </AdminRoute>
                  } />
                  <Route path="/admin/users" element={
                    <AdminRoute>
                      <div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl text-gray-500">Admin Users - Coming Soon!</h1></div>
                    </AdminRoute>
                  } />
                  <Route path="/admin/coupons" element={
                    <AdminRoute>
                      <div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl text-gray-500">Admin Coupons - Coming Soon!</h1></div>
                    </AdminRoute>
                  } />
                  
                  {/* Fallback route */}
                  <Route path="*" element={
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                        <p className="text-xl text-gray-600 mb-8">Page not found</p>
                        <a href="/" className="btn-primary">Go Home</a>
                      </div>
                    </div>
                  } />
                </Routes>
              </main>
              
              <Footer />
              
              {/* Toast notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    style: {
                      background: '#22c55e',
                    },
                  },
                  error: {
                    style: {
                      background: '#ef4444',
                    },
                  },
                }}
              />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
