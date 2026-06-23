import { useState, useCallback } from 'react';
import type { Product } from '../../domain/entities';
import { GetProductsUsecase } from '../../domain/usecases';
import { ServiceLocator } from '../../di';

interface UseProductReturn {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
}

export const useProduct = (): UseProductReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const usecase = ServiceLocator.get<GetProductsUsecase>(
        'GetProductsUsecase',
      );
      const fetchedProducts = await usecase.execute();
      setProducts(fetchedProducts);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { products, isLoading, error, fetchProducts };
};
