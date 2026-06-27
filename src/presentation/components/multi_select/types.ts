import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

/** Tương đương OptionModel trong Flutter — item phải có id + label để search/compare */
export interface OptionModel {
  id: string | number;
  label: string;
}

/**
 * replace — khi đầy thì xóa item đầu tiên, thêm item mới (không cho deselect)
 * limit   — khi đầy thì block, cho phép deselect
 * unLimit — không giới hạn, toggle tự do
 */
export type MultiSelectorType = 'replace' | 'limit' | 'unLimit';

export interface LoadMoreModel<T> {
  items: T[];
  hasMore: boolean;
  totalCount?: number;
}

export interface MultiSelectorProps<T> {
  items: T[];
  initialSelectedItems: T[];
  /** Số item được chọn tối đa (default 1) */
  selectLength?: number;
  type?: MultiSelectorType;
  enable?: boolean;
  /** Cho phép disable từng item riêng lẻ */
  enableItem?: (item: T) => boolean;
  onSelectItem?: (selected: T[]) => void;
  /** Render từng item — nhận item + trạng thái isSelected */
  itemBuilder?: (item: T, isSelected: boolean) => ReactNode;
  /**
   * Override toàn bộ container list — nhận lại itemBuilder, items, selectedItems
   * để tự quyết định layout (Grid, FlatList, custom...)
   */
  itemContainerBuilder?: (
    itemBuilder: (item: T, isSelected: boolean) => ReactNode,
    items: T[],
    selectedItems: Set<T>,
  ) => ReactNode;
  selectedColor?: string;
  unselectedColor?: string;
  style?: StyleProp<ViewStyle>;
}

export interface SelectorProps<T extends OptionModel> extends Omit<MultiSelectorProps<T>, 'initialSelectedItems'> {
  selectedItems: T[];
  title?: string;
  hint?: string;
  hasSearchBar?: boolean;
  autoFocus?: boolean;
  onChanged?: (selected: T[]) => void;
}

export interface LoadMoreSelectorProps<T extends OptionModel> extends Omit<SelectorProps<T>, 'items'> {
  pageSize?: number;
  getItemsFunction: (pageSize: number, pageNumber: number, keyword: string) => Promise<LoadMoreModel<T>>;
  /**
   * Tiền xử lý trước khi gọi search — dùng để thêm debounce, bỏ qua keyword ngắn, v.v.
   * Nếu không truyền thì search ngay lập tức.
   *
   * @example
   * preAnalyzeSearch={(search, keyword) => {
   *   if (keyword.length < 3) return;   // bỏ qua keyword quá ngắn
   *   debounce(() => search(), 400);     // debounce 400ms
   * }}
   */
  preAnalyzeSearch?: (searchFn: () => void, keyword: string) => void;
  onItemTap?: (selected: T[]) => void;
}
