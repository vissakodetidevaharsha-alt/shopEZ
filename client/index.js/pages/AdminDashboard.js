import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "../styles.css";

// AdminDashboard – premium glassmorphism cards displaying key metrics
const AdminDashboard = () => {
  const [summary, setSummary] = useState({
    productsCount: 0,
    ordersCount: 0,
    usersCount: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await API.get("/admin/summary");
        if (data && data.success) {
          setSummary(data.summary);
        } else {
          setError("Failed to load summary data");
        }
      } catch (err) {
        console.error(err);
        setError("Server error while fetching summary");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const cardData = [
    {
      title: "Products",
      value: summary.productsCount,
      icon: "🛍️",
      link: "/admin/products",
      bg: "var(--gradient-primary)",
    },
    {
      title: "Orders",
      value: summary.ordersCount,
      icon: "📦",
      link: "/admin/orders",
      bg: "var(--gradient-secondary)",
    },
    {
      title: "Customers",
      value: summary.usersCount,
      icon: "👥",
      link: "/admin/users",
      bg: "var(--gradient-accent)",
    },
    {
      title: "Revenue",
      value: `$${summary.totalRevenue.toLocaleString()}`,
      icon: "💰",
      link: "/admin/revenue",
      bg: "var(--gradient-info)",
    },
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container py-5 page-container">
      <h1 className="mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
        Admin Dashboard
      </h1>
      <div className="row g-4">
        {cardData.map((card) => (
          <div key={card.title} className="col-12 col-sm-6 col-lg-3">
            <Link to={card.link} className="text-decoration-none">
              <div
                className="card glass-card h-100 d-flex flex-column justify-content-center align-items-center"
                style={{
                  background: card.bg,
                  color: "white",
                  borderRadius: "1.5rem",
                  padding: "2rem",
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                }}
              >
                <div style={{ fontSize: "2rem" }}>{card.icon}</div>
                <h5 className="mt-3" style={{ fontWeight: "600" }}>
                  {card.title}
                </h5>
                <p className="fs-4 mt-2 mb-0" style={{ fontWeight: "700" }}>
                  {card.value}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
