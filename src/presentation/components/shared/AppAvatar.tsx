import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, borderRadius } from '../../../common/theme';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AppAvatarProps {
  name?: string;
  uri?: string;
  size?: AvatarSize;
  color?: string;
  style?: ViewStyle;
}

const SIZES: Record<AvatarSize, number> = { xs: 24, sm: 32, md: 40, lg: 48, xl: 64 };
const FONT_SIZES: Record<AvatarSize, number> = { xs: 9, sm: 12, md: 15, lg: 18, xl: 24 };

// Palette 8 màu preset theo FoxPro
const PALETTE = ['#FF8500','#5933EB','#0BD78C','#16ADFF','#F43F4A','#FFA800','#6E4BFF','#3C4459'];

function getColor(name?: string): string {
  if (!name) return PALETTE[0];
  const idx = name.charCodeAt(0) % PALETTE.length;
  return PALETTE[idx];
}

function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * AppAvatar — avatar tròn với ảnh hoặc chữ cái đầu màu.
 */
export const AppAvatar: React.FC<AppAvatarProps> = ({
  name,
  uri,
  size = 'md',
  color,
  style,
}) => {
  const dim = SIZES[size];
  const bg = color ?? getColor(name);

  return (
    <View style={[s.base, { width: dim, height: dim, borderRadius: dim / 2, backgroundColor: bg }, style]}>
      {uri ? (
        <Image source={{ uri }} style={{ width: dim, height: dim, borderRadius: dim / 2 }} />
      ) : (
        <Text style={[s.initials, { fontSize: FONT_SIZES[size] }]}>{getInitials(name)}</Text>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  base:     { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  initials: { ...typography.label, color: colors.white, fontWeight: '700' } as object,
});
