import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../../common/theme';

interface Co2ImpactCardProps {
  companyCo2Kg: number;
  personalCo2Kg: number;
  savedKm: number;
}

function formatCo2(kg: number): string {
  if (kg < 1) return `${Math.round(kg * 1000)} g`;
  return `${kg.toFixed(1)} kg`;
}

function useCountUpText(target: number, format: (v: number) => string, duration = 1200): string {
  const anim = useRef(new Animated.Value(0)).current;
  const [text, setText] = useState(format(0));

  useEffect(() => {
    anim.setValue(0);
    const listener = anim.addListener(({ value }) => setText(format(value)));
    Animated.timing(anim, { toValue: target, duration, useNativeDriver: false }).start();
    return () => anim.removeListener(listener);
  }, [target]);

  return text;
}

/**
 * Co2ImpactCard — card hero cam, hiển thị CO₂ tiết kiệm với count-up animation.
 * Không dùng interpolate string để tránh lỗi RN 0.65 "invalid pattern".
 */
export const Co2ImpactCard: React.FC<Co2ImpactCardProps> = ({
  companyCo2Kg,
  personalCo2Kg,
  savedKm,
}) => {
  const companyText  = useCountUpText(companyCo2Kg,  formatCo2);
  const personalText = useCountUpText(personalCo2Kg, formatCo2);
  const kmText       = useCountUpText(savedKm, v => `${Math.round(v)} km`);

  return (
    <View style={s.card}>
      <View style={s.globeWrap}>
        <Text style={s.globeIcon}>🌍</Text>
      </View>

      <Text style={s.tagline}>Cùng nhau bảo vệ môi trường</Text>

      <View style={s.statsRow}>
        <View style={s.statItem}>
          <Text style={s.statValue}>{companyText}</Text>
          <Text style={s.statLabel}>CO₂ công ty{'\n'}đã tiết kiệm</Text>
        </View>

        <View style={s.separator} />

        <View style={s.statItem}>
          <Text style={s.statValue}>{personalText}</Text>
          <Text style={s.statLabel}>CO₂ của tôi{'\n'}đã tiết kiệm</Text>
        </View>

        <View style={s.separator} />

        <View style={s.statItem}>
          <Text style={s.statValue}>{kmText}</Text>
          <Text style={s.statLabel}>Km tiết kiệm{'\n'}xăng xe</Text>
        </View>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing['2xl'],
    marginHorizontal: spacing.lg,
    alignItems: 'center',
  },
  globeWrap: {
    width: 56, height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
  },
  globeIcon: { fontSize: 28 },
  tagline: {
    ...typography.c1,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: spacing.xl,
  } as object,
  statsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
  },
  statItem:  { flex: 1, alignItems: 'center' },
  statValue: {
    ...typography.s2,
    color: colors.white,
    fontWeight: '700',
    textAlign: 'center',
  } as object,
  statLabel: {
    ...typography.tiny,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: 4,
  } as object,
  separator: {
    width: 1,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginTop: 4,
  },
});
