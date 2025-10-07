import mongoose from 'mongoose';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Coupon.deleteMany();

    console.log('Existing data cleared...');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@orderit.com',
      password: 'admin123',
      phone: '9876543210',
      role: 'admin'
    });

    // Create test user
    const user = await User.create({
      name: 'Test User',
      email: 'user@orderit.com',
      password: 'user123',
      phone: '9876543211',
      role: 'user'
    });

    console.log('Users created...');

    // Create categories
    const categories = await Category.insertMany([
      {
        name: 'Daily Use Products',
        description: 'Essential items for daily use',
        image: {
          url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop'
        },
        icon: 'fas fa-home',
        sortOrder: 1
      },
      {
        name: 'Electronics',
        description: 'Latest electronic gadgets and devices',
        image: {
          url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=200&fit=crop'
        },
        icon: 'fas fa-laptop',
        sortOrder: 2
      },
      {
        name: 'Groceries',
        description: 'Fresh groceries and food items',
        image: {
          url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=200&fit=crop'
        },
        icon: 'fas fa-shopping-basket',
        sortOrder: 3
      },
      {
        name: 'Clothing',
        description: 'Fashion and clothing items',
        image: {
          url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop'
        },
        icon: 'fas fa-tshirt',
        sortOrder: 4
      },
      {
        name: 'Books',
        description: 'Books and educational materials',
        image: {
          url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop'
        },
        icon: 'fas fa-book',
        sortOrder: 5
      },
      {
        name: 'Sports & Fitness',
        description: 'Sports equipment and fitness gear',
        image: {
          url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop'
        },
        icon: 'fas fa-dumbbell',
        sortOrder: 6
      }
    ]);

    console.log('Categories created...');

    // Create products for each category
    const products = [];

    // Daily Use Products
    products.push(
      {
        name: 'Premium Hand Soap',
        description: 'Antibacterial hand soap with moisturizing formula',
        price: 149,
        originalPrice: 199,
        images: [{
          url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
          public_id: 'soap1'
        }],
        category: categories[0]._id,
        brand: 'CleanHands',
        stock: 100,
        weight: '250ml',
        tags: ['soap', 'antibacterial', 'daily use'],
        createdBy: admin._id,
        isFeatured: true
      },
      {
        name: 'Organic Toothpaste',
        description: 'Natural toothpaste with herbal ingredients',
        price: 89,
        originalPrice: 120,
        images: [{
          url: 'https://images.unsplash.com/photo-1609140025109-bea8f043269f?w=400&h=400&fit=crop',
          public_id: 'toothpaste1'
        }],
        category: categories[0]._id,
        brand: 'NaturalCare',
        stock: 150,
        weight: '100g',
        tags: ['toothpaste', 'organic', 'herbal'],
        createdBy: admin._id
      }
    );

    // Electronics
    products.push(
      {
        name: 'Wireless Bluetooth Earbuds',
        description: 'Premium quality wireless earbuds with noise cancellation',
        price: 2499,
        originalPrice: 3999,
        images: [{
          url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop',
          public_id: 'earbuds1'
        }],
        category: categories[1]._id,
        brand: 'TechSound',
        stock: 50,
        weight: '50g',
        tags: ['earbuds', 'wireless', 'bluetooth'],
        createdBy: admin._id,
        isFeatured: true
      },
      {
        name: 'Smartphone Fast Charger',
        description: '25W fast charging adapter with Type-C cable',
        price: 899,
        originalPrice: 1299,
        images: [{
          url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
          public_id: 'charger1'
        }],
        category: categories[1]._id,
        brand: 'PowerTech',
        stock: 80,
        weight: '200g',
        tags: ['charger', 'fast charging', 'type-c'],
        createdBy: admin._id
      }
    );

    // Groceries
    products.push(
      {
        name: 'Organic Basmati Rice',
        description: 'Premium quality organic basmati rice, aged for perfect aroma',
        price: 299,
        originalPrice: 399,
        images: [{
          url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
          public_id: 'rice1'
        }],
        category: categories[2]._id,
        brand: 'OrganicFields',
        stock: 200,
        weight: '1kg',
        tags: ['rice', 'basmati', 'organic'],
        createdBy: admin._id
      },
      {
        name: 'Fresh Mixed Vegetables Box',
        description: 'Fresh seasonal vegetables box containing 8-10 varieties',
        price: 249,
        originalPrice: 299,
        images: [{
          url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop',
          public_id: 'vegetables1'
        }],
        category: categories[2]._id,
        brand: 'FreshFarm',
        stock: 75,
        weight: '2kg',
        tags: ['vegetables', 'fresh', 'organic'],
        createdBy: admin._id,
        isFeatured: true
      }
    );

    // Clothing
    products.push(
      {
        name: 'Cotton Casual T-Shirt',
        description: 'Comfortable 100% cotton casual t-shirt for everyday wear',
        price: 499,
        originalPrice: 799,
        images: [{
          url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
          public_id: 'tshirt1'
        }],
        category: categories[3]._id,
        brand: 'ComfortWear',
        stock: 120,
        weight: '200g',
        tags: ['t-shirt', 'cotton', 'casual'],
        createdBy: admin._id
      }
    );

    // Books
    products.push(
      {
        name: 'JavaScript Programming Guide',
        description: 'Complete guide to modern JavaScript programming with examples',
        price: 599,
        originalPrice: 899,
        images: [{
          url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop',
          public_id: 'jsbook1'
        }],
        category: categories[4]._id,
        brand: 'TechBooks',
        stock: 60,
        weight: '500g',
        tags: ['javascript', 'programming', 'guide'],
        createdBy: admin._id
      }
    );

    // Sports & Fitness
    products.push(
      {
        name: 'Yoga Mat Premium',
        description: 'Anti-slip yoga mat with perfect cushioning for all exercises',
        price: 899,
        originalPrice: 1299,
        images: [{
          url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop',
          public_id: 'yogamat1'
        }],
        category: categories[5]._id,
        brand: 'FitLife',
        stock: 40,
        weight: '1kg',
        tags: ['yoga', 'mat', 'fitness'],
        createdBy: admin._id,
        isFeatured: true
      }
    );

    await Product.insertMany(products);

    console.log('Products created...');

    // Create sample coupons
    const coupons = await Coupon.insertMany([
      {
        code: 'WELCOME10',
        description: 'Welcome offer - 10% off on orders above ₹999',
        type: 'percentage',
        value: 10,
        minimumAmount: 999,
        maximumDiscount: 500,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        createdBy: admin._id
      },
      {
        code: 'SAVE200',
        description: 'Flat ₹200 off on orders above ₹1999',
        type: 'fixed',
        value: 200,
        minimumAmount: 1999,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
        createdBy: admin._id
      },
      {
        code: 'FIRSTORDER',
        description: 'First order special - 15% off on orders above ₹499',
        type: 'percentage',
        value: 15,
        minimumAmount: 499,
        maximumDiscount: 300,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        userRestrictions: {
          newUsersOnly: true,
          maxUsagePerUser: 1
        },
        createdBy: admin._id
      }
    ]);

    console.log('Coupons created...');

    console.log('✅ Database seeded successfully!');
    console.log('\n📧 Admin Login: admin@orderit.com / admin123');
    console.log('📧 User Login: user@orderit.com / user123');
    console.log('\n🎟️ Sample Coupons:');
    coupons.forEach(coupon => {
      console.log(`   - ${coupon.code}: ${coupon.description}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
