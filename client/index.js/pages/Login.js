import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

const Login = () => {
  const { login, error, setError, token, user } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Clear errors on page mount
  useEffect(() => {
    setError(null);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (token && user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [token, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all email and password fields.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="page-container d-flex align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
      <div className="card border-0 shadow-lg p-4 bg-white rounded-premium w-100" style={{ maxWidth: '420px' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-dark">Sign In</h2>
          <p className="text-muted small">Access your ShopEZ customer profile and orders</p>
        </div>

        {error && <div className="alert alert-danger alert-custom small py-2 mb-3">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label small fw-semibold text-muted">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-light text-muted border-end-0" style={{ borderTopLeftRadius: '0.75rem', borderBottomLeftRadius: '0.75rem' }}>
                <FiMail />
              </span>
              <input
                type="email"
                className="form-control form-control-custom border-start-0"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="form-label small fw-semibold text-muted">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light text-muted border-end-0" style={{ borderTopLeftRadius: '0.75rem', borderBottomLeftRadius: '0.75rem' }}>
                <FiLock />
              </span>
              <input
                type="password"
                className="form-control form-control-custom border-start-0"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary-custom w-100 py-2 d-flex align-items-center justify-content-center gap-2" disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              <>
                <FiLogIn /> Login Account
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-muted small">New to ShopEZ? </span>
          <Link to="/register" className="text-primary small fw-semibold text-decoration-none">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
