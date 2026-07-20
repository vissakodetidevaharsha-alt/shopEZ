import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import API from '../services/api';

const Profile = () => {
  const { user } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders/my-orders');

        const orderList = data.orders || data || [];

        setOrders(Array.isArray(orderList) ? orderList : []);
      } catch (err) {
        console.error('Failed to load orders:', err);
        setOrdersError('Order history could not be loaded.');
      } finally {
        setOrdersLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    } else {
      setOrdersLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container mt-4">
        <p className="text-danger">Please log in to view your profile.</p>
      </div>
    );
  }

  const displayName =
    user.name ||
    user.email?.split('@')[0] ||
    'User';

  const displayRole =
    user.role?.toLowerCase() === 'admin'
      ? 'Administrator'
      : user.role
      ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
      : 'User';

  return (
    <div className="container mt-4">
      <div className="profile-card p-4 shadow-sm bg-white rounded">
        <div className="d-flex align-items-center mb-4">
          <FaUserCircle className="profile-avatar me-3" size={64} />

          <div>
            <h2 className="mb-0">{displayName}'s Profile</h2>

            <p className="mb-0">
              <strong>Email:</strong> {user.email || 'Not available'}
            </p>

            <p className="mb-0">
              <strong>Role:</strong> {displayRole}
            </p>
          </div>
        </div>

        <button className="btn btn-outline-primary mb-4">
          Edit Profile
        </button>

        <h3 className="mt-4">Order History</h3>

        {ordersLoading && <p>Loading orders...</p>}

        {!ordersLoading && ordersError && (
          <p className="text-warning">{ordersError}</p>
        )}

        {!ordersLoading &&
          !ordersError &&
          orders.length === 0 && <p>No orders yet.</p>}

        {!ordersLoading &&
          !ordersError &&
          orders.length > 0 && (
            <ul className="list-group">
              {orders.map((order) => (
                <li key={order._id} className="list-group-item">
                  <p>
                    <strong>Order ID:</strong> {order._id}
                  </p>

                  <p>
                    <strong>Total:</strong> $
                    {Number(order.totalPrice || order.total || 0).toFixed(2)}
                  </p>

                  <p>
                    <strong>Status:</strong>{' '}
                    {order.orderStatus ||
                      order.status ||
                      (order.isDelivered ? 'Delivered' : 'Pending')}
                  </p>
                </li>
              ))}
            </ul>
          )}
      </div>
    </div>
  );
};

export default Profile;