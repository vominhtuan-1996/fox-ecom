import { renderHook, act } from '@testing-library/react-native';
import { useCart } from '../../src/hooks/useCart';
import type { Product } from '../../src/types';

describe('useCart', () => {
  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    price: 29.99,
  };

  it('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCart());
    expect(result.current.cart.items).toEqual([]);
    expect(result.current.cart.total).toBe(0);
  });

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    expect(result.current.cart.items).toHaveLength(1);
    expect(result.current.cart.total).toBe(29.99);
  });

  it('should remove item from cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
      result.current.removeItem('1');
    });

    expect(result.current.cart.items).toHaveLength(0);
    expect(result.current.cart.total).toBe(0);
  });

  it('should clear cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
      result.current.clearCart();
    });

    expect(result.current.cart.items).toHaveLength(0);
    expect(result.current.cart.total).toBe(0);
  });
});
