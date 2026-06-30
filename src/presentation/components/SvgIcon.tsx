import React from 'react';
import { Image, View } from 'react-native';
import { ICONS, IconKey } from '../../assets/icons';

interface SvgIconProps {
  name: string;
  size?: number;
  color?: string;
}

/**
 * SvgIcon Component
 * Renders SVG icons using Image component for better compatibility
 *
 * Tech: Uses react-native Image component with SVG static assets
 * No external SVG transformer needed
 */
export const SvgIcon: React.FC<SvgIconProps> = ({ name, size = 24, color = '#FF8500' }) => {
  const key = name.toUpperCase().replace(/-/g, '_') as IconKey;
  const iconSource = ICONS[key];

  if (!iconSource) {
    console.warn(`[SvgIcon] Icon not found: ${name}`);
    // Return placeholder circle
    return (
      <View
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          opacity: 0.2,
          borderRadius: size / 2,
        }}
      />
    );
  }

  // SVG files are loaded as static assets via require()
  // This works in both dev and production
  return (
    <Image
      source={iconSource}
      style={{
        width: size,
        height: size,
        tintColor: color,
      }}
      resizeMode="contain"
    />
  );
};
