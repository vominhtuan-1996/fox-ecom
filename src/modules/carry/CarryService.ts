import { Hub, Order, CarryUser, CreateOrderInput, OrderStatus, ItemSize } from './types';

// ── Mock hubs (6 FTel văn phòng) ─────────────────────────────────────────────
export const HUBS: Hub[] = [
  { id: 'hcm-ftw', name: 'FPT Tower HCM',      shortName: 'FPT Tower', address: '9 Đường Số 3, Khu CNC, Q.9', city: 'HCM' },
  { id: 'hcm-hub', name: 'Hub Nguyễn Văn Linh', shortName: 'NVL Hub',   address: '5 Nguyễn Văn Linh, Q.7',    city: 'HCM' },
  { id: 'hcm-bd',  name: 'VP Bình Dương',        shortName: 'Bình Dương',address: '12 ĐL Bình Dương, Thủ Dầu Một', city: 'HCM' },
  { id: 'hn-fpt',  name: 'Toà nhà FPT HN',       shortName: 'FPT HN',   address: '17 Duy Tân, Cầu Giấy',      city: 'HN' },
  { id: 'hn-hub',  name: 'Hub Trung Hoà',         shortName: 'Trung Hoà',address: '210 Trung Kính, Cầu Giấy',   city: 'HN' },
  { id: 'hn-hd',   name: 'VP Hải Dương',          shortName: 'Hải Dương',address: '45 Nguyễn Lương Bằng, HD',   city: 'HN' },
];

const MOCK_USERS: CarryUser[] = [
  { id: 'u1', name: 'Nguyễn Văn A', dept: 'Phòng CNTT' },
  { id: 'u2', name: 'Trần Thị B',   dept: 'Phòng Kinh doanh' },
  { id: 'u3', name: 'Lê Minh C',    dept: 'Phòng Kỹ thuật' },
  { id: 'u4', name: 'Phạm Thu D',   dept: 'Phòng Nhân sự' },
  { id: 'u5', name: 'Hoàng Văn E',  dept: 'Phòng Marketing' },
];

// ── Point & CO₂ formula ───────────────────────────────────────────────────────
const SIZE_BONUS: Record<ItemSize, number> = { S: 0, M: 5, L: 10 };
const KM_BETWEEN: Record<string, number> = {
  'hcm-ftw|hcm-hub': 12,
  'hcm-ftw|hcm-bd':  28,
  'hcm-hub|hcm-bd':  22,
  'hn-fpt|hn-hub':    6,
  'hn-fpt|hn-hd':    55,
  'hn-hub|hn-hd':    52,
};

function getKm(fromId: string, toId: string): number {
  return KM_BETWEEN[`${fromId}|${toId}`]
    ?? KM_BETWEEN[`${toId}|${fromId}`]
    ?? 10;
}

export function calcEstimate(fromId: string, toId: string, size: ItemSize) {
  const km = getKm(fromId, toId);
  const points = 10 + km + SIZE_BONUS[size];
  const co2Kg = parseFloat((km * 0.07).toFixed(2));
  return { points, co2Kg, km };
}

// ── In-memory store ───────────────────────────────────────────────────────────
let _orders: Order[] = [
  {
    id: 'FC-2401', sender: MOCK_USERS[0], receiver: MOCK_USERS[1],
    fromHub: HUBS[0], toHub: HUBS[1],
    itemDesc: 'Tài liệu hợp đồng Q2', itemSize: 'S', itemValueVnd: 0,
    deadline: new Date(Date.now() + 3 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    status: 'OPEN', estimatedPoints: 22, estimatedCo2Kg: 0.84,
  },
  {
    id: 'FC-2402', sender: MOCK_USERS[2], receiver: MOCK_USERS[3],
    fromHub: HUBS[1], toHub: HUBS[2],
    itemDesc: 'Laptop Dell XPS 15 + sạc', itemSize: 'L', itemValueVnd: 35000000,
    deadline: new Date(Date.now() + 6 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 600000).toISOString(),
    status: 'OPEN', estimatedPoints: 42, estimatedCo2Kg: 1.54,
  },
  {
    id: 'FC-2403', sender: MOCK_USERS[4], receiver: MOCK_USERS[0],
    fromHub: HUBS[0], toHub: HUBS[2],
    itemDesc: 'Quà tặng KH (hộp bánh)', itemSize: 'M', itemValueVnd: 500000,
    deadline: new Date(Date.now() + 24 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    status: 'OPEN', estimatedPoints: 33, estimatedCo2Kg: 1.96,
  },
];

let _nextId = 2404;

export const CarryService = {
  getHubs: (): Hub[] => HUBS,

  searchUsers: (query: string): CarryUser[] => {
    if (!query.trim()) return MOCK_USERS;
    const q = query.toLowerCase();
    return MOCK_USERS.filter(
      u => u.name.toLowerCase().includes(q) || u.dept.toLowerCase().includes(q),
    );
  },

  getBoard: (fromId?: string, toId?: string): Order[] => {
    let list = _orders.filter(o => o.status === 'OPEN');
    if (fromId) list = list.filter(o => o.fromHub.id === fromId);
    if (toId)   list = list.filter(o => o.toHub.id === toId);
    return [...list].sort(
      (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
    );
  },

  getMyOrders: (userId: string): Order[] =>
    _orders.filter(
      o => o.sender.id === userId || o.receiver.id === userId || o.carrier?.id === userId,
    ),

  getOrder: (id: string): Order | undefined => _orders.find(o => o.id === id),

  createOrder: (input: CreateOrderInput, sender: CarryUser): Order => {
    const fromHub = HUBS.find(h => h.id === input.fromHubId)!;
    const toHub   = HUBS.find(h => h.id === input.toHubId)!;
    const receiver = MOCK_USERS.find(u => u.id === input.receiverId) ?? MOCK_USERS[1];
    const { points, co2Kg } = calcEstimate(input.fromHubId, input.toHubId, input.itemSize);

    const order: Order = {
      id: `FC-${_nextId++}`,
      sender, receiver,
      fromHub, toHub,
      itemDesc: input.itemDesc,
      itemSize: input.itemSize,
      itemValueVnd: input.itemValueVnd,
      deadline: input.deadline,
      createdAt: new Date().toISOString(),
      status: 'OPEN',
      estimatedPoints: points,
      estimatedCo2Kg: co2Kg,
    };
    _orders = [order, ..._orders];
    return order;
  },

  claimOrder: (orderId: string, carrier: CarryUser): Order | undefined => {
    const order = _orders.find(o => o.id === orderId);
    if (!order || order.status !== 'OPEN') return undefined;
    order.carrier = carrier;
    order.status = 'CLAIMED';
    return order;
  },

  updateStatus: (orderId: string, status: OrderStatus): Order | undefined => {
    const order = _orders.find(o => o.id === orderId);
    if (!order) return undefined;
    order.status = status;
    return order;
  },
};
