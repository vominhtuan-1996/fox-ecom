type Factory<T> = () => T;

export class ServiceLocator {
  private static instances: Map<string, any> = new Map();
  private static factories: Map<string, Factory<any>> = new Map();

  static register<T>(key: string, factory: Factory<T>): void {
    this.factories.set(key, factory);
  }

  static get<T>(key: string): T {
    if (!this.instances.has(key)) {
      const factory = this.factories.get(key);
      if (!factory) {
        throw new Error(`Service "${key}" not found in locator`);
      }
      this.instances.set(key, factory());
    }
    return this.instances.get(key) as T;
  }

  static has(key: string): boolean {
    return this.factories.has(key);
  }

  static reset(): void {
    this.instances.clear();
    this.factories.clear();
  }

  static resetInstance(key: string): void {
    this.instances.delete(key);
  }
}
