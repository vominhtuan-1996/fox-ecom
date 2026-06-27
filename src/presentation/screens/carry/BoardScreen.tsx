import React, { useState, useMemo, useEffect } from 'react';
import {
  View, FlatList, Text, TouchableOpacity, StyleSheet,
  Platform, StatusBar,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows, layout } from '../../../common/theme';
import { AppSearchBar } from '../../components/shared/AppSearchBar';
import { SkeletonList } from '../../components/shared/SkeletonLoader';
import { OfflineBanner } from '../../components/shared/OfflineBanner';
import { OrderCard } from './OrderCard';
import { CarryService } from '../../../modules/carry/CarryService';
import { Order } from '../../../modules/carry/types';
import { RouteFilter } from '../orders/RouteFilterScreen';
import { useNetworkState } from '../../hooks/useNetworkState';

const CARD_HEIGHT = 160 + spacing.md;

interface BoardScreenProps {
  onBack?: () => void;
  onCreateOrder?: () => void;
  onOpenOrder?: (order: Order) => void;
  onOpenFilter?: () => void;
  onQrScan?: () => void;
  routeFilter?: RouteFilter;
}

const STATUS_H = Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight ?? 24);

export const BoardScreen: React.FC<BoardScreenProps> = ({
  onBack,
  onCreateOrder,
  onOpenOrder,
  onOpenFilter,
  onQrScan,
  routeFilter,
}) => {
  const [query,   setQuery]   = useState('');
  const [loading, setLoading] = useState(true);
  const isOnline = useNetworkState();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const orders = useMemo(() => {
    let list = CarryService.getBoard(
      routeFilter?.fromHub?.id,
      routeFilter?.toHub?.id,
    );
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        o =>
          o.fromHub.name.toLowerCase().includes(q) ||
          o.toHub.name.toLowerCase().includes(q) ||
          o.itemDesc.toLowerCase().includes(q),
      );
    }
    return list;
  }, [query, routeFilter]);

  const hasFilter = !!(routeFilter?.fromHub || routeFilter?.toHub || routeFilter?.myRouteOnly);

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <OfflineBanner visible={!isOnline} />

      {/* Header cam */}
      <View style={[s.header, { paddingTop: STATUS_H + spacing.sm }]}>
        <View style={s.headerRow}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={s.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={s.backArrow}>‹</Text>
            </TouchableOpacity>
          )}
          <Text style={s.headerTitle}>Giao hàng tiện đường</Text>

          <TouchableOpacity onPress={onOpenFilter} style={[s.iconBtn, hasFilter && s.iconBtnActive]}>
            <Text style={s.iconBtnText}>⇄</Text>
            {hasFilter && <View style={s.filterDot} />}
          </TouchableOpacity>

          <TouchableOpacity onPress={onQrScan} style={[s.iconBtn, { marginLeft: spacing.xs }]}>
            <Text style={s.iconBtnText}>▣</Text>
          </TouchableOpacity>
        </View>

        <AppSearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Tìm theo tuyến, mô tả hàng..."
          style={s.searchBar}
        />
      </View>

      {/* Filter tag */}
      {hasFilter && (
        <View style={s.filterTag}>
          <Text style={s.filterTagText}>
            {[
              routeFilter?.fromHub?.shortName,
              routeFilter?.toHub?.shortName,
            ].filter(Boolean).join(' → ')}
            {routeFilter?.myRouteOnly ? ' · Tuyến của tôi' : ''}
          </Text>
          <TouchableOpacity onPress={onOpenFilter}>
            <Text style={s.filterTagEdit}>Sửa</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* List */}
      {loading ? (
        <View style={s.list}><SkeletonList count={4} /></View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={o => o.id}
          renderItem={({ item }) => (
            <OrderCard order={item} onPress={() => onOpenOrder?.(item)} />
          )}
          getItemLayout={(_, index) => ({ length: CARD_HEIGHT, offset: CARD_HEIGHT * index, index })}
          contentContainerStyle={s.list}
          ListEmptyComponent={<EmptyState query={query} hasFilter={hasFilter} />}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      <TouchableOpacity style={s.fab} onPress={onCreateOrder} activeOpacity={0.85}>
        <Text style={s.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const EmptyState: React.FC<{ query: string; hasFilter: boolean }> = ({ query, hasFilter }) => (
  <View style={s.empty}>
    <Text style={s.emptyIcon}>{query || hasFilter ? '🔍' : '📭'}</Text>
    <Text style={s.emptyText}>
      {query
        ? `Không tìm thấy đơn nào cho "${query}"`
        : hasFilter
          ? 'Không có đơn nào phù hợp với bộ lọc'
          : 'Chưa có đơn nào cần người chở'}
    </Text>
  </View>
);

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  headerRow:   { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  backBtn:     { marginRight: spacing.sm },
  backArrow:   { ...typography.h3, color: colors.white, lineHeight: 28 } as object,
  headerTitle: { ...typography.s1, color: colors.white, flex: 1 } as object,
  iconBtn:     { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  iconBtnActive:{ backgroundColor: 'rgba(255,255,255,0.4)' },
  iconBtnText: { fontSize: 18, color: colors.white },
  filterDot:   { position: 'absolute', top: 6, right: 6, width: 6, height: 6, borderRadius: 3, backgroundColor: colors.white },
  searchBar:   { backgroundColor: 'rgba(255,255,255,0.95)' },

  filterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfacePeach,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
  filterTagText: { ...typography.c1, color: colors.primary, fontWeight: '600' } as object,
  filterTagEdit: { ...typography.c1, color: colors.secondary } as object,

  list: { padding: spacing.lg, paddingBottom: layout.tabBarHeight + spacing['3xl'] },

  fab: {
    position: 'absolute',
    right: spacing['2xl'],
    bottom: spacing['3xl'],
    width: 56, height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    ...(shadows.pop as object),
  },
  fabIcon: { fontSize: 28, color: colors.white, lineHeight: 32 },

  empty:     { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: spacing.lg },
  emptyText: { ...typography.p2, color: colors.textSecondary, textAlign: 'center' } as object,
});
