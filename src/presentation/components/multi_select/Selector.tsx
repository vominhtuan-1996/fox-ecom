import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { MultiSelector } from './MultiSelector';
import { OptionModel, SelectorProps } from './types';
import { SdkStrings } from '../../../common/language';

/**
 * Selector — tương đương Selector<T extends OptionModel> trong Flutter.
 * Thêm search bar lọc items theo label, confirm/cancel pattern.
 */
export function Selector<T extends OptionModel>({
  items,
  selectedItems,
  selectLength = 1,
  type = 'replace',
  title,
  hint = SdkStrings.selector.searchPlaceholder,
  hasSearchBar = true,
  autoFocus = true,
  enable = true,
  enableItem,
  itemBuilder,
  itemContainerBuilder,
  selectedColor,
  unselectedColor,
  onChanged,
  style,
}: SelectorProps<T>) {
  const [keyword, setKeyword] = useState('');
  const [filtered, setFiltered] = useState<T[]>(items);

  // lastSelectedItems — tương đương SelectorState.lastSelectedItems
  // dùng để rollback khi cancel (unConfirmSelected)
  const lastConfirmed = useRef<T[]>(selectedItems);
  const [pending, setPending] = useState<T[]>(selectedItems);

  // Sync items từ parent — tương đương didUpdateWidget → updateItems
  useEffect(() => {
    setFiltered(filterByKeyword(items, keyword));
  }, [items]);

  const filterByKeyword = (list: T[], kw: string): T[] => {
    if (!kw.trim()) return list;
    const lower = kw.toLowerCase();
    return list.filter(item => item.label.toLowerCase().includes(lower));
  };

  const onKeywordChanged = (value: string) => {
    setKeyword(value);
    setFiltered(filterByKeyword(items, value));
  };

  // Tương đương onConfirmPress
  const confirm = () => {
    lastConfirmed.current = pending;
    onChanged?.(pending);
  };

  // Tương đương onBackPress → unConfirmSelected
  const cancel = () => {
    setPending(lastConfirmed.current);
  };

  return (
    <View style={[s.container, style]}>
      {title && <Text style={s.title}>{title}</Text>}

      {hasSearchBar && (
        <View style={s.searchWrap}>
          <Text style={s.searchIcon}>🔍</Text>
          <TextInput
            style={s.searchInput}
            value={keyword}
            onChangeText={onKeywordChanged}
            placeholder={hint}
            placeholderTextColor="#9ca3af"
            autoFocus={autoFocus}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {keyword.length > 0 && (
            <TouchableOpacity onPress={() => onKeywordChanged('')}>
              <Text style={s.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <View style={s.divider} />

      <MultiSelector<T>
        items={filtered}
        initialSelectedItems={pending}
        selectLength={selectLength}
        type={type}
        enable={enable}
        enableItem={enableItem}
        selectedColor={selectedColor}
        unselectedColor={unselectedColor}
        onSelectItem={setPending}
        itemBuilder={itemBuilder}
        itemContainerBuilder={
          itemContainerBuilder ??
          ((builder, listItems, selectedSet) => (
            <ScrollView
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              {Array.from(listItems).map((item, idx) => (
                <View key={String((item as any).id ?? idx)}>
                  {builder(item, selectedSet.has(item))}
                  <View style={s.separator} />
                </View>
              ))}
            </ScrollView>
          ))
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600', color: '#1f2937', paddingHorizontal: 16, paddingVertical: 12 },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f3f4f6', borderRadius: 10,
    marginHorizontal: 12, marginBottom: 4,
    paddingHorizontal: 12,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: '#1f2937', paddingVertical: 10 },
  clearBtn: { fontSize: 14, color: '#9ca3af', paddingLeft: 8 },
  divider: { height: 1, backgroundColor: '#e5e7eb', marginTop: 4 },
  separator: { height: 1, backgroundColor: '#f3f4f6', marginHorizontal: 16 },
});
