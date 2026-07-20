import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data.product);
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="container my-4">
      <h2>{product.name}</h2>
      <div className="row">
        <div className="col-md-6">
          <img src={product.image} alt={product.name} className="img-fluid" />
        </div>
        <div className="col-md-6">
          <p>{product.description}</p>
          <p>Category: {product.category}</p>
          <p>Brand: {product.brand}</p>
          <p>Rating: {product.rating?.toFixed(1) || 'N/A'}</p>
          <p>Stock: {product.stock > 0 ? product.stock : 'Out of stock'}</p>
          <p>
            Price:{' '}
            {product.discount > 0 ? (
              <>
                <span className="text-muted text-decoration-line-through">${product.price.toFixed(2)}</span>{' '}
                <span className="fw-bold text-success">
                  ${ (product.price * (1 - product.discount / 100)).toFixed(2) }
                </span>{' '}
                <span className="badge bg-danger">-{product.discount}%</span>
              </>
            ) : (
              <span className="fw-bold">${product.price.toFixed(2)}</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
