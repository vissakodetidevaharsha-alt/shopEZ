import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import { FiSmartphone, FiGift, FiShield, FiTruck, FiRefreshCw, FiHeadphones } from 'react-icons/fi';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const featuredRes = await API.get('/products?featured=true');
        const discountRes = await API.get('/products?discount=true');
        
        if (featuredRes.data && featuredRes.data.success) {
          setFeaturedProducts(featuredRes.data.products.slice(0, 4));
        }
        if (discountRes.data && discountRes.data.success) {
          setDiscountedProducts(discountRes.data.products.slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching home page products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const categories = [
    { name: 'Electronics', icon: <FiSmartphone /> },
    { name: 'Fashion', icon: <FiGift /> },
    { name: 'Footwear', icon: <FiGift /> },
    { name: 'Home and Kitchen', icon: <FiGift /> },
    { name: 'Beauty', icon: <FiGift /> },
    { name: 'Books', icon: <FiGift /> },
    { name: 'Sports', icon: <FiGift /> }
  ];

  return (
    <div className="page-container">
      {/* Hero Section */}
      <div className="hero-section text-center text-md-start">
        <div className="row align-items-center">
          <div className="col-md-7 hero-content mb-4 mb-md-0">
            <h1 className="hero-title">
              Upgrade Your Lifestyle with <span className="text-primary">ShopEZ</span>
            </h1>
            <p className="hero-subtitle">
              Explore our curated selection of high-quality electronics, fashionable clothes, premium footwear, home decor, and sports gear. Save big with daily discount deals.
            </p>
            <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-3">
              <Link to="/products" className="btn btn-primary-custom px-4 py-2 fs-5">
                Shop Catalog
              </Link>
              <Link to="/products?discount=true" className="btn btn-secondary-custom px-4 py-2 fs-5">
                View Hot Deals
              </Link>
            </div>
          </div>
          <div className="col-md-5 text-center hero-content">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=60"
              alt="Shopping Hero Banner"
              className="img-fluid rounded-premium shadow-lg"
              style={{ maxHeight: '350px', objectFit: 'cover', borderRadius: '1.5rem' }}
            />
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Shop by Category</h2>
          <Link to="/products" className="text-primary fw-semibold text-decoration-none">View All</Link>
        </div>
        <div className="row g-3 justify-content-center">
          {categories.map((cat) => (
            <div key={cat.name} className="col-6 col-md-3 col-lg-2">
              <div
                className="category-card h-100"
                onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
              >
                <div className="category-icon text-secondary">{cat.icon}</div>
                <div className="fw-semibold small text-truncate">{cat.name}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-0">Featured Products</h2>
            <p className="text-muted small mb-0">Our highly recommended products selected just for you</p>
          </div>
          <Link to="/products?featured=true" className="text-primary fw-semibold text-decoration-none">View All</Link>
        </div>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <div key={product._id} className="col-sm-6 col-md-4 col-lg-3">
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="col-12 text-center text-muted">No featured products available.</div>
            )}
          </div>
        )}
      </section>

      {/* Discounted Products Banner / Section */}
      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-0">Hot Discounts & Offers</h2>
            <p className="text-muted small mb-0">Grab these items before they run out of stock</p>
          </div>
          <Link to="/products?discount=true" className="text-primary fw-semibold text-decoration-none">View All Deals</Link>
        </div>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-secondary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {discountedProducts.length > 0 ? (
              discountedProducts.map((product) => (
                <div key={product._id} className="col-sm-6 col-md-4 col-lg-3">
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="col-12 text-center text-muted">No discounted products available.</div>
            )}
          </div>
        )}
      </section>

      {/* Benefits Section */}
      <section className="border-top pt-5 mb-4">
        <div className="row g-4 text-center">
          <div className="col-md-4">
            <div className="p-3">
              <div className="fs-1 text-primary mb-3">
                <FiTruck className="mx-auto" />
              </div>
              <h5 className="fw-bold">Fast & Free Delivery</h5>
              <p className="text-muted small px-3">
                Get free shipping on all orders over $50, delivered straight to your doorstep without delay.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3">
              <div className="fs-1 text-primary mb-3">
                <FiRefreshCw className="mx-auto" />
              </div>
              <h5 className="fw-bold">Easy Returns Policy</h5>
              <p className="text-muted small px-3">
                Not satisfied with your product? Return it within 14 days for a full, hassle-free refund.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3">
              <div className="fs-1 text-primary mb-3">
                <FiHeadphones className="mx-auto" />
              </div>
              <h5 className="fw-bold">24/7 Dedicated Support</h5>
              <p className="text-muted small px-3">
                Our support team is always active and ready to help you resolve any order or shipping queries.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
