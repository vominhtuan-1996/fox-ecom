/**
 * ProductsScreen
 * Display list of products
 */

import React, { useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../../cart/hooks/useCart';

export function ProductsScreen() {
  const { products, state, fetchProducts, getByCategory } = useProducts();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  if (state === 'loading') {
    return <div>Loading products...</div>;
  }

  if (state === 'error') {
    return <div>Error loading products</div>;
  }

  return (
    <div className="products-screen">
      <h1>📦 Products</h1>

      <div className="product-filters">
        <button onClick={() => fetchProducts()}>All</button>
        <button onClick={() => getByCategory('electronics')}>Electronics</button>
        <button onClick={() => getByCategory('clothing')}>Clothing</button>
      </div>

      <div className="products-list">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p className="price">${product.price}</p>
            <p className="rating">⭐ {product.rating}</p>
            <button
              onClick={() => addToCart(product, 1)}
              disabled={!product.stock || product.stock <= 0}
            >
              {product.stock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
