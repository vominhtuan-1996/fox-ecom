import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import Svg, { Path, Polyline, G } from 'react-native-svg';
import { SVG_CONTENT, IconKey } from '../../assets/icons';

interface SvgIconProps {
  name: string;
  size?: number;
  color?: string;
}

/**
 * SvgIcon Component
 * Renders SVG icons using react-native-svg library
 *
 * Tech: Uses react-native-svg (already installed) to render SVG paths
 * SVG content is embedded as strings, parsed and rendered as SVG paths
 * Works in both dev and production
 */
export const SvgIcon: React.FC<SvgIconProps> = ({ name, size = 24, color = '#FF8500' }) => {
  const key = name.toUpperCase().replace(/-/g, '_') as IconKey;
  const svgData = SVG_CONTENT[key];

  if (!svgData) {
    console.warn(`[SvgIcon] Icon not found: ${name}`);
    return <Text style={{ fontSize: size, color }}>?</Text>;
  }

  const { viewBox, paths, polylines } = svgData;
  const [vbWidth, vbHeight] = viewBox.split(' ').slice(2).map(Number);

  return (
    <Svg width={size} height={size} viewBox={viewBox}>
      <G>
        {paths.map((pathData, idx) => (
          <Path
            key={`path-${idx}`}
            d={pathData}
            fill={color}
            stroke={color}
            strokeWidth="0"
          />
        ))}
        {polylines.map((points, idx) => (
          <Polyline
            key={`polyline-${idx}`}
            points={points}
            fill={color}
            stroke={color}
            strokeWidth="0"
          />
        ))}
      </G>
    </Svg>
  );
};
