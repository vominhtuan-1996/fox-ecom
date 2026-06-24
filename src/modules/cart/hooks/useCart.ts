/**
 * useCart Hook
 * React hook for cart management (replaces Flutter's cart cubit)
 */

import { useEffect, useState } from 'react';
import { cartService } from '../services/CartService';
import { Cart, CartItem, CartState } from '../types/cart.types';
import { Product } from '../../../modules/products';

export function useCart() {
  const [cart, setCart] = useState<Cart>(cartService.getCart());
  const [state, setState] = useState<CartState>('idle');
  const [error, setError] = useState<string | null>(null);

  /**
   * Add to cart
   */
  const addToCart = (product: Product, quantity: number = 1) => {
    try {
      setState('loading');
      const cartItem: CartItem = {
        productId: product.id,
        product,
        quantity,
        addedAt: Date.now(),
      };
      cartService.addToCart(cartItem);
      setState('success');
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setState('error');
    }
  };

  /**
   * Remove from cart
   */
  const removeFromCart = (productId: string) => {
    try {
      setState('loading');
      cartService.removeFromCart(productId);
      setState('success');
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setState('error');
    }
  };

  /**
   * Update quantity
   */
  const updateQuantity = (productId: string, quantity: number) => {
    try {
      setState('loading');
      cartService.updateQuantity(productId, quantity);
      setState('success');
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setState('error');
    }
  };

  /**
   * Clear cart
   */
  const clearCart = () => {
    try {
      setState('loading');
      cartService.clearCart();
      setState('success');
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setState('error');
    }
  };

  /**
   * Subscribe to cart changes
   */
  useEffect(() => {
    const unsubscribe = cartService.subscribe((newCart) => {
      setCart(newCart);
    });
    return unsubscribe;
  }, []);

  return {
    cart,
    items: cart.items,
    totalItems: cart.totalItems,
    totalPrice: cart.totalPrice,
    state,
    error,
    isLoading: state === 'loading',
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
}

export type UseCartReturn = ReturnType<typeof useCart>;
