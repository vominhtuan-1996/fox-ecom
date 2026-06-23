export class Product {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly price: number,
    readonly description?: string,
  ) {}

  isAvailable(): boolean {
    return this.price > 0;
  }

  getPriceAfterDiscount(discountPercent: number): number {
    if (discountPercent < 0 || discountPercent > 100) {
      throw new Error('Invalid discount percentage');
    }
    return this.price * (1 - discountPercent / 100);
  }
}
