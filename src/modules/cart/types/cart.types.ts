/**
 * Cart Types
 */

import { Product } from '../../../modules/products';

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  addedAt: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  lastUpdated: number;
}

export interface AddToCartRequest {
  productId: string;
  quantity?: number;
}

export type CartState = 'idle' | 'loading' | 'success' | 'error';
