export type OrderStatus =
  | 'OPEN'
  | 'CLAIMED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'DISPUTED';

export type ItemSize = 'S' | 'M' | 'L';

export interface Hub {
  id: string;
  name: string;
  shortName: string;
  address: string;
  city: 'HCM' | 'HN';
}

export interface CarryUser {
  id: string;
  name: string;
  dept: string;
  avatarColor?: string;
}

export interface Order {
  id: string;
  sender: CarryUser;
  receiver: CarryUser;
  carrier?: CarryUser;
  fromHub: Hub;
  toHub: Hub;
  itemDesc: string;
  itemSize: ItemSize;
  itemValueVnd: number;
  deadline: string;        // ISO date string
  createdAt: string;
  status: OrderStatus;
  estimatedPoints: number;
  estimatedCo2Kg: number;
  actualPoints?: number;
  actualCo2Kg?: number;
}

export interface CreateOrderInput {
  fromHubId: string;
  toHubId: string;
  receiverId: string;
  itemDesc: string;
  itemSize: ItemSize;
  itemValueVnd: number;
  deadline: string;
}
