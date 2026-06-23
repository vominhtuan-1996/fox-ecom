/**
 * Type definitions for the SDK
 */

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface Cart {
  items: Product[];
  total: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
}
