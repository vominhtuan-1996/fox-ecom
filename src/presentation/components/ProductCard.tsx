import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { Product } from '../../domain/entities';
import { colors, spacing, typography, borderRadius, shadows } from '../../common/theme';

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
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    ...shadows.md,
  },
  name: {
    ...typography.bodyMedium,
    marginBottom: spacing.sm,
    color: colors.gray900,
  },
  price: {
    ...typography.bodySm,
    fontWeight: '700' as const,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.caption,
    color: colors.textTertiary,
  },
});
