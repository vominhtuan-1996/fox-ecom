/**
 * CartScreen
 * Display shopping cart
 */

import React from 'react';
import { useCart } from '../hooks/useCart';

export function CartScreen() {
  const { items, totalPrice, totalItems, removeFromCart, updateQuantity, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-screen empty">
        <h1>🛒 Shopping Cart</h1>
        <p>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="cart-screen">
      <h1>🛒 Shopping Cart ({totalItems} items)</h1>

      <div className="cart-items">
        {items.map((item) => (
          <div key={item.productId} className="cart-item">
            <div className="item-info">
              <h3>{item.product.name}</h3>
              <p>${item.product.price}</p>
            </div>

            <div className="item-quantity">
              <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
            </div>

            <div className="item-total">
              <p>${(item.product.price * item.quantity).toFixed(2)}</p>
              <button onClick={() => removeFromCart(item.productId)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Total Items:</span>
          <span>{totalItems}</span>
        </div>
        <div className="summary-row total">
          <span>Total Price:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="cart-actions">
        <button className="checkout">Checkout</button>
        <button className="continue">Continue Shopping</button>
        <button className="clear" onClick={clearCart}>
          Clear Cart
        </button>
      </div>
    </div>
  );
}
