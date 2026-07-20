import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import API from '../services/api';
import { FiCheckCircle } from 'react-icons/fi';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const { cart, clearCart, fetchCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Form fields
  const [fullName, setFullName] = useState(user ? user.name : '');
  const [phone, setPhone] = useState(user ? user.phone : '');
  const [address, setAddress] = useState(user && user.address ? user.address.street : '');
  const [city, setCity] = useState(user && user.address ? user.address.city : '');
  const [state, setState] = useState(user && user.address ? user.address.state : '');
  const [postalCode, setPostalCode] = useState(user && user.address ? user.address.postalCode : '');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Ensure cart is loaded and has items
  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (user) {
      setFullName(user.name);
      setPhone(user.phone || '');
      if (user.address) {
        setAddress(user.address.street || '');
        setCity(user.address.city || '');
        setState(user.address.state || '');
        setPostalCode(user.address.postalCode || '');
      }
    }
  }, [user]);

  if (!cart || !cart.products || cart.products.length === 0) {
    return (
      <div className="page-container text-center py-5">
        <h2>Your Cart is Empty</h2>
        <p className="text-muted">You cannot access checkout without items in your cart.</p>
        <Link to="/products" className="btn btn-primary-custom mt-3">Back to Catalog</Link>
      </div>
    );
  }

  // Calculate pricing breakdown
  const calculatePricing = () => {
    let itemsPrice = 0;
    let discountAmount = 0;

    cart.products.forEach((item) => {
      const prod = item.product;
      if (prod) {
        const qty = item.quantity;
        itemsPrice += prod.price * qty;
        if (prod.discount > 0) {
          discountAmount += ((prod.price * prod.discount) / 100) * qty;
        }
      }
    });

    const netPrice = itemsPrice - discountAmount;
    const shippingPrice = netPrice > 50 ? 0 : 10.0;
    const totalPrice = netPrice + shippingPrice;

    return {
      itemsPrice,
      discountAmount,
      shippingPrice,
      totalPrice
    };
  };

  const { itemsPrice, discountAmount, shippingPrice, totalPrice } = calculatePricing();

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!fullName.trim() || !phone.trim() || !address.trim() || !city.trim() || !state.trim() || !postalCode.trim()) {
      setError('Please fill in all shipping fields.');
      return;
    }

    setLoading(true);

    try {
      // Map cart products to orderItems
      const orderItems = cart.products.map((item) => {
        const prod = item.product;
        const finalItemPrice = prod.discount > 0 ? prod.price - (prod.price * prod.discount) / 100 : prod.price;
        return {
          product: prod._id,
          name: prod.name,
          quantity: item.quantity,
          price: finalItemPrice
        };
      });

      const orderData = {
        orderItems,
        shippingAddress: {
          fullName,
          phone,
          address,
          city,
          state,
          postalCode
        },
        paymentMethod,
        itemsPrice,
        discountAmount,
        shippingPrice,
        totalPrice
      };

      const res = await API.post('/orders', orderData);

      if (res.data && res.data.success) {
        const createdOrder = res.data.order;
        // Clear shopping cart context locally
        await clearCart();
        // Redirect to success page with order details
        navigate('/order-success', { state: { order: createdOrder } });
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Failed to place order. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="fw-bold mb-4 h3">Secure Checkout</h1>

      {error && <div className="alert alert-danger alert-custom mb-4">{error}</div>}

      <div className="row g-4">
        {/* Left Side: Checkout Form */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm p-4 bg-white rounded-premium mb-4">
            <h4 className="fw-bold mb-3">Shipping Information</h4>
            <form onSubmit={handlePlaceOrder}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Recipient Full Name</label>
                  <input
                    type="text"
                    className="form-control form-control-custom"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control form-control-custom"
                    placeholder="1234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold text-muted">Street Address</label>
                  <input
                    type="text"
                    className="form-control form-control-custom"
                    placeholder="Apartment, Street name..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-muted">City</label>
                  <input
                    type="text"
                    className="form-control form-control-custom"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
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
                    required
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
                    required
                  />
                </div>
              </div>

              <h4 className="fw-bold mb-3 mt-4">Payment Method (College Demo)</h4>
              <div className="p-3 border rounded mb-4 bg-light">
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="payCOD"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label fw-semibold text-dark" htmlFor="payCOD">
                    Cash on Delivery
                  </label>
                  <div className="small text-muted">Pay with physical cash when the delivery agent arrives at your door.</div>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="payCard"
                    value="Demo Card Payment"
                    checked={paymentMethod === 'Demo Card Payment'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label fw-semibold text-dark" htmlFor="payCard">
                    Demo Card Payment (Instant Success)
                  </label>
                  <div className="small text-muted">Simulate card payment instantly. No real transactions will be processed.</div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary-custom w-100 py-3 fs-5 d-flex align-items-center justify-content-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Placing Order...
                  </>
                ) : (
                  <>
                    <FiCheckCircle /> Confirm & Place Order (${totalPrice.toFixed(2)})
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Order summary preview */}
        <div className="col-lg-5">
          <div className="order-summary-box">
            <h4 className="fw-bold mb-4">Cart Breakdown</h4>
            <div className="max-height-checkout-items overflow-y-auto mb-4" style={{ maxHeight: '250px' }}>
              {cart.products.map((item) => {
                const prod = item.product;
                if (!prod) return null;
                const finalItemPrice = prod.discount > 0 ? prod.price - (prod.price * prod.discount) / 100 : prod.price;

                return (
                  <div key={prod._id} className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                    <div style={{ maxWidth: '80%' }}>
                      <h6 className="small fw-semibold text-dark mb-0 text-truncate">{prod.name}</h6>
                      <span className="text-muted small">Qty: {item.quantity} &times; ${finalItemPrice.toFixed(2)}</span>
                    </div>
                    <span className="fw-semibold text-dark small">${(finalItemPrice * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            <div className="d-flex justify-content-between mb-2 small text-muted">
              <span>Items Total</span>
              <span>${itemsPrice.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2 small text-success">
              <span>Discount Savings</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3 small text-muted">
              <span>Delivery Fee</span>
              <span>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span>
            </div>

            <hr className="border-light" />

            <div className="d-flex justify-content-between fs-5 fw-bold text-dark">
              <span>Final Total</span>
              <span className="text-primary">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
