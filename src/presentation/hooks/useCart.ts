import { useState, useCallback, useEffect } from 'react';
import { Cart, type Product } from '../../domain/entities';
import {
  AddToCartUsecase,
  RemoveFromCartUsecase,
  ClearCartUsecase,
} from '../../domain/usecases';
import { ServiceLocator } from '../../di';

interface UseCartReturn {
  cart: Cart;
  isLoading: boolean;
  error: string | null;
  addItem: (product: Product) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCart = (): UseCartReturn => {
  const [cart, setCart] = useState<Cart>(new Cart());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addItem = useCallback(async (product: Product) => {
    try {
      setIsLoading(true);
      setError(null);
      const usecase = ServiceLocator.get<AddToCartUsecase>('AddToCartUsecase');
      const updatedCart = await usecase.execute(product);
      setCart(updatedCart);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add item';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeItem = useCallback(async (productId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const usecase = ServiceLocator.get<RemoveFromCartUsecase>(
        'RemoveFromCartUsecase',
      );
      const updatedCart = await usecase.execute(productId);
      setCart(updatedCart);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove item';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const usecase = ServiceLocator.get<ClearCartUsecase>('ClearCartUsecase');
      const clearedCart = await usecase.execute();
      setCart(clearedCart);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to clear cart';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { cart, isLoading, error, addItem, removeItem, clearCart };
};
