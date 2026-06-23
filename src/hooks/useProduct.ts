import { useState, useCallback } from 'react';
import type { Product } from '../types';

interface UseProductReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
}

export const useProduct = (): UseProductReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Placeholder: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProducts([
        {
          id: '1',
          name: 'Product 1',
          price: 29.99,
          description: 'Description for product 1',
        },
        {
          id: '2',
          name: 'Product 2',
          price: 39.99,
          description: 'Description for product 2',
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  return { products, loading, error, fetchProducts };
};
