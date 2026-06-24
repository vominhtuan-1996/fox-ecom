/**
 * Dependency Injection Container
 * Similar to Flutter's GetIt service locator
 */

type ServiceFactory<T> = () => T;
type SingletonFactory<T> = (get: <U>(name: string) => U) => T;

export class DIContainer {
  private singletons: Map<string, any> = new Map();
  private factories: Map<string, ServiceFactory<any>> = new Map();
  private lazyInstances: Map<string, any> = new Map();

  /**
   * Register singleton instance
   * Instance created once and reused
   */
  registerSingleton<T>(name: string, instance: T): void {
    this.singletons.set(name, instance);
    console.log(`✅ Singleton registered: ${name}`);
  }

  /**
   * Register singleton with factory
   * Factory called once, result cached
   */
  registerLazySingleton<T>(name: string, factory: SingletonFactory<T>): void {
    this.factories.set(name, () => {
      if (!this.lazyInstances.has(name)) {
        const instance = factory(this.get.bind(this));
        this.lazyInstances.set(name, instance);
      }
      return this.lazyInstances.get(name);
    });
    console.log(`✅ Lazy singleton registered: ${name}`);
  }

  /**
   * Register factory (new instance each time)
   * Called every time get() is called
   */
  registerFactory<T>(name: string, factory: ServiceFactory<T>): void {
    this.factories.set(name, factory);
    console.log(`✅ Factory registered: ${name}`);
  }

  /**
   * Get instance
   * Returns singleton or creates new from factory
   */
  get<T>(name: string): T {
    // Check singletons first
    if (this.singletons.has(name)) {
      return this.singletons.get(name);
    }

    // Check factories
    if (this.factories.has(name)) {
      const factory = this.factories.get(name);
      return factory();
    }

    throw new Error(`❌ Service not found: ${name}`);
  }

  /**
   * Check if service registered
   */
  has(name: string): boolean {
    return this.singletons.has(name) || this.factories.has(name);
  }

  /**
   * Unregister service
   */
  unregister(name: string): void {
    this.singletons.delete(name);
    this.factories.delete(name);
    this.lazyInstances.delete(name);
    console.log(`🗑️ Unregistered: ${name}`);
  }

  /**
   * Clear all services
   */
  clear(): void {
    this.singletons.clear();
    this.factories.clear();
    this.lazyInstances.clear();
    console.log('🗑️ DI container cleared');
  }

  /**
   * Get all registered services
   */
  getServices(): string[] {
    const all = new Set([...this.singletons.keys(), ...this.factories.keys()]);
    return Array.from(all);
  }
}

// Global DI container instance
export const di = new DIContainer();
