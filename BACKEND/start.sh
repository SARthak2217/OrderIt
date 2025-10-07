#!/bin/bash
cd /Users/sarthak/Desktop/OrderIt/BACKEND
export MONGODB_URI=mongodb://localhost:27017/orderit
export JWT_SECRET=SAR2217
export JWT_EXPIRE=7d
export PORT=5000
export NODE_ENV=development
export RAZORPAY_KEY_ID=rzp_test_RAi5uQX3MTrzfi
export RAZORPAY_SECRET=EWCwDEY9WeX3wv4u2NYQ7MBB
node server.js
