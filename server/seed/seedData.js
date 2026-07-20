const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Review = require('../models/Review');

// Load env variables
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopez')
  .then(() => console.log('MongoDB Connected for seeding...'))
  .catch(err => {
    console.error(`DB Connection Error: ${err.message}`);
    process.exit(1);
  });

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Cart.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();

    console.log('Cleared existing collections...');

    // Seed default admin
    const adminUser = await User.create({
      name: 'ShopEZ Administrator',
      email: 'admin@shopez.com',
      password: 'Admin@123', // Will be hashed automatically by pre-save hook
      role: 'admin',
      address: {
        street: '100 Admin HQ Way',
        city: 'Tech City',
        state: 'Silicon State',
        postalCode: '10101',
        country: 'United States'
      },
      phone: '1234567890'
    });

    console.log('Created Default Admin User...');

    // Create an empty cart for Admin
    await Cart.create({ user: adminUser._id, products: [] });

    // Seed 15 Products
    const products = [
      {
        name: 'Wireless Noise Cancelling Headphones',
        description: 'Premium active noise cancelling over-ear headphones with 40-hour battery life, quick charging, and high-fidelity spatial audio performance.',
        price: 199.99,
        category: 'Electronics',
        brand: 'AcousticTech',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
        stock: 25,
        discount: 15,
        rating: 4.8,
        featured: true
      },
      {
        name: 'Smart Fitness Watch Pro',
        description: 'Track your daily activities, heart rate, blood oxygen levels, sleep quality, and workouts. Features a high-definition AMOLED display and 10 days of battery life.',
        price: 129.99,
        category: 'Electronics',
        brand: 'TempoFit',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60',
        stock: 50,
        discount: 10,
        rating: 4.5,
        featured: true
      },
      {
        name: 'Ultra Slim Laptop 14"',
        description: 'Super-fast performance packed inside a sleek metal chassis. 16GB RAM, 512GB SSD, powered by the latest processor with a crisp display.',
        price: 899.99,
        category: 'Electronics',
        brand: 'ApexPro',
        image: 'https://images.unsplash.com/photo-1496181130204-7552cc145cd1?w=800&auto=format&fit=crop&q=60',
        stock: 12,
        discount: 5,
        rating: 4.7,
        featured: true
      },
      {
        name: 'Classic Leather Jacket',
        description: 'Crafted from premium full-grain leather. Standard collar layout, heavy-duty zipper hardware, and double-stitched durability for a timeless look.',
        price: 149.99,
        category: 'Fashion',
        brand: 'UrbanEdge',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=60',
        stock: 30,
        discount: 20,
        rating: 4.6,
        featured: false
      },
      {
        name: 'Summer Floral Maxi Dress',
        description: 'Breathable lightweight organic cotton. Stunning floral pattern styling, elasticated waistline, and split detailing, ideal for warm seasonal wear.',
        price: 49.99,
        category: 'Fashion',
        brand: 'LotusBloom',
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=60',
        stock: 45,
        discount: 0,
        rating: 4.3,
        featured: false
      },
      {
        name: 'Ultra Boost Athletic Sneakers',
        description: 'Engineered mesh upper for maximum breathability combined with high-grade responsive foam midsole cushioning to provide all-day comfort.',
        price: 119.99,
        category: 'Footwear',
        brand: 'RunPace',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60',
        stock: 40,
        discount: 10,
        rating: 4.9,
        featured: true
      },
      {
        name: 'Premium Leather Loafers',
        description: 'Sophisticated hand-stitched leather dress shoes with rubber inserts in the soles for slip resistance. Perfect for semi-formal and formal business attire.',
        price: 89.99,
        category: 'Footwear',
        brand: 'Vanguard',
        image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&auto=format&fit=crop&q=60',
        stock: 20,
        discount: 0,
        rating: 4.4,
        featured: false
      },
      {
        name: 'Ergonomic Espresso Coffee Maker',
        description: '15-Bar high-pressure pump system produces rich Italian espresso with thick cream layers. Built-in steam wand lets you create velvet milk froths.',
        price: 159.99,
        category: 'Home and Kitchen',
        brand: 'CafeDeluxe',
        image: 'https://via.placeholder.com/300x230?text=Ergonomic+Espresso+Coffee+Maker',
        stock: 15,
        discount: 25,
        rating: 4.7,
        featured: true
      },
      {
        name: 'Professional Knife Set (8-Piece)',
        description: 'Ultra-sharp high-carbon stainless steel blades with comfortable wood handles. Packaged in a beautiful acacia block stand for easy storage.',
        price: 79.99,
        category: 'Home and Kitchen',
        brand: 'CutlerCo',
        image: 'https://images.unsplash.com/photo-1593113598332-cd59c5ad3f90?w=800&auto=format&fit=crop&q=60',
        stock: 18,
        discount: 10,
        rating: 4.2,
        featured: false
      },
      {
        name: 'Hydrating Vitamin C Serum',
        description: 'Advanced organic serum infused with Hyaluronic Acid and Vitamin E. Renews skin cells, brightens skin tones, and reduces dark spots effectively.',
        price: 24.99,
        category: 'Beauty',
        brand: 'GlowSkin',
        image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?w=800&auto=format&fit=crop&q=60',
        stock: 60,
        discount: 5,
        rating: 4.6,
        featured: false
      },
      {
        name: 'Matte Liquid Lipstick Trio',
        description: 'Long-lasting smudge-proof matte liquid lipstick set containing three signature natural shades. Smells delicious and maintains hydration all day.',
        price: 29.99,
        category: 'Beauty',
        brand: 'VividFace',
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=60',
        stock: 35,
        discount: 0,
        rating: 4.3,
        featured: false
      },
      {
        name: 'Deep Work: Rules for Focused Success',
        description: 'Master the art of deep focus in a distracted digital world. Written by Cal Newport, this book provides actionable advice for professional success.',
        price: 15.99,
        category: 'Books',
        brand: 'PaperbackPress',
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format&fit=crop&q=60',
        stock: 100,
        discount: 10,
        rating: 4.8,
        featured: true
      },
      {
        name: 'Atomic Habits',
        description: 'Tiny Changes, Remarkable Results. James Clear provides an easy framework to build good habits and break bad ones. Essential reading.',
        price: 16.99,
        category: 'Books',
        brand: 'AveryPublishing',
        image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=60',
        stock: 120,
        discount: 15,
        rating: 4.9,
        featured: true
      },
      {
        name: 'Adjustable Dumbbell Set (40 lbs)',
        description: 'All-in-one dumbbell set with variable weight adjustments. Solid cast iron build with rubber-coated handles for a secure grip during home workouts.',
        price: 99.99,
        category: 'Sports',
        brand: 'IronGrip',
        image: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=800&auto=format&fit=crop&q=60',
        stock: 15,
        discount: 0,
        rating: 4.5,
        featured: false
      },
      {
        name: 'Professional Soccer Ball Size 5',
        description: 'Thermbonded PU cover with textured finish for stable aerodynamic flight. Bladder technology keeps air sealed tight. Ideal for competitive matches.',
        price: 34.99,
        category: 'Sports',
        brand: 'AeroGoal',
        image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=60',
        stock: 30,
        discount: 20,
        rating: 4.1,
        featured: false
      }
        ,
    {
      name: 'Organic Green Tea Pack',
      description: 'Premium organic green tea leaves, 100g pack for a healthy boost.',
      price: 19.99,
      category: 'Food & Beverage',
      brand: 'NatureSip',
      image: 'https://images.unsplash.com/photo-1518977956815-0c9f6c4ca5b0?w=800&auto=format&fit=crop&q=60',
      stock: 80,
      discount: 10,
      rating: 4.5,
      featured: false
    },
    {
      name: 'Bluetooth Wireless Earbuds',
      description: 'Compact true wireless earbuds with high fidelity sound and long battery life.',
      price: 59.99,
      category: 'Electronics',
      brand: 'SoundWave',
      image: 'https://images.unsplash.com/photo-1512499617640-c2f9996d2b1d?w=800&auto=format&fit=crop&q=60',
      stock: 40,
      discount: 20,
      rating: 4.4,
      featured: true
    },
    {
      name: 'Stainless Steel Water Bottle',
      description: 'Insulated 750ml bottle keeps drinks cold for 24h or hot for 12h.',
      price: 24.99,
      category: 'Home and Kitchen',
      brand: 'PureSip',
      image: 'https://images.unsplash.com/photo-1556911220-9c6a2e0f5c0d?w=800&auto=format&fit=crop&q=60',
      stock: 60,
      discount: 15,
      rating: 4.7,
      featured: false
    },
    {
      name: 'Yoga Mat Eco-friendly',
      description: 'Non‑slip, 6mm thick eco‑friendly yoga mat made from natural rubber.',
      price: 34.99,
      category: 'Sports',
      brand: 'FlexFit',
      image: 'https://images.unsplash.com/photo-1588776816730-7e7c7e7e0f2d?w=800&auto=format&fit=crop&q=60',
      stock: 70,
      discount: 5,
      rating: 4.6,
      featured: true
    },
    {
      name: 'Classic Hardcover Novel Set',
      description: 'Three timeless classics bound in elegant hardcover editions.',
      price: 44.99,
      category: 'Books',
      brand: 'LiteratureCo',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=60',
      stock: 30,
      discount: 0,
      rating: 4.9,
      featured: false
    }
];

    await Product.insertMany(products);
    console.log('Successfully Seeded 15 Products...');

    console.log('Database Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error(`Error during seeding: ${error.message}`);
    process.exit(1);
  }
};

seedData();
