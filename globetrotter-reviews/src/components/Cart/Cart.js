import React from 'react';
import './Cart.css';

const Cart = ({ cartItems }) => {
  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      <div className="cart-items">
      {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.cover_image} alt={item.title} className="cart-item-image" />
            <div className="cart-item-detail">
              <h3>{item.title}</h3>
              <p>¥{item.price}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cart;
