import { Cart, Product } from '../../entities';
import { CartRepository } from '../../repositories';

export class AddToCartUsecase {
  constructor(private cartRepository: CartRepository) {}

  async execute(product: Product): Promise<Cart> {
    if (!product || !product.id) {
      throw new Error('Invalid product');
    }

    const currentCart = await this.cartRepository.getCart();
    const updatedCart = currentCart.addItem(product);
    await this.cartRepository.saveCart(updatedCart);

    return updatedCart;
  }
}
