import React from 'react';
import { SvgXml } from 'react-native-svg';

export const Icon = ({ name, size = 20, color = '#1976d2' }) => {
  const iconMap = {
    home: require('../src/assets/icons/home.svg'),
    alert: require('../src/assets/icons/alert.svg'),
    confirm: require('../src/assets/icons/confirm.svg'),
    dialog: require('../src/assets/icons/dialog.svg'),
    input: require('../src/assets/icons/input.svg'),
    custom: require('../src/assets/icons/custom.svg'),
    bell: require('../src/assets/icons/bell.svg'),
    layers: require('../src/assets/icons/layers.svg'),
    cart: require('../src/assets/icons/shopping-cart.svg'),
    package: require('../src/assets/icons/package.svg'),
    heart: require('../src/assets/icons/heart.svg'),
    settings: require('../src/assets/icons/settings.svg'),
  };

  const svgXml = iconMap[name.toLowerCase()];

  if (!svgXml) {
    return null;
  }

  return (
    <SvgXml xml={svgXml} width={size} height={size} color={color} />
  );
};
