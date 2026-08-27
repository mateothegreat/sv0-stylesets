/**
 * Example: Type-safe theme handling with createStyleSet() and ThemeManager
 *
 * This demonstrates how to extract and constrain theme IDs for type-safe theme switching
 */

import { createStyleSet, ThemeManager, type ExtractThemeIds, type ExtractThemeIdsFromArray } from "./index";

// =============================================================================
// METHOD 1: Type-safe themes with createStyleSet()
// =============================================================================

// Define themes configuration with 'as const' for literal types
const myThemes = {
  light: {
    tokens: {
      color: {
        primary: "blue-600",
        background: "white"
      }
    }
  },
  dark: {
    tokens: {
      color: {
        primary: "blue-400",
        background: "gray-900"
      }
    }
  },
  highContrast: {
    tokens: {
      color: {
        primary: "yellow-400",
        background: "black"
      }
    }
  }
} as const;

// Extract theme IDs as a union type
type MyThemeIds = ExtractThemeIds<typeof myThemes>;
// Result: 'light' | 'dark' | 'highContrast'

// Create a StyleSet with theme type inference
const button = createStyleSet({
  base: "px-4 py-2 rounded",
  variants: {
    intent: {
      primary: "bg-{color.primary}",
      secondary: "bg-gray-200"
    }
  },
  themes: myThemes
});

// ✅ Type-safe theme usage - autocomplete works!
button({ theme: "light" });
button({ theme: "dark" });
button({ theme: "highContrast" });

// ❌ This would be a TypeScript error:
// button({ theme: "unknown" });

// Create a type-safe wrapper component
type ButtonProps = {
  intent?: "primary" | "secondary";
  theme?: MyThemeIds; // <-- Type-constrained theme prop
  className?: string;
};

function ButtonComponent(props: ButtonProps) {
  return button({
    intent: props.intent,
    theme: props.theme, // Type-safe!
    class: props.className
  });
}

// ✅ Usage with autocompletion
ButtonComponent({ theme: "dark" });
ButtonComponent({ theme: "light" });

// =============================================================================
// METHOD 2: Type-safe themes with ThemeManager
// =============================================================================

// Define theme configurations as const array
const themeConfigs = [
  {
    id: "ocean" as const,
    name: "Ocean Blue",
    tokens: {
      color: {
        primary: "blue-500",
        background: "blue-50"
      }
    }
  },
  {
    id: "forest" as const,
    name: "Forest Green",
    tokens: {
      color: {
        primary: "green-600",
        background: "green-50"
      }
    }
  },
  {
    id: "sunset" as const,
    name: "Sunset Orange",
    tokens: {
      color: {
        primary: "orange-500",
        background: "orange-50"
      }
    }
  }
] as const;

// Extract theme IDs from the array
type AppThemeIds = ExtractThemeIdsFromArray<typeof themeConfigs>;
// Result: 'ocean' | 'forest' | 'sunset'

// Create ThemeManager with theme configs
const themeManager = new ThemeManager(themeConfigs);

// Create a type-safe theme switcher function
function setAppTheme(themeId: AppThemeIds): boolean {
  return themeManager.setActiveTheme(themeId);
}

// ✅ Type-safe theme switching
setAppTheme("ocean");
setAppTheme("forest");
setAppTheme("sunset");

// ❌ This would be a TypeScript error:
// setAppTheme("invalid");

// Create a StyleSet that uses the shared ThemeManager
const card = createStyleSet({
  base: "rounded-lg shadow p-4",
  variants: {
    elevated: {
      true: "shadow-lg",
      false: "shadow-sm"
    }
  },
  tokens: {
    color: {
      primary: "gray-600",
      background: "white"
    }
  },
  themeManager
});

// =============================================================================
// METHOD 3: Creating a global theme system
// =============================================================================

// Define your app's theme registry
const APP_THEMES = {
  default: {
    tokens: {
      color: {
        primary: "indigo-600",
        secondary: "gray-600",
        background: "white",
        text: "gray-900"
      }
    }
  },
  corporate: {
    tokens: {
      color: {
        primary: "blue-700",
        secondary: "slate-600",
        background: "slate-50",
        text: "slate-900"
      }
    }
  },
  darkMode: {
    tokens: {
      color: {
        primary: "indigo-400",
        secondary: "gray-400",
        background: "gray-900",
        text: "gray-100"
      }
    },
    darkMode: true
  }
} as const;

