import React from 'react';
import { Text } from 'react-native';
import Svg, { Path, Polyline, Circle, Rect, Ellipse, Line, Polygon, G } from 'react-native-svg';
import { SVG_CONTENT, IconKey, SvgNode } from '../../assets/icons/generated-icons';

interface SvgIconProps {
  name: string;
  size?: number;
  color?: string;
}

/**
 * SvgIcon Component
 * Renders SVG icons using react-native-svg
 *
 * Uses generated-icons.ts which contains parsed SVG data
 * Supports all SVG element types via SvgNode structure
 */

const renderNode = (node: SvgNode, color: string, idx: number): React.ReactElement | null => {
  const { type, props } = node;
  const key = `node-${idx}`;

  // Apply color override if not explicitly set in SVG
  const finalProps = { ...props };
  if (!finalProps.fill && type !== 'g') {
    finalProps.fill = color;
  }

  switch (type) {
    case 'path':
      return <Path key={key} {...finalProps} />;

    case 'polyline':
      return <Polyline key={key} {...finalProps} />;

    case 'circle':
      return <Circle key={key} {...finalProps} />;

    case 'rect':
      return <Rect key={key} {...finalProps} />;

    case 'ellipse':
      return <Ellipse key={key} {...finalProps} />;

    case 'line':
      return <Line key={key} {...finalProps} />;

    case 'polygon':
      return <Polygon key={key} {...finalProps} />;

    case 'g':
      return (
        <G key={key} {...finalProps}>
          {node.children?.map((child, childIdx) => renderNode(child, color, childIdx))}
        </G>
      );

    default:
      return null;
  }
};

export const SvgIcon: React.FC<SvgIconProps> = ({ name, size = 24, color = '#FF8500' }) => {
  const key = name.toUpperCase().replace(/-/g, '_') as IconKey;
  const svgData = SVG_CONTENT[key];

  if (!svgData) {
    console.warn(`[SvgIcon] Icon not found: ${name}`);
    return <Text style={{ fontSize: size, color }}>?</Text>;
  }

  const { viewBox, children } = svgData;

  return (
    <Svg width={size} height={size} viewBox={viewBox}>
      {children.map((node, idx) => renderNode(node, color, idx))}
    </Svg>
  );
};
