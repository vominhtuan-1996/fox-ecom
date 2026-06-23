import { useState, useCallback } from 'react';
import type { Cart, Product } from '../types';

interface UseCartReturn {
  cart: Cart;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

export const useCart = (): UseCartReturn => {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });

  const calculateTotal = useCallback((items: Product[]) => {
    return items.reduce((sum, item) => sum + item.price, 0);
  }, []);

  const addItem = useCallback(
    (product: Product) => {
      setCart((prevCart) => {
        const items = [...prevCart.items, product];
        return {
          items,
          total: calculateTotal(items),
        };
      });
    },
    [calculateTotal],
  );

  const removeItem = useCallback(
    (productId: string) => {
      setCart((prevCart) => {
        const items = prevCart.items.filter((item) => item.id !== productId);
        return {
          items,
          total: calculateTotal(items),
        };
      });
    },
    [calculateTotal],
  );

  const clearCart = useCallback(() => {
    setCart({ items: [], total: 0 });
  }, []);

  return { cart, addItem, removeItem, clearCart };
};
