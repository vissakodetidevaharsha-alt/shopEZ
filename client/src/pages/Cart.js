import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, increaseQty, decreaseQty } = useContext(CartContext);

  const calculatePrice = (product) => {
    const price = product.price * (1 - (product.discount || 0) / 100);
    return price;
  };

  const itemsTotal = cartItems.reduce((sum, item) => sum + calculatePrice(item.product) * item.qty, 0);

  if (cartItems.length === 0) {
    return (
      <div className="container my-4">
        <h2>Your cart is empty.</h2>
        <Link to="/products" className="btn btn-primary mt-3">Go Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <h2>Shopping Cart</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Image</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(item => {
            const price = calculatePrice(item.product);
            const subtotal = price * item.qty;
            return (
              <tr key={item.product._id}>
                <td>{item.product.name}</td>
                <td><img src={item.product.image} alt={item.product.name} style={{ width: '80px', height: '80px', objectFit: 'cover' }} onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/80'; }} /></td>
                <td className="d-flex align-items-center">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => decreaseQty(item.product._id)} disabled={item.qty <= 1}>-</button>
                  <span className="mx-2">{item.qty}</span>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => increaseQty(item.product._id)}>+</button>
                </td>
                <td>${price.toFixed(2)}</td>
                <td>${subtotal.toFixed(2)}</td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => removeFromCart(item.product._id)}>Remove</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <h4 className="text-end">Total: ${itemsTotal.toFixed(2)}</h4>
      <div className="d-flex justify-content-between mt-3">
        <button className="btn btn-secondary" onClick={clearCart}>Clear Cart</button>
        <Link to="/checkout" className="btn btn-primary">Proceed to Checkout</Link>
      </div>
    </div>
  );
};

export default Cart;
