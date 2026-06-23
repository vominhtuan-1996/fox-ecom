import { Product } from '../../entities';
import { ProductRepository } from '../../repositories';

export class GetProductsUsecase {
  constructor(private productRepository: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return await this.productRepository.getProducts();
  }
}
