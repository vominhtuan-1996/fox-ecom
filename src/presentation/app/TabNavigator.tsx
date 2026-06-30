import React, { useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Navigator } from '../navigator/Navigator';
import { NavigatorRef, ScreenProps } from '../navigator/types';
import { AppBottomTabBar, TabKey } from '../components/shared/AppBottomTabBar';
import { colors } from '../../common/theme';
import { SvgIcon } from '../components/SvgIcon';

// HomeScreen V2 là .jsx (JS thuần) — @ts-ignore bỏ qua type check
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { HomeScreen } = require('../screens/home/HomeScreen.jsx');
import { LeaderboardScreen } from '../screens/rank/LeaderboardScreen';
import { RankScreen } from '../screens/rank/RankScreen';
import { MyOrdersScreen } from '../screens/orders/MyOrdersScreen';
import { DetailScreen } from '../screens/carry/detail/DetailScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { EditProfileScreen } from '../screens/profile/EditProfileScreen';
import { SettingsScreen } from '../screens/profile/SettingsScreen';
import { CarryService } from '../../modules/carry/CarryService';
import { Order } from '../../modules/carry/types';
import { CURRENT_USER } from './currentUser';

interface TabNavigatorProps {
  onGoCarry?: () => void;
  currentUserId?: string;
  onGoNotifications?: () => void;
}

// ── Tab order V2: Trang chủ / Hoạt động / Xếp hạng / Cá nhân ─────────────────
const TAB_CONFIG: { key: TabKey; label: string; icon: string }[] = [
  { key: 'home',     label: 'Trang chủ', icon: 'home' },
  { key: 'activity', label: 'Hoạt động', icon: 'layers' },
  { key: 'rank',     label: 'Xếp hạng',  icon: 'heart' },
  { key: 'profile',  label: 'Cá nhân',   icon: 'custom' },
];

// ── Stack cho từng tab ────────────────────────────────────────────────────────
function HomeStack({ userId, onGoCarry, onGoNotifications }: { userId: string; onGoCarry?: () => void; onGoNotifications?: () => void }) {
  const user = CURRENT_USER;
  return (
    <Navigator
      initialRoute="home"
      routes={[{ key: 'home', component: null }]}
      renderScreen={() => (
        <HomeScreen
          userName={user.name}
          onGoCarry={onGoCarry}
          onGoNotifications={onGoNotifications}
        />
      )}
      hideHeader
      useSafeArea={false}
    />
  );
}

function RankStack({ userId }: { userId: string }) {
  return (
    <Navigator
      initialRoute="leaderboard"
      routes={[{ key: 'leaderboard', component: null }, { key: 'podium', component: null }]}
      renderScreen={(key, sp) => {
        if (key === 'leaderboard')
          return <LeaderboardScreen currentUserId={userId} onOpenRank={() => sp.push('podium')} />;
        return <RankScreen currentUserId={userId} onBack={sp.pop} />;
      }}
      hideHeader
      useSafeArea={false}
    />
  );
}

function ActivityStack({ userId }: { userId: string }) {
  return (
    <Navigator
      initialRoute="orders"
      routes={[{ key: 'orders', component: null }, { key: 'detail', component: null }]}
      renderScreen={(key, sp) => {
        if (key === 'orders')
          return (
            <MyOrdersScreen
              currentUserId={userId}
              onOpenOrder={(o: Order) => sp.push('detail', { orderId: o.id })}
            />
          );

        // Detail trong tab Activity: xem lịch sử, không có action chủ động (carrier đã handled trong CarryNavigator)
        const orderId = sp.params?.orderId as string | undefined;
        const order = orderId ? CarryService.getOrder(orderId) : undefined;
        if (!order) return null;

        return (
          <DetailScreen
            order={order}
            currentUserId={userId}
            onBack={sp.pop}
            // Đơn trong lịch sử: sender xác nhận đã nhận (DELIVERED → CONFIRMED)
            onCancel={() => {
              CarryService.updateStatus(order.id, 'CONFIRMED');
              sp.replace('detail', { orderId: order.id });
            }}
          />
        );
      }}
      hideHeader
      useSafeArea={false}
    />
  );
}

function ProfileStack({ userId }: { userId: string }) {
  return (
    <Navigator
      initialRoute="profile"
      routes={[
        { key: 'profile',  component: null },
        { key: 'edit',     component: null },
        { key: 'settings', component: null },
      ]}
      renderScreen={(key, sp) => {
        if (key === 'edit')     return <EditProfileScreen userId={userId} onBack={sp.pop} onSaved={sp.pop} />;
        if (key === 'settings') return <SettingsScreen onBack={sp.pop} />;
        return (
          <ProfileScreen
            userId={userId}
            onEdit={() => sp.push('edit')}
            onSettings={() => sp.push('settings')}
            onHistory={() => {}}
          />
        );
      }}
      hideHeader
      useSafeArea={false}
    />
  );
}

// ── Tab Navigator root ────────────────────────────────────────────────────────
export const TabNavigator: React.FC<TabNavigatorProps> = ({
  onGoCarry,
  currentUserId = 'u1',
  onGoNotifications,
}) => {
  const [activeTab, setActiveTab] = React.useState<TabKey>('home');

  const tabs = TAB_CONFIG.map(({ key, label, icon: iconName }) => ({
    key,
    label,
    icon: (active: boolean) => (
      <SvgIcon
        name={iconName}
        size={24}
        color={active ? colors.primary : colors.textTertiary}
      />
    ),
  }));

  return (
    <View style={s.root}>
      <View style={s.content}>
        {activeTab === 'home'     && <HomeStack     userId={currentUserId} onGoCarry={onGoCarry} onGoNotifications={onGoNotifications} />}
        {activeTab === 'rank'     && <RankStack     userId={currentUserId} />}
        {activeTab === 'activity' && <ActivityStack userId={currentUserId} />}
        {activeTab === 'profile'  && <ProfileStack  userId={currentUserId} />}
      </View>

      <AppBottomTabBar
        activeTab={activeTab}
        onTabPress={setActiveTab}
        tabs={tabs}
        style={s.tabBar}
      />
    </View>
  );
};

const TAB_BAR_H = 62 + (Platform.OS === 'ios' ? 20 : 0);

const s = StyleSheet.create({
  root:    { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, paddingBottom: TAB_BAR_H },
  tabBar:  { position: 'absolute', bottom: 0, left: 0, right: 0 },
});
