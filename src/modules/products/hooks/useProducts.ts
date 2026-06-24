/**
 * useProducts Hook
 * React hook for products (replaces Flutter's product cubit)
 */

import { useEffect, useState } from 'react';
import { productService } from '../services/ProductService';
import { Product, ProductFilter, ProductListResponse, ProductState } from '../types/product.types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [state, setState] = useState<ProductState>('idle');
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all products
   */
  const fetchProducts = async (filter?: ProductFilter) => {
    setState('loading');
    try {
      const result = await productService.getProducts(filter);
      setProducts(result.items);
      setState('success');
      setError(null);
      return result;
    } catch (err: any) {
      setError(err.message);
      setState('error');
      return null;
    }
  };

  /**
   * Fetch product by ID
   */
  const fetchProductById = async (productId: string) => {
    setState('loading');
    try {
      const product = await productService.getProductById(productId);
      setState('success');
      setError(null);
      return product;
    } catch (err: any) {
      setError(err.message);
      setState('error');
      return null;
    }
  };

  /**
   * Search products
   */
  const searchProducts = async (query: string) => {
    setState('loading');
    try {
      const results = await productService.searchProducts(query);
      setProducts(results);
      setState('success');
      setError(null);
      return results;
    } catch (err: any) {
      setError(err.message);
      setState('error');
      return [];
    }
  };

  /**
   * Get products by category
   */
  const getByCategory = async (category: string) => {
    setState('loading');
    try {
      const results = await productService.getProductsByCategory(category);
      setProducts(results);
      setState('success');
      setError(null);
      return results;
    } catch (err: any) {
      setError(err.message);
      setState('error');
      return [];
    }
  };

  // Subscribe to changes
  useEffect(() => {
    const unsubscribe = productService.subscribe((newProducts) => {
      setProducts(newProducts);
    });
    return unsubscribe;
  }, []);

  return {
    products,
    state,
    error,
    isLoading: state === 'loading',
    fetchProducts,
    fetchProductById,
    searchProducts,
    getByCategory,
  };
}

export type UseProductsReturn = ReturnType<typeof useProducts>;
