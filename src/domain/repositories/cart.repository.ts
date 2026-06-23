import { Cart } from '../entities';

export interface CartRepository {
  getCart(): Promise<Cart>;
  saveCart(cart: Cart): Promise<void>;
  clearCart(): Promise<void>;
}
