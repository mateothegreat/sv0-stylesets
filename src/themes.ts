import { TokenResolver } from "./tokens";
import type { ThemeConfig, TokenResolutionContext } from "./types";

/**
 * Deep merge utility for combining objects
 */
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };

  for (const key in source) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      result[key] = deepMerge((result[key] || {}) as any, source[key] as any);
    } else if (source[key] !== undefined) {
      result[key] = source[key] as any;
    }
  }

  return result;
}

/**
 * Compose multiple themes into a single theme configuration
 */
export function composeTheme(...themes: (ThemeConfig | Partial<ThemeConfig>)[]): ThemeConfig {
  if (themes.length === 0) {
    throw new Error("At least one theme must be provided to composeTheme");
  }

  const baseTheme = themes[0] as ThemeConfig;
  if (!baseTheme.id || !baseTheme.name) {
    throw new Error("Base theme must have id and name properties");
  }

  let composed = { ...baseTheme };

  // Merge each subsequent theme
  for (let i = 1; i < themes.length; i++) {
    const theme = themes[i];
    composed = deepMerge(composed, theme);
  }

  // Ensure composed theme has required properties
  return {
    ...composed,
    id: composed.id || "composed-theme",
    name: composed.name || "Composed Theme"
  };
}

/**
 * Create a theme variant with specific overrides
 */
export function createThemeVariant(
  baseTheme: ThemeConfig,
  variantName: string,
  overrides: Partial<ThemeConfig>
): ThemeConfig {
  return composeTheme(baseTheme, {
    ...overrides,
    id: variantName,
    name: variantName
  });
}

/**
 * Theme manager for handling multiple themes and switching
 */
export class ThemeManager {
  private themes = new Map<string, ThemeConfig>();
  private activeTheme?: ThemeConfig;
  private tokenResolver = new TokenResolver();
  private context: TokenResolutionContext = {};

  constructor(themes: ThemeConfig[] = []) {
    themes.forEach((theme) => this.registerTheme(theme));
  }

  /**
   * Register a theme
   */
  registerTheme(theme: ThemeConfig): void {
    this.themes.set(theme.id, theme);

    // Register theme tokens with resolver
    if (theme.tokens) {
      Object.entries(theme.tokens).forEach(([category, tokens]) => {
        if (tokens) {
          this.tokenResolver.register(category, tokens);
        }
      });
    }
  }

  /**
   * Get a registered theme by ID
   */
  getTheme(id: string): ThemeConfig | undefined {
    return this.themes.get(id);
  }

  /**
   * Get all registered themes
   */
  getAllThemes(): ThemeConfig[] {
    return Array.from(this.themes.values());
  }

  /**
   * Set the active theme
   */
  setActiveTheme(themeId?: string): boolean {
    const theme = themeId ? this.themes.get(themeId) : undefined;
    if (!theme) {
      return false;
    }

    this.activeTheme = theme;
    this.context = { ...this.context, theme };

    // Apply theme to document if in browser
    if (typeof document !== "undefined") {
      this.applyThemeToDocument(theme);
    }

    return true;
  }

  /**
   * Get the currently active theme
   */
  getActiveTheme(): ThemeConfig | undefined {
    return this.activeTheme;
  }

  /**
   * Update user preferences for accessibility
   */
  setPreferences(preferences: NonNullable<TokenResolutionContext["preferences"]>): void {
    this.context = { ...this.context, preferences };
  }

  /**
   * Get current resolution context
   */
  getContext(): TokenResolutionContext {
    return this.context;
  }

  /**
   * Resolve tokens using current theme and context
   */
  resolveToken(reference: string): string {
    const result = this.tokenResolver.resolve(reference, this.context);
    return result.value;
  }

  /**
   * Create a theme-aware class resolver
   */
  createResolver() {
    return {
      resolve: (reference: string) => this.resolveToken(reference),
      hasTokens: (value: string) => this.tokenResolver.hasTokenReferences(value),
      replaceTokens: (value: string) => {
        const result = this.tokenResolver.replaceTokens(value, this.context);
        return result.value;
      }
    };
  }

