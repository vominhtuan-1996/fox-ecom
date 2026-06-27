import React from 'react';
import {
  View, TouchableOpacity, Text, StyleSheet, ViewStyle, Platform,
} from 'react-native';
import { colors, typography, spacing, shadows, layout } from '../../../common/theme';

export type TabKey = 'home' | 'rank' | 'activity' | 'profile';

interface TabItem {
  key: TabKey;
  label: string;
  icon: (active: boolean) => React.ReactNode;
}

interface AppBottomTabBarProps {
  activeTab: TabKey;
  onTabPress: (tab: TabKey) => void;
  tabs: TabItem[];
  style?: ViewStyle;
}

/**
 * AppBottomTabBar — tab bar dưới FoxPro.
 * height: 62px · active tint: cam · inactive: grayChateau
 */
export const AppBottomTabBar: React.FC<AppBottomTabBarProps> = ({
  activeTab,
  onTabPress,
  tabs,
  style,
}) => (
  <View style={[s.bar, style]}>
    {tabs.map((tab) => {
      const active = tab.key === activeTab;
      return (
        <TouchableOpacity
          key={tab.key}
          style={s.tab}
          onPress={() => onTabPress(tab.key)}
          activeOpacity={0.7}
        >
          <View style={s.iconWrap}>
            {tab.icon(active)}
            {active && <View style={s.dot} />}
          </View>
          <Text style={[s.label, active ? s.labelActive : s.labelInactive]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const BOTTOM_SAFE = Platform.OS === 'ios' ? 20 : 0;

const s = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    height: layout.tabBarHeight + BOTTOM_SAFE,
    paddingBottom: BOTTOM_SAFE,
    backgroundColor: colors.surface,
    ...(shadows.bar as object),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.sm,
  },
  iconWrap: {
    alignItems: 'center',
  },
  dot: {
    width: 4, height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 2,
  },
  label:        { ...typography.tiny, marginTop: 2 } as object,
  labelActive:  { color: colors.primary, fontWeight: '700' },
  labelInactive:{ color: colors.grayChateau },
});
