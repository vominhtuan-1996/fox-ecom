/**
 * NotificationService — mock push notification handler.
 * Production: thay bằng @react-native-firebase/messaging hoặc Expo Notifications.
 */

export type NotificationPayload = {
  type: 'new_order' | 'order_claimed' | 'order_delivered' | 'order_confirmed';
  orderId: string;
  title: string;
  body: string;
};

type NotificationHandler = (payload: NotificationPayload) => void;

const _handlers: NotificationHandler[] = [];
const _history: NotificationPayload[] = [];

// Mock: 3 pending notifications khi app mở
const MOCK_NOTIFICATIONS: NotificationPayload[] = [
  {
    type: 'new_order',
    orderId: 'o1',
    title: 'Đơn hàng mới gần bạn',
    body: 'HCM-Q7 → HCM-Q1 · Phần thưởng: 14 điểm',
  },
  {
    type: 'order_claimed',
    orderId: 'o2',
    title: 'Đơn hàng đã được nhận',
    body: 'Trần Thị B đã nhận chở đơn của bạn',
  },
  {
    type: 'order_delivered',
    orderId: 'o3',
    title: 'Đơn hàng đã giao',
    body: 'Đơn #o3 đến nơi — xác nhận để cộng điểm',
  },
];

export const NotificationService = {
  /** Đăng ký handler nhận notification */
  addListener(handler: NotificationHandler): () => void {
    _handlers.push(handler);
    return () => {
      const idx = _handlers.indexOf(handler);
      if (idx !== -1) _handlers.splice(idx, 1);
    };
  },

  /** Lấy danh sách notification chưa xử lý */
  getPending(): NotificationPayload[] {
    return [...MOCK_NOTIFICATIONS];
  },

  /** Lịch sử đã nhận trong session */
  getHistory(): NotificationPayload[] {
    return [..._history];
  },

  /** Simulate: dispatch notification (dùng trong demo / test) */
  simulate(payload: NotificationPayload): void {
    _history.push(payload);
    _handlers.forEach(h => h(payload));
  },

  /** Giả lập "tap notification từ system tray" khi app mở — null = không có */
  getInitialNotification(): NotificationPayload | null {
    return null; // ponytail: trả null trong dev, set mock khi test deep-link
  },
};
