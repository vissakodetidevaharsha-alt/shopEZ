import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer mt-auto">
      <div className="container">
        <div className="row g-4">
          {/* Brand Info */}
          <div className="col-lg-4 col-md-6">
            <h5 className="footer-brand">ShopEZ</h5>
            <p className="text-muted small">
              A premium full-stack MERN e-commerce application. Browse high-quality mock inventory, manage shopping carts, and checkout orders through a modern, responsive layout.
            </p>
            <p className="text-muted small mt-3">
              &copy; {new Date().getFullYear()} ShopEZ. All rights reserved.
            </p>
          </div>

          {/* Quick Shop Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="text-white mb-3 fw-bold">Shop Links</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/products" className="footer-link">All Products</Link></li>
              <li><Link to="/cart" className="footer-link">My Cart</Link></li>
            </ul>
          </div>

          {/* Categories Links */}
          <div className="col-lg-3 col-md-6 col-6">
            <h6 className="text-white mb-3 fw-bold">Categories</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/products?category=Electronics" className="footer-link">Electronics</Link></li>
              <li><Link to="/products?category=Fashion" className="footer-link">Fashion</Link></li>
              <li><Link to="/products?category=Footwear" className="footer-link">Footwear</Link></li>
              <li><Link to="/products?category=Home%20and%20Kitchen" className="footer-link">Home & Kitchen</Link></li>
            </ul>
          </div>

          {/* College Demo Banner */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white mb-3 fw-bold">College Project Demo</h6>
            <p className="text-muted small">
              This application has been developed as an academic showcase using Node.js, Express, React, and MongoDB.
            </p>
            <div className="p-2 border border-secondary rounded text-center small text-warning bg-opacity-10 bg-warning">
              Admin Creds: <strong>admin@shopez.com</strong> / <strong>Admin@123</strong>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
