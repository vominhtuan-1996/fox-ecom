import React from 'react';
import { ICONS, IconKey } from '../../assets/icons';

interface SvgIconProps {
  name: string;
  size?: number;
  color?: string;
}

export const SvgIcon: React.FC<SvgIconProps> = ({ name, size = 24, color = '#000' }) => {
  const key = name.toUpperCase().replace(/-/g, '_') as IconKey;
  const Icon = ICONS[key];
  if (!Icon) return null;
  return <Icon width={size} height={size} color={color} fill={color} />;
};
