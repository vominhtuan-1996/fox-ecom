import { AppSnackbarConfig, AppSnackbarType } from './models/dialog_config';

// ─── Host callbacks ────────────────────────────────────────────────────────────

type ShowSnackbarFn = (config: AppSnackbarConfig) => void;
type ClearTopFn = () => void;

let _showTop: ShowSnackbarFn | null = null;
let _showBottom: ShowSnackbarFn | null = null;
let _clearTop: ClearTopFn | null = null;

/**
 * AppSnackbarEngine — static class, context-free.
 * top: queue overlay (slide từ trên xuống, tương đương TopOverlayBanner Flutter)
 * bottom: overlay cuối màn hình (slide từ dưới lên)
 * Tương đương AppSnackbarEngine trong Flutter.
 */
export class AppSnackbarEngine {
  // ── Registration ──────────────────────────────────────────────────────────

  static _register(showTop: ShowSnackbarFn, showBottom: ShowSnackbarFn, clearTop: ClearTopFn): void {
    _showTop = showTop;
    _showBottom = showBottom;
    _clearTop = clearTop;
  }

  static _unregister(): void {
    _showTop = null;
    _showBottom = null;
    _clearTop = null;
  }

  // ── Core ──────────────────────────────────────────────────────────────────

  static show(config: AppSnackbarConfig): void {
    if (config.position === 'bottom') {
      _showBottom?.(config);
    } else {
      _showTop?.(config);
    }
  }

  // ── Shortcuts ─────────────────────────────────────────────────────────────

  static info(message: string, config?: Partial<AppSnackbarConfig>): void {
    AppSnackbarEngine.show({ message, type: 'info', ...config });
  }

  static error(message: string, config?: Partial<AppSnackbarConfig>): void {
    AppSnackbarEngine.show({ message, type: 'error', ...config });
  }

  static success(message: string, config?: Partial<AppSnackbarConfig>): void {
    AppSnackbarEngine.show({ message, type: 'success', ...config });
  }

  static warning(message: string, config?: Partial<AppSnackbarConfig>): void {
    AppSnackbarEngine.show({ message, type: 'warning', ...config });
  }

  // ── Queue control ─────────────────────────────────────────────────────────

  static clearTopQueue(): void {
    _clearTop?.();
  }
}
