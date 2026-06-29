/**
 * NotificationService V2 — mock notification handler.
 * Thêm: buildNotifs, getSeen/setSeen, getUnreadCount, markSeen, getAll.
 */

const _handlers = [];
let _items = [];
const _seenSet = new Set();

// Seed mock notifications
const MOCK = [
  {
    id: 'n1',
    orderId: 'o1',
    type: 'new_order',
    title: 'Đơn hàng mới gần bạn',
    body: 'HCM-Q7 → HCM-Q1 · Phần thưởng: 14 điểm',
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    seen: false,
  },
  {
    id: 'n2',
    orderId: 'o2',
    type: 'order_claimed',
    title: 'Đơn hàng đã được nhận',
    body: 'Trần Thị B đã nhận chở đơn của bạn',
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    seen: false,
  },
  {
    id: 'n3',
    orderId: 'o3',
    type: 'order_delivered',
    title: 'Đơn hàng đã giao',
    body: 'Đơn #o3 đến nơi — xác nhận để cộng điểm',
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    seen: true,
  },
];

_items = MOCK.map(n => ({ ...n }));
MOCK.filter(n => n.seen).forEach(n => _seenSet.add(n.id));

export const NotificationService = {
  /** Đăng ký listener — trả về hàm unsubscribe */
  addListener(handler) {
    _handlers.push(handler);
    return () => {
      const idx = _handlers.indexOf(handler);
      if (idx !== -1) _handlers.splice(idx, 1);
    };
  },

  /** Lấy toàn bộ notification (mới nhất trước) */
  getAll() {
    return [..._items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  /** Số thông báo chưa đọc */
  getUnreadCount() {
    return _items.filter(n => !n.seen).length;
  },

  /** Đánh dấu 1 notification đã đọc */
  markSeen(id) {
    _seenSet.add(id);
    _items = _items.map(n => n.id === id ? { ...n, seen: true } : n);
    _notify();
  },

  /** Đánh dấu tất cả đã đọc */
  markAllSeen() {
    _items = _items.map(n => ({ ...n, seen: true }));
    _items.forEach(n => _seenSet.add(n.id));
    _notify();
  },

  /** Thêm notification mới (simulate push) */
  push(payload) {
    const item = {
      id: `n${Date.now()}`,
      createdAt: new Date().toISOString(),
      seen: false,
      ...payload,
    };
    _items = [item, ..._items];
    _notify();
  },

  /** Giả lập tap notification từ system tray khi app mở — null = không có */
  getInitialNotification() {
    return null;
  },
};

function _notify() {
  _handlers.forEach(h => h());
}
