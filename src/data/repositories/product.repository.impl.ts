import { Product } from '../../domain/entities';
import { ProductRepository } from '../../domain/repositories';
import {
  ProductRemoteDataSource,
  ProductLocalDataSource,
} from '../datasources';

export class ProductRepositoryImpl implements ProductRepository {
  constructor(
    private remoteDataSource: ProductRemoteDataSource,
    private localDataSource: ProductLocalDataSource,
  ) {}

  async getProducts(): Promise<Product[]> {
    try {
      const models = await this.remoteDataSource.getProducts();
      // Cache the products
      await this.localDataSource.saveProducts(models);
      return models.map((model) => model.toDomain());
    } catch (error) {
      // Fallback to cached products
      try {
        const cachedModels = await this.localDataSource.getProducts();
        return cachedModels.map((model) => model.toDomain());
      } catch {
        throw new Error('Failed to fetch products from all sources');
      }
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const model = await this.remoteDataSource.getProductById(id);
      return model.toDomain();
    } catch (error) {
      try {
        const cached = await this.localDataSource.getProductById(id);
        return cached ? cached.toDomain() : null;
      } catch {
        throw new Error('Failed to fetch product from all sources');
      }
    }
  }

  async searchProducts(query: string): Promise<Product[]> {
    try {
      const models = await this.remoteDataSource.searchProducts(query);
      return models.map((model) => model.toDomain());
    } catch (error) {
      const allCached = await this.localDataSource.getProducts();
      const filtered = allCached.filter(
        (model) =>
          model.name.toLowerCase().includes(query.toLowerCase()) ||
          model.description?.toLowerCase().includes(query.toLowerCase()),
      );
      return filtered.map((model) => model.toDomain());
    }
  }
}
