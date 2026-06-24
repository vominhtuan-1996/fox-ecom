/**
 * Fox eCommerce SDK - Example App
 * Demonstrates all SDK features
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useAuth } from 'fox-ecom/modules/auth';
import { useNavigation } from 'fox-ecom/modules/navigation';
import { Routing } from 'fox-ecom/common/routing';
import { useProducts } from 'fox-ecom/modules/products';
import { useCart } from 'fox-ecom/modules/cart';

/**
 * Main App Component
 */
export function App() {
  const { user, isAuthenticated, logout } = useAuth();
  const { navigate, currentRoute } = useNavigation();
  const [currentScreen, setCurrentScreen] = useState('home');

  // Handle navigation
  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen);
    navigate(screen as any);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={() => setCurrentScreen('home')} />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🛍️ Fox eCommerce</Text>
        <Text style={styles.subtitle}>Welcome, {user?.name || 'User'}!</Text>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabs}>
        <NavTab
          label="🏠 Home"
          active={currentScreen === 'home'}
          onPress={() => handleNavigate('home')}
        />
        <NavTab
          label="📦 Products"
          active={currentScreen === 'products'}
          onPress={() => handleNavigate('products')}
        />
        <NavTab
          label="🛒 Cart"
          active={currentScreen === 'cart'}
          onPress={() => handleNavigate('cart')}
        />
        <NavTab
          label="👤 Profile"
          active={currentScreen === 'profile'}
          onPress={() => handleNavigate('profile')}
        />
      </View>

      {/* Screen Content */}
      <ScrollView style={styles.content}>
        {currentScreen === 'home' && <HomeContent />}
        {currentScreen === 'products' && <ProductsContent />}
        {currentScreen === 'cart' && <CartContent />}
        {currentScreen === 'profile' && <ProfileContent onLogout={() => logout()} />}
      </ScrollView>
    </View>
  );
}

/**
 * Navigation Tab Component
 */
function NavTab({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.tab, active && styles.tabActive]}
      onPress={onPress}
    >
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

/**
 * Home Screen Content
 */
function HomeContent() {
  const { navigate } = useNavigation();

  return (
    <View style={styles.screen}>
      <Text style={styles.screenTitle}>Welcome to Fox eCommerce SDK! 🎉</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features:</Text>
        <Text style={styles.featureItem}>✅ Authentication</Text>
        <Text style={styles.featureItem}>✅ Product Catalog</Text>
        <Text style={styles.featureItem}>✅ Shopping Cart</Text>
        <Text style={styles.featureItem}>✅ Navigation</Text>
        <Text style={styles.featureItem}>✅ Type-Safe SDK</Text>
      </View>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigate('products' as any)}
      >
        <Text style={styles.actionButtonText}>🛍️ Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * Products Screen Content
 */
function ProductsContent() {
  const { products, fetchProducts, isLoading } = useProducts();
  const { addToCart } = useCart();
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!loaded) {
      fetchProducts();
      setLoaded(true);
    }
  }, []);

  return (
    <View style={styles.screen}>
      <Text style={styles.screenTitle}>📦 Products</Text>

      {isLoading ? (
        <Text style={styles.loadingText}>Loading products...</Text>
      ) : (
        <View>
          {products.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>${product.price}</Text>
              <Text style={styles.productDesc}>{product.description}</Text>

              {product.rating && (
                <Text style={styles.productRating}>⭐ {product.rating}/5</Text>
              )}

              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  addToCart(product, 1);
                  alert(`✅ ${product.name} added to cart!`);
                }}
              >
                <Text style={styles.addButtonText}>🛒 Add to Cart</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

/**
 * Cart Screen Content
 */
function CartContent() {
  const { items, totalPrice, totalItems, removeFromCart, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <View style={styles.screen}>
        <Text style={styles.screenTitle}>🛒 Cart</Text>
        <Text style={styles.emptyText}>Your cart is empty</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.screenTitle}>🛒 Cart ({totalItems} items)</Text>

      {items.map((item) => (
        <View key={item.productId} style={styles.cartItem}>
          <View style={styles.cartItemInfo}>
            <Text style={styles.cartItemName}>{item.product.name}</Text>
            <Text style={styles.cartItemPrice}>
              ${item.product.price} x {item.quantity}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeFromCart(item.productId)}
          >
            <Text style={styles.removeButtonText}>🗑️ Remove</Text>
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.cartSummary}>
        <Text style={styles.summaryText}>
          Total: <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.checkoutButton} onPress={() => alert('Checkout!')}>
        <Text style={styles.checkoutButtonText}>💳 Checkout</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.checkoutButton, { backgroundColor: '#ff6b6b' }]}
        onPress={() => clearCart()}
      >
        <Text style={styles.checkoutButtonText}>Clear Cart</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * Profile Screen Content
 */
function ProfileContent({ onLogout }: { onLogout: () => void }) {
  const { user } = useAuth();

  return (
    <View style={styles.screen}>
      <Text style={styles.screenTitle}>👤 Profile</Text>

      <View style={styles.profileCard}>
        <Text style={styles.profileLabel}>Email:</Text>
        <Text style={styles.profileValue}>{user?.email}</Text>

        <Text style={styles.profileLabel}>Name:</Text>
        <Text style={styles.profileValue}>{user?.name}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutButtonText}>🚪 Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * Login Screen
 */
function LoginScreen({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = React.useState('test@example.com');
  const [password, setPassword] = React.useState('password123');

  const handleLogin = async () => {
    const result = await login({ email, password });
    if (result.success) {
      onLoginSuccess();
    }
  };

  return (
    <View style={styles.loginContainer}>
      <Text style={styles.loginTitle}>🔐 Login</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email:</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password:</Text>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity
        style={[styles.loginButton, loading && styles.loginButtonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginButtonText}>
          {loading ? '⏳ Logging in...' : '✅ Login with Demo Account'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.demoNote}>💡 Demo: Click login to test with mock credentials</Text>
    </View>
  );
}

/**
 * Styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e0e0',
    marginTop: 5,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#007AFF',
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  screen: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  featureItem: {
    fontSize: 14,
    paddingVertical: 6,
    color: '#666',
  },
  productCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
    marginVertical: 4,
  },
  productDesc: {
    fontSize: 12,
    color: '#666',
    marginVertical: 4,
  },
  productRating: {
    fontSize: 12,
    color: '#ff9500',
    marginVertical: 4,
  },
  addButton: {
    backgroundColor: '#34C759',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  cartItemPrice: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  removeButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  cartSummary: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 16,
    color: '#fff',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '700',
  },
  checkoutButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  profileCard: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
    marginVertical: 16,
  },
  profileLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginTop: 12,
  },
  profileValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  loginTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
  demoNote: {
    color: '#666',
    fontSize: 12,
    marginTop: 20,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default App;
