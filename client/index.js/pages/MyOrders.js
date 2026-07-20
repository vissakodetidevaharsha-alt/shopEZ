import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { FiInbox, FiClock, FiFileText } from 'react-icons/fi';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/orders/my-orders');
        if (res.data && res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error('Error fetching user orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Get status class for coloring badges
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-warning text-dark';
      case 'Confirmed':
        return 'bg-info text-dark';
      case 'Shipped':
        return 'bg-primary text-white';
      case 'Delivered':
        return 'bg-success text-white';
      case 'Cancelled':
        return 'bg-danger text-white';
      default:
        return 'bg-secondary text-white';
    }
  };

  const isOrdersEmpty = orders.length === 0;

  return (
    <div className="page-container">
      <h1 className="fw-bold mb-2 h3">My Orders</h1>
      <p className="text-muted small mb-4">View and track all your purchases and order status details.</p>

      {isOrdersEmpty ? (
        <div className="empty-state py-5 bg-white border border-light">
          <div className="empty-state-icon text-secondary">
            <FiInbox />
          </div>
          <h3>No Orders Placed</h3>
          <p className="text-muted">You haven't placed any orders with ShopEZ yet.</p>
          <Link to="/products" className="btn btn-primary-custom px-4 py-2 mt-2">
            Browse Our Catalog
          </Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {orders.map((order) => (
            <div key={order._id} className="card border-0 shadow-sm p-4 bg-white rounded-premium">
              <div className="row g-3 align-items-center">
                {/* ID & Date */}
                <div className="col-md-4">
                  <span className="text-muted small d-block">ORDER REFERENCE</span>
                  <span className="fw-bold text-dark text-truncate d-block small mb-1">{order._id}</span>
                  <span className="text-muted small d-flex align-items-center gap-1">
                    <FiClock /> {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Items & Cost */}
                <div className="col-6 col-md-3">
                  <span className="text-muted small d-block">BILLING & ITEMS</span>
                  <span className="fw-semibold text-dark d-block">
                    {order.orderItems.reduce((acc, curr) => acc + curr.quantity, 0)} Items
                  </span>
                  <span className="fw-bold text-primary">${order.totalPrice.toFixed(2)}</span>
                </div>

                {/* Status Badges */}
                <div className="col-6 col-md-3">
                  <span className="text-muted small d-block mb-1">STATUS DETAILS</span>
                  <span className={`badge ${getStatusBadgeClass(order.orderStatus)} me-2`}>
                    Order: {order.orderStatus}
                  </span>
                  <span className={`badge ${order.paymentStatus === 'Paid' ? 'bg-success text-white' : 'bg-warning text-dark'}`}>
                    Payment: {order.paymentStatus}
                  </span>
                </div>

                {/* Actions button */}
                <div className="col-md-2 text-md-end">
                  <Link to={`/orders/${order._id}`} className="btn btn-outline-custom btn-sm w-100 py-2 d-flex align-items-center justify-content-center gap-1">
                    <FiFileText /> Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
