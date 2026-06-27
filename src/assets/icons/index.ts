/**
 * SVG Icons
 * Reusable icon assets for menu and components
 */

import HomeIcon from './home.svg';
import AlertIcon from './alert.svg';
import ConfirmIcon from './confirm.svg';
import DialogIcon from './dialog.svg';
import InputIcon from './input.svg';
import CustomIcon from './custom.svg';
import BellIcon from './bell.svg';
import LayersIcon from './layers.svg';
import ShoppingCartIcon from './shopping-cart.svg';
import PackageIcon from './package.svg';
import HeartIcon from './heart.svg';
import SettingsIcon from './settings.svg';

export const ICONS = {
  HOME: HomeIcon,
  ALERT: AlertIcon,
  CONFIRM: ConfirmIcon,
  DIALOG: DialogIcon,
  INPUT: InputIcon,
  CUSTOM: CustomIcon,
  BELL: BellIcon,
  LAYERS: LayersIcon,
  SHOPPING_CART: ShoppingCartIcon,
  PACKAGE: PackageIcon,
  HEART: HeartIcon,
  SETTINGS: SettingsIcon,
} as const;

export type IconKey = keyof typeof ICONS;
