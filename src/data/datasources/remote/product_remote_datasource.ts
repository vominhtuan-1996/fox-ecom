import { ProductModel } from '../../models';

export interface IProductRemoteDataSource {
  getProducts(): Promise<ProductModel[]>;
  getProductById(id: string): Promise<ProductModel>;
  searchProducts(query: string): Promise<ProductModel[]>;
}

export class ProductRemoteDataSource implements IProductRemoteDataSource {
  async getProducts(): Promise<ProductModel[]> {
    try {
      // Placeholder: Replace with actual API call
      await new Promise((resolve) => setTimeout(() => resolve(null), 1000));
      const mockData = [
        {
          id: '1',
          name: 'Premium Product',
          price: 29.99,
          description: 'High quality product',
        },
        {
          id: '2',
          name: 'Standard Product',
          price: 19.99,
          description: 'Good quality product',
        },
      ];
      return mockData.map((item) => ProductModel.fromJson(item));
    } catch (error) {
      throw new Error('Failed to fetch products');
    }
  }

  async getProductById(id: string): Promise<ProductModel> {
    try {
      await new Promise((resolve) => setTimeout(() => resolve(null), 500));
      const mockData = {
        id,
        name: 'Product ' + id,
        price: 29.99,
      };
      return ProductModel.fromJson(mockData);
    } catch (error) {
      throw new Error('Failed to fetch product');
    }
  }

  async searchProducts(query: string): Promise<ProductModel[]> {
    try {
      const allProducts = await this.getProducts();
      return allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description?.toLowerCase().includes(query.toLowerCase()),
      );
    } catch (error) {
      throw new Error('Failed to search products');
    }
  }
}
