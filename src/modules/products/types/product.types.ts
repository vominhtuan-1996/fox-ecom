/**
 * Product Types
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  rating?: number;
  stock?: number;
  sku?: string;
  [key: string]: any;
}

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type ProductState = 'idle' | 'loading' | 'success' | 'error';
