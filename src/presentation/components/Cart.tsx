import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import type { Cart as CartType } from '../../domain/entities';
import { colors, spacing, typography } from '../styles';
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
    fontSize: typography.h2.fontSize,
    fontWeight: '700',
    marginBottom: spacing.md,
    color: colors.gray900,
  },
  emptyText: {
    fontSize: typography.body1.fontSize,
    color: colors.gray500,
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
    borderTopColor: colors.gray200,
  },
  totalLabel: {
    fontSize: typography.body1.fontSize,
    fontWeight: '600',
    color: colors.gray900,
  },
  totalAmount: {
    fontSize: typography.h3.fontSize,
    fontWeight: 'bold',
    color: colors.primary,
  },
});
