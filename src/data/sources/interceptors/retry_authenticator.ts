/**
 * Retry authenticator cho token refresh
 */
export interface TokenRefreshHandler {
  (): Promise<string | null>;
}

export class RetryAuthenticator {
  private refreshHandler?: TokenRefreshHandler;
  private isRefreshing = false;
  private refreshPromise?: Promise<string | null>;

  setRefreshHandler(handler: TokenRefreshHandler): void {
    this.refreshHandler = handler;
  }

  async refreshToken(): Promise<string | null> {
    if (!this.refreshHandler) {
      return null;
    }

    // ponytail: global lock, per-user if multi-tenant
    if (this.isRefreshing) {
      // Chờ refresh hiện tại hoàn thành
      return this.refreshPromise || null;
    }

    this.isRefreshing = true;
    try {
      this.refreshPromise = this.refreshHandler();
      const newToken = await this.refreshPromise;
      return newToken;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = undefined;
    }
  }
}
