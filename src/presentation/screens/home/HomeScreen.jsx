import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  Platform, StatusBar,
} from 'react-native';
import { colors, typography, spacing, layout } from '../../../common/theme';
import { AppAvatar } from '../../components/shared/AppAvatar';
import { Co2ImpactCard } from './Co2ImpactCard.jsx';
import { FeatureGrid } from './FeatureGrid.jsx';
import { NotificationService } from '../../../modules/notification/NotificationService';

const STATUS_H = Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight ?? 24);

export function HomeScreen({ userName = 'Nguyễn Văn A', onGoCarry, onGoNotifications }) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Đếm thông báo chưa đọc
    function refresh() {
      setUnreadCount(NotificationService.getUnreadCount());
    }
    refresh();
    const unsub = NotificationService.addListener(refresh);
    return unsub;
  }, []);

  const features = [
    {
      key: 'carry',
      icon: '📦',
      title: 'Giao hàng',
      subtitle: 'Gửi & nhận hàng tiện đường',
      active: true,
      onPress: onGoCarry,
    },
    {
      key: 'kids',
      icon: '👦',
      title: 'Đón con',
      subtitle: 'Nhờ đồng nghiệp đón con hộ',
      active: false,
      locked: true,
    },
    {
      key: 'commute',
      icon: '🚗',
      title: 'Đi làm chung',
      subtitle: 'Carpool cùng đồng nghiệp',
      active: false,
      locked: true,
    },
  ];

  return (
    <View style={s.root}>
      {/* StatusBar dark vì nền xanh lá sáng */}
      <StatusBar barStyle="dark-content" backgroundColor="#CDEBD2" />

      {/* Header xanh lá */}
      <View style={[s.header, { paddingTop: STATUS_H + spacing.md }]}>
        <View style={s.headerRow}>
          <View>
            <Text style={s.greeting}>Xin chào 👋</Text>
            <Text style={s.userName}>{userName}</Text>
          </View>

          {/* Bell icon + badge */}
          <TouchableOpacity style={s.bellBtn} onPress={onGoNotifications} activeOpacity={0.75}>
            <Text style={s.bellIcon}>🔔</Text>
            {unreadCount > 0 && (
              <View style={s.badge}>
                <Text style={s.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={s.avatarRow}>
          <AppAvatar name={userName} size="md" style={s.avatar} />
          <View>
            <Text style={s.deptLabel}>FPT Telecom · Phòng CNTT</Text>
            <Text style={s.pointLabel}>⭐ 320 điểm · Hạng Bạc</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={s.body}
        contentContainerStyle={s.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {/* CO₂ card với glassmorphism */}
        <Co2ImpactCard
          companyCo2Kg={1240}
          personalCo2Kg={3.7}
          savedKm={52}
        />

        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Tính năng</Text>
        </View>

        <FeatureGrid features={features} />

        <View style={{ height: layout.tabBarHeight + spacing['3xl'] }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#CDEBD2' },

  // Header xanh lá nhạt (V2)
  header: {
    backgroundColor: '#CDEBD2',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  greeting: { ...typography.p2, color: '#3a6b4a' },
  userName:  { ...typography.h4, color: '#1a3a2a', fontWeight: '700' },

  // Bell button
  bellBtn: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center', justifyContent: 'center',
  },
  bellIcon: { fontSize: 20 },
  badge: {
    position: 'absolute', top: 2, right: 2,
    minWidth: 16, height: 16, borderRadius: 8,
    backgroundColor: colors.error,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { fontSize: 9, color: colors.white, fontWeight: '700' },

  avatarRow: { flexDirection: 'row', alignItems: 'center' },
  avatar:    { marginRight: spacing.md },
  deptLabel: { ...typography.c1, color: '#4a7a5a' },
  pointLabel: { ...typography.c2, color: '#2a5a3a', marginTop: 2 },

  // Body
  body:        { flex: 1 },
  bodyContent: { paddingTop: spacing.lg },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginTop: spacing['2xl'],
    marginBottom: spacing.xs,
  },
  sectionTitle: { ...typography.s2, color: colors.text },
});
