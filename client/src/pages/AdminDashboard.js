import React, { useEffect, useState } from 'react';
import API from '../services/api';

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await API.get('/admin/summary');
        setSummary(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load admin summary');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <div className="container mt-4"><h2>Loading...</h2></div>;
  if (error) return <div className="container mt-4"><p className="text-danger">{error}</p></div>;

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>
      {summary ? (
        <div className="row">
          <div className="col-md-4">
            <div className="card text-bg-primary mb-3">
              <div className="card-body">
                <h5 className="card-title">Total Users</h5>
                <p className="card-text display-4">{summary.totalUsers}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-bg-success mb-3">
              <div className="card-body">
                <h5 className="card-title">Total Orders</h5>
                <p className="card-text display-4">{summary.totalOrders}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-bg-warning mb-3">
              <div className="card-body">
                <h5 className="card-title">Total Revenue</h5>
                <p className="card-text display-4">${summary.totalRevenue?.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>No summary data.</p>
      )}
    </div>
  );
};

export default AdminDashboard;
