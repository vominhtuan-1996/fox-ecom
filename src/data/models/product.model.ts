import { Product } from '../../domain/entities';

export interface ProductModelParams {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export class ProductModel {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly price: number,
    readonly description?: string,
  ) {}

  static fromJson(json: any): ProductModel {
    return new ProductModel(
      json.id,
      json.name,
      json.price,
      json.description,
    );
  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      description: this.description,
    };
  }

  toDomain(): Product {
    return new Product(
      this.id,
      this.name,
      this.price,
      this.description,
    );
  }
}
