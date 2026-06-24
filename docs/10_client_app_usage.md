# 📱 Client App Using Fox eCommerce SDK

Complete example: Cách app khác sử dụng SDK của bạn

---

## 📦 Step 1: Install SDK

### Via NPM

```bash
npm install fox-ecom
```

### Via Local Tarball (Development)

```bash
npm install ../fox-ecom-0.1.0.tgz
```

### Via GitHub (if published)

```bash
npm install github:tuanvm37/fox-ecom
```

---

## ⚙️ Step 2: Setup Environment

Create `.env` file:

```bash
# SDK Configuration
REACT_APP_API_BASE_URL=https://api.foxecom.com
REACT_APP_API_URL_DEVELOPMENT=http://localhost:3000
REACT_APP_API_URL_STAGING=https://api-staging.foxecom.com
REACT_APP_API_URL_PRODUCTION=https://api.foxecom.com

# Your App Token
REACT_APP_SDK_TOKEN=your-app-token-here
REACT_APP_SDK_ENV=production

# Extra Data
REACT_APP_USER_ID=your-user-id
REACT_APP_DEVICE_ID=your-device-id
```

---

## 🚀 Step 3: Initialize SDK

**File: `src/index.tsx` (App Entry Point)**

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { initSDK } from 'fox-ecom';
import App from './App';

// Initialize SDK before rendering app
async function initializeApp() {
  try {
    await initSDK({
      token: process.env.REACT_APP_SDK_TOKEN || 'default-token',
      environment: (process.env.REACT_APP_SDK_ENV || 'production') as any,
      extra: {
        userId: process.env.REACT_APP_USER_ID,
        deviceId: process.env.REACT_APP_DEVICE_ID,
        appVersion: '1.0.0',
        appName: 'MyApp',
      },
    });

    console.log('✅ SDK initialized');

    // Render app
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('❌ SDK initialization failed:', error);
  }
}

initializeApp();
```

---

## 🗺️ Step 4: Setup Routing

**File: `src/config/routes.tsx`**

```typescript
import { Route } from 'fox-ecom';
import HomeScreen from '../screens/HomeScreen';
import ProductsScreen from '../screens/ProductsScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';

export const appRoutes: Route[] = [
  {
    name: 'home',
    path: '/home',
    component: HomeScreen,
  },
  {
    name: 'products',
    path: '/products',
    component: ProductsScreen,
  },
  {
    name: 'product-detail',
    path: '/product-detail',
    component: ProductDetailScreen,
  },
  {
    name: 'cart',
    path: '/cart',
    component: CartScreen,
  },
  {
    name: 'checkout',
    path: '/checkout',
    component: CheckoutScreen,
  },
];
```

---

## 📱 Step 5: Create App Component

**File: `src/App.tsx`**

```typescript
import { useEffect } from 'react';
import { sdkRouter, useNavigation, listenToDeepLinks } from 'fox-ecom';
import { appRoutes } from './config/routes';
import './App.css';

// Register routes
sdkRouter.registerRoutes(appRoutes);

function App() {
  const { currentRoute } = useNavigation();

  useEffect(() => {
    // Listen to deep links for browser back button, hash navigation, etc.
    const unsubscribe = listenToDeepLinks();
    return unsubscribe;
  }, []);

  // Render current screen
  const Component = sdkRouter.getRouteComponent(currentRoute || 'home');

  return (
    <div className="app">
      {Component ? <Component /> : <div>Loading...</div>}
    </div>
  );
}

export default App;
```

---

## 🏠 Step 6: Create Screen Components

**File: `src/screens/HomeScreen.tsx`**

```typescript
import { useNavigation } from 'fox-ecom';
import '../styles/screens.css';

export default function HomeScreen() {
  const { navigate } = useNavigation();

  return (
    <div className="screen home-screen">
      <h1>Welcome to Fox eCommerce</h1>
      <p>Start shopping now!</p>

      <div className="button-group">
        <button
          className="btn btn-primary"
          onClick={() => navigate('products')}
        >
          Browse Products
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('cart')}
        >
          View Cart
        </button>
      </div>
    </div>
  );
}
```

**File: `src/screens/ProductsScreen.tsx`**

```typescript
import { useState } from 'react';
import { useNavigation } from 'fox-ecom';
import '../styles/screens.css';

