import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../../common/theme';

function formatCo2(kg) {
  if (kg < 1) return `${Math.round(kg * 1000)} g`;
  return `${kg.toFixed(1)} kg`;
}

function useCountUpText(target, format, duration = 1200) {
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

/** TreesGlyph — SVG cây xanh đơn giản dùng View thay thế */
function TreesGlyph({ size = 64 }) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'flex-end' }}>
      {/* Tán cây */}
      <View style={{
        width: size * 0.7, height: size * 0.55,
        backgroundColor: '#4CAF50',
        borderRadius: size * 0.35,
        marginBottom: -4,
      }} />
      {/* Thân cây */}
      <View style={{ width: size * 0.12, height: size * 0.25, backgroundColor: '#795548' }} />
    </View>
  );
}

/**
 * Co2ImpactCard V2 — glassmorphism background, TreesGlyph thay globe.
 */
export function Co2ImpactCard({ companyCo2Kg, personalCo2Kg, savedKm }) {
  const companyText  = useCountUpText(companyCo2Kg,  v => formatCo2(v));
  const personalText = useCountUpText(personalCo2Kg, v => formatCo2(v));
  const kmText       = useCountUpText(savedKm,       v => `${Math.round(v)} km`);

  return (
    <View style={s.card}>
      <View style={s.top}>
        <View style={s.info}>
          <Text style={s.label}>CO₂ tiết kiệm hôm nay</Text>
          <Text style={s.bigValue}>{companyText}</Text>
          <Text style={s.subLabel}>toàn công ty</Text>
        </View>
        <TreesGlyph size={72} />
      </View>

      <View style={s.divider} />

      <View style={s.stats}>
        <Stat label="Của tôi" value={personalText} />
        <View style={s.statDivider} />
        <Stat label="Km tiết kiệm" value={kmText} />
        <View style={s.statDivider} />
        <Stat label="Chuyến hôm nay" value="12" />
      </View>
    </View>
  );
}

function Stat({ label, value }) {
  return (
    <View style={s.stat}>
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  // Glassmorphism card
  card: {
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.65)',
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  info:      { flex: 1 },
  label:     { ...typography.c1, color: '#3a6b4a', marginBottom: 4 },
  bigValue:  { ...typography.h3, color: '#1a3a2a', fontWeight: '800' },
  subLabel:  { ...typography.c2, color: '#4a7a5a', marginTop: 2 },

  divider:   { height: 1, backgroundColor: 'rgba(0,0,0,0.06)', marginVertical: spacing.md },

  stats:      { flexDirection: 'row', alignItems: 'center' },
  stat:       { flex: 1, alignItems: 'center' },
  statValue:  { ...typography.s2, color: '#1a3a2a', fontWeight: '700' },
  statLabel:  { ...typography.c2, color: '#4a7a5a', marginTop: 2 },
  statDivider:{ width: 1, height: 32, backgroundColor: 'rgba(0,0,0,0.08)' },
});
