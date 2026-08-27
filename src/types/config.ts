import type { ClassValue } from "clsx";
import type { ThemeManager } from "../themes";
import type { AccessibilityConfig } from "./accessibility";
import type { TokenRegistry } from "./tokens";
import type { VariantSelection } from "./variants";

/**
 * Enhanced styler configuration with theme support
 */
export type EnhancedStylerConfig<V, R> = {
  /** Base classes */
  base?: ClassValue;
  /** Component variants */
  variants?: V;
  /** Compound variants */
  compoundVariants?: (V extends Record<string, any>
    ? Partial<VariantSelection<V>> & { class: ClassValue }
    : never)[];
  /** Default variant selections */
  defaultVariants?: VariantSelection<V>;
  /** Static class recipes */
  recipes?: R;
  /** Design tokens to use */
  tokens?: TokenRegistry;
  /** Accessibility enhancements */
  accessibility?: AccessibilityConfig;
  /** Theme-specific overrides */
  themes?: Record<string, Partial<EnhancedStylerConfig<V, R>>>;
  /**
   * Optional ThemeManager instance to share across multiple StyleSets. When provided, this StyleSet
   * will use the provided ThemeManager instead of creating its own. This allows for centralized
   * theme management and avoids theme duplication.
   *
   * @example
   *
   * ```typescript
   * // Create global ThemeManager once
   * const globalThemeManager = new ThemeManager([lightTheme, darkTheme]);
   *
   * // Share across multiple StyleSets
   * const button = createStyleSet({
   *   variants: { ... },
   *   themeManager: globalThemeManager
   * });
   *
   * const card = createStyleSet({
   *   variants: { ... },
   *   themeManager: globalThemeManager
   * });
   * ```
   */
  themeManager?: ThemeManager;
};
