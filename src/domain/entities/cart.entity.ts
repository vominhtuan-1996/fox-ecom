import { Product } from './product.entity';

export class Cart {
  constructor(
    readonly items: Product[] = [],
    readonly total: number = 0,
  ) {}

  addItem(product: Product): Cart {
    const newItems = [...this.items, product];
    const newTotal = this.calculateTotal(newItems);
    return new Cart(newItems, newTotal);
  }

  removeItem(productId: string): Cart {
    const newItems = this.items.filter((item) => item.id !== productId);
    const newTotal = this.calculateTotal(newItems);
    return new Cart(newItems, newTotal);
  }

  clear(): Cart {
    return new Cart([], 0);
  }

  private calculateTotal(items: Product[]): number {
    return items.reduce((sum, item) => sum + item.price, 0);
  }

  getItemCount(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}
