import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useAuth } from 'fox-ecom/modules/auth';
import { useNavigation } from 'fox-ecom/modules/navigation';
import { useProducts } from 'fox-ecom/modules/products';
import { useCart } from 'fox-ecom/modules/cart';

export function App() {
  const { user, isAuthenticated, logout } = useAuth();
  const { navigate } = useNavigation();
  const [currentScreen, setCurrentScreen] = useState('home');

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
    navigate(screen);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={() => setCurrentScreen('home')} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fox eCommerce SDK</Text>
        <Text style={styles.subtitle}>Welcome, {user?.name || 'User'}!</Text>
      </View>

      <View style={styles.tabs}>
        {['home', 'products', 'cart', 'profile'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, currentScreen === tab && styles.tabActive]}
            onPress={() => handleNavigate(tab)}
          >
            <Text style={[styles.tabText, currentScreen === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {currentScreen === 'home' && <HomeContent onNavigate={handleNavigate} />}
        {currentScreen === 'products' && <ProductsContent />}
        {currentScreen === 'cart' && <CartContent />}
        {currentScreen === 'profile' && <ProfileContent onLogout={logout} />}
      </ScrollView>
    </View>
  );
}

function HomeContent({ onNavigate }) {
  return (
    <View style={styles.screen}>
      <Text style={styles.screenTitle}>Welcome to Fox eCommerce! 🎉</Text>
      <Text style={styles.featureItem}>✅ SDK from npm package</Text>
      <Text style={styles.featureItem}>✅ Type-safe modules</Text>
      <Text style={styles.featureItem}>✅ Production ready</Text>
      <TouchableOpacity style={styles.button} onPress={() => onNavigate('products')}>
        <Text style={styles.buttonText}>Browse Products</Text>
      </TouchableOpacity>
    </View>
  );
}

function ProductsContent() {
  const { products } = useProducts();
  const { addToCart } = useCart();

  return (
    <View style={styles.screen}>
      <Text style={styles.screenTitle}>Products</Text>
      {products.map((product) => (
        <View key={product.id} style={styles.card}>
          <Text style={styles.cardTitle}>{product.name}</Text>
          <Text style={styles.cardPrice}>${product.price}</Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => {
              addToCart(product, 1);
              alert('Added to cart!');
            }}
          >
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

function CartContent() {
  const { items, totalPrice, clearCart } = useCart();

  if (!items.length) {
    return (
      <View style={styles.screen}>
        <Text style={styles.screenTitle}>Cart (Empty)</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.screenTitle}>Cart ({items.length} items)</Text>
      <Text style={styles.cardPrice}>Total: ${totalPrice.toFixed(2)}</Text>
      <TouchableOpacity style={styles.button} onPress={clearCart}>
        <Text style={styles.buttonText}>Clear Cart</Text>
      </TouchableOpacity>
    </View>
  );
}

function ProfileContent({ onLogout }) {
  const { user } = useAuth();

  return (
    <View style={styles.screen}>
      <Text style={styles.screenTitle}>Profile</Text>
      <Text style={styles.label}>Email: {user?.email}</Text>
      <Text style={styles.label}>Name: {user?.name}</Text>
      <TouchableOpacity style={[styles.button, styles.buttonDanger]} onPress={onLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

function LoginScreen({ onLoginSuccess }) {
  const { login, loading } = useAuth();

  const handleLogin = async () => {
    const result = await login({ email: 'test@example.com', password: 'password123' });
    if (result.success) onLoginSuccess();
  };

  return (
    <View style={styles.loginContainer}>
      <Text style={styles.loginTitle}>Login</Text>
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Demo Login'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#007AFF', paddingTop: 40, paddingHorizontal: 20, paddingBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 16, color: '#e0e0e0', marginTop: 5 },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 3, borderBottomColor: '#007AFF' },
  tabText: { fontSize: 12, color: '#666', fontWeight: '500' },
  tabTextActive: { color: '#007AFF', fontWeight: '700' },
  content: { flex: 1, padding: 16 },
  screen: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 20 },
  screenTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  card: { backgroundColor: '#f9f9f9', borderRadius: 8, padding: 12, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#007AFF' },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  cardPrice: { fontSize: 18, fontWeight: '700', color: '#007AFF', marginVertical: 4 },
  featureItem: { fontSize: 14, paddingVertical: 6, color: '#666' },
  button: { backgroundColor: '#007AFF', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  buttonDanger: { backgroundColor: '#ff3b30' },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  label: { fontSize: 14, color: '#333', marginVertical: 8 },
  loginContainer: { flex: 1, justifyContent: 'center', paddingHorizontal: 20, backgroundColor: '#f5f5f5' },
  loginTitle: { fontSize: 32, fontWeight: 'bold', marginBottom: 30, color: '#333', textAlign: 'center' },
});

export default App;
