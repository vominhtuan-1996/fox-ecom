/**
 * ProductService
 * Business logic for products
 * (Similar to Flutter's product repository)
 */

import { Product, ProductFilter, ProductListResponse } from '../types/product.types';

type ProductListener = (products: Product[]) => void;

class ProductServiceImpl {
  private static instance: ProductServiceImpl;
  private products: Product[] = [];
  private listeners: Set<ProductListener> = new Set();

  private constructor() {}

  static getInstance(): ProductServiceImpl {
    if (!ProductServiceImpl.instance) {
      ProductServiceImpl.instance = new ProductServiceImpl();
    }
    return ProductServiceImpl.instance;
  }

  /**
   * Get all products
   */
  async getProducts(filter?: ProductFilter): Promise<ProductListResponse> {
    try {
      console.log('📦 Fetching products...', filter);

      // TODO: Replace with actual API call
      // const response = await fetch(`${apiUrl}/products?...`);

      // Mock data for now
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Laptop',
          description: 'High-performance laptop',
          price: 999.99,
          category: 'electronics',
          rating: 4.5,
          stock: 10,
        },
        {
          id: '2',
          name: 'Phone',
          description: 'Latest smartphone',
          price: 599.99,
          category: 'electronics',
          rating: 4.8,
          stock: 20,
        },
        {
          id: '3',
          name: 'T-Shirt',
          description: 'Comfortable t-shirt',
          price: 19.99,
          category: 'clothing',
          rating: 4.2,
          stock: 50,
        },
      ];

      this.products = mockProducts;
      this.notifyListeners();

      return {
        items: mockProducts,
        total: mockProducts.length,
        page: filter?.page || 1,
        limit: filter?.limit || 10,
        totalPages: 1,
      };
    } catch (error: any) {
      console.error('❌ Failed to fetch products:', error.message);
      throw error;
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(productId: string): Promise<Product | null> {
    try {
      console.log('📦 Fetching product:', productId);

      // TODO: Replace with actual API call
      // const response = await fetch(`${apiUrl}/products/${productId}`);

      const product = this.products.find((p) => p.id === productId);
      return product || null;
    } catch (error: any) {
      console.error('❌ Failed to fetch product:', error.message);
      throw error;
    }
  }

  /**
   * Search products
   */
  async searchProducts(query: string): Promise<Product[]> {
    try {
      console.log('🔍 Searching products:', query);

      return this.products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description?.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error: any) {
      console.error('❌ Search failed:', error.message);
      throw error;
    }
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      console.log('📂 Fetching products by category:', category);

      return this.products.filter((p) => p.category === category);
    } catch (error: any) {
      console.error('❌ Failed to fetch products:', error.message);
      throw error;
    }
  }

  /**
   * Subscribe to product changes
   */
  subscribe(listener: ProductListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Private: Notify listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.products));
  }
}

export const productService = ProductServiceImpl.getInstance();
export class ProductService {
  static getInstance = ProductServiceImpl.getInstance;
}
