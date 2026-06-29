import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../../common/theme';

/**
 * FeatureGrid V2 — glassmorphism cho inactive, gradient cam cho active.
 */
export function FeatureGrid({ features, style }) {
  return (
    <View style={[s.grid, style]}>
      {features.map(f => (
        <TouchableOpacity
          key={f.key}
          style={[s.card, f.active ? s.cardActive : s.cardGlass]}
          onPress={f.active ? f.onPress : undefined}
          activeOpacity={f.active ? 0.85 : 1}
        >
          {/* Lock icon cho inactive */}
          {f.locked && (
            <View style={s.lockWrap}>
              <Text style={s.lockIcon}>🔒</Text>
            </View>
          )}

          <Text style={s.icon}>{f.icon}</Text>
          <Text style={[s.title, f.active ? s.titleActive : s.titleGlass]}>
            {f.title}
          </Text>
          <Text style={[s.subtitle, f.active ? s.subtitleActive : s.subtitleGlass]} numberOfLines={2}>
            {f.subtitle}
          </Text>

          {f.locked && (
            <View style={s.soonBadge}>
              <Text style={s.soonText}>Sắp có</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    gap: spacing.sm,
  },

  card: {
    flex: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    minHeight: 120,
  },

  // Active: gradient cam
  cardActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  // Inactive: glassmorphism (rgba trắng trong suốt)
  cardGlass: {
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },

  lockWrap: { position: 'absolute', top: spacing.sm, right: spacing.sm },
  lockIcon: { fontSize: 14 },

  icon: { fontSize: 28, marginBottom: spacing.sm },

  title:        { ...typography.s2, marginBottom: 4 },
  titleActive:  { color: colors.white },
  titleGlass:   { color: '#2a5a3a' },

  subtitle:       { ...typography.c2 },
  subtitleActive: { color: 'rgba(255,255,255,0.85)' },
  subtitleGlass:  { color: '#4a7a5a' },

  soonBadge: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: borderRadius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  soonText: { ...typography.tiny, color: '#2a5a3a', fontWeight: '700' },
});
