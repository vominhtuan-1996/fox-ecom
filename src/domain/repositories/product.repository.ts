import { Product } from '../entities';

export interface ProductRepository {
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  searchProducts(query: string): Promise<Product[]>;
}
