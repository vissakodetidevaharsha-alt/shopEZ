import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const discountedPrice = product.price * (1 - (product.discount || 0) / 100);

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`}>
        <img src={product.image} alt={product.name} className="product-image" onError={(e)=>{e.target.onerror=null; e.target.src='https://via.placeholder.com/300x230?text=No+Image';}} />
      </Link>
      <div className="product-content">
        <h5 className="product-title">{product.name}</h5>
        <div className="product-rating">Rating: {product.rating?.toFixed(1) || 'N/A'}</div>
        <div className="product-price">
          {product.discount > 0 ? (
            <>
              <span className="original-price">${product.price.toFixed(2)}</span>
              <span className="fw-bold text-success">${discountedPrice.toFixed(2)}</span>
              <span className="discount-badge">-{product.discount}%</span>
            </>
          ) : (
            <span className="fw-bold">${product.price.toFixed(2)}</span>
          )}
        </div>
        <div className="product-stock">
          Stock: {product.stock > 0 ? product.stock : <span className="text-danger">Out of stock</span>}
        </div>
        <button
          className="btn btn-primary add-cart-btn"
          onClick={() => {
            addToCart(product);
            alert('Product added to cart');
          }}
          disabled={product.stock === 0}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
