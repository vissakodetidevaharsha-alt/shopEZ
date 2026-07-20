import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import { FiSliders, FiRefreshCw } from 'react-icons/fi';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStock, setInStock] = useState(false);
  const [discount, setDiscount] = useState(searchParams.get('discount') === 'true');
  const [sortBy, setSortBy] = useState('');

  const categories = [
    'All',
    'Electronics',
    'Fashion',
    'Footwear',
    'Home and Kitchen',
    'Beauty',
    'Books',
    'Sports'
  ];

  // Sync state filters with URL query strings
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setCategory(searchParams.get('category') || 'All');
    setDiscount(searchParams.get('discount') === 'true');
  }, [searchParams]);

  // Main fetch products trigger
  const fetchProducts = async () => {
    setLoading(true);
    try {
      let queryStr = `/products?category=${category !== 'All' ? encodeURIComponent(category) : 'All'}`;
      
      if (search) queryStr += `&search=${encodeURIComponent(search)}`;
      if (minPrice) queryStr += `&minPrice=${minPrice}`;
      if (maxPrice) queryStr += `&maxPrice=${maxPrice}`;
      if (inStock) queryStr += `&inStock=true`;
      if (discount) queryStr += `&discount=true`;
      if (sortBy) queryStr += `&sortBy=${sortBy}`;
      
      // If URL has featured=true, fetch featured
      if (searchParams.get('featured') === 'true') {
        queryStr += `&featured=true`;
      }

      const res = await API.get(queryStr);
      if (res.data && res.data.success) {
        setProducts(res.data.products);
      }
    } catch (error) {
      console.error('Error loading catalog products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, searchParams, sortBy]); // Auto fetch on category change, query change, sort change

  const handleApplyFilters = (e) => {
    e.preventDefault();
    // Update URL search parameters to reflect changes
    let newParams = {};
    if (search) newParams.search = search;
    if (category && category !== 'All') newParams.category = category;
    if (discount) newParams.discount = 'true';
    setSearchParams(newParams);
    
    // Explicit trigger for ranges
    fetchProducts();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setInStock(false);
    setDiscount(false);
    setSortBy('');
    setSearchParams({});
  };

  return (
    <div className="page-container">
      <div className="row g-4">
        {/* Filter Sidebar */}
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm rounded-premium p-4 sticky-lg-top" style={{ top: '90px', zIndex: 5 }}>
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                <FiSliders className="text-primary" /> Filter Options
              </h5>
              <button
                className="btn btn-sm btn-link text-danger text-decoration-none d-flex align-items-center gap-1 p-0 small"
                onClick={handleResetFilters}
              >
                <FiRefreshCw /> Reset
              </button>
            </div>

            <form onSubmit={handleApplyFilters}>
              {/* Search */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Keyword Search</label>
                <input
                  type="text"
                  className="form-control form-control-custom"
                  placeholder="Brand, item name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Category */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Category Selection</label>
                <select
                  className="form-select form-control-custom"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Price Range ($)</label>
                <div className="row g-2">
                  <div className="col-6">
                    <input
                      type="number"
                      className="form-control form-control-custom"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      min="0"
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="number"
                      className="form-control form-control-custom"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Stock Status */}
              <div className="form-check mb-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="checkInStock"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                />
                <label className="form-check-label small fw-medium" htmlFor="checkInStock">
                  In Stock Items Only
                </label>
              </div>

              {/* Discount Status */}
              <div className="form-check mb-4">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="checkDiscount"
                  checked={discount}
                  onChange={(e) => setDiscount(e.target.checked)}
                />
                <label className="form-check-label small fw-medium" htmlFor="checkDiscount">
                  With Active Discount Deals
                </label>
              </div>

              <button type="submit" className="btn btn-primary-custom w-100 py-2">
                Apply Filters
              </button>
            </form>
          </div>
        </div>

        {/* Product Catalog Grid */}
        <div className="col-lg-9">
          <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-3 bg-white p-3 rounded shadow-sm border border-light">
            <div>
              <h2 className="h4 mb-1 fw-bold text-dark">Product Catalog</h2>
              <span className="text-muted small">Showing {products.length} products found</span>
            </div>

            {/* Sorting Selectors */}
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small text-nowrap fw-semibold">Sort By:</span>
              <select
                className="form-select form-select-sm border-light bg-light rounded-pill px-3 py-2 fw-medium"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ width: '170px' }}
              >
                <option value="">Default (Newest)</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="ratingDesc">Avg. Customer Rating</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {products.length > 0 ? (
                products.map((product) => (
                  <div key={product._id} className="col-sm-6 col-md-4">
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <div className="col-12">
                  <div className="empty-state">
                    <div className="empty-state-icon">🔎</div>
                    <h4>No Products Found</h4>
                    <p className="text-muted">We couldn't find any products matching your active filters. Try clearing some selections.</p>
                    <button className="btn btn-primary-custom px-4 py-2 mt-2" onClick={handleResetFilters}>
                      Reset All Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
