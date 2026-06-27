import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Selector } from './Selector';
import { OptionModel, LoadMoreSelectorProps, LoadMoreModel } from './types';
import { SdkStrings } from '../../../common/language';

/**
 * LoadMoreSelector — tương đương LoadMoreSelector<T> trong Flutter.
 * Kế thừa toàn bộ Selector (search bar, confirm/cancel),
 * thêm phân trang qua FlatList onEndReached.
 */
export function LoadMoreSelector<T extends OptionModel>({
  pageSize = 10,
  getItemsFunction,
  preAnalyzeSearch,
  onItemTap,
  onChanged,
  selectedItems,
  enableItem,
  ...selectorProps
}: LoadMoreSelectorProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const pageRef = useRef(1);
  const keywordRef = useRef('');

  // ── Fetch page ──────────────────────────────────────────────────────────────

  const fetchPage = useCallback(async (page: number, keyword: string, append: boolean) => {
    if (page === 1) setIsLoading(true);
    else setIsLoadingMore(true);

    try {
      const result: LoadMoreModel<T> = await getItemsFunction(pageSize, page, keyword);
      setItems(prev => append ? [...prev, ...result.items] : result.items);
      setHasMore(result.hasMore);
      pageRef.current = page;
    } catch (_) {
      // caller handles error via UI — không crash
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [getItemsFunction, pageSize]);

  // Init — tương đương loadMoreCubit.initData() trong initState
  useEffect(() => {
    fetchPage(1, '', false);
  }, []);

  // ── Search — tương đương onKeywordChanged + preAnalyzeSearch ───────────────

  const doSearch = useCallback((keyword: string) => {
    keywordRef.current = keyword;
    fetchPage(1, keyword, false);
  }, [fetchPage]);

  const handleKeywordChange = useCallback((keyword: string) => {
    if (preAnalyzeSearch) {
      preAnalyzeSearch(() => doSearch(keyword), keyword);
    } else {
      doSearch(keyword);
    }
  }, [preAnalyzeSearch, doSearch]);

  // ── Load more khi scroll tới cuối ─────────────────────────────────────────

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    fetchPage(pageRef.current + 1, keywordRef.current, true);
  }, [isLoadingMore, hasMore, fetchPage]);

  // ── Render ─────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  return (
    <Selector<T>
      {...selectorProps}
      items={items}
      selectedItems={selectedItems}
      enableItem={enableItem}
      onChanged={onChanged}
      // Override keyword handler để trigger load-more search thay vì filter local
      // Selector nhận hint sẽ trigger onKeywordChanged nội bộ — ta override qua itemContainerBuilder
      itemContainerBuilder={(itemBuilder, listItems, selectedSet) => (
        <View style={s.flex}>
          <FlatList
            data={Array.from(listItems)}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => (
              <View>
                {itemBuilder(item, selectedSet.has(item))}
              </View>
            )}
            ItemSeparatorComponent={() => <View style={s.separator} />}
            keyboardShouldPersistTaps="handled"
            onEndReached={loadMore}
            onEndReachedThreshold={0.2}
            ListFooterComponent={
              isLoadingMore
                ? <View style={s.footer}><ActivityIndicator size="small" color="#1976d2" /></View>
                : !hasMore && items.length > 0
                  ? <Text style={s.footerText}>{SdkStrings.selector.allLoaded}</Text>
                  : null
            }
          />
        </View>
      )}
    />
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  separator: { height: 1, backgroundColor: '#f3f4f6', marginHorizontal: 16 },
  footer: { paddingVertical: 16, alignItems: 'center' },
  footerText: { textAlign: 'center', color: '#9ca3af', fontSize: 13, paddingVertical: 12 },
});
