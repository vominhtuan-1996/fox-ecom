import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import type { Cart as CartType } from '../../domain/entities';
import { colors, spacing, typography, fontWeight } from '../../common/theme';
import { ProductCard } from './ProductCard';

interface CartProps {
  cart: CartType;
}

export const Cart: React.FC<CartProps> = ({ cart }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping Cart</Text>
      {cart.isEmpty() ? (
        <Text style={styles.emptyText}>Your cart is empty</Text>
      ) : (
        <>
          <FlatList
            data={cart.items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ProductCard product={item} />}
            scrollEnabled={false}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalAmount}>${cart.total.toFixed(2)}</Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  title: {
    ...typography.h2,
    marginBottom: spacing.md,
    color: colors.gray900,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    ...typography.bodyMedium,
    color: colors.gray900,
  },
  totalAmount: {
    ...typography.h3,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
});
