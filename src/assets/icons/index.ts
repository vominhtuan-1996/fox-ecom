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
// V2 Design icons
import BellIconV2 from './v2/bell.svg';
import BadgeIcon from './v2/badge.svg';
import TreeIcon from './v2/tree.svg';
import LockIcon from './v2/lock.svg';

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
  // V2 Design icons
  BELL_V2: BellIconV2,
  BADGE: BadgeIcon,
  TREE: TreeIcon,
  LOCK: LockIcon,
} as const;

export type IconKey = keyof typeof ICONS;
