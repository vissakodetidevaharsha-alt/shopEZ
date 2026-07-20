import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiUser, FiPhone, FiMapPin, FiLock, FiCheck } from 'react-icons/fi';

const UserProfile = () => {
  const { user, updateProfile, error, setError } = useContext(AuthContext);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setError(null);
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      if (user.address) {
        setStreet(user.address.street || '');
        setCity(user.address.city || '');
        setState(user.address.state || '');
        setPostalCode(user.address.postalCode || '');
        setCountry(user.address.country || '');
      }
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess('');

    if (!name.trim()) {
      setError('Name field cannot be left blank.');
      return;
    }

    if (password && password.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    
    const profileData = {
      name,
      phone,
      address: {
        street,
        city,
        state,
        postalCode,
        country
      }
    };

    if (password) {
      profileData.password = password;
    }

    const result = await updateProfile(profileData);
    setLoading(false);

    if (result.success) {
      setSuccess('Profile updated successfully!');
      setPassword(''); // Clear password field
    }
  };

  return (
    <div className="page-container">
      <div className="row g-4 justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm p-4 bg-white rounded-premium">
            <h2 className="fw-bold text-dark mb-1">Account Profile</h2>
            <p className="text-muted small mb-4">View or update your saved delivery address and billing contact information.</p>

            {success && <div className="alert alert-success alert-custom mb-3">{success}</div>}
            {error && <div className="alert alert-danger alert-custom mb-3">{error}</div>}

            <form onSubmit={handleSubmit}>
              <h5 className="fw-bold mb-3 text-secondary">Personal Information</h5>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted"><FiUser /></span>
                    <input
                      type="text"
                      className="form-control form-control-custom border-start-0"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Email Address (Cannot Change)</label>
                  <input
                    type="email"
                    className="form-control form-control-custom bg-light"
                    value={user ? user.email : ''}
                    disabled
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Contact Phone</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted"><FiPhone /></span>
                    <input
                      type="tel"
                      className="form-control form-control-custom border-start-0"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">User Account Role</label>
                  <span className="form-control form-control-custom bg-light text-capitalize">{user ? user.role : 'customer'}</span>
                </div>
              </div>

              <h5 className="fw-bold mb-3 text-secondary">Default Shipping Address</h5>
              <div className="row g-3 mb-4">
                <div className="col-12">
                  <label className="form-label small fw-semibold text-muted">Street Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted"><FiMapPin /></span>
                    <input
                      type="text"
                      className="form-control form-control-custom border-start-0"
                      placeholder="Apartment, building, street..."
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-muted">City</label>
                  <input
                    type="text"
                    className="form-control form-control-custom"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-muted">State / Region</label>
                  <input
                    type="text"
                    className="form-control form-control-custom"
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-muted">Postal / ZIP Code</label>
                  <input
                    type="text"
                    className="form-control form-control-custom"
                    placeholder="Postal Code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
                <div className="col-md-12">
                  <label className="form-label small fw-semibold text-muted">Country</label>
                  <input
                    type="text"
                    className="form-control form-control-custom"
                    placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
              </div>

              <h5 className="fw-bold mb-3 text-secondary">Update Security Credentials</h5>
              <div className="row g-3 mb-4">
                <div className="col-12">
                  <label className="form-label small fw-semibold text-muted">New Password (Leave blank to keep current)</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted"><FiLock /></span>
                    <input
                      type="password"
                      className="form-control form-control-custom border-start-0"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary-custom px-5 py-2 fw-semibold d-flex align-items-center gap-2" disabled={loading}>
                {loading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <>
                    <FiCheck /> Save Changes
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
