/**
 * Ví dụ sử dụng HttpClient
 *
 * File này cho mục đích tài liệu, xóa sau khi setup xong
 */

import { HttpClient, BaseResponse } from './index';

// 1. Khởi tạo client
const httpClient = new HttpClient({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
});

// 2. Setup token refresh handler
httpClient['retryAuth'].setRefreshHandler(async () => {
  try {
    const response = await fetch('https://api.example.com/auth/refresh', {
      method: 'POST',
    });
    const data = await response.json();
    return data.token;
  } catch {
    return null;
  }
});

// 3. Setup auth token
httpClient.setAuthToken('initial-token');

// 4. Sử dụng
interface Product {
  id: string;
  name: string;
  price: number;
}

// GET request
async function getProducts() {
  try {
    const products = await httpClient.get<Product[]>('/products');
    console.log('Products:', products);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

// POST request
async function createProduct(product: Omit<Product, 'id'>) {
  try {
    const created = await httpClient.post<Product>('/products', product);
    console.log('Created:', created);
  } catch (error) {
    console.error('Error creating product:', error);
  }
}

// PUT request
async function updateProduct(id: string, product: Partial<Product>) {
  try {
    const updated = await httpClient.put<Product>(`/products/${id}`, product);
    console.log('Updated:', updated);
  } catch (error) {
    console.error('Error updating product:', error);
  }
}

// DELETE request
async function deleteProduct(id: string) {
  try {
    await httpClient.delete(`/products/${id}`);
    console.log('Deleted product', id);
  } catch (error) {
    console.error('Error deleting product:', error);
  }
}

// Custom request với timeout
async function getProductWithCustomTimeout(id: string) {
  try {
    const product = await httpClient.get<Product>(`/products/${id}`, {
      timeout: 5000, // 5 seconds custom timeout
    });
    return product;
  } catch (error) {
    console.error('Error:', error);
  }
}
