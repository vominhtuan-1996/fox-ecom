import { CarryService, HUBS, calcEstimate } from '../../src/modules/carry/CarryService';
import { CarryUser } from '../../src/modules/carry/types';

const SENDER: CarryUser  = { id: 'test-sender',  name: 'Test Sender',  dept: 'IT' };
const CARRIER: CarryUser = { id: 'test-carrier', name: 'Test Carrier', dept: 'Dev' };

const INPUT_BASE = {
  fromHubId:   HUBS[0].id,
  toHubId:     HUBS[1].id,
  itemSize:    'S' as const,
  itemDesc:    'Tài liệu test',
  itemValueVnd: 0,
  receiverId:  'u2',
  deadline:    new Date(Date.now() + 86400000).toISOString(),
};

describe('CarryService', () => {
  describe('getHubs', () => {
    it('returns at least 2 hubs', () => {
      expect(CarryService.getHubs().length).toBeGreaterThanOrEqual(2);
    });

    it('hubs have id, name, city', () => {
      CarryService.getHubs().forEach(h => {
        expect(h.id).toBeTruthy();
        expect(h.name).toBeTruthy();
        expect(['HCM', 'HN']).toContain(h.city);
      });
    });
  });

  describe('getBoard', () => {
    it('returns OPEN orders', () => {
      const board = CarryService.getBoard();
      expect(Array.isArray(board)).toBe(true);
      board.forEach(o => expect(o.status).toBe('OPEN'));
    });

    it('filters by fromHub', () => {
      const hub = HUBS[0];
      const board = CarryService.getBoard(hub.id);
      board.forEach(o => expect(o.fromHub.id).toBe(hub.id));
    });

    it('filters by toHub', () => {
      const hub = HUBS[1];
      const board = CarryService.getBoard(undefined, hub.id);
      board.forEach(o => expect(o.toHub.id).toBe(hub.id));
    });
  });

  describe('createOrder', () => {
    it('returns an order with OPEN status', () => {
      const order = CarryService.createOrder(INPUT_BASE, SENDER);
      expect(order.id).toBeTruthy();
      expect(order.status).toBe('OPEN');
      expect(order.sender.id).toBe(SENDER.id);
    });

    it('created order is retrievable via getOrder', () => {
      const order = CarryService.createOrder(INPUT_BASE, SENDER);
      const found = CarryService.getOrder(order.id);
      expect(found).toBeDefined();
      expect(found!.id).toBe(order.id);
    });

    it('created order appears in getMyOrders for sender', () => {
      const order = CarryService.createOrder(INPUT_BASE, SENDER);
      const mine = CarryService.getMyOrders(SENDER.id);
      expect(mine.some(o => o.id === order.id)).toBe(true);
    });
  });

  describe('claimOrder', () => {
    it('changes status to CLAIMED and sets carrier', () => {
      const order = CarryService.createOrder(INPUT_BASE, SENDER);
      const claimed = CarryService.claimOrder(order.id, CARRIER);
      expect(claimed).toBeDefined();
      expect(claimed!.status).toBe('CLAIMED');
      expect(claimed!.carrier?.id).toBe(CARRIER.id);
    });

    it('returns undefined for non-OPEN order', () => {
      const order = CarryService.createOrder(INPUT_BASE, SENDER);
      CarryService.claimOrder(order.id, CARRIER); // first claim
      const second = CarryService.claimOrder(order.id, { id: 'other', name: 'X', dept: 'Y' });
      expect(second).toBeUndefined();
    });

    it('returns undefined for unknown orderId', () => {
      const result = CarryService.claimOrder('nonexistent', CARRIER);
      expect(result).toBeUndefined();
    });
  });

  describe('updateStatus', () => {
    it('updates order status', () => {
      const order = CarryService.createOrder(INPUT_BASE, SENDER);
      const updated = CarryService.updateStatus(order.id, 'CANCELLED');
      expect(updated).toBeDefined();
      expect(updated!.status).toBe('CANCELLED');
    });

    it('returns undefined for unknown orderId', () => {
      const result = CarryService.updateStatus('nonexistent', 'CANCELLED');
      expect(result).toBeUndefined();
    });
  });
});

describe('calcEstimate', () => {
  it('returns points and co2Kg for different hubs', () => {
    const result = calcEstimate(HUBS[0].id, HUBS[1].id, 'S');
    expect(result.points).toBeGreaterThan(0);
    expect(result.co2Kg).toBeGreaterThanOrEqual(0);
  });

  it('larger items give more points', () => {
    const small = calcEstimate(HUBS[0].id, HUBS[1].id, 'S');
    const large = calcEstimate(HUBS[0].id, HUBS[1].id, 'L');
    expect(large.points).toBeGreaterThan(small.points);
  });

  it('returns same points for same hubs regardless of order call', () => {
    const a = calcEstimate(HUBS[0].id, HUBS[1].id, 'M');
    const b = calcEstimate(HUBS[0].id, HUBS[1].id, 'M');
    expect(a.points).toBe(b.points);
    expect(a.co2Kg).toBe(b.co2Kg);
  });
});
