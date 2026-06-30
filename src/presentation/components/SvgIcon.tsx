import React from 'react';
import { Text } from 'react-native';
import { ICON_MAP, IconKey } from '../../assets/icons';

interface SvgIconProps {
  name: string;
  size?: number;
  color?: string;
}

/**
 * SvgIcon Component
 * Renders icon emojis (working solution while SVG setup is being fixed)
 *
 * Temporary: Uses emoji icons that work immediately
 * TODO: Replace with proper SVG rendering once react-native-svg-transformer is configured
 */
export const SvgIcon: React.FC<SvgIconProps> = ({ name, size = 24, color = '#FF8500' }) => {
  const key = name.toUpperCase().replace(/-/g, '_') as IconKey;
  const emoji = ICON_MAP[key];

  if (!emoji) {
    console.warn(`[SvgIcon] Icon not found: ${name}`);
    return <Text style={{ fontSize: size, color }}>❓</Text>;
  }

  return <Text style={{ fontSize: size, color }}>{emoji}</Text>;
};
