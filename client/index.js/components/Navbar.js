import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { FiShoppingCart, FiUser, FiSearch, FiLogOut, FiLayout, FiList } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const categories = [
    'Electronics',
    'Fashion',
    'Footwear',
    'Home and Kitchen',
    'Beauty',
    'Books',
    'Sports'
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-light navbar-custom py-3">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <span className="brand-logo-text">ShopEZ</span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#shopEzNavbar"
          aria-controls="shopEzNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="shopEzNavbar">
          {/* Main Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center">
            <li className="nav-item">
              <Link className="nav-link fw-semibold px-3" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold px-3" to="/products">Products</Link>
            </li>
            
            {/* Categories Dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle fw-semibold px-3"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Categories
              </a>
              <ul className="dropdown-menu border-0 shadow-lg" aria-labelledby="navbarDropdown">
                <li>
                  <Link className="dropdown-item py-2" to="/products">All Categories</Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat}>
                    <Link className="dropdown-item py-2" to={`/products?category=${encodeURIComponent(cat)}`}>
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>

          {/* Universal Search Bar */}
          <form className="d-flex mx-lg-4 my-2 my-lg-0 flex-grow-1 max-width-search" onSubmit={handleSearchSubmit}>
            <div className="input-group">
              <input
                type="text"
                className="form-control form-control-custom border-end-0 bg-light"
                placeholder="Search products by name or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
              />
              <button
                className="btn btn-outline-secondary border-start-0 bg-light text-muted"
                type="submit"
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderColor: '#e2e8f0' }}
              >
                <FiSearch />
              </button>
            </div>
          </form>

          {/* User & Cart Actions */}
          <div className="d-flex align-items-center gap-3">
            {/* Cart Icon */}
            <Link className="position-relative text-dark p-2" to="/cart" aria-label="Cart">
              <FiShoppingCart size={22} className="text-secondary" />
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Authentication Menu */}
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-custom dropdown-toggle d-flex align-items-center gap-2"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FiUser /> {user.name.split(' ')[0]}
                </button>
                <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg mt-2" aria-labelledby="userDropdown">
                  {user.role === 'admin' && (
                    <li>
                      <Link className="dropdown-item py-2 d-flex align-items-center gap-2 fw-semibold text-primary" to="/admin">
                        <FiLayout /> Admin Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to="/profile">
                      <FiUser /> My Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to="/my-orders">
                      <FiList /> My Orders
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider border-light" /></li>
                  <li>
                    <button className="dropdown-item py-2 text-danger d-flex align-items-center gap-2" onClick={logout}>
                      <FiLogOut /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link className="btn btn-outline-custom" to="/login">Login</Link>
                <Link className="btn btn-primary-custom" to="/register">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .max-width-search {
          max-width: 400px;
        }
        @media (max-width: 991px) {
          .max-width-search {
            max-width: 100%;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
