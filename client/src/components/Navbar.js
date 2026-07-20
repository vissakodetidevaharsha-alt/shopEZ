import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAdmin = user?.role?.toLowerCase() === 'admin';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">ShopEZ</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link className="nav-link" to="/products">Products</Link></li>
            {user && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/cart">Cart <span className="badge bg-primary ms-1">{cartItems.length}</span></Link></li>
                <li className="nav-item"><Link className="nav-link" to="/profile">Profile</Link></li>
                {isAdmin && (
                  <li className="nav-item"><Link className="nav-link" to="/admin">Admin</Link></li>
                )}
              </>
            )}
          </ul>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {user ? (
              <>
                <li className="nav-item"><span className="navbar-text me-3">Hello, {user?.name || (user?.role?.toLowerCase() === 'admin' ? 'Admin' : (user?.email ? user.email.split('@')[0] : 'User'))}</span></li>
                <li className="nav-item"><a className="nav-link" href="#" onClick={handleLogout}>Logout</a></li>
              </>
            ) : (
              <>
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
