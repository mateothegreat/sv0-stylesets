/**
 * Test demonstrating global ThemeManager usage
 */
import { createStyleSet } from "./stylesets";
import { createThemeVariant, ThemeManager } from "./themes";
import type { ThemeConfig } from "./types";

console.log("=== GLOBAL THEMEMANAGER TEST ===\n");

// Step 1: Create themes
const base: ThemeConfig = {
  id: "base",
  name: "Base Theme",
  darkMode: false,
  tokens: {
    color: {
      primary: { value: "indigo-600", description: "Brand primary" },
      secondary: { value: "pink-600", description: "Brand secondary" }
    }
  }
};

const dark = createThemeVariant(base, "dark", {
  tokens: {
    color: {
      primary: "yellow-400",
      secondary: "purple-600"
    }
  }
});

// Step 2: Create GLOBAL ThemeManager (only once!)
const globalThemeManager = new ThemeManager([base, dark]);

console.log(
  "✅ Created global ThemeManager with themes:",
  globalThemeManager.getAllThemes().map((t) => t.id)
);

// Step 3: Create multiple StyleSets that share the SAME ThemeManager
const button = createStyleSet({
  base: "px-4 py-2 rounded",
  variants: {
    intent: {
      primary: "bg-{color.primary} text-white",
      secondary: "bg-{color.secondary} text-white"
    }
  },
  // ✅ Pass the global ThemeManager - no need to duplicate themes!
  themeManager: globalThemeManager
});

const card = createStyleSet({
  base: "p-6 rounded-lg shadow",
  variants: {
    variant: {
      primary: "border-2 border-{color.primary}",
      secondary: "border-2 border-{color.secondary}"
    }
  },
  // ✅ Same ThemeManager instance
  themeManager: globalThemeManager
});

// Step 4: Change theme globally - affects ALL stylesets
console.log("\n📍 Setting global theme to 'base-dark'");
globalThemeManager.setActiveTheme("base-dark");

const currentTheme = globalThemeManager.getActiveTheme();
console.log("Current theme:", currentTheme?.id);

// Step 5: Use stylesets - they automatically use the active global theme
console.log("\n🎨 Button with primary intent:");
const buttonResult = button({ intent: "primary", theme: currentTheme?.id });
console.log(buttonResult);
console.log("Contains yellow-400?", buttonResult.includes("yellow-400"));

console.log("\n🎨 Card with secondary variant:");
const cardResult = card({ variant: "secondary", theme: currentTheme?.id });
console.log(cardResult);
console.log("Contains purple-600?", cardResult.includes("purple-600"));

// Step 6: Switch theme globally
console.log("\n📍 Switching global theme to 'base'");
globalThemeManager.setActiveTheme("base");
const newTheme = globalThemeManager.getActiveTheme();

console.log("\n🎨 Button after theme switch:");
const buttonResult2 = button({ intent: "primary", theme: newTheme?.id });
console.log(buttonResult2);
console.log("Contains indigo-600?", buttonResult2.includes("indigo-600"));

console.log("\n✅ SUCCESS: One ThemeManager shared across multiple StyleSets!");
console.log("No need to duplicate theme definitions in each createStyleSet call.");
