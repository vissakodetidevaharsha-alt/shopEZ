import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { FaStar, FaRegStar, FaShoppingBag, FaCartPlus } from 'react-icons/fa';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Review submission state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const fetchProductDetails = async () => {
    try {
      const productRes = await API.get(`/products/${id}`);
      if (productRes.data && productRes.data.success) {
        setProduct(productRes.data.product);
      }
      
      const reviewsRes = await API.get(`/products/${id}/reviews`);
      if (reviewsRes.data && reviewsRes.data.success) {
        setReviews(reviewsRes.data.reviews);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-container text-center py-5">
        <h2>Product Not Found</h2>
        <p className="text-muted">The product you are trying to view does not exist or has been removed.</p>
        <Link to="/products" className="btn btn-primary-custom mt-3">Back to Catalog</Link>
      </div>
    );
  }

  const { name, description, price, discount, rating: avgRating, image, category, brand, stock } = product;
  const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;

  const handleIncrement = () => {
    if (quantity < stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCartClick = async () => {
    if (stock === 0) return;
    const result = await addToCart(product._id, quantity);
    alert(result.message);
  };

  const handleBuyNowClick = async () => {
    if (stock === 0) return;
    const result = await addToCart(product._id, quantity);
    if (result.success) {
      navigate('/cart');
    } else {
      alert(result.message);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (!comment.trim()) {
      setReviewError('Review comment cannot be empty.');
      return;
    }

    try {
      const res = await API.post(`/products/${id}/reviews`, { rating, comment });
      if (res.data && res.data.success) {
        setReviewSuccess('Review submitted successfully!');
        setComment('');
        setRating(5);
        fetchProductDetails(); // Reload data to show new rating & reviews
      }
    } catch (error) {
      const msg = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : 'Failed to submit review.';
      setReviewError(msg);
    }
  };

  const renderStars = (ratingVal) => {
    const stars = [];
    const floorRating = Math.floor(ratingVal || 0);
    for (let i = 1; i <= 5; i++) {
      if (i <= floorRating) {
        stars.push(<FaStar key={i} className="text-warning me-1" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-muted me-1" />);
      }
    }
    return stars;
  };

  return (
    <div className="page-container">
      {/* Breadcrumb / Back Link */}
      <div className="mb-4">
        <Link to="/products" className="text-muted text-decoration-none small">&larr; Back to Catalog</Link>
      </div>

      <div className="row g-5">
        {/* Left Column: Product Image */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-premium overflow-hidden bg-white">
            <img
              src={image}
              alt={name}
              className="img-fluid w-100"
              style={{ objectFit: 'contain', maxHeight: '450px', width: '100%' }}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=60';
              }}
            />
          </div>
        </div>

        {/* Right Column: Product Specs */}
        <div className="col-md-6">
          <span className="badge bg-light text-primary border border-primary px-3 py-2 rounded-pill fw-semibold text-uppercase mb-2">
            {brand}
          </span>
          <h1 className="fw-bold mb-2 h2">{name}</h1>

          {/* Average Rating Stars */}
          <div className="d-flex align-items-center mb-3">
            <div className="d-flex text-warning align-items-center">
              {renderStars(avgRating)}
            </div>
            <span className="text-muted small ms-2 fw-medium">
              {avgRating ? avgRating.toFixed(1) : '0.0'} ({reviews.length} Customer Reviews)
            </span>
          </div>

          <hr className="border-light" />

          {/* Pricing */}
          <div className="mb-4">
            <div className="d-flex align-items-baseline gap-3">
              <span className="fs-2 fw-bold text-primary">${finalPrice.toFixed(2)}</span>
              {discount > 0 && (
                <>
                  <span className="fs-5 text-muted text-decoration-line-through">${price.toFixed(2)}</span>
                  <span className="badge bg-danger rounded-pill px-3 py-1">Save {discount}%</span>
                </>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="mb-4">
            <h6 className="fw-bold text-dark">Description</h6>
            <p className="text-secondary small">{description}</p>
          </div>

          <div className="row mb-4 g-2 text-start">
            <div className="col-6 col-sm-4">
              <div className="p-2 border rounded bg-white">
                <span className="text-muted small d-block">Category</span>
                <span className="fw-semibold text-dark small">{category}</span>
              </div>
            </div>
            <div className="col-6 col-sm-4">
              <div className="p-2 border rounded bg-white">
                <span className="text-muted small d-block">Stock Status</span>
                {stock > 0 ? (
                  <span className="fw-semibold text-success small">In Stock ({stock})</span>
                ) : (
                  <span className="fw-semibold text-danger small">Out of Stock</span>
                )}
              </div>
            </div>
          </div>

          {/* Actions & Quantity Selector */}
          {stock > 0 && (
            <div className="mb-4">
              <h6 className="fw-bold text-dark mb-2">Quantity</h6>
              <div className="d-flex align-items-center gap-3">
                <div className="input-group" style={{ width: '130px' }}>
                  <button className="btn btn-outline-secondary border-light-subtle rounded-start-pill" type="button" onClick={handleDecrement}>
                    -
                  </button>
                  <input
                    type="text"
                    className="form-control text-center bg-white border-light-subtle"
                    value={quantity}
                    readOnly
                  />
                  <button className="btn btn-outline-secondary border-light-subtle rounded-end-pill" type="button" onClick={handleIncrement}>
                    +
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="d-flex flex-wrap gap-3 mt-4">
            {stock > 0 ? (
              <>
                <button className="btn btn-primary-custom px-4 py-2 d-flex align-items-center gap-2" onClick={handleAddToCartClick}>
                  <FaCartPlus /> Add to Cart
                </button>
                <button className="btn btn-secondary-custom px-4 py-2 d-flex align-items-center gap-2" onClick={handleBuyNowClick}>
                  <FaShoppingBag /> Buy Now
                </button>
              </>
            ) : (
              <button className="btn btn-secondary w-100 py-3 rounded-pill fw-bold" disabled>
                Sold Out
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reviews & Submission Area */}
      <div className="row mt-5 g-4 border-top pt-5">
        {/* Left Side: Display Existing Reviews */}
        <div className="col-lg-7">
          <h3 className="fw-bold mb-4">Customer Reviews ({reviews.length})</h3>

          {reviews.length > 0 ? (
            <div className="d-flex flex-column gap-3">
              {reviews.map((rev) => (
                <div key={rev._id} className="card border-0 shadow-sm p-4 bg-white rounded-premium">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-bold text-dark mb-0">{rev.userName}</h6>
                    <span className="text-muted small">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="d-flex text-warning mb-2">
                    {renderStars(rev.rating)}
                  </div>
                  <p className="text-secondary small mb-0">{rev.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 border rounded text-center bg-white text-muted">
              No reviews yet. Be the first to share your thoughts on this product!
            </div>
          )}
        </div>

        {/* Right Side: Add New Review Form */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm p-4 bg-white rounded-premium sticky-lg-top" style={{ top: '100px' }}>
            <h4 className="fw-bold mb-3">Write a Customer Review</h4>

            {token ? (
              <form onSubmit={handleReviewSubmit}>
                {reviewSuccess && <div className="alert alert-success alert-custom small py-2">{reviewSuccess}</div>}
                {reviewError && <div className="alert alert-danger alert-custom small py-2">{reviewError}</div>}

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted">Product Rating Score</label>
                  <select
                    className="form-select form-control-custom"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                  >
                    <option value={5}>5 Stars - Outstanding</option>
                    <option value={4}>4 Stars - Very Good</option>
                    <option value={3}>3 Stars - Good / Average</option>
                    <option value={2}>2 Stars - Poor</option>
                    <option value={1}>1 Star - Terrible</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted">Review Comments</label>
                  <textarea
                    rows={4}
                    className="form-control form-control-custom"
                    placeholder="Describe your user experience, product quality, build, delivery speed..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary-custom w-100 py-2">
                  Submit Review
                </button>
              </form>
            ) : (
              <div className="text-center p-3">
                <p className="text-muted small">You must be registered and signed in to write reviews on ShopEZ products.</p>
                <Link to="/login" className="btn btn-outline-custom w-100 mt-2">Sign In to Review</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
