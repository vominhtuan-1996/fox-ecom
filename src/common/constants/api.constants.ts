export const API_BASE_URL = 'https://api.example.com';
export const API_TIMEOUT = 10000; // ms
export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id: string) => `/products/${id}`,
  SEARCH: '/products/search',
};
