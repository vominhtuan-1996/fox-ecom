/**
 * Screen Registry
 * Maps route names to screen components
 * Usage: Register all your screens here
 */

import React from 'react';
import { ScreenName } from '@/modules/navigation';

/**
 * Screen Component Type
 */
export type ScreenComponent = React.ComponentType<any>;

/**
 * Screen Registry
 */
export class ScreenRegistry {
  private static screens: Map<ScreenName, ScreenComponent> = new Map();

  /**
   * Register a screen
   */
  static register(name: ScreenName, component: ScreenComponent): void {
    this.screens.set(name, component);
    console.log(`✅ Screen registered: ${name}`);
  }

  /**
   * Register multiple screens
   */
  static registerMultiple(screens: Record<ScreenName, ScreenComponent>): void {
    Object.entries(screens).forEach(([name, component]) => {
      this.screens.set(name as ScreenName, component);
    });
    console.log(`✅ Registered ${Object.keys(screens).length} screens`);
  }

  /**
   * Get screen by name
   */
  static getScreen(name: ScreenName): ScreenComponent | null {
    return this.screens.get(name) || null;
  }

  /**
   * Get all screens
   */
  static getAll(): Record<ScreenName, ScreenComponent> {
    const result: any = {};
    this.screens.forEach((component, name) => {
      result[name] = component;
    });
    return result;
  }

  /**
   * Check if screen exists
   */
  static has(name: ScreenName): boolean {
    return this.screens.has(name);
  }

  /**
   * Clear all screens
   */
  static clear(): void {
    this.screens.clear();
  }

  /**
   * Get screen count
   */
  static count(): number {
    return this.screens.size;
  }
}

export default ScreenRegistry;
