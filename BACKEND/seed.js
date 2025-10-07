import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Import models
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import Coupon from './models/Coupon.js';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const categories = [
  {
    name: 'Electronics',
    description: 'Latest electronic gadgets and devices',
    icon: 'fa-mobile-alt',
    image: { url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop' }
  },
  {
    name: 'Groceries',
    description: 'Fresh groceries and daily essentials',
    icon: 'fa-shopping-basket',
    image: { url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop' }
  },
  {
    name: 'Daily Use Products',
    description: 'Everyday household and personal care items',
    icon: 'fa-home',
    image: { url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop' }
  },
  {
    name: 'Fashion',
    description: 'Trendy clothing and accessories',
    icon: 'fa-tshirt',
    image: { url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop' }
  },
  {
    name: 'Sports & Fitness',
    description: 'Sports equipment and fitness gear',
    icon: 'fa-dumbbell',
    image: { url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop' }
  },
  {
    name: 'Books & Education',
    description: 'Books, educational materials and stationery',
    icon: 'fa-book',
    image: { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop' }
  },
  {
    name: 'iPhone 16 Pro',
    description: 'Latest Apple iPhone 16 Pro with advanced features',
    icon: 'fa-apple',
    image: { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop' }
  }
];

const coupons = [
  {
    code: 'WELCOME10',
    description: 'Welcome offer - 10% off on orders above ₹500',
    type: 'percentage',
    value: 10,
    minimumAmount: 500,
    maximumDiscount: 100,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    usageLimit: 1000,
    isActive: true
  },
  {
    code: 'SAVE200',
    description: 'Flat ₹200 off on orders above ₹1000',
    type: 'fixed',
    value: 200,
    minimumAmount: 1000,
    validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    usageLimit: 500,
    isActive: true
  },
  {
    code: 'BULK15',
    description: 'Bulk order special - 15% off on orders above ₹2000',
    type: 'percentage',
    value: 15,
    minimumAmount: 2000,
    maximumDiscount: 500,
    validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
    usageLimit: 300,
    isActive: true
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});

    // Hash passwords for users
    console.log('Creating users...');
    for (let userData of users) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }
    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create categories
    console.log('Creating categories...');
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create sample products for each category
    console.log('Creating products...');
    const products = [];
    const adminUser = createdUsers.find(user => user.role === 'admin');

    // Electronics
    const electronicsCategory = createdCategories.find(cat => cat.name === 'Electronics');
    products.push(
      {
        name: 'Wireless Bluetooth Earbuds Pro',
        description: 'Premium quality wireless earbuds with active noise cancellation, 30-hour battery life, and crystal clear sound quality. Perfect for music lovers and professionals.',
        price: 2499,
        originalPrice: 3999,
        category: electronicsCategory._id,
        brand: 'TechSound',
        images: [
          { 
            public_id: 'sample_earbuds_1',
            url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop' 
          },
          { 
            public_id: 'sample_earbuds_2',
            url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop' 
          }
        ],
        stock: 50,
        ratings: 4.5,
        numOfReviews: 128,
        isFeatured: true,
        weight: '50g',
        createdBy: adminUser._id,
        specifications: [
          { name: 'Battery Life', value: '30 hours' },
          { name: 'Connectivity', value: 'Bluetooth 5.2' },
          { name: 'Water Resistance', value: 'IPX7' },
          { name: 'Warranty', value: '1 year' }
        ]
      },
      {
        name: 'Smart LED TV 43 Inch 4K',
        description: '43-inch 4K Ultra HD Smart LED TV with Android OS, built-in WiFi, multiple connectivity options, and premium picture quality.',
        price: 25999,
        originalPrice: 35999,
        category: electronicsCategory._id,
        brand: 'VisionTech',
        images: [
          { 
            public_id: 'sample_tv_1',
            url: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&h=500&fit=crop' 
          }
        ],
        stock: 15,
        ratings: 4.3,
        numOfReviews: 89,
        isFeatured: true,
        weight: '8.5kg',
        createdBy: adminUser._id,
        specifications: [
          { name: 'Screen Size', value: '43 inches' },
          { name: 'Resolution', value: '4K Ultra HD' },
          { name: 'Operating System', value: 'Android TV' },
          { name: 'Warranty', value: '2 years' }
        ]
      }
    );

    // Groceries
    const groceriesCategory = createdCategories.find(cat => cat.name === 'Groceries');
    products.push(
      {
        name: 'Organic Basmati Rice Premium',
        description: 'Premium quality organic basmati rice, aged for perfect aroma and taste. Grown without chemicals and pesticides for healthy living.',
        price: 299,
        originalPrice: 399,
        category: groceriesCategory._id,
        brand: 'OrganicFields',
        images: [
          { 
            public_id: 'sample_rice_1',
            url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=500&fit=crop' 
          }
        ],
        stock: 200,
        ratings: 4.8,
        numOfReviews: 156,
        isFeatured: true,
        weight: '5kg',
        createdBy: adminUser._id,
        specifications: [
          { name: 'Weight', value: '5 kg' },
          { name: 'Type', value: 'Basmati Rice' },
          { name: 'Organic', value: 'Yes' },
          { name: 'Shelf Life', value: '12 months' }
        ]
      },
      {
        name: 'Fresh Mixed Vegetables Box',
        description: 'Farm-fresh mixed vegetables box containing seasonal vegetables. Perfect for daily cooking needs with guaranteed freshness.',
        price: 199,
        originalPrice: 249,
        category: groceriesCategory._id,
        brand: 'FreshFarm',
        images: [
          { 
            public_id: 'sample_vegetables_1',
            url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&h=500&fit=crop' 
          }
        ],
        stock: 100,
        ratings: 4.6,
        numOfReviews: 203,
        isFeatured: false,
        weight: '2kg',
        createdBy: adminUser._id,
        specifications: [
          { name: 'Weight', value: '2 kg' },
          { name: 'Type', value: 'Mixed Vegetables' },
          { name: 'Freshness', value: '1-2 days' },
          { name: 'Organic', value: 'Yes' }
        ]
      }
    );

    // Daily Use Products
    const dailyUseCategory = createdCategories.find(cat => cat.name === 'Daily Use Products');
    products.push(
      {
        name: 'Antibacterial Hand Soap Premium',
        description: 'Premium antibacterial hand soap with moisturizing formula. Kills 99.9% germs while keeping hands soft and smooth.',
        price: 149,
        originalPrice: 199,
        category: dailyUseCategory._id,
        brand: 'CleanHands',
        images: [
          { 
            public_id: 'sample_soap_1',
            url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop' 
          }
        ],
        stock: 150,
        ratings: 4.3,
        numOfReviews: 67,
        isFeatured: true,
        weight: '250ml',
        createdBy: adminUser._id,
        specifications: [
          { name: 'Volume', value: '250ml' },
          { name: 'Type', value: 'Liquid Soap' },
          { name: 'Antibacterial', value: 'Yes' },
          { name: 'Skin Type', value: 'All types' }
        ]
      }
    );

    // Sports & Fitness
    const sportsCategory = createdCategories.find(cat => cat.name === 'Sports & Fitness');
    products.push(
      {
        name: 'Premium Yoga Mat Non-Slip',
        description: 'Premium quality yoga mat with anti-slip surface, perfect cushioning, and eco-friendly materials. Ideal for yoga, pilates, and exercises.',
        price: 899,
        originalPrice: 1299,
        category: sportsCategory._id,
        brand: 'FitLife',
        images: [
          { 
            public_id: 'sample_yogamat_1',
            url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop' 
          }
        ],
        stock: 75,
        ratings: 4.6,
        numOfReviews: 45,
        isFeatured: true,
        weight: '1.2kg',
        createdBy: adminUser._id,
        specifications: [
          { name: 'Length', value: '183 cm' },
          { name: 'Width', value: '61 cm' },
          { name: 'Thickness', value: '6 mm' },
          { name: 'Material', value: 'TPE (Eco-friendly)' }
        ]
      }
    );

    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products`);

    // Create coupons
    console.log('Creating coupons...');
    const couponsWithAdmin = coupons.map(coupon => ({
      ...coupon,
      createdBy: adminUser._id
    }));
    const createdCoupons = await Coupon.insertMany(couponsWithAdmin);
    console.log(`✅ Created ${createdCoupons.length} coupons`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: sar123@admin.com / 123');
    console.log('User: user@example.com / password123');
    console.log('\n🏷️ Available Coupons:');
    createdCoupons.forEach(coupon => {
      console.log(`- ${coupon.code}: ${coupon.description}`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    process.exit(0);
  }
};

// Run the seed function
const runSeed = async () => {
  await connectDB();
  await seedDatabase();
};

runSeed();
