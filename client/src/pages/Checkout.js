import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [shipping, setShipping] = useState({
    fullName: ''
    , phone: ''
    , address: ''
    , city: ''
    , state: ''
    , postalCode: ''
  });

  const [paymentMethod] = useState('Cash on Delivery');

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  // Calculate prices
  const itemsPrice = cartItems.reduce((sum, item) => {
    const price = item.product.price * (1 - (item.product.discount || 0) / 100);
    return sum + price * item.qty;
  }, 0);
  const discountAmount = 0; // placeholder for future discounts
  const shippingPrice = 0; // free shipping for now
  const totalPrice = itemsPrice + shippingPrice - discountAmount;

  const placeOrder = async () => {
    try {
      const orderItems = cartItems.map(i => ({
        product: i.product._id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.qty
      }));

      await API.post('/orders', {
        orderItems,
        shippingAddress: shipping,
        paymentMethod,
        itemsPrice,
        discountAmount,
        shippingPrice,
        totalPrice
      });
      clearCart();
      alert('Order placed successfully!');
      navigate('/profile'); // redirect to profile where order history is shown
    } catch (err) {
      console.error(err);
      console.log(err.response?.data);
      alert('Failed to place order');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container my-4">
        <h2>Your cart is empty.</h2>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <h2>Checkout</h2>
      <ul className="list-group mb-3">
        {cartItems.map(item => (
          <li key={item.product._id} className="list-group-item d-flex justify-content-between align-items-center">
            {item.product.name} x {item.qty}
            <span>${(item.product.price * item.qty).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <h4 className="text-end">Total: ${totalPrice.toFixed(2)}</h4>

      <form className="mt-4">
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input type="text" className="form-control" name="fullName" value={shipping.fullName} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input type="text" className="form-control" name="phone" value={shipping.phone} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Address</label>
          <input type="text" className="form-control" name="address" value={shipping.address} onChange={handleChange} required />
        </div>
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <label className="form-label">City</label>
            <input type="text" className="form-control" name="city" value={shipping.city} onChange={handleChange} required />
          </div>
          <div className="col-md-4">
            <label className="form-label">State</label>
            <input type="text" className="form-control" name="state" value={shipping.state} onChange={handleChange} required />
          </div>
          <div className="col-md-4">
            <label className="form-label">Postal Code</label>
            <input type="text" className="form-control" name="postalCode" value={shipping.postalCode} onChange={handleChange} required />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Payment Method</label>
          <input type="text" className="form-control" readOnly value={paymentMethod} />
        </div>
        <button type="button" className="btn btn-success" onClick={placeOrder}>Place Order</button>
      </form>
    </div>
  );
};

export default Checkout;
