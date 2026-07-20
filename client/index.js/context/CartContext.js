import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [cart, setCart] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Recalculate item count whenever cart updates
  useEffect(() => {
    if (cart && cart.products) {
      const count = cart.products.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(count);
    } else {
      setCartCount(0);
    }
  }, [cart]);

  // Load cart when user logs in or token is verified
  const fetchCart = async () => {
    if (!token) {
      setCart(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await API.get('/cart');
      if (res.data && res.data.success) {
        setCart(res.data.cart);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Could not fetch cart items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!token) {
      return { success: false, loginRequired: true, message: 'Please log in to add products to the cart' };
    }
    setError(null);
    try {
      const res = await API.post('/cart', { productId, quantity });
      if (res.data && res.data.success) {
        setCart(res.data.cart);
        return { success: true, message: res.data.message };
      }
    } catch (err) {
      const msg = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : 'Failed to add item to cart.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  // Update item quantity
  const updateCartItem = async (productId, quantity) => {
    if (!token) return { success: false, loginRequired: true };
    setError(null);
    try {
      const res = await API.put(`/cart/${productId}`, { quantity });
      if (res.data && res.data.success) {
        setCart(res.data.cart);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : 'Failed to update cart quantity.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    if (!token) return { success: false, loginRequired: true };
    setError(null);
    try {
      const res = await API.delete(`/cart/${productId}`);
      if (res.data && res.data.success) {
        setCart(res.data.cart);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : 'Failed to remove item from cart.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!token) return { success: false, loginRequired: true };
    setError(null);
    try {
      const res = await API.delete('/cart');
      if (res.data && res.data.success) {
        setCart(res.data.cart);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : 'Failed to clear cart.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        error,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        setError
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
