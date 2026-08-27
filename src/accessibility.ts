import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { TokenResolver } from "./tokens";
import type { AccessibilityConfig, TokenResolutionContext } from "./types";

/**
 * Accessibility enhancement utilities
 */
export class AccessibilityManager {
  private config: AccessibilityConfig;
  private preferences: NonNullable<TokenResolutionContext["preferences"]> = {};
  private tokenResolver?: TokenResolver | undefined;
  private context?: TokenResolutionContext;

  constructor(config: AccessibilityConfig = {}, tokenResolver?: TokenResolver) {
    this.config = config;
    this.tokenResolver = tokenResolver;

    // Auto-detect user preferences if in browser
    if (typeof window !== "undefined") {
      this.detectUserPreferences();
    }
  }

  /**
   * Update accessibility configuration
   */
  updateConfig(config: Partial<AccessibilityConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Set user preferences manually
   */
  setPreferences(preferences: Partial<NonNullable<TokenResolutionContext["preferences"]>>): void {
    this.preferences = { ...this.preferences, ...preferences };
  }

  /**
   * Set token resolution context
   */
  setContext(context: TokenResolutionContext): void {
    this.context = context;
  }

  /**
   * Get current user preferences
   */
  getPreferences(): NonNullable<TokenResolutionContext["preferences"]> {
    return this.preferences;
  }

  /**
   * Apply accessibility enhancements to classes
   */
  enhance(classes: ClassValue): string {
    let enhanced = twMerge(clsx(classes));

    // Apply focus ring enhancements
    enhanced = this.applyFocusRing(enhanced);

    // Apply reduced motion handling
    enhanced = this.applyReducedMotion(enhanced);

    // Apply high contrast adjustments
    enhanced = this.applyHighContrast(enhanced);

    return enhanced;
  }

  /**
   * Create focus ring classes for interactive elements
   */
  createFocusRing(variant?: string): string {
    if (!this.config.focusRing) {
      return "";
    }

    const { default: defaultRing, variants } = this.config.focusRing;

    let ringClasses: string;
    if (variant && variants?.[variant]) {
      ringClasses = twMerge(clsx(variants[variant]));
    } else {
      ringClasses = twMerge(clsx(defaultRing)) || "";
    }

    // Resolve tokens if tokenResolver and context are available
    if (this.tokenResolver && this.context && ringClasses) {
      const resolved = this.tokenResolver.replaceTokens(ringClasses, this.context);
      ringClasses = resolved.value;
    }

    return twMerge(clsx(ringClasses));
  }

  /**
   * Create screen reader only classes
   */
  createScreenReaderOnly(): string {
    return this.config.screenReader?.srOnly
      ? twMerge(clsx(this.config.screenReader.srOnly))
      : "sr-only";
  }

  /**
   * Create focus-visible only classes
   */
  createFocusVisible(classes: ClassValue): string {
    const baseClasses = twMerge(clsx(classes));
    const focusVisible = this.config.screenReader?.focusVisible
      ? twMerge(clsx(this.config.screenReader.focusVisible))
      : "focus-visible:not-sr-only";

    return `${this.createScreenReaderOnly()} ${focusVisible} ${baseClasses}`;
  }

  /**
   * Check if reduced motion is preferred
   */
  prefersReducedMotion(): boolean {
    return this.preferences.reducedMotion ?? false;
  }

  /**
   * Check if high contrast is preferred
   */
  prefersHighContrast(): boolean {
    return this.preferences.highContrast ?? false;
  }

  private detectUserPreferences(): void {
    // Detect reduced motion preference
    if (window.matchMedia) {
      const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      this.preferences.reducedMotion = reducedMotionQuery.matches;

      reducedMotionQuery.addEventListener("change", (e) => {
        this.preferences.reducedMotion = e.matches;
      });

      // Detect high contrast preference
      const highContrastQuery = window.matchMedia("(prefers-contrast: high)");
      this.preferences.highContrast = highContrastQuery.matches;

      highContrastQuery.addEventListener("change", (e) => {
        this.preferences.highContrast = e.matches;
      });

      // Detect color scheme preference
      const darkSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
      this.preferences.colorScheme = darkSchemeQuery.matches ? "dark" : "light";

      darkSchemeQuery.addEventListener("change", (e) => {
        this.preferences.colorScheme = e.matches ? "dark" : "light";
      });
    }
  }

  private applyFocusRing(classes: string): string {
    if (!this.config.focusRing?.auto) {
      return classes;
    }

    // Add focus ring to interactive elements if not already present
    const hasFocus = /focus:/.test(classes);
    if (!hasFocus && this.isInteractiveClass(classes)) {
      const focusRing = this.createFocusRing();
      return twMerge(clsx(classes, focusRing));
    }

    return classes;
  }

  private applyReducedMotion(classes: string): string {
    if (!this.preferences.reducedMotion || !this.config.reducedMotion?.auto) {
      return classes;
    }

    let result = classes;
    const { replace } = this.config.reducedMotion;

    // Replace animation classes with reduced motion alternatives
    Object.entries(replace).forEach(([original, replacement]) => {
      const regex = new RegExp(`\\b${original}\\b`, "g");
      result = result.replace(regex, twMerge(clsx(replacement)));
    });

    return result;
  }

  private applyHighContrast(classes: string): string {
    if (!this.preferences.highContrast || !this.config.highContrast?.auto) {
      return classes;
    }

    let result = classes;
    const { colorMap } = this.config.highContrast;

    // Apply high contrast color mappings
    Object.entries(colorMap).forEach(([original, replacement]) => {
      const regex = new RegExp(`\\b${original}\\b`, "g");
      result = result.replace(regex, twMerge(clsx(replacement)));
    });

    return result;
  }

  private isInteractiveClass(classes: string): boolean {
    const interactiveKeywords = [
      "button",
      "btn",
      "link",
      "input",
      "select",
      "textarea",
      "checkbox",
      "radio",
      "switch",
      "toggle",
      "clickable",
      "hover:",
      "active:",
      "cursor-pointer"
    ];

    return interactiveKeywords.some((keyword) => classes.includes(keyword));
  }
}

/**
 * Focus ring presets for common UI patterns
 */
export const focusRingPresets = {
  default: "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
  tight: "focus:ring-1 focus:ring-blue-500 focus:ring-offset-1",
  loose: "focus:ring-4 focus:ring-blue-500 focus:ring-offset-4",
  primary: "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
  secondary: "focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
  success: "focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
  warning: "focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2",
  error: "focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
  dark: "focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900",
  light: "focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white"
};

/**
 * Reduced motion presets
 */
export const reducedMotionPresets = {
  animations: {
    "animate-spin": "animate-none",
    "animate-ping": "animate-none",
    "animate-pulse": "animate-none",
    "animate-bounce": "animate-none"
  },
  transitions: {
    "transition-all": "transition-none",
    "transition-colors": "transition-none",
    "transition-opacity": "transition-none",
    "transition-transform": "transition-none"
  },
  durations: {
    "duration-75": "duration-0",
    "duration-100": "duration-0",
    "duration-150": "duration-0",
    "duration-200": "duration-0",
    "duration-300": "duration-0",
    "duration-500": "duration-0",
    "duration-700": "duration-0",
    "duration-1000": "duration-0"
  }
};

/**
 * High contrast color mappings
 */
export const highContrastPresets = {
  text: {
    "text-gray-400": "text-gray-900 dark:text-white",
    "text-gray-500": "text-gray-900 dark:text-white",
    "text-gray-600": "text-gray-900 dark:text-white"
  },
  backgrounds: {
    "bg-gray-50": "bg-white dark:bg-black",
    "bg-gray-100": "bg-white dark:bg-black",
    "bg-gray-200": "bg-gray-100 dark:bg-gray-900"
  },
  borders: {
    "border-gray-200": "border-gray-400 dark:border-gray-600",
    "border-gray-300": "border-gray-500 dark:border-gray-500"
  }
};

/**
 * Create a complete accessibility configuration
 */
export function createAccessibilityConfig(options: {
  focusRing?: keyof typeof focusRingPresets | ClassValue;
  reducedMotion?: boolean;
  highContrast?: boolean;
}): AccessibilityConfig {
  const { focusRing = "default", reducedMotion = true, highContrast = true } = options;

  return {
    focusRing: {
      default:
        typeof focusRing === "string" && focusRing in focusRingPresets
          ? focusRingPresets[focusRing as keyof typeof focusRingPresets]
          : (focusRing as ClassValue),
      auto: true,
      variants: focusRingPresets
    },
    ...(reducedMotion && {
      reducedMotion: {
        replace: {
          ...reducedMotionPresets.animations,
          ...reducedMotionPresets.transitions,
          ...reducedMotionPresets.durations
        },
        auto: true
      }
    }),
    ...(highContrast && {
      highContrast: {
        colorMap: {
          ...highContrastPresets.text,
          ...highContrastPresets.backgrounds,
          ...highContrastPresets.borders
        },
        auto: true
      }
    }),
    screenReader: {
      srOnly: "sr-only",
      focusVisible:
        "focus-visible:not-sr-only focus-visible:absolute focus-visible:left-1 focus-visible:top-1"
    }
  };
}

/**
 * Global accessibility manager
 */
export const globalAccessibilityManager = new AccessibilityManager(
  createAccessibilityConfig({ focusRing: "default" })
);
