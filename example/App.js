import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, LogBox } from 'react-native';
import { useAuth, useNavigation, useProducts, useCart } from 'fox-ecom';

// Suppress RN internal LogBox Flow type errors
LogBox.ignoreLogs([/SyntaxError.*LogBox/, /missing-asset-registry-path/]);

const MENU_ITEMS = [
  { id: 'home', title: 'Home', icon: '🏠', color: '#FF6B6B' },
  { id: 'products', title: 'Products', icon: '📦', color: '#4ECDC4' },
  { id: 'cart', title: 'Cart', icon: '🛒', color: '#45B7D1' },
  { id: 'profile', title: 'Profile', icon: '👤', color: '#96CEB4' },
  { id: 'sdk', title: 'Fox SDK', icon: '🦊', color: '#FFEAA7' },
];

export function App() {
  const { user, logout } = useAuth();
  const { navigate } = useNavigation();
  const [currentScreen, setCurrentScreen] = useState('menu');

  const handleMenuPress = (itemId) => {
    if (itemId === 'sdk') {
      setCurrentScreen('sdk-info');
    } else {
      setCurrentScreen(itemId);
      navigate(itemId);
    }
  };

  if (currentScreen === 'menu') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Fox eCommerce</Text>
          <Text style={styles.subtitle}>Welcome, {user?.name || 'User'}!</Text>
        </View>

        <ScrollView style={styles.gridContainer}>
          <View style={styles.grid}>
            {MENU_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, { backgroundColor: item.color }]}
                onPress={() => handleMenuPress(item.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.icon}>{item.icon}</Text>
                <Text style={styles.menuTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (currentScreen === 'sdk-info') {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => setCurrentScreen('menu')}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <ScrollView style={styles.content}>
          <View style={styles.sdkInfo}>
            <Text style={styles.sdkTitle}>🦊 Fox eCommerce SDK</Text>
            <Text style={styles.sdkVersion}>v0.1.0</Text>

            <View style={styles.sdkSection}>
              <Text style={styles.sectionTitle}>Features:</Text>
              <Text style={styles.featureText}>✓ Authentication</Text>
              <Text style={styles.featureText}>✓ Product Management</Text>
              <Text style={styles.featureText}>✓ Shopping Cart</Text>
              <Text style={styles.featureText}>✓ Navigation</Text>
            </View>

            <View style={styles.sdkSection}>
              <Text style={styles.sectionTitle}>Status:</Text>
              <Text style={styles.statusText}>✅ Production Ready</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => setCurrentScreen('menu')}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <ScrollView style={styles.content}>
        {currentScreen === 'home' && <HomeContent onNavigate={() => handleMenuPress('products')} />}
        {currentScreen === 'products' && <ProductsContent />}
        {currentScreen === 'cart' && <CartContent />}
        {currentScreen === 'profile' && <ProfileContent onLogout={logout} />}
      </ScrollView>
    </SafeAreaView>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#007AFF', paddingTop: 20, paddingHorizontal: 20, paddingBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 16, color: '#e0e0e0', marginTop: 5 },

  // Grid Menu Styles
  gridContainer: { flex: 1, padding: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  menuItem: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: { fontSize: 48, marginBottom: 8 },
  menuTitle: { fontSize: 16, fontWeight: '600', color: '#fff', textAlign: 'center' },

  // Button Styles
  backBtn: { paddingHorizontal: 16, paddingVertical: 12 },
  backText: { fontSize: 16, color: '#007AFF', fontWeight: '600' },
  logoutBtn: {
    backgroundColor: '#ff3b30',
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  // SDK Info Styles
  sdkInfo: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginTop: 20 },
  sdkTitle: { fontSize: 28, fontWeight: '700', color: '#333', marginBottom: 4, textAlign: 'center' },
  sdkVersion: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 20 },
  sdkSection: { marginVertical: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#e0e0e0' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 8 },
  featureText: { fontSize: 14, color: '#666', marginVertical: 6 },
  statusText: { fontSize: 14, color: '#34C759', fontWeight: '600' },

  // Content & Screen Styles
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

  // Login Styles
  loginContainer: { flex: 1, justifyContent: 'center', paddingHorizontal: 20, backgroundColor: '#f5f5f5' },
  loginTitle: { fontSize: 32, fontWeight: 'bold', marginBottom: 30, color: '#333', textAlign: 'center' },
});

export default App;
