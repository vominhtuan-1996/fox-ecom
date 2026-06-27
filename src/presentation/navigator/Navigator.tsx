import React, {
  useState,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
  ReactNode,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {
  Route,
  NavigatorConfig,
  NavigatorRef,
  NavigatorTheme,
  ScreenProps,
  TransitionType,
} from './types';
import { buildTransition, runTransition } from './transitions';

interface HistoryEntry {
  key: string;
  params?: Record<string, unknown>;
}

interface NavigatorProps extends NavigatorConfig {
  routes: Route[];
  renderScreen: (key: string, screenProps: ScreenProps) => ReactNode;
  renderHeader?: (key: string, canGoBack: boolean, pop: () => void) => ReactNode;
  hideHeader?: boolean;
  /** false khi Navigator nằm trong Modal/SafeAreaView cha để tránh cộng dồn safe-area inset */
  useSafeArea?: boolean;
  style?: object;
}

export const Navigator = forwardRef<NavigatorRef, NavigatorProps>((props, ref) => {
  const {
    initialRoute,
    initialParams,
    routes,
    renderScreen,
    renderHeader,
    hideHeader = false,
    useSafeArea = true,
    theme = {},
    pushTransition = 'slide',
    popTransition = 'slide',
    transitionDuration = 280,
    style,
  } = props;

  const [history, setHistory] = useState<HistoryEntry[]>([{ key: initialRoute, params: initialParams }]);
  const anim = useRef(new Animated.Value(1)).current;
  const transitionType = useRef<TransitionType>(pushTransition);
  const directionRef = useRef<'push' | 'pop'>('push');

  const current = history[history.length - 1];
  const canGoBack = history.length > 1;

  const animate = useCallback(
    (dir: 'push' | 'pop', type: TransitionType) => {
      transitionType.current = type;
      directionRef.current = dir;
      runTransition(anim, transitionDuration);
    },
    [anim, transitionDuration],
  );

  const push = useCallback(
    (key: string, params?: Record<string, unknown>) => {
      setHistory(h => [...h, { key, params }]);
      animate('push', pushTransition);
    },
    [animate, pushTransition],
  );

  const pop = useCallback(() => {
    if (history.length <= 1) return;
    setHistory(h => h.slice(0, -1));
    animate('pop', popTransition);
  }, [history.length, animate, popTransition]);

  const replace = useCallback(
    (key: string, params?: Record<string, unknown>) => {
      setHistory(h => [...h.slice(0, -1), { key, params }]);
      animate('push', pushTransition);
    },
    [animate, pushTransition],
  );

  const reset = useCallback(
    (key: string) => {
      setHistory([{ key }]);
      animate('push', 'fade');
    },
    [animate],
  );

  useImperativeHandle(ref, () => ({
    push,
    pop,
    replace,
    reset,
    canGoBack: () => history.length > 1,
    getCurrentRoute: () => current.key,
  }));

  const screenProps: ScreenProps = {
    params: current.params,
    push,
    pop,
    replace,
  };

  const animStyle = buildTransition(transitionType.current, anim, directionRef.current);

  const Root = useSafeArea ? SafeAreaView : View;

  return (
    <Root style={[s.root, { backgroundColor: theme.backgroundColor ?? '#fff' }, style]}>
      {/* Header */}
      {!hideHeader && (
        renderHeader
          ? renderHeader(current.key, canGoBack, pop)
          : <DefaultHeader theme={theme} title={current.key} canGoBack={canGoBack} onBack={pop} />
      )}

      {/* Screen */}
      <Animated.View style={[s.screen, animStyle]}>
        {renderScreen(current.key, screenProps)}
      </Animated.View>
    </Root>
  );
});

Navigator.displayName = 'Navigator';

// ---------- Default header — override via renderHeader prop ----------

interface DefaultHeaderProps {
  theme: NavigatorTheme;
  title: string;
  canGoBack: boolean;
  onBack: () => void;
}

function DefaultHeader({ theme, title, canGoBack, onBack }: DefaultHeaderProps) {
  return (
    <View style={[s.header, { backgroundColor: theme.headerBackground ?? '#1976d2' }]}>
      {/* Left: back button */}
      <View style={s.headerLeft}>
        {canGoBack && (
          <TouchableOpacity onPress={onBack} style={s.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            {theme.backIcon ?? (
              <Text style={[s.backLabel, { color: theme.backLabelColor ?? '#fff' }]}>‹ Back</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Center: title */}
      <Text style={[s.headerTitle, theme.headerTitleStyle]} numberOfLines={1}>
        {title}
      </Text>

      {/* Right: custom actions */}
      <View style={s.headerRight}>
        {theme.headerRight ?? null}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: 12,
  },
  headerLeft: { width: 72, alignItems: 'flex-start' },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  headerRight: { width: 72, alignItems: 'flex-end' },
  backBtn: { paddingVertical: 4 },
  backLabel: { fontSize: 16 },
  screen: { flex: 1 },
});
