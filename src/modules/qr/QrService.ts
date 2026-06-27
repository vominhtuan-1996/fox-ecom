type QrType = 'pickup' | 'dropoff';

interface QrEntry {
  code: string;
  orderId: string;
  type: QrType;
  expiresAt: number;
  used: boolean;
}

const TTL_MS = 5 * 60 * 1000; // 5 phút

// In-memory store — key: `${orderId}:${type}`
const _store = new Map<string, QrEntry>();

function pad6(n: number): string {
  return String(n).padStart(6, '0');
}

export const QrService = {
  generateCode(orderId: string, type: QrType): string {
    const code = pad6(Math.floor(Math.random() * 1000000));
    _store.set(`${orderId}:${type}`, {
      code, orderId, type,
      expiresAt: Date.now() + TTL_MS,
      used: false,
    });
    return code;
  },

  validateCode(orderId: string, type: QrType, input: string): 'ok' | 'wrong' | 'expired' | 'used' {
    const entry = _store.get(`${orderId}:${type}`);
    if (!entry) return 'expired';
    if (entry.used) return 'used';
    if (Date.now() > entry.expiresAt) return 'expired';
    if (entry.code !== input.trim()) return 'wrong';
    entry.used = true;
    return 'ok';
  },

  isExpired(orderId: string, type: QrType): boolean {
    const entry = _store.get(`${orderId}:${type}`);
    if (!entry) return true;
    return entry.used || Date.now() > entry.expiresAt;
  },

  getRemainingSeconds(orderId: string, type: QrType): number {
    const entry = _store.get(`${orderId}:${type}`);
    if (!entry) return 0;
    return Math.max(0, Math.floor((entry.expiresAt - Date.now()) / 1000));
  },
};
