/**
 * Example Products Screen
 * Demonstrates using products and cart modules
 */

import React, { useEffect } from 'react';
import { useProducts } from '@/modules/products';
import { useCart } from '@/modules/cart';
import { useNavigation } from '@/modules/navigation';
import { Routing } from '@/common/routing';

export function ExampleProductsScreen() {
  const { products, fetchProducts, isLoading } = useProducts();
  const { addToCart } = useCart();
  const { navigate } = useNavigation();

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="screen products-screen">
      <div className="products-container">
        <h1>📦 Products</h1>

        {isLoading && <p>Loading products...</p>}

        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-header">
                <h3>{product.name}</h3>
                <p className="price">${product.price}</p>
              </div>

              <p className="description">{product.description}</p>

              {product.rating && (
                <div className="rating">
                  ⭐ {product.rating} / 5
                </div>
              )}

              {product.stock !== undefined && (
                <p className="stock">Stock: {product.stock}</p>
              )}

              <div className="product-actions">
                <button
                  onClick={() =>
                    navigate(Routing.routes.productDetail.name, {
                      productId: product.id,
                    })
                  }
                  className="view-btn"
                >
                  👁️ View Details
                </button>

                <button
                  onClick={() => {
                    addToCart(product, 1);
                    console.log(`✅ Added ${product.name} to cart`);
                  }}
                  className="cart-btn"
                >
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="products-footer">
          <button onClick={() => navigate(Routing.routes.cart.name)}>
            🛒 Go to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
