import React, { useEffect, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MultiSelectorProps } from './types';
import { useMultiSelect } from './useMultiSelect';
import { SdkStrings } from '../../../common/language';

/**
 * MultiSelector — tương đương MultiSelector<T> trong Flutter.
 * Generic thuần: không có search, không có load more.
 * Dùng itemBuilder / itemContainerBuilder để custom hoàn toàn.
 */
export function MultiSelector<T>({
  items,
  initialSelectedItems,
  selectLength = 1,
  type = 'replace',
  enable = true,
  enableItem,
  onSelectItem,
  itemBuilder,
  itemContainerBuilder,
  selectedColor = '#1976d2',
  unselectedColor = '#374151',
  style,
}: MultiSelectorProps<T>) {
  const { selectedItems, selectItem } = useMultiSelect(
    initialSelectedItems,
    type,
    selectLength,
    onSelectItem,
  );

  // Notify caller mỗi khi selectedItems thay đổi — thay thế BlocListener
  useEffect(() => {
    onSelectItem?.(Array.from(selectedItems));
  }, [selectedItems]);

  const defaultItemBuilder = (item: T, isSelected: boolean): ReactNode => {
    const color = isSelected ? selectedColor : unselectedColor;
    const itemEnabled = enableItem?.(item) ?? true;
    const finalColor = !enable || !itemEnabled ? color + '55' : color;

    return (
      <View style={defaultStyles.row}>
        <Circle size={20} color={finalColor} isSelected={isSelected} />
        <Text style={[defaultStyles.label, { color: finalColor }]} numberOfLines={1}>
          {String(item)}
        </Text>
      </View>
    );
  };

  const resolvedItemBuilder = itemBuilder ?? defaultItemBuilder;

  const handlePress = (item: T) => {
    const itemEnabled = enableItem?.(item) ?? true;
    if (!enable || !itemEnabled) return;
    selectItem(item);
  };

  const renderItem = (item: T): ReactNode => {
    const isSelected = selectedItems.has(item);
    return (
      <TouchableOpacity
        key={String(item)}
        activeOpacity={0.7}
        onPress={() => handlePress(item)}
        disabled={!enable || !(enableItem?.(item) ?? true)}
      >
        {resolvedItemBuilder(item, isSelected)}
      </TouchableOpacity>
    );
  };

  if (items.length === 0) {
    return (
      <View style={defaultStyles.empty}>
        <Text style={defaultStyles.emptyText}>{SdkStrings.selector.noData}</Text>
      </View>
    );
  }

  return (
    <View style={style}>
      {itemContainerBuilder
        ? itemContainerBuilder(resolvedItemBuilder, items, selectedItems)
        : items.map(item => renderItem(item))}
    </View>
  );
}

// ─── Circle indicator — tương đương _Circle trong Flutter ────────────────────

function Circle({ size, color, isSelected }: { size: number; color: string; isSelected: boolean }) {
  const border = size / 8;
  return (
    <View style={[
      circleStyles.outer,
      { width: size, height: size, borderRadius: size / 2, borderWidth: border, borderColor: color },
    ]}>
      {isSelected && (
        <View style={[
          circleStyles.inner,
          { backgroundColor: color, borderRadius: (size - border * 4) / 2 },
        ]} />
      )}
    </View>
  );
}

const defaultStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 4 },
  label: { flex: 1, fontSize: 15, marginLeft: 10 },
  empty: { paddingVertical: 24, alignItems: 'center' },
  emptyText: { color: '#9ca3af', fontSize: 14 },
});

const circleStyles = StyleSheet.create({
  outer: { justifyContent: 'center', alignItems: 'center', margin: 2 },
  inner: { flex: 1, margin: 2 },
});
