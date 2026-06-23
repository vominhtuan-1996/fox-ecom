import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import {
  ProductCard,
  Cart,
  useCart,
  useProduct,
  setupDependencies,
  colors,
  spacing,
  typography,
} from '../src/index';

setupDependencies();

const App = () => {
  const { cart, addItem } = useCart();
  const { products, isLoading, error, fetchProducts } = useProduct();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProduct = async (product: any) => {
    await addItem(product);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Fox eCommerce</Text>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loading}>Loading products...</Text>
        </View>
      )}

      {error && <Text style={styles.error}>Error: {error}</Text>}

      {!isLoading && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Products</Text>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={handleAddProduct}
              />
            ))}
          </View>

          <View style={styles.section}>
            <Cart cart={cart} />
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
    paddingTop: spacing.xl,
  },
  title: {
    fontSize: typography.h1.fontSize,
    fontWeight: '700',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    color: colors.gray900,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  loading: {
    fontSize: typography.body1.fontSize,
    textAlign: 'center',
    marginVertical: spacing.md,
    color: colors.gray500,
  },
  error: {
    fontSize: typography.body1.fontSize,
    textAlign: 'center',
    marginVertical: spacing.md,
    color: colors.danger,
    paddingHorizontal: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: '600',
    marginBottom: spacing.md,
    color: colors.gray900,
  },
});

export default App;
