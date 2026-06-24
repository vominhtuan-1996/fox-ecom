/**
 * Example Cart Screen
 * Demonstrates using cart module
 */

import React from 'react';
import { useCart } from '@/modules/cart';
import { useNavigation } from '@/modules/navigation';
import { Routing } from '@/common/routing';

export function ExampleCartScreen() {
  const { items, totalPrice, totalItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const { navigate } = useNavigation();

  if (items.length === 0) {
    return (
      <div className="screen cart-screen empty">
        <div className="empty-cart">
          <h1>🛒 Shopping Cart</h1>
          <p>Your cart is empty</p>
          <button onClick={() => navigate(Routing.routes.products.name)}>
            📦 Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen cart-screen">
      <div className="cart-container">
        <h1>🛒 Shopping Cart ({totalItems} items)</h1>

        <div className="cart-items">
          {items.map((item) => (
            <div key={item.productId} className="cart-item">
              <div className="item-info">
                <h3>{item.product.name}</h3>
                <p className="price">${item.product.price}</p>
              </div>

              <div className="item-quantity">
                <button
                  onClick={() =>
                    updateQuantity(item.productId, Math.max(1, item.quantity - 1))
                  }
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>

              <div className="item-total">
                <p>${(item.product.price * item.quantity).toFixed(2)}</p>
              </div>

              <button
                onClick={() => removeFromCart(item.productId)}
                className="remove-btn"
              >
                🗑️ Remove
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-row">
            <span>Total Items:</span>
            <span>{totalItems}</span>
          </div>
          <div className="summary-row">
            <span>Total Price:</span>
            <span className="total">${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="cart-actions">
          <button onClick={() => navigate(Routing.routes.checkout.name)} className="checkout-btn">
            💳 Checkout
          </button>
          <button
            onClick={() => navigate(Routing.routes.products.name)}
            className="continue-btn"
          >
            📦 Continue Shopping
          </button>
          <button onClick={() => clearCart()} className="clear-btn">
            🗑️ Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
