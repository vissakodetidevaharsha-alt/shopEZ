const Product = require('../models/Product');

// @desc    Get all products (with search, filter, sort)
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice, inStock, discount, featured, sortBy } = req.query;
    let query = {};

    // Search by name, brand, or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    // Filter by stock status
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Filter by discount availability
    if (discount === 'true') {
      query.discount = { $gt: 0 };
    }

    // Filter by featured status
    if (featured === 'true') {
      query.featured = true;
    }

    // Create query database execution
    let productsQuery = Product.find(query);

    // Sorting
    if (sortBy) {
      if (sortBy === 'priceAsc') {
        productsQuery = productsQuery.sort({ price: 1 });
      } else if (sortBy === 'priceDesc') {
        productsQuery = productsQuery.sort({ price: -1 });
      } else if (sortBy === 'ratingDesc') {
        productsQuery = productsQuery.sort({ rating: -1 });
      } else if (sortBy === 'newest') {
        productsQuery = productsQuery.sort({ createdAt: -1 });
      }
    } else {
      productsQuery = productsQuery.sort({ createdAt: -1 }); // Default to newest
    }

    const products = await productsQuery;

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      category,
      brand,
      image,
      stock,
      discount,
      featured
    } = req.body;

    if (!name || !description || price === undefined || !category || !brand || !image || stock === undefined) {
      return res.status(400).json({ success: false, message: 'Please enter all required fields' });
    }

    if (Number(price) < 0) {
      return res.status(400).json({ success: false, message: 'Price cannot be negative' });
    }

    if (Number(stock) < 0) {
      return res.status(400).json({ success: false, message: 'Stock cannot be negative' });
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      brand,
      image,
      stock: Number(stock),
      discount: discount ? Number(discount) : 0,
      featured: featured === true || featured === 'true'
    });

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      category,
      brand,
      image,
      stock,
      discount,
      featured
    } = req.body;

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (price !== undefined && Number(price) < 0) {
      return res.status(400).json({ success: false, message: 'Price cannot be negative' });
    }

    if (stock !== undefined && Number(stock) < 0) {
      return res.status(400).json({ success: false, message: 'Stock cannot be negative' });
    }

    // Update product
    product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: name || product.name,
        description: description || product.description,
        price: price !== undefined ? Number(price) : product.price,
        category: category || product.category,
        brand: brand || product.brand,
        image: image || product.image,
        stock: stock !== undefined ? Number(stock) : product.stock,
        discount: discount !== undefined ? Number(discount) : product.discount,
        featured: featured !== undefined ? (featured === true || featured === 'true') : product.featured
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
