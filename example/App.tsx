import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ProductCard, Cart, useCart, useProduct } from '../src/index';

const App = () => {
  const { cart, addItem, removeItem, clearCart } = useCart();
  const { products, loading, error, fetchProducts } = useProduct();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>eCommerce Demo</Text>

      {loading && <Text style={styles.loading}>Loading products...</Text>}
      {error && <Text style={styles.error}>Error: {error}</Text>}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Products</Text>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onPress={() => addItem(product)}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Cart cart={cart} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  loading: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
    color: '#666',
  },
  error: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
    color: 'red',
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
});

export default App;
