/**
 * User's Corrected Implementation
 *
 * This shows the proper way to use a global ThemeManager with createStyleSet
 * to avoid theme duplication.
 */

// ============================================================================
// FILE 1: themes/base.ts
// ============================================================================
import type { ThemeConfig } from "@sv0/stylesets";
import { ThemeManager, createThemeVariant } from "@sv0/stylesets";

export const base: ThemeConfig = {
  id: "base",
  name: "Base Theme",
  darkMode: false,
  tokens: {
    border: {
      primary: "dark:border-zinc-800 dark:bg-zinc-900"
    },
    color: {
      primary: { value: "indigo-600", description: "Brand primary" },
      secondary: { value: "pink-600", description: "Brand secondary" },
      accent: { value: "orange-500", description: "Brand accent" },
      background: "white",
      surface: "gray-50",
      text: "gray-900",
      textMuted: "gray-600"
    },
    spacing: {
      xs: "2px",
      sm: "4px",
      md: "8px",
      lg: "16px",
      xl: "32px"
    }
  },
  accessibility: {
    focusRing: {
      default: "focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
      auto: true
    }
  },
  cssVariables: {
    "--theme-primary": "#4f46e5",
    "--theme-background": "#ffffff",
    "--theme-text": "#111827"
  }
};

export const dark = createThemeVariant(base, "dark", {
  id: "dark",
  name: "Dark Theme",
  darkMode: true,
  tokens: {
    color: {
      primary: "yellow-400",
      background: "black",
      text: "white",
      surface: "gray-900"
    }
  },
  cssVariables: {
    "--theme-primary": "#fbbf24",
    "--theme-background": "#000000",
    "--theme-text": "#ffffff"
  }
});

// ✅ Create global ThemeManager ONCE
export const themeManager = new ThemeManager([base, dark]);

// ============================================================================
// FILE 2: components/toolbar/styleset.ts
// ============================================================================
import { themeManager } from "../themes/base";
import { createStyleSet } from "@sv0/stylesets";

// ✅ CORRECT: Pass the global ThemeManager instance
export const styleset = createStyleSet({
  base: "flex items-center gap-2 rounded-xl",
  variants: {
    intent: {
      primary: "bg-{color.primary} text-white hover:bg-blue-700 active:bg-blue-800",
      secondary: "bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800",
      success: "bg-green-600 text-white hover:bg-green-700 active:bg-green-800",
      danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
      warning: "bg-yellow-600 text-white hover:bg-yellow-700 active:bg-yellow-800",
      ghost: "bg-transparent hover:bg-gray-100 active:bg-gray-200"
    },
    border: {
      primary: "dark:border-{color.primary} dark:bg-zinc-900"
    },
    size: {
      xs: "h-7 px-2 text-xs rounded",
      sm: "h-8 px-3 text-sm rounded",
      md: "h-10 px-4 text-base rounded-md",
      lg: "h-12 px-6 text-lg rounded-lg",
      xl: "h-14 px-8 text-xl rounded-lg"
    },
    width: {
      compact: "relative w-fit",
      full: "w-full"
    }
  },
  defaultVariants: {
    intent: "primary",
    border: "primary",
    size: "md",
    width: "compact"
  },

  // ✅ SOLUTION: Pass the global ThemeManager instance
  // No need to duplicate theme definitions!
  themeManager: themeManager,

  accessibility: {
    focusRing: {
      default: "focus:ring-2 focus:ring-offset-2",
      variants: {
        primary: "focus:ring-blue-500",
        secondary: "focus:ring-gray-500",
        success: "focus:ring-green-500",
        danger: "focus:ring-red-500"
      },
      auto: true
    },
    reducedMotion: {
      replace: {
        "transition-all": "transition-none"
      },
      auto: true
    }
  }
});

// ============================================================================
// USAGE EXAMPLE
// ============================================================================

// Set active theme globally
themeManager.setActiveTheme("base-dark");

// Get current theme
const currentTheme = themeManager.getActiveTheme();

console.log("Current theme:", currentTheme?.id); // "base-dark"
console.log("Primary color:", currentTheme?.tokens.color.primary); // "yellow-400"

// Use styleset with theme
const result = styleset({
  intent: "primary",
  border: "primary",
  theme: currentTheme?.id
});

console.log(result);
// ✅ Output: "flex items-center gap-2 bg-yellow-400 text-white hover:bg-blue-700 active:bg-blue-800 dark:border-yellow-400 dark:bg-zinc-900 h-10 px-4 text-base rounded-md relative w-fit focus:ring-2 focus:ring-offset-2"

// ============================================================================
// BENEFITS OF THIS APPROACH
// ============================================================================

/*
✅ ADVANTAGES:

1. Single Source of Truth
   - Themes defined ONCE in theme-config.ts
   - No duplication across StyleSets

2. Centralized Control
   - Change theme globally with themeManager.setActiveTheme()
   - All StyleSets automatically use the new theme

3. Less Code
   - No need for `themes: { base, dark }` in every createStyleSet call
   - Just pass `themeManager: themeManager`

4. Better Performance
   - Single ThemeManager instance shared across all StyleSets
   - Reduced memory usage

5. Easier Maintenance
   - Add/remove themes in one place
   - All components automatically get new themes

COMPARISON:

❌ OLD WAY (Redundant):
-------------------------------------------
// In button.ts
const button = createStyleSet({
  themes: { base, dark }  // Duplicate
});

// In card.ts
const card = createStyleSet({
  themes: { base, dark }  // Duplicate again
});

// In toolbar.ts
const toolbar = createStyleSet({
  themes: { base, dark }  // Duplicate again!
});

✅ NEW WAY (DRY):
-------------------------------------------
// In theme-config.ts (ONCE)
export const themeManager = new ThemeManager([base, dark]);

// In button.ts
const button = createStyleSet({
  themeManager: themeManager  // Share instance
});

// In card.ts
const card = createStyleSet({
  themeManager: themeManager  // Share instance
});

// In toolbar.ts
const toolbar = createStyleSet({
  themeManager: themeManager  // Share instance
});
*/
