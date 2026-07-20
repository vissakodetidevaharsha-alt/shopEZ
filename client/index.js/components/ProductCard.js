import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const { _id, name, price, discount, rating, image, category, brand, stock } = product;

  // Calculate final price based on discount
  const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigating to product details when clicking the cart button
    if (stock === 0) return;
    const result = await addToCart(_id, 1);
    if (result.success) {
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  // Render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const floorRating = Math.floor(rating || 0);
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
    <div className="product-card">
      <Link to={`/products/${_id}`} className="text-decoration-none text-dark flex-grow-1 d-flex flex-column">
        {/* Card Images & Badges */}
        <div className="product-card-img-wrapper">
          {discount > 0 && (
            <span className="product-badge-discount">-{discount}%</span>
          )}
          {product.featured && (
            <span className="product-badge-featured">Featured</span>
          )}
          <img
            src={image}
            alt={name}
            className="product-card-img"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=60';
            }}
          />
        </div>

        {/* Card Details */}
        <div className="product-card-body">
          <span className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
            {brand} &bull; {category}
          </span>
          <h5 className="product-card-title mt-1 mb-2">{name}</h5>
          
          <div className="product-card-rating">
            {renderStars(rating)}
            <span className="text-muted ms-1" style={{ fontSize: '0.8rem' }}>
              ({rating ? rating.toFixed(1) : '0.0'})
            </span>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
            <div className="product-card-price-wrapper">
              <span className="product-card-price-final">${finalPrice.toFixed(2)}</span>
              {discount > 0 && (
                <span className="product-card-price-original">${price.toFixed(2)}</span>
              )}
            </div>

            {stock === 0 ? (
              <span className="badge bg-danger rounded-pill">Out of Stock</span>
            ) : (
              <button
                className="btn btn-primary-custom d-flex align-items-center justify-content-center p-2 rounded-circle"
                onClick={handleAddToCart}
                title="Add to Cart"
                style={{ width: '38px', height: '38px' }}
              >
                <FiPlus size={18} />
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