const PRODUCTS = [
  { id: '1', name: 'Laptop', price: 999.99, category: 'electronics' },
  { id: '2', name: 'Phone', price: 599.99, category: 'electronics' },
  { id: '3', name: 'T-Shirt', price: 19.99, category: 'clothing' },
  { id: '4', name: 'Jeans', price: 49.99, category: 'clothing' },
];

export default function ProductsScreen() {
  const { navigate, params } = useNavigation();
  const category = params.category || 'all';

  const filteredProducts = category === 'all'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === category);

  return (
    <div className="screen products-screen">
      <h1>Products {category !== 'all' && `(${category})`}</h1>

      <div className="filters">
        <button onClick={() => navigate('products', { category: 'all' })}>
          All
        </button>
        <button onClick={() => navigate('products', { category: 'electronics' })}>
          Electronics
        </button>
        <button onClick={() => navigate('products', { category: 'clothing' })}>
          Clothing
        </button>
      </div>

      <div className="products-list">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <button
              onClick={() =>
                navigate('product-detail', { productId: product.id })
              }
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      <button onClick={() => navigate('home')} className="back-button">
        ← Back
      </button>
    </div>
  );
}
```

**File: `src/screens/ProductDetailScreen.tsx`**

```typescript
import { useNavigation } from 'fox-ecom';
import '../styles/screens.css';

