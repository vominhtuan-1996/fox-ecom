import { ReactNode } from 'react';
import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

export interface Route {
  key: string;
  /** Component to render for this route */
  component: ReactNode;
}

export interface NavigatorTheme {
  /** Background color of the screen container */
  backgroundColor?: string;
  /** Header bar background */
  headerBackground?: string;
  /** Header title text style */
  headerTitleStyle?: TextStyle;
  /** Back button label color */
  backLabelColor?: string;
  /** Back button icon — any ReactNode (text, svg, image) */
  backIcon?: ReactNode;
  /** Show/hide the header */
  headerVisible?: boolean;
  /** Extra content rendered on the right side of the header */
  headerRight?: ReactNode;
  /** Container style override */
  containerStyle?: ViewStyle;
}

export type TransitionType = 'slide' | 'fade' | 'scale' | 'none';

export interface NavigatorConfig {
  /** Initial route key */
  initialRoute: string;
  /** Params truyền vào màn hình đầu tiên */
  initialParams?: Record<string, unknown>;
  theme?: NavigatorTheme;
  /** Animation when pushing a new screen */
  pushTransition?: TransitionType;
  /** Animation when going back */
  popTransition?: TransitionType;
  /** Duration in ms (default 280) */
  transitionDuration?: number;
}

export interface NavigatorRef {
  push: (key: string, params?: Record<string, unknown>) => void;
  pop: () => void;
  replace: (key: string, params?: Record<string, unknown>) => void;
  reset: (key: string) => void;
  canGoBack: () => boolean;
  getCurrentRoute: () => string;
}

export interface ScreenProps {
  /** Current route params */
  params?: Record<string, unknown>;
  /** Push a new screen */
  push: (key: string, params?: Record<string, unknown>) => void;
  /** Go back to previous screen */
  pop: () => void;
  /** Replace current screen */
  replace: (key: string, params?: Record<string, unknown>) => void;
}
