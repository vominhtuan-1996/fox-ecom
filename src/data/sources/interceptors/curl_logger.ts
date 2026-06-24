/**
 * Curl request logger for debugging
 */
export class CurlLogger {
  private enabled: boolean = __DEV__; // ponytail: only in dev, disable in prod

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  log(request: Request, body?: any): void {
    if (!this.enabled) return;

    try {
      const curl = this.buildCurl(request, body);
      console.log('🌐 CURL:', curl);
    } catch (error) {
      console.error('Failed to log curl', error);
    }
  }

  private buildCurl(request: Request, body?: any): string {
    const method = request.method;
    const url = request.url;
    const headers = (request.headers as any).entries ? Array.from((request.headers as any).entries()) : Object.entries(request.headers || {});

    let curl = `curl -X ${method}`;

    // Add headers
    headers.forEach(([key, value]: any) => {
      curl += ` -H "${key}: ${value}"`;
    });

    // Add body if present
    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
      curl += ` -d '${bodyStr}'`;
    }

    curl += ` "${url}"`;

    return curl;
  }
}

// ponytail: global var, DEV should come from environment or build config
declare const __DEV__: boolean;
