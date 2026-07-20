import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FiCheckCircle, FiInbox, FiTruck } from 'react-icons/fi';

const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state && location.state.order;

  return (
    <div className="page-container text-center py-5">
      <div className="card border-0 shadow-lg p-5 bg-white rounded-premium mx-auto" style={{ maxWidth: '600px' }}>
        <div className="text-success mb-4">
          <FiCheckCircle size={70} className="mx-auto" />
        </div>
        
        <h1 className="fw-bold mb-2 h2">Order Placed Successfully!</h1>
        <p className="text-muted mb-4">
          Thank you for shopping with ShopEZ. Your order has been placed successfully and is being processed.
        </p>

        {order ? (
          <div className="p-3 border rounded text-start bg-light mb-4 small">
            <div className="mb-2">
              <span className="text-muted">Order ID:</span>{' '}
              <strong className="text-dark">{order._id}</strong>
            </div>
            <div className="mb-2">
              <span className="text-muted">Placed On:</span>{' '}
              <strong className="text-dark">{new Date(order.createdAt).toLocaleString()}</strong>
            </div>
            <div className="mb-2">
              <span className="text-muted">Payment Method:</span>{' '}
              <strong className="text-dark">{order.paymentMethod}</strong>
            </div>
            <div className="mb-2">
              <span className="text-muted">Payment Status:</span>{' '}
              <span className={`badge ${order.paymentStatus === 'Paid' ? 'bg-success' : 'bg-warning'}`}>
                {order.paymentStatus}
              </span>
            </div>
            <div className="mb-2">
              <span className="text-muted">Order Status:</span>{' '}
              <span className="badge bg-primary">{order.orderStatus}</span>
            </div>
            <hr className="border-light" />
            <div className="d-flex justify-content-between fw-bold text-dark">
              <span>Total Amount Paid:</span>
              <span className="text-primary">${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        ) : (
          <p className="text-muted small">Could not load specific order logs, please check your history page.</p>
        )}

        <div className="d-flex flex-wrap justify-content-center gap-3">
          <Link to="/my-orders" className="btn btn-primary-custom px-4 py-2 d-flex align-items-center gap-2">
            <FiInbox /> View My Orders
          </Link>
          <Link to="/products" className="btn btn-outline-custom px-4 py-2 d-flex align-items-center gap-2">
            <FiTruck /> Keep Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
