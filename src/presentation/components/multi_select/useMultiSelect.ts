import { useReducer, useCallback } from 'react';
import { MultiSelectorType } from './types';

/** Tương đương MultiSelectCubit — quản lý Set các item đang được chọn */

interface State<T> {
  selectedItems: Set<T>;
}

type Action<T> = { type: 'SELECT'; item: T };

function buildReducer<T>(type: MultiSelectorType, selectLength: number) {
  return (state: State<T>, action: Action<T>): State<T> => {
    const { item } = action;
    const current = state.selectedItems;

    switch (type) {
      case 'replace': {
        // Đã chọn rồi → không làm gì (không cho deselect)
        if (current.has(item)) return state;
        const next = new Set(current);
        if (next.size >= selectLength) {
          // Xóa item đầu tiên rồi thêm item mới
          next.delete(next.values().next().value as T);
        }
        next.add(item);
        return { selectedItems: next };
      }
      case 'limit': {
        const next = new Set(current);
        if (next.has(item)) {
          next.delete(item);
        } else {
          if (next.size >= selectLength) return state; // block khi đầy
          next.add(item);
        }
        return { selectedItems: next };
      }
      case 'unLimit': {
        const next = new Set(current);
        if (next.has(item)) next.delete(item);
        else next.add(item);
        return { selectedItems: next };
      }
    }
  };
}

export function useMultiSelect<T>(
  initialSelected: T[],
  type: MultiSelectorType,
  selectLength: number,
  onSelectItem?: (selected: T[]) => void,
) {
  const reducer = buildReducer<T>(type, selectLength);
  const [state, dispatch] = useReducer(reducer, {
    selectedItems: new Set<T>(initialSelected),
  });

  const selectItem = useCallback(
    (item: T) => {
      dispatch({ type: 'SELECT', item });
      // onSelectItem nhận snapshot sau khi dispatch — dùng trong useEffect ở component
    },
    [],
  );

  return { selectedItems: state.selectedItems, selectItem };
}
