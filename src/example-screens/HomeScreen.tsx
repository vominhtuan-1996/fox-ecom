/**
 * Example Home Screen
 * Demonstrates using auth and navigation modules
 */

import React from 'react';
import { useAuth } from '@/modules/auth';
import { useNavigation } from '@/modules/navigation';
import { Routing } from '@/common/routing';

export function HomeScreen() {
  const { user, logout, isAuthenticated } = useAuth();
  const { navigate } = useNavigation();

  return (
    <div className="screen home-screen">
      <div className="home-container">
        <h1>🏠 Home</h1>

        {isAuthenticated && user && (
          <div className="user-info">
            <p>Welcome, <strong>{user.name || user.email}</strong>! 👋</p>
          </div>
        )}

        <section className="featured">
          <h2>Featured Products</h2>
          <p>Check out our latest products</p>
          <button onClick={() => navigate(Routing.routes.products.name)}>
            📦 View Products
          </button>
        </section>

        <section className="quick-links">
          <h2>Quick Links</h2>
          <div className="links-grid">
            <button onClick={() => navigate(Routing.routes.products.name)}>
              🛍️ Shop
            </button>
            <button onClick={() => navigate(Routing.routes.cart.name)}>
              🛒 Cart
            </button>
            <button onClick={() => navigate(Routing.routes.profile.name)}>
              👤 Profile
            </button>
          </div>
        </section>

        <section className="actions">
          {isAuthenticated && (
            <button onClick={() => logout()} className="logout-btn">
              🚪 Logout
            </button>
          )}
        </section>
      </div>
    </div>
  );
}
