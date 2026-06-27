/**
 * CurlLogger — log mỗi request dưới dạng curl command để debug.
 * Tương đương CurlLogger trong Flutter.
 * Chỉ hoạt động khi __DEV__ = true.
 */

declare const __DEV__: boolean;

export class CurlLogger {
  private enabled: boolean;

  constructor(enabled?: boolean) {
    this.enabled = enabled ?? (typeof __DEV__ !== 'undefined' ? __DEV__ : false);
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  log(method: string, url: string, headers: Record<string, string>, body?: unknown): void {
    if (!this.enabled) return;
    try {
      console.log('🌐 CURL:', this._build(method, url, headers, body));
    } catch { /* ignore logging errors */ }
  }

  logResponse(status: number, url: string): void {
    if (!this.enabled) return;
    const icon = status < 400 ? '✅' : '❌';
    console.log(`${icon} [${status}] ${url}`);
  }

  private _build(
    method: string,
    url: string,
    headers: Record<string, string>,
    body?: unknown,
  ): string {
    const parts = [`curl -X ${method.toUpperCase()}`];

    Object.entries(headers).forEach(([k, v]) => {
      parts.push(`-H '${k}: ${v}'`);
    });

    if (body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
      parts.push(`-d '${bodyStr.replace(/'/g, "'\\''")}'`);
    }

    parts.push(`'${url}'`);
    return parts.join(' \\\n  ');
  }
}
