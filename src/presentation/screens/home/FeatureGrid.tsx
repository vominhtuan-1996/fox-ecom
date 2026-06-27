import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../../common/theme';

interface Feature {
  key: string;
  icon: string;
  title: string;
  subtitle: string;
  active: boolean;
  onPress?: () => void;
}

interface FeatureGridProps {
  features: Feature[];
  style?: ViewStyle;
}

/**
 * FeatureGrid — grid 3 card tính năng HomeScreen.
 * active: tap được · inactive: badge "Sắp có" + opacity
 */
export const FeatureGrid: React.FC<FeatureGridProps> = ({ features, style }) => (
  <View style={[s.grid, style]}>
    {features.map((f) => (
      <TouchableOpacity
        key={f.key}
        style={[s.card, !f.active && s.cardDisabled]}
        onPress={f.active ? f.onPress : undefined}
        activeOpacity={f.active ? 0.8 : 1}
      >
        {!f.active && (
          <View style={s.soonBadge}>
            <Text style={s.soonText}>Sắp có</Text>
          </View>
        )}
        <Text style={s.icon}>{f.icon}</Text>
        <Text style={[s.title, !f.active && s.titleDisabled]}>{f.title}</Text>
        <Text style={s.subtitle} numberOfLines={2}>{f.subtitle}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const s = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.xs,
    ...(shadows.card as object),
  },
  cardDisabled: { opacity: 0.55 },
  soonBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.fill,
    borderRadius: borderRadius.pill,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  soonText: { ...typography.tiny, color: colors.textSecondary, fontWeight: '700' } as object,
  icon:  { fontSize: 28, marginBottom: spacing.sm },
  title: { ...typography.s2, color: colors.text, marginBottom: 4 } as object,
  titleDisabled: { color: colors.textTertiary },
  subtitle: { ...typography.c2, color: colors.textSecondary } as object,
});
