import { Cart } from '../../entities';
import { CartRepository } from '../../repositories';

export class RemoveFromCartUsecase {
  constructor(private cartRepository: CartRepository) {}

  async execute(productId: string): Promise<Cart> {
    if (!productId || productId.trim().length === 0) {
      throw new Error('Product ID cannot be empty');
    }

    const currentCart = await this.cartRepository.getCart();
    const updatedCart = currentCart.removeItem(productId);
    await this.cartRepository.saveCart(updatedCart);

    return updatedCart;
  }
}
