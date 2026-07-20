import React, { useEffect, useState } from 'react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [discounted, setDiscounted] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await API.get('/products?limit=100');
      if (data.success) {
        const all = data.products;
        setFeatured(all.filter(p => p.featured).slice(0, 4));
        setBestSellers([...all].sort((a, b) => b.rating - a.rating).slice(0, 4));
        setDiscounted(all.filter(p => p.discount > 0).slice(0, 4));
        const cats = [...new Set(all.map(p => p.category))];
        setCategories(cats);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container my-4">
      <div className="section-spacing">
        <h2 className="mb-3">Featured</h2>
        <div className="product-grid">
          {featured.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>

      <div className="section-spacing">
        <h2 className="my-3">Best Sellers</h2>
        <div className="product-grid">
          {bestSellers.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>

      <div className="section-spacing">
        <h2 className="my-3">Discounted</h2>
        <div className="product-grid">
          {discounted.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>

      <div className="section-spacing">
        <h2 className="my-3">Categories</h2>
        <div className="category-grid">
          {categories.map(cat => (
            <Link to={`/products?category=${cat}`} key={cat} className="category-card">
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
