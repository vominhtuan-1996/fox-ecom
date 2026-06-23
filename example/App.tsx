import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {
  ProductCard,
  Cart,
  useCart,
  useProduct,
  setupDependencies,
  colors,
  spacing,
  typography,
  HttpClient,
} from 'fox-ecom';

// Initialize DI
setupDependencies();

// Setup HttpClient (optional)
const httpClient = new HttpClient({
  baseURL: 'https://api.example.com',
  timeout: 10000,
});

const App = () => {
  const { cart, addItem, removeItem, clearCart } = useCart();
  const { products, isLoading, error, fetchProducts } = useProduct();

  useEffect(() => {
    // Test: Fetch products on mount
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProduct = async (product: any) => {
    await addItem(product);
  };

  const handleRemoveProduct = (productId: string) => {
    removeItem(productId);
  };

  const handleClearCart = () => {
    clearCart();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🦊 Fox eCommerce SDK</Text>
      <Text style={styles.subtitle}>Example App</Text>

      {/* Loading State */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loading}>Đang tải sản phẩm...</Text>
        </View>
      )}

      {/* Error State */}
      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.error}>❌ Lỗi: {error}</Text>
        </View>
      )}

      {/* Products List */}
      {!isLoading && products.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📦 Danh Sách Sản Phẩm</Text>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={handleAddProduct}
            />
          ))}
        </View>
      )}

      {/* Empty State */}
      {!isLoading && products.length === 0 && !error && (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Không có sản phẩm</Text>
        </View>
      )}

      {/* Shopping Cart */}
      <View style={styles.section}>
        <View style={styles.cartHeader}>
          <Text style={styles.sectionTitle}>🛒 Giỏ Hàng</Text>
          {cart.items.length > 0 && (
            <TouchableOpacity onPress={handleClearCart}>
              <Text style={styles.clearButton}>Xóa tất cả</Text>
            </TouchableOpacity>
          )}
        </View>
        <Cart cart={cart} />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Fox eCommerce SDK v0.1.0
        </Text>
      </View>
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
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    color: colors.gray900,
  },
  subtitle: {
    fontSize: typography.body2.fontSize,
    color: colors.gray500,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
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
  errorBox: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.danger,
    borderRadius: 8,
  },
  error: {
    fontSize: typography.body1.fontSize,
    color: colors.white,
  },
  emptyBox: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: 8,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.body1.fontSize,
    color: colors.gray500,
  },
  section: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: '600',
    color: colors.gray900,
  },
  clearButton: {
    fontSize: typography.body2.fontSize,
    color: colors.danger,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  footerText: {
    fontSize: typography.caption.fontSize,
    color: colors.gray500,
  },
});

export default App;
