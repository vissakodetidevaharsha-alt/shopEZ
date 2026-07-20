import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { FiTrash2, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';

const Cart = () => {
  const { cart, loading, updateCartItem, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Calculate pricing breakdown
  const calculatePricing = () => {
    if (!cart || !cart.products || cart.products.length === 0) {
      return { itemsPrice: 0, discountAmount: 0, shippingPrice: 0, totalPrice: 0 };
    }

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
    const shippingPrice = netPrice > 50 || netPrice === 0 ? 0 : 10.0;
    const totalPrice = netPrice + shippingPrice;

    return {
      itemsPrice,
      discountAmount,
      shippingPrice,
      totalPrice
    };
  };

  const { itemsPrice, discountAmount, shippingPrice, totalPrice } = calculatePricing();

  const handleQtyChange = async (productId, currentQty, stock, increment) => {
    const newQty = increment ? currentQty + 1 : currentQty - 1;
    if (newQty < 1) return;
    if (newQty > stock) {
      alert(`Only ${stock} items are available in stock.`);
      return;
    }
    await updateCartItem(productId, newQty);
  };

  const handleRemoveItem = async (productId) => {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      await removeFromCart(productId);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to empty your shopping cart?')) {
      await clearCart();
    }
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  const isCartEmpty = !cart || !cart.products || cart.products.length === 0;

  return (
    <div className="page-container">
      <h1 className="fw-bold mb-4 h3">Shopping Cart</h1>

      {isCartEmpty ? (
        <div className="empty-state py-5">
          <div className="empty-state-icon text-secondary">🛒</div>
          <h3>Your Cart is Empty</h3>
          <p className="text-muted">You haven't added any products to your ShopEZ shopping cart yet.</p>
          <Link to="/products" className="btn btn-primary-custom px-4 py-2 mt-2">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {/* Cart items list */}
          <div className="col-lg-8">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted small">Manage items in your shopping list</span>
              <button className="btn btn-sm btn-outline-danger px-3 py-1 rounded-pill" onClick={handleClearCart}>
                Clear Cart
              </button>
            </div>

            <div className="d-flex flex-column gap-3">
              {cart.products.map((item) => {
                const prod = item.product;
                if (!prod) return null;

                const finalItemPrice = prod.discount > 0 ? prod.price - (prod.price * prod.discount) / 100 : prod.price;

                return (
                  <div key={prod._id} className="card border-0 shadow-sm p-3 bg-white rounded-premium">
                    <div className="row g-3 align-items-center">
                      {/* Product Image */}
                      <div className="col-3 col-md-2">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="img-fluid rounded border"
                          style={{ objectFit: 'cover', height: '70px', width: '70px' }}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=60';
                          }}
                        />
                      </div>

                      {/* Product details */}
                      <div className="col-9 col-md-4">
                        <span className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.7rem' }}>
                          {prod.brand}
                        </span>
                        <Link to={`/products/${prod._id}`} className="text-decoration-none text-dark d-block">
                          <h6 className="fw-semibold mb-1 text-truncate">{prod.name}</h6>
                        </Link>
                        <div className="small">
                          <span className="fw-bold text-primary">${finalItemPrice.toFixed(2)}</span>
                          {prod.discount > 0 && (
                            <span className="text-muted text-decoration-line-through ms-2" style={{ fontSize: '0.8rem' }}>
                              ${prod.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="col-6 col-md-3">
                        <div className="input-group input-group-sm rounded-pill" style={{ maxWidth: '110px' }}>
                          <button
                            className="btn btn-outline-secondary border-light-subtle rounded-start-pill"
                            type="button"
                            onClick={() => handleQtyChange(prod._id, item.quantity, prod.stock, false)}
                          >
                            -
                          </button>
                          <input
                            type="text"
                            className="form-control text-center bg-white border-light-subtle"
                            value={item.quantity}
                            readOnly
                          />
                          <button
                            className="btn btn-outline-secondary border-light-subtle rounded-end-pill"
                            type="button"
                            onClick={() => handleQtyChange(prod._id, item.quantity, prod.stock, true)}
                          >
                            +
                          </button>
                        </div>
                        <span className="text-muted" style={{ fontSize: '0.7rem' }}>Stock: {prod.stock}</span>
                      </div>

                      {/* Total cost & delete */}
                      <div className="col-6 col-md-3 text-end d-flex justify-content-between align-items-center justify-content-md-end gap-3">
                        <div>
                          <span className="small text-muted d-block d-md-none">Subtotal</span>
                          <span className="fw-bold text-dark">${(finalItemPrice * item.quantity).toFixed(2)}</span>
                        </div>
                        <button
                          className="btn btn-link text-danger p-0"
                          onClick={() => handleRemoveItem(prod._id)}
                          title="Remove item"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4">
              <Link to="/products" className="text-primary text-decoration-none fw-semibold d-flex align-items-center gap-2">
                <FiArrowLeft /> Continue Shopping
              </Link>
            </div>
          </div>

          {/* Checkout summary details */}
          <div className="col-lg-4">
            <div className="order-summary-box">
              <h4 className="fw-bold mb-4">Order Summary</h4>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Subtotal (original)</span>
                <span className="fw-semibold text-dark">${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3 text-success">
                <span>Discount Savings</span>
                <span className="fw-semibold">-${discountAmount.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Delivery Charges</span>
                <span className="fw-semibold text-dark">
                  {shippingPrice === 0 ? <span className="text-success fw-bold">FREE</span> : `$${shippingPrice.toFixed(2)}`}
                </span>
              </div>
              {shippingPrice > 0 && (
                <div className="alert alert-info border-0 rounded p-2 small text-center text-muted">
                  Add <strong>${(50 - (itemsPrice - discountAmount)).toFixed(2)}</strong> more to get free delivery!
                </div>
              )}
              <hr className="border-light" />
              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold text-dark fs-5">Total Amount</span>
                <span className="fw-bold text-primary fs-5">${totalPrice.toFixed(2)}</span>
              </div>

              <button className="btn btn-primary-custom w-100 py-3 d-flex align-items-center justify-content-center gap-2" onClick={handleProceedToCheckout}>
                <FiShoppingBag /> Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