  /**
   * Compose multiple themes and register the result
   */
  composeAndRegister(newId: string, newName: string, ...themeIds: string[]): ThemeConfig | null {
    const themes = themeIds.map((id) => this.themes.get(id)).filter(Boolean) as ThemeConfig[];

    if (themes.length === 0) {
      return null;
    }

    // Create base theme with new identity
    const baseTheme: ThemeConfig = {
      id: newId,
      name: newName
    };

    // Compose with all provided themes
    const composed = composeTheme(baseTheme, ...themes);

    // Ensure the final composed theme has the correct ID and name
    composed.id = newId;
    composed.name = newName;

    this.registerTheme(composed);

    return composed;
  }

  private applyThemeToDocument(theme: ThemeConfig): void {
    const root = document.documentElement;

    // Apply CSS variables
    if (theme.cssVariables) {
      Object.entries(theme.cssVariables).forEach(([property, value]) => {
        root.style.setProperty(property, value);
      });
    }

    // Apply base classes
    if (theme.base) {
      const baseClasses = typeof theme.base === "string" ? theme.base.split(" ") : [];
      baseClasses.forEach((className) => {
        if (className) root.classList.add(className);
      });
    }

    // Set data attributes
    root.setAttribute("data-theme", theme.id);
    if (theme.darkMode) {
      root.setAttribute("data-color-scheme", "dark");
    } else {
      root.setAttribute("data-color-scheme", "light");
    }
  }
}

/**
 * Default theme presets
 */
export const defaultThemes = {
  /**
   * Light theme with modern neutral palette
   */
  light: (): ThemeConfig => ({
    id: "light",
    name: "light",
    darkMode: false,
    tokens: {
      color: {
        primary: { value: "blue-600", description: "Primary brand color" },
        secondary: { value: "gray-600", description: "Secondary color" },
        accent: { value: "indigo-600", description: "Accent color" },
        success: { value: "green-600", description: "Success state color" },
        warning: { value: "yellow-600", description: "Warning state color" },
        error: { value: "red-600", description: "Error state color" },
        background: { value: "white", description: "Background color" },
        surface: { value: "gray-50", description: "Surface color" },
        text: { value: "gray-900", description: "Primary text color" },
        textMuted: { value: "gray-600", description: "Muted text color" }
      },
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "3rem"
      },
      border: {
        default: { value: "border-gray-200", description: "Default border" },
        focus: { value: "border-{color.primary}", description: "Focus border" }
      }
    },
    accessibility: {
      focusRing: {
        default: "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        auto: true
      },
      reducedMotion: {
        replace: {
          "animate-spin": "animate-none",
          "transition-all": "transition-none"
        },
        auto: true
      }
    },
    cssVariables: {
      "--theme-primary": "#2563eb",
      "--theme-background": "#ffffff",
      "--theme-text": "#111827"
    }
  }),

  /**
   * Dark theme with high contrast
   */
  dark: (): ThemeConfig => ({
    id: "dark",
    name: "dark",
    darkMode: true,
    tokens: {
      color: {
        primary: { value: "blue-400", description: "Primary brand color" },
        secondary: { value: "gray-400", description: "Secondary color" },
        accent: { value: "indigo-400", description: "Accent color" },
        success: { value: "green-400", description: "Success state color" },
        warning: { value: "yellow-400", description: "Warning state color" },
        error: { value: "red-400", description: "Error state color" },
        background: { value: "gray-900", description: "Background color" },
        surface: { value: "gray-800", description: "Surface color" },
        text: { value: "gray-100", description: "Primary text color" },
        textMuted: { value: "gray-400", description: "Muted text color" }
      },
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "3rem"
      },
      border: {
        default: { value: "border-gray-700", description: "Default border" },
        focus: { value: "border-{color.primary}", description: "Focus border" }
      }
    },
    accessibility: {
      focusRing: {
        default: "focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900",
        auto: true
      },
      reducedMotion: {
        replace: {
          "animate-spin": "animate-none",
          "transition-all": "transition-none"
        },
        auto: true
      },
      highContrast: {
        colorMap: {
          "text-gray-400": "text-gray-100",
          "bg-gray-800": "bg-gray-900"
        },
        auto: false
      }
    },
    cssVariables: {
      "--theme-primary": "#60a5fa",
      "--theme-background": "#111827",
      "--theme-text": "#f9fafb"
    }
  })
};

/**
 * Global theme manager instance
 */
export const globalThemeManager = new ThemeManager([defaultThemes.light(), defaultThemes.dark()]);
