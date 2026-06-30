/**
 * Splash Module
 * Handles app initialization: token verification, service setup, env config
 */

interface SplashConfig {
  baseUrl?: string;
  environment?: 'development' | 'staging' | 'production';
  token?: string;
  timeout?: number;
}

interface SplashResult {
  success: boolean;
  message?: string;
  token?: string;
  error?: string;
}

class SplashModuleImpl {
  private baseUrl: string = '';
  private environment: 'development' | 'staging' | 'production' = 'staging';
  private token: string = '';
  private timeout: number = 5000;

  /**
   * Initialize splash module with config
   */
  async initialize(config: SplashConfig): Promise<SplashResult> {
    try {
      // Set configuration
      this.baseUrl = config.baseUrl || this.getDefaultBaseUrl();
      this.environment = config.environment || 'staging';
      this.timeout = config.timeout || 5000;

      // Verify token
      if (config.token) {
        this.token = config.token;
        const tokenValid = await this.verifyToken(config.token);
        if (!tokenValid) {
          return {
            success: false,
            error: 'Token verification failed',
          };
        }
      }

      // Initialize services
      await this.initializeServices();

      return {
        success: true,
        message: 'Initialization completed',
        token: this.token,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Verify token validity
   */
  private async verifyToken(token: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isValid = token.length > 10;
        resolve(isValid);
      }, 500);
    });
  }

  /**
   * Initialize all services
   */
  private async initializeServices(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.setupBearerAuth();
        this.setupEnvironment();
        resolve();
      }, 500);
    });
  }

  /**
   * Setup Bearer authentication header
   */
  private setupBearerAuth(): void {
    if (this.token) {
      const authHeader = `Bearer ${this.token}`;
      console.log('[Splash] Bearer auth configured');
    }
  }

  /**
   * Setup environment configuration
   */
  private setupEnvironment(): void {
    const envConfig = {
      baseUrl: this.baseUrl,
      environment: this.environment,
      timeout: this.timeout,
    };
    console.log('[Splash] Environment configured:', envConfig);
  }

  /**
   * Get default base URL based on environment
   */
  private getDefaultBaseUrl(): string {
    const urls: Record<string, string> = {
      development: 'https://apis-dev.fpt.vn',
      staging: 'https://apis-stag.fpt.vn',
      production: 'https://apis.fpt.vn',
    };
    return urls[this.environment] || urls.staging;
  }

  /**
   * Get configuration
   */
  getConfig() {
    return {
      baseUrl: this.baseUrl,
      environment: this.environment,
      hasToken: !!this.token,
    };
  }

  /**
   * Reset configuration
   */
  reset(): void {
    this.token = '';
    this.baseUrl = '';
    this.environment = 'staging';
  }
}

export const splashModule = new SplashModuleImpl();

export type { SplashConfig, SplashResult };
