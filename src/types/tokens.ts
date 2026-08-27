import type { ThemeConfig } from "./themes";

/**
 * Design token type that supports placeholders and runtime resolution
 */
export type DesignToken =
  | string
  | {
      /** Token value with optional placeholders like {color.primary} */
      value: string;
      /** Description for documentation */
      description?: string;
      /** Whether this token should be resolved at runtime */
      runtime?: boolean;
    };

/**
 * Token registry for design system values
 */
export type TokenRegistry = {
  color?: Record<string, DesignToken>;
  spacing?: Record<string, DesignToken>;
  typography?: Record<string, DesignToken>;
  shadow?: Record<string, DesignToken>;
  border?: Record<string, DesignToken>;
  animation?: Record<string, DesignToken>;
  breakpoint?: Record<string, DesignToken>;
  [category: string]: Record<string, DesignToken> | undefined;
};

/**
 * Context for token resolution
 */
export type TokenResolutionContext = {
  /** Current theme being applied */
  theme?: ThemeConfig | undefined;
  /** User preferences */
  preferences?: {
    reducedMotion?: boolean;
    highContrast?: boolean;
    colorScheme?: "light" | "dark";
  };
  /** Current breakpoint */
  breakpoint?: string;
  /** Custom context data */
  custom?: Record<string, any>;
};

/**
 * Result of token resolution
 */
export type ResolvedToken = {
  /** Final resolved value */
  value: string;
  /** Whether value was resolved from a token */
  wasResolved: boolean;
  /** Original token reference if applicable */
  tokenRef?: string | undefined;
};
