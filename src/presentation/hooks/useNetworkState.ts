import { useState, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

/**
 * useNetworkState — detect network via fetch ping.
 * Ping khi app về foreground hoặc interval 30s.
 * Không dùng @react-native-community/netinfo để tránh native dep.
 */
export function useNetworkState(): boolean {
  const [isOnline, setIsOnline] = useState(true);

  async function check() {
    try {
      // ponytail: fetch với timeout 3s, nếu reject → offline
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 3000);
      await fetch('https://clients3.google.com/generate_204', { signal: ctrl.signal });
      clearTimeout(timer);
      setIsOnline(true);
    } catch {
      setIsOnline(false);
    }
  }

  useEffect(() => {
    check();
    const interval = setInterval(check, 30000);
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') check();
    });
    return () => { clearInterval(interval); sub.remove(); };
  }, []);

  return isOnline;
}
