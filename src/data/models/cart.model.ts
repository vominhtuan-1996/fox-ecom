import { Cart } from '../../domain/entities';
import { ProductModel } from './product.model';

export class CartModel {
  constructor(
    readonly items: ProductModel[] = [],
    readonly total: number = 0,
  ) {}

  static fromJson(json: any): CartModel {
    const items = (json.items || []).map((item: any) =>
      ProductModel.fromJson(item),
    );
    return new CartModel(items, json.total || 0);
  }

  toJson(): Record<string, any> {
    return {
      items: this.items.map((item) => item.toJson()),
      total: this.total,
    };
  }

  toDomain(): Cart {
    const products = this.items.map((item) => item.toDomain());
    return new Cart(products, this.total);
  }
}
