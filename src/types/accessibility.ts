import type { ClassValue } from "clsx";

/**
 * Accessibility configuration for themes
 */
export type AccessibilityConfig = {
  /** Focus ring configuration */
  focusRing?: {
    /** Default focus ring classes */
    default: ClassValue;
    /** Focus ring variants by context */
    variants?: Record<string, ClassValue>;
    /** Whether to enable automatic focus ring application */
    auto?: boolean;
  };

  /** Reduced motion configuration */
  reducedMotion?: {
    /** Classes to apply when user prefers reduced motion */
    replace: Record<string, ClassValue>;
    /** Whether to automatically handle reduced motion */
    auto?: boolean;
  };

  /** High contrast mode configuration */
  highContrast?: {
    /** Color mappings for high contrast mode */
    colorMap: Record<string, ClassValue>;
    /** Whether to automatically apply high contrast styles */
    auto?: boolean;
  };

  /** Screen reader specific configurations */
  screenReader?: {
    /** Classes that should be screen reader only */
    srOnly: ClassValue;
    /** Focus-visible only classes */
    focusVisible: ClassValue;
  };
};
