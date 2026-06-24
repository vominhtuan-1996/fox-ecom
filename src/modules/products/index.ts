/**
 * Products Module
 * Product feature module
 */

export { productService, ProductService } from './services/ProductService';
export { useProducts } from './hooks/useProducts';
export type {
  Product,
  ProductFilter,
  ProductListResponse,
  ProductState,
} from './types/product.types';
