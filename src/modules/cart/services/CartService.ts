import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * CartService
 * Business logic for shopping cart
 * (Similar to Flutter's cart repository)
 */

import { Cart, CartItem, AddToCartRequest } from '../types/cart.types';

type CartListener = (cart: Cart) => void;

class CartServiceImpl {
  private static instance: CartServiceImpl;
  private cart: Cart = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    lastUpdated: Date.now(),
  };
  private listeners: Set<CartListener> = new Set();

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): CartServiceImpl {
    if (!CartServiceImpl.instance) {
      CartServiceImpl.instance = new CartServiceImpl();
    }
    return CartServiceImpl.instance;
  }

  /**
   * Add item to cart
   */
  addToCart(item: CartItem): void {
    try {
      const existing = this.cart.items.find((i) => i.productId === item.productId);

      if (existing) {
        existing.quantity += item.quantity;
      } else {
        this.cart.items.push(item);
      }

      this.updateCart();
      console.log('✅ Item added to cart:', item.product.name);
    } catch (error: any) {
      console.error('❌ Failed to add to cart:', error.message);
      throw error;
    }
  }

  /**
   * Remove item from cart
   */
  removeFromCart(productId: string): void {
    try {
      this.cart.items = this.cart.items.filter((i) => i.productId !== productId);
      this.updateCart();
      console.log('✅ Item removed from cart:', productId);
    } catch (error: any) {
      console.error('❌ Failed to remove from cart:', error.message);
      throw error;
    }
  }

  /**
   * Update item quantity
   */
  updateQuantity(productId: string, quantity: number): void {
    try {
      const item = this.cart.items.find((i) => i.productId === productId);
      if (item) {
        item.quantity = Math.max(1, quantity);
        this.updateCart();
        console.log('✅ Quantity updated:', productId, quantity);
      }
    } catch (error: any) {
      console.error('❌ Failed to update quantity:', error.message);
      throw error;
    }
  }

  /**
   * Clear cart
   */
  clearCart(): void {
    try {
      this.cart.items = [];
      this.updateCart();
      console.log('✅ Cart cleared');
    } catch (error: any) {
      console.error('❌ Failed to clear cart:', error.message);
      throw error;
    }
  }

  /**
   * Get cart
   */
  getCart(): Cart {
    return { ...this.cart };
  }

  /**
   * Get total price
   */
  getTotalPrice(): number {
    return this.cart.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }

  /**
   * Get total items
   */
  getTotalItems(): number {
    return this.cart.items.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Subscribe to cart changes
   */
  subscribe(listener: CartListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Private: Update cart and notify listeners
   */
  private updateCart(): void {
    this.cart.totalItems = this.getTotalItems();
    this.cart.totalPrice = this.getTotalPrice();
    this.cart.lastUpdated = Date.now();
    this.saveToStorage();
    this.notifyListeners();
  }

  /**
   * Private: Save to storage
   */
  private saveToStorage(): void {
    AsyncStorage.setItem('cart', JSON.stringify(this.cart)).catch(() => {});
  }

  /**
   * Private: Load from storage
   */
  private loadFromStorage(): void {
    AsyncStorage.getItem('cart').then(stored => {
      if (stored) {
        try { this.cart = JSON.parse(stored); } catch { /* ignore */ }
      }
    }).catch(() => {});
  }

  /**
   * Private: Notify listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.getCart()));
  }
}

export const cartService = CartServiceImpl.getInstance();
export class CartService {
  static getInstance = CartServiceImpl.getInstance;
}
