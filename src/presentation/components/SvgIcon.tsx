import React from 'react';
import { Image, View, Text } from 'react-native';
import { ICONS, IconKey } from '../../assets/icons';

interface SvgIconProps {
  name: string;
  size?: number;
  color?: string;
}

export const SvgIcon: React.FC<SvgIconProps> = ({ name, size = 24, color = '#000' }) => {
  const key = name.toUpperCase().replace(/-/g, '_') as IconKey;
  const iconSource = ICONS[key];

  if (!iconSource) {
    console.warn(`[SvgIcon] Icon not found: ${name}`);
    return null;
  }

  // Handle both React component (dev) and require() result (production)
  if (typeof iconSource === 'function') {
    // It's a React component (from Metro's SVG transformer in dev)
    // Wrap in Text to provide color context for stroke="currentColor"
    const Icon = iconSource as React.ComponentType<any>;
    return (
      <Text style={{ color, width: size, height: size, lineHeight: size }}>
        <Icon width={size} height={size} color={color} stroke={color} fill={color} />
      </Text>
    );
  }

  if (typeof iconSource === 'number') {
    // It's a require() asset ID (production)
    return (
      <Image
        source={iconSource}
        style={{ width: size, height: size, tintColor: color }}
        resizeMode="contain"
      />
    );
  }

  // Fallback if icon is a string or object (shouldn't happen)
  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        opacity: 0.3,
        borderRadius: size / 2,
      }}
    />
  );
};
