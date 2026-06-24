# 🗺️ SDK Routing

Navigation và routing cho SDK screens

---

## 🚀 Quick Start

### 1. Define Routes

```typescript
import { sdkRouter, type Route } from 'fox-ecom';

const routes: Route[] = [
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

sdkRouter.registerRoutes(routes);
```

### 2. Use Navigation

```typescript
import { useNavigation } from 'fox-ecom';

function MyComponent() {
  const { navigate, currentRoute, goBack } = useNavigation();

  return (
    <div>
      {currentRoute === 'home' && <HomeScreen />}
      {currentRoute === 'products' && <ProductsScreen />}

      <button onClick={() => navigate('products')}>
        Go to Products
      </button>
      <button onClick={goBack}>Back</button>
    </div>
  );
}
```

---

## 📱 Navigation Methods

### Navigate to Screen

```typescript
import { useNavigation } from 'fox-ecom';

const { navigate } = useNavigation();

// Simple navigation
navigate('products');

// With params
navigate('product-detail', { productId: '123', category: 'electronics' });
```

### Navigate with Params

```typescript
const { navigate, getParams } = useNavigation();

// Navigate
navigate('product-detail', { productId: '123' });

// Get params in next screen
const productId = getParams('productId'); // '123'
const allParams = getParams();             // { productId: '123' }
```

### Go Back

```typescript
const { goBack, canGoBack } = useNavigation();

// Check if can go back
if (canGoBack()) {
  goBack();
}
```

### Get Current Route

```typescript
const { currentRoute, isRoute } = useNavigation();

if (currentRoute === 'products') {
  // Render products screen
}

if (isRoute('cart')) {
  // Render cart screen
}
```

---

## 🎯 Hook API

```typescript
const {
  // State
  currentRoute,      // ScreenName | null
  previousRoute,     // ScreenName | null
  params,            // RouteParams
  history,           // ScreenName[]

  // Methods
  navigate,          // (screen, params?) => boolean
  goBack,            // () => boolean
  getParams,         // (key?) => any

  // Utils
  isRoute,           // (screen) => boolean
  canGoBack,         // () => boolean
} = useNavigation();
```

---

## 🔗 Deep Linking

### Parse Deep Link

```typescript
import { parseDeepLink } from 'fox-ecom';

const result = parseDeepLink('https://app.com/product-detail?productId=123');
// { screen: 'product-detail', params: { productId: '123' } }
```

### Handle Deep Link

```typescript
import { handleDeepLink } from 'fox-ecom';

// Navigate via URL
handleDeepLink('/products?category=electronics');
// Navigates to 'products' screen with params
```

### Create Deep Link

```typescript
import { createDeepLink } from 'fox-ecom';

const link = createDeepLink(
  'https://app.com',
  'product-detail',
  { productId: '123', category: 'electronics' }
);
// https://app.com/product-detail?productId=123&category=electronics
```

### Listen to Deep Links

```typescript
import { listenToDeepLinks } from 'fox-ecom';

useEffect(() => {
  const unsubscribe = listenToDeepLinks((screen, params) => {
    console.log(`Navigated to ${screen}`, params);
  });

  return unsubscribe;
}, []);
```

---

## 💻 Complete Example

### Setup Routes

```typescript
import { sdkRouter, Route } from 'fox-ecom';
import HomeScreen from './screens/HomeScreen';
import ProductsScreen from './screens/ProductsScreen';
import CartScreen from './screens/CartScreen';

const routes: Route[] = [
  { name: 'home', path: '/home', component: HomeScreen },
  { name: 'products', path: '/products', component: ProductsScreen },
  { name: 'cart', path: '/cart', component: CartScreen },
];

sdkRouter.registerRoutes(routes);
```

### App Component

```typescript
import { useNavigation } from 'fox-ecom';
import { listenToDeepLinks } from 'fox-ecom';

function App() {
  const { currentRoute } = useNavigation();

  useEffect(() => {
    const unsubscribe = listenToDeepLinks();
    return unsubscribe;
  }, []);

  const renderScreen = () => {
    switch (currentRoute) {
      case 'home':
        return <HomeScreen />;
      case 'products':
        return <ProductsScreen />;
      case 'cart':
        return <CartScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return <div>{renderScreen()}</div>;
}
```

