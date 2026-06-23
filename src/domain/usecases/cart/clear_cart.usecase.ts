import { Cart } from '../../entities';
import { CartRepository } from '../../repositories';

export class ClearCartUsecase {
  constructor(private cartRepository: CartRepository) {}

  async execute(): Promise<Cart> {
    await this.cartRepository.clearCart();
    return new Cart([], 0);
  }
}
