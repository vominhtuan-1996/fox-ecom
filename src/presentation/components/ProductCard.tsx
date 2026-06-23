import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { Product } from '../../domain/entities';
import { colors, spacing, typography } from '../styles';

interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress?.(product)}
      activeOpacity={0.7}
    >
      <View style={styles.container}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        {product.description && (
          <Text style={styles.description}>{product.description}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: spacing.sm,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  name: {
    fontSize: typography.body1.fontSize,
    fontWeight: '600',
    marginBottom: spacing.sm,
    color: colors.gray900,
  },
  price: {
    fontSize: typography.body2.fontSize,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.caption.fontSize,
    color: colors.gray500,
  },
});