### Screen Component

```typescript
import { useNavigation } from 'fox-ecom';

function ProductsScreen() {
  const { navigate, params } = useNavigation();
  const category = params.category || 'all';

  return (
    <div>
      <h1>Products - {category}</h1>
      
      <button onClick={() => navigate('product-detail', { productId: '123' })}>
        View Product
      </button>
      
      <button onClick={() => navigate('cart')}>
        Go to Cart
      </button>
    </div>
  );
}
```

---

## 📍 Router Service

### Direct Router API

```typescript
import { sdkRouter } from 'fox-ecom';

// Navigate
sdkRouter.navigate('products', { category: 'electronics' });

// Get current route
const current = sdkRouter.getCurrentRoute(); // 'products'

// Get params
const params = sdkRouter.getParams(); // { category: 'electronics' }

// Get component
const Component = sdkRouter.getRouteComponent('products');

// Get route
const route = sdkRouter.getRoute('products');

// Check route exists
const exists = sdkRouter.hasRoute('products'); // true

// Get navigation state
const state = sdkRouter.getState();
// { currentRoute, previousRoute, params, history }

// Subscribe to changes
const unsubscribe = sdkRouter.subscribe((state) => {
  console.log('Navigation changed', state);
});

// Go back
sdkRouter.goBack();

// Reset
sdkRouter.reset();
```

---

## 🎭 State Management

### Navigation State

```typescript
interface NavigationState {
  currentRoute: ScreenName | null;      // Current screen
  previousRoute: ScreenName | null;     // Previous screen
  params: RouteParams;                  // Current params
  history: ScreenName[];                // All visited screens
}
```

### Subscribe to Changes

```typescript
import { sdkRouter } from 'fox-ecom';

const unsubscribe = sdkRouter.subscribe((state) => {
  console.log('Current route:', state.currentRoute);
  console.log('History:', state.history);
  console.log('Params:', state.params);
});

// Cleanup
unsubscribe();
```

---

## 🔄 Navigation Flow

### Typical Flow

```
1. App starts
   ↓
2. Register routes
   sdkRouter.registerRoutes(routes)
   ↓
3. Listen to deep links
   listenToDeepLinks()
   ↓
4. Navigate via user action
   navigate('products')
   ↓
5. Render current screen
   switch(currentRoute)
   ↓
6. Handle navigation changes
   useNavigation() re-renders
```

---

## 📱 Mobile Deep Links

### React Native (if using)

```typescript
import { handleDeepLink } from 'fox-ecom';
import { Linking } from 'react-native';

useEffect(() => {
  // Handle app open from deep link
  Linking.addEventListener('url', ({ url }) => {
    handleDeepLink(url);
  });

  // Get initial URL
  Linking.getInitialURL().then((url) => {
    if (url) handleDeepLink(url);
  });
}, []);
```

---

## 🆘 Examples

### Navigate with Category

```typescript
const { navigate } = useNavigation();

navigate('products', { category: 'electronics', sort: 'price' });
```

### Product Detail with ID

```typescript
const { navigate } = useNavigation();

navigate('product-detail', { productId: '123' });
```

### Checkout with Order Summary

```typescript
const { navigate } = useNavigation();

navigate('checkout', {
  orderId: 'ORD-123',
  total: '99.99',
  items: 5
});
```

### Conditional Navigation

```typescript
const { navigate, canGoBack } = useNavigation();

if (canGoBack()) {
  goBack();
} else {
  navigate('home');
}
```

---

## 🎯 Best Practices

### ✅ DO:
- Register all routes upfront
- Use meaningful screen names
- Pass params via navigate method
- Subscribe to changes for updates
- Listen to deep links on app start
- Clean up subscriptions

### ❌ DON'T:
- Register routes dynamically
- Use URL for state management
- Pass complex objects as params
- Forget to unsubscribe
- Hard-code screen names

---

**Version**: 0.1.0  
**Last Updated**: 2026-06-24
