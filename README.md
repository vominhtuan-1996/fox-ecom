# Fox eCommerce SDK

A React Native SDK for building e-commerce applications.

## Installation

```bash
npm install fox-ecom
# or
yarn add fox-ecom
```

## Requirements

- React Native >= 0.72.0
- React >= 17.0.0
- Node.js >= 16.0.0

## Quick Start

```tsx
import React from 'react';
import { ProductCard, useCart } from 'fox-ecom';

const MyApp = () => {
  const { cart, addItem } = useCart();

  return (
    <ProductCard
      product={{
        id: '1',
        name: 'My Product',
        price: 29.99,
      }}
      onPress={(product) => addItem(product)}
    />
  );
};

export default MyApp;
```

## Components

### ProductCard

Displays a single product with name, price, and description.

```tsx
import { ProductCard } from 'fox-ecom';

<ProductCard
  product={{
    id: '1',
    name: 'Product Name',
    price: 29.99,
    description: 'Product description',
  }}
  onPress={(product) => console.log('Product pressed:', product)}
/>
```

### Cart

Displays shopping cart with all items and total.

```tsx
import { Cart } from 'fox-ecom';

<Cart
  cart={{
    items: [{ id: '1', name: 'Product', price: 29.99 }],
    total: 29.99,
  }}
/>
```

## Hooks

### useCart

Manage shopping cart state.

```tsx
import { useCart } from 'fox-ecom';

const { cart, addItem, removeItem, clearCart } = useCart();
```

### useProduct

Fetch and manage products.

```tsx
import { useProduct } from 'fox-ecom';

const { products, loading, error, fetchProducts } = useProduct();

useEffect(() => {
  fetchProducts();
}, []);
```

## Utilities

### formatPrice

Format price as currency string.

```tsx
import { formatPrice } from 'fox-ecom';

formatPrice(29.99, 'USD'); // '$29.99'
```

### calculateDiscount

Calculate discounted price.

```tsx
import { calculateDiscount } from 'fox-ecom';

calculateDiscount(100, 10); // 90
```

## Development

### Setup

```bash
npm install
```

### Build

```bash
npm run build
```

### Testing

```bash
npm test
npm test -- --watch
npm test -- --coverage
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Type Checking

```bash
npm run type-check
```

## Publishing

```bash
# Create tarball
npm pack

# Publish to npm
npm publish
```

## License

MIT
