# 🔌 Custom Integration - Use SDK with Your Own Navigator

How to use Fox eCommerce SDK with your own navigation system and custom screens

---

## 🎯 Overview

**Scenario**: Other app wants to:
- Use their own navigation system (React Navigation, etc.)
- Use their own auth screen design
- Use their own UI components
- But use SDK's auth logic & services

**Solution**: SDK is modular - use only what you need!

---

## 📋 Three Approaches

### Approach 1: Use Only Auth Service (Minimal)
Use only the auth service, ignore routing

### Approach 2: Use Auth + Your Navigation
Use SDK auth with your navigator

### Approach 3: Full Customization
Use any parts of SDK, override screens/routing

---

## 🎯 Approach 1: Auth Service Only

Use SDK for auth logic, your own navigation for screens.

### Setup

```typescript
// src/main.tsx
import { initializeApp } from 'fox-ecom';

// Initialize only auth/services
await initializeApp({
  token: 'your-token',
  environment: 'production',
});

// Your own navigation setup
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={YourLoginScreen} />
        <Stack.Screen name="Home" component={YourHomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### Use Auth Service

```typescript
// YourLoginScreen.tsx
import { useAuth } from 'fox-ecom';

export function YourLoginScreen({ navigation }) {
  const { login, loading, error } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    const response = await login({ email, password });
    
    if (response.success) {
      // Your navigation
      navigation.navigate('Home');
    }
  };

  return (
    <div>
      {/* Your custom UI */}
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button onClick={() => handleLogin('...', '...')}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

### That's it! ✅

You get:
- ✅ Auth service (`useAuth`)
- ✅ Your navigation system
- ✅ Your custom UI
- ❌ SDK routing (don't use Routing class)

---

## 🎯 Approach 2: Auth + Your Navigation

Mix SDK auth with your navigation system.

### Setup

```typescript
// src/main.tsx
import { initializeApp } from 'fox-ecom';
import { NavigationContainer } from '@react-navigation/native';

// 1. Initialize auth only
await initializeApp({
  token: 'your-token',
  environment: 'production',
});

// 2. Setup your navigation
function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <AppStack />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}
```

### Auth Stack

```typescript
// AuthStack.tsx
import { useAuth } from 'fox-ecom';

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login">
        {(props) => <YourCustomLoginScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Register">
        {(props) => <YourCustomRegisterScreen {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function YourCustomLoginScreen({ navigation }) {
  const { login } = useAuth();

  const handleSubmit = async (email, password) => {
    const result = await login({ email, password });
    if (result.success) {
      navigation.replace('Home');
    }
  };

  return (
    <div>
      {/* Your beautiful login UI */}
      <Form onSubmit={handleSubmit} />
    </div>
  );
}
```

### App Stack

```typescript
// AppStack.tsx
import { useAuth, useProducts, useCart } from 'fox-ecom';

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Products" component={ProductsScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>
  );
}

function ProductsScreen({ navigation }) {
  const { products, fetchProducts } = useProducts();

  return (
    <div>
      <button onClick={() => fetchProducts()}>Load</button>
      {products.map((p) => (
        <button key={p.id} onClick={() => navigation.navigate('ProductDetail', { id: p.id })}>
          {p.name}
        </button>
      ))}
    </div>
  );
}

function ProductDetailScreen({ route, navigation }) {
  const { addToCart } = useCart();

  return (
    <div>
      <button onClick={() => addToCart(product, 1)}>Add to Cart</button>
      <button onClick={() => navigation.navigate('Cart')}>Go to Cart</button>
    </div>
  );
}
```

### You Get:

✅ Auth service (`useAuth`)
✅ Products service (`useProducts`)
✅ Cart service (`useCart`)
✅ Your navigation (React Navigation)
✅ Your custom screens
❌ SDK routing (`Routing` class)

---

## 🎯 Approach 3: Full Customization

Use SDK routing but customize screens.

### Step 1: Custom Screens

```typescript
// src/screens/CustomAuthScreen.tsx
import { useAuth } from 'fox-ecom';

export function CustomAuthScreen() {
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <div>Already logged in</div>;
  }

  return (
    <div className="auth-screen">
      {/* Your custom auth UI using SDK auth service */}
      <YourAuthForm onSubmit={login} />
    </div>
  );
}

// src/screens/CustomProductsScreen.tsx
import { useProducts } from 'fox-ecom';
import { useNavigation } from 'fox-ecom';
import { Routing } from 'fox-ecom';

export function CustomProductsScreen() {
  const { products, fetchProducts } = useProducts();
  const { navigate } = useNavigation();

  return (
    <div className="products-screen">
      {/* Your custom design using SDK services */}
      <YourCustomProductsList
        products={products}
        onProductClick={(id) =>
          navigate(Routing.routes.productDetail.name, { productId: id })
        }
      />
    </div>
  );
}
```

### Step 2: Register Custom Screens

```typescript
// src/app/screen-map.ts
import * as CustomScreens from '@/screens/custom';

export const screenMap = {
  // Override SDK screens with your custom ones
  auth: CustomScreens.CustomAuthScreen,
  products: CustomScreens.CustomProductsScreen,
  cart: CustomScreens.CustomCartScreen,
  // ... more custom screens
};
```

### Step 3: Setup

```typescript
// src/main.tsx
import { initializeApp, setupAppRouting } from 'fox-ecom';
import { screenMap } from '@/app/screen-map';

await initializeApp({ token, environment });
await setupAppRouting(screenMap);  // Your custom screens

ReactDOM.render(<App />, document.getElementById('root'));
```

### You Get:

✅ SDK routing (`Routing` class)
✅ SDK services (auth, products, cart)
✅ Your custom screens & UI
✅ Full control over navigation

---

## 🎨 Approach 4: Mix & Match

Use **some** SDK screens and **some** custom screens.

```typescript
// src/app/screen-map.ts
import { ProductsScreen } from 'fox-ecom';  // SDK screen
import { CustomAuthScreen } from '@/screens';  // Your screen
import { CustomCartScreen } from '@/screens';  // Your screen

export const screenMap = {
  // SDK screens
  products: ProductsScreen,
  productDetail: ProductDetailScreen,
  
  // Your custom screens
  auth: CustomAuthScreen,
  cart: CustomCartScreen,
  checkout: CustomCheckoutScreen,
};
```

---

## 🔧 Using Only Specific SDK Features

### Just Auth (No Routing)

```typescript
import { useAuth, authService } from 'fox-ecom';

// Use only auth, ignore everything else
const { user, login, logout } = useAuth();
```

### Just Products

```typescript
import { useProducts, productService } from 'fox-ecom';

// Use only products
const { products, fetchProducts } = useProducts();
```

### Just Cart

```typescript
import { useCart, cartService } from 'fox-ecom';

// Use only cart
const { items, addToCart } = useCart();
```

### Just Routing

```typescript
import { Routing, useNavigation, setupAppRouting } from 'fox-ecom';

// Use only routing
navigate(Routing.routes.products.name);
```

---

## 💡 Real-World Examples

### Example 1: React Navigation + SDK Auth

```typescript
// Use React Navigation with SDK auth service

import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from 'fox-ecom';

function Navigation() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default Navigation;
```

### Example 2: Vue.js + SDK Services

```typescript
// Use Vue with SDK services (not React)

import { useAuth } from 'fox-ecom';

export default {
  setup() {
    const { user, login, logout } = useAuth();
    
    return { user, login, logout };
  }
};
```

### Example 3: Angular + SDK

```typescript
// Use Angular with SDK services

import { Injectable } from '@angular/core';
import { authService } from 'fox-ecom';

@Injectable()
export class AuthFacade {
  login(email: string, password: string) {
    return authService.login({ email, password });
  }
}
```

### Example 4: Custom Navigation Stack

```typescript
// Custom navigation without SDK routing

import { useAuth, useProducts, useCart } from 'fox-ecom';

function App() {
  const [screen, setScreen] = useState('home');
  const { isAuthenticated } = useAuth();
  const { products } = useProducts();
  const { items } = useCart();

  return (
    <div>
      {!isAuthenticated ? (
        <LoginScreen onLogin={() => setScreen('home')} />
      ) : (
        <>
          <Header />
          {screen === 'home' && <HomeScreen />}
          {screen === 'products' && <ProductsScreen products={products} />}
          {screen === 'cart' && <CartScreen items={items} />}
        </>
      )}
    </div>
  );
}
```

---

## 🎯 Decision Tree

```
Does app want to use SDK routing (Routing class)?
├─ YES → Setup with setupAppRouting() → Use custom screens
└─ NO → Use only services (useAuth, useProducts, etc.)

Does app have existing navigator?
├─ YES → Skip SDK routing, use own navigation
└─ NO → Use SDK routing or create own

Does app want custom UI?
├─ YES → Create custom screens, use SDK services
└─ NO → Use SDK screens as-is
```

---

## ✅ Checklist: Integration Options

- ✅ Auth service only (minimal)
- ✅ Auth + your navigator
- ✅ Full SDK with custom screens
- ✅ Mix SDK & custom screens
- ✅ Specific features only
- ✅ Any framework (React, Vue, Angular, etc.)

---

## 📚 Summary

**The SDK is flexible:**

| Need | Solution |
|------|----------|
| Auth only | Import `useAuth` only |
| Custom nav | Skip SDK routing, use `useAuth`, `useProducts`, etc. |
| Custom screens | Map custom screens in `screenMap` |
| Mix SDK & custom | Use both SDK screens and custom screens |
| No routing | Use services directly, ignore Routing class |
| Different framework | Services work anywhere (React, Vue, etc.) |

**Your app controls:**
- Navigation system
- Screen designs
- UI components
- User flow

**SDK provides:**
- Auth logic
- Business services
- Data management
- Type definitions

---

**Version**: 0.1.0  
**Integration Level**: Fully Customizable  
**Last Updated**: 2026-06-24