// Export the theme ID type for use across your app
export type AppTheme = ExtractThemeIds<typeof APP_THEMES>;
// Result: 'default' | 'corporate' | 'darkMode'

// Create StyleSets that all use the same theme type
const heading = createStyleSet({
  base: "font-bold text-{color.text}",
  variants: {
    size: {
      sm: "text-lg",
      md: "text-2xl",
      lg: "text-4xl"
    }
  },
  themes: APP_THEMES
});

const paragraph = createStyleSet({
  base: "text-{color.text}",
  variants: {
    muted: {
      true: "text-{color.secondary}",
      false: "text-{color.text}"
    }
  },
  themes: APP_THEMES
});

// Create a centralized theme context
class AppThemeContext {
  #currentTheme: AppTheme = "default";

  setTheme(theme: AppTheme): void {
    this.#currentTheme = theme;
    // Apply theme to all components
    document.documentElement.setAttribute("data-theme", theme);
  }

  getTheme(): AppTheme {
    return this.#currentTheme;
  }

  // Type-safe theme checker
  isTheme(theme: AppTheme): boolean {
    return this.#currentTheme === theme;
  }
}

const themeContext = new AppThemeContext();

// ✅ All theme operations are now type-safe
themeContext.setTheme("corporate");
themeContext.setTheme("darkMode");

heading({ theme: themeContext.getTheme() });
paragraph({ theme: themeContext.getTheme() });

// =============================================================================
// METHOD 4: Dynamic theme registration with type assertion
// =============================================================================

// For cases where themes are loaded dynamically, use a branded type
const DYNAMIC_THEME_BRAND = Symbol("DynamicTheme");

type DynamicThemeId = string & { [DYNAMIC_THEME_BRAND]: true };

class DynamicThemeManager {
  private themes = new Map<string, any>();

  registerTheme(id: string, config: any): DynamicThemeId {
    this.themes.set(id, config);
    return id as DynamicThemeId;
  }

  setTheme(id: DynamicThemeId): void {
    // Theme setting logic
  }
}

const dynamicManager = new DynamicThemeManager();

// Register themes and get type-safe IDs
const theme1 = dynamicManager.registerTheme("custom1", {});
const theme2 = dynamicManager.registerTheme("custom2", {});

// ✅ Can only use registered theme IDs
dynamicManager.setTheme(theme1);
dynamicManager.setTheme(theme2);

// =============================================================================
// SUMMARY & BEST PRACTICES
// =============================================================================

/**
 * Best Practices:
 *
 * 1. Always use 'as const' when defining theme objects or arrays
 *    - This preserves literal types instead of widening to string
 *
 * 2. For createStyleSet():
 *    - Define themes object outside with 'as const'
 *    - Use ExtractThemeIds<typeof themes> to get the union type
 *    - Pass themes to createStyleSet and TypeScript will infer the rest
 *
 * 3. For ThemeManager:
 *    - Define theme configs as const array with 'as const'
 *    - Use ExtractThemeIdsFromArray<typeof configs> to extract IDs
 *    - Create type-safe wrapper functions for theme operations
 *
 * 4. Share theme types across your application:
 *    - Export a single AppTheme type
 *    - Use it consistently in all components
 *    - Create a centralized theme context/store
 *
 * 5. For Svelte 5 integration:
 *    - Store the current theme in $state()
 *    - Use $derived() for theme-dependent computed values
 *    - Pass theme type to component props
 */

export {
  APP_THEMES,
  AppThemeContext,
  button,
  ButtonComponent,
  card,
  dynamicManager,
  heading,
  myThemes,
  paragraph,
  setAppTheme,
  themeConfigs,
  themeContext,
  themeManager
};

// Example type exports for other modules
export type { AppTheme, AppThemeIds, ButtonProps, DynamicThemeId, MyThemeIds };
