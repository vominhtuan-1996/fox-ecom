import { Product } from '../../entities';
import { ProductRepository } from '../../repositories';

export class GetProductByIdUsecase {
  constructor(private productRepository: ProductRepository) {}

  async execute(id: string): Promise<Product | null> {
    if (!id || id.trim().length === 0) {
      throw new Error('Product ID cannot be empty');
    }
    return await this.productRepository.getProductById(id);
  }
}
