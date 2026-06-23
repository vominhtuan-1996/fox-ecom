import { ProductModel } from '../../models';

export interface IProductLocalDataSource {
  getProducts(): Promise<ProductModel[]>;
  getProductById(id: string): Promise<ProductModel | null>;
  saveProducts(products: ProductModel[]): Promise<void>;
}

export class ProductLocalDataSource implements IProductLocalDataSource {
  private cachedProducts: Map<string, ProductModel> = new Map();

  async getProducts(): Promise<ProductModel[]> {
    try {
      // Placeholder: Replace with AsyncStorage or SQLite
      return Array.from(this.cachedProducts.values());
    } catch (error) {
      throw new Error('Failed to fetch cached products');
    }
  }

  async getProductById(id: string): Promise<ProductModel | null> {
    try {
      return this.cachedProducts.get(id) || null;
    } catch (error) {
      throw new Error('Failed to fetch cached product');
    }
  }

  async saveProducts(products: ProductModel[]): Promise<void> {
    try {
      products.forEach((product) => {
        this.cachedProducts.set(product.id, product);
      });
    } catch (error) {
      throw new Error('Failed to cache products');
    }
  }
}