export default function ProductDetailScreen() {
  const { navigate, getParams, goBack } = useNavigation();
  const productId = getParams('productId');

  return (
    <div className="screen product-detail-screen">
      <h1>Product Detail: {productId}</h1>

      <div className="product-info">
        <h2>Product Name</h2>
        <p>Price: $99.99</p>
        <p>Description: Amazing product description here</p>

        <div className="actions">
          <button onClick={() => navigate('cart')} className="btn btn-primary">
            Add to Cart
          </button>
          <button onClick={goBack} className="btn btn-secondary">
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}
```

**File: `src/screens/CartScreen.tsx`**

```typescript
import { useNavigation } from 'fox-ecom';
import '../styles/screens.css';

export default function CartScreen() {
  const { navigate } = useNavigation();

  return (
    <div className="screen cart-screen">
      <h1>Shopping Cart</h1>

      <div className="cart-items">
        <p>You have 2 items in cart</p>
        <div className="item">Item 1 - $99.99</div>
        <div className="item">Item 2 - $49.99</div>
      </div>

      <div className="cart-total">
        <h2>Total: $149.98</h2>
      </div>

      <div className="actions">
        <button
          onClick={() => navigate('checkout')}
          className="btn btn-primary"
        >
          Checkout
        </button>
        <button
          onClick={() => navigate('products')}
          className="btn btn-secondary"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
```

**File: `src/screens/CheckoutScreen.tsx`**

```typescript
import { useNavigation } from 'fox-ecom';
import '../styles/screens.css';

export default function CheckoutScreen() {
  const { navigate, goBack } = useNavigation();

  return (
    <div className="screen checkout-screen">
      <h1>Checkout</h1>

      <form>
        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="your@email.com" />
        </div>

        <div className="form-group">
          <label>Address</label>
          <input type="text" placeholder="Your address" />
        </div>

        <div className="form-group">
          <label>Card</label>
          <input type="text" placeholder="4532 1234 5678 9010" />
        </div>

        <button type="submit" className="btn btn-primary">
          Place Order
        </button>
      </form>

      <button onClick={goBack} className="btn btn-secondary">
        ← Back to Cart
      </button>
    </div>
  );
}
```

---

## 📂 Step 7: Project Structure

```
my-ecommerce-app/
├── src/
│   ├── index.tsx              # App entry point (init SDK)
│   ├── App.tsx                # Main app component (routing)
│   ├── config/
│   │   └── routes.tsx         # Route definitions
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── ProductsScreen.tsx
│   │   ├── ProductDetailScreen.tsx
│   │   ├── CartScreen.tsx
│   │   └── CheckoutScreen.tsx
│   └── styles/
│       ├── App.css
│       └── screens.css
├── .env                       # Environment configuration
├── .env.example              # Template
├── package.json              # Dependencies
└── public/
    └── index.html
```

---

## 🔗 Step 8: Update package.json

```json
{
  "name": "my-ecommerce-app",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "fox-ecom": "0.1.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "devDependencies": {
    "react-scripts": "5.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0"
  }
}
```

---

## 🚀 Step 9: Run App

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your token
REACT_APP_SDK_TOKEN=your-app-token-here

# Start app
npm start

# App runs at http://localhost:3000
```

---

## 📝 Complete Flow

### 1. App Starts
```
index.tsx
  ↓
initSDK({ token, environment, extra })
  ↓
SDK initialized
  ↓
App.tsx renders
```

### 2. Routes Registered
```
App.tsx
  ↓
sdkRouter.registerRoutes(appRoutes)
  ↓
Routes ready for navigation
```

### 3. User Navigates
```
HomeScreen
  ↓ (click Browse Products)
ProductsScreen
  ↓ (click View Details)
ProductDetailScreen
  ↓ (click Add to Cart)
CartScreen
  ↓ (click Checkout)
CheckoutScreen
```

### 4. All Requests Include Auth
```
Component uses SDK
  ↓
API call with Authorization header
  ↓
Token injected automatically
  ↓
Request succeeds
```

---

## ✅ Checklist

- [ ] Install SDK: `npm install fox-ecom`
- [ ] Create `.env` file
- [ ] Set `REACT_APP_SDK_TOKEN`
- [ ] Initialize SDK in `index.tsx`
- [ ] Define routes in `config/routes.tsx`
- [ ] Create screen components
- [ ] Register routes in `App.tsx`
- [ ] Test navigation
- [ ] Deploy to production

---

## 🎯 Key Points

✅ **SDK must be initialized before rendering app**
✅ **Routes must be registered before navigation**
✅ **Use `useNavigation()` hook in components**
✅ **All API calls include auth token automatically**
✅ **Environment variables control API URL**
✅ **Extra data is available everywhere**

---

## 📱 Using Other SDK Features

### Dialogs

```typescript
import { useDialog } from 'fox-ecom';

function MyComponent() {
  const { alert, confirm } = useDialog();

  const handleDelete = async () => {
    const result = await confirm({
      title: 'Delete?',
      message: 'Are you sure?',
    });
    if (result) {
      // Delete
    }
  };

  return <button onClick={handleDelete}>Delete</button>;
}
```

### Toast

```typescript
import { Toast } from 'fox-ecom';

Toast.show({
  message: 'Item added to cart!',
  type: 'success',
  duration: 2000,
});
```

### Cart

```typescript
import { useCart } from 'fox-ecom';

function ProductDetailScreen() {
  const { addToCart, items } = useCart();

  return (
    <button onClick={() => addToCart(productId)}>
      Add to Cart ({items.length})
    </button>
  );
}
```

---

## 🆘 Troubleshooting

### "SDK not initialized"
```typescript
// Make sure initSDK is called in index.tsx BEFORE rendering App
await initSDK({ token, environment });
ReactDOM.render(<App />);
```

### "Route not found"
```typescript
// Check route name is registered
sdkRouter.registerRoutes(appRoutes);
navigate('products'); // Must match route name
```

### "Token not working"
```typescript
// Check .env file
REACT_APP_SDK_TOKEN=your-actual-token

// Restart dev server after changing .env
npm start
```

### "Navigation not updating"
```typescript
// Make sure useNavigation hook is in component
const { navigate, currentRoute } = useNavigation();
// Not: const currentRoute = sdkRouter.getCurrentRoute()
```

---

## 📚 SDK Documentation

- [Authentication Layer](./06_authentication.md)
- [SDK Initialization](./08_sdk_simple_init.md)
- [SDK Routing](./09_sdk_routing.md)

---

**Version**: 0.1.0  
**Last Updated**: 2026-06-24
```