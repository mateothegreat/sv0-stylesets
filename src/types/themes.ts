import type { ClassValue } from "clsx";
import type { AccessibilityConfig } from "./accessibility";
import type { TokenRegistry } from "./tokens";

/**
 * Theme configuration supporting tokens and accessibility
 */
export type ThemeConfig = {
  /** Theme identifier */
  id: string;
  /** Theme display name */
  name: string;
  /** Design tokens for this theme */
  tokens?: TokenRegistry;
  /** Accessibility configuration */
  accessibility?: AccessibilityConfig;
  /** Base CSS classes for the theme */
  base?: ClassValue;
  /** Whether this theme supports dark mode */
  darkMode?: boolean;
  /** CSS variables to set when theme is active */
  cssVariables?: Record<string, string>;
};

/**
 * Extract theme IDs from a themes configuration object
 * @example
 * ```typescript
 * const themes = { light: {...}, dark: {...} } as const;
 * type ThemeIds = ExtractThemeIds<typeof themes>; // 'light' | 'dark'
 * ```
 */
export type ExtractThemeIds<T extends Record<string, any>> = keyof T & string;

/**
 * Extract theme IDs from a ThemeManager instance
 * This requires the themes to be passed as a const array with explicit theme configs
 * @example
 * ```typescript
 * const themeConfigs = [
 *   { id: 'light', name: 'Light' },
 *   { id: 'dark', name: 'Dark' }
 * ] as const;
 * type ThemeIds = ExtractThemeIdsFromArray<typeof themeConfigs>; // 'light' | 'dark'
 * ```
 */
export type ExtractThemeIdsFromArray<T extends ReadonlyArray<ThemeConfig>> = T[number]["id"];
