import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Platform, StatusBar,
} from 'react-native';
import { colors, typography, spacing } from '../../../common/theme';
import { NotificationService } from '../../../modules/notification/NotificationService';

const STATUS_H = Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight ?? 24);

function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Vừa xong';
  if (mins < 60) return `${mins} phút trước`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} giờ trước`;
  return `${Math.floor(hrs / 24)} ngày trước`;
}

const TYPE_ICON = {
  new_order:       '📦',
  order_claimed:   '🤝',
  order_delivered: '✅',
  order_confirmed: '🎉',
  order_cancelled: '❌',
};

export function NotificationsScreen({ onBack, onOpenOrder }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    function refresh() {
      setItems(NotificationService.getAll());
    }
    refresh();
    const unsub = NotificationService.addListener(refresh);
    return unsub;
  }, []);

  function handlePress(item) {
    NotificationService.markSeen(item.id);
    if (item.orderId) onOpenOrder?.(item.orderId);
  }

  function handleMarkAllSeen() {
    NotificationService.markAllSeen();
  }

  const unread = items.filter(i => !i.seen).length;

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {/* Header */}
      <View style={[s.header, { paddingTop: STATUS_H + spacing.sm }]}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={s.back}>‹</Text>
        </TouchableOpacity>
        <Text style={s.title}>Thông báo</Text>
        {unread > 0 ? (
          <TouchableOpacity onPress={handleMarkAllSeen}>
            <Text style={s.markAll}>Đọc tất</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 56 }} />
        )}
      </View>

      {items.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyIcon}>🔔</Text>
          <Text style={s.emptyText}>Chưa có thông báo nào</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={i => i.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[s.item, !item.seen && s.itemUnread]}
              onPress={() => handlePress(item)}
              activeOpacity={0.75}
            >
              <Text style={s.itemIcon}>{TYPE_ICON[item.type] ?? '📢'}</Text>
              <View style={s.itemBody}>
                <Text style={[s.itemTitle, !item.seen && s.itemTitleUnread]}>
                  {item.title}
                </Text>
                <Text style={s.itemBody2} numberOfLines={2}>{item.body}</Text>
                <Text style={s.itemTime}>{timeAgo(item.createdAt)}</Text>
              </View>
              {!item.seen && <View style={s.dot} />}
            </TouchableOpacity>
          )}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border ?? '#E5E7EB',
  },
  back:    { ...typography.h3, color: colors.text, lineHeight: 28 },
  title:   { ...typography.s1, color: colors.text },
  markAll: { ...typography.c1, color: colors.primary, fontWeight: '600' },

  list: { paddingVertical: spacing.sm },

  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    borderRadius: 12,
  },
  itemUnread: { backgroundColor: '#FFF8F0' },
  itemIcon:   { fontSize: 24, marginRight: spacing.md, marginTop: 2 },
  itemBody:   { flex: 1 },
  itemTitle:  { ...typography.p2, color: colors.text, marginBottom: 2 },
  itemTitleUnread: { fontWeight: '700' },
  itemBody2:  { ...typography.c1, color: colors.textSecondary, marginBottom: 4 },
  itemTime:   { ...typography.c2, color: colors.textSecondary },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 6, marginLeft: spacing.sm,
  },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyIcon: { fontSize: 48, marginBottom: spacing.lg },
  emptyText: { ...typography.p2, color: colors.textSecondary },
});
