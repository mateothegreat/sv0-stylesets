/**
 * Test file to verify theme token interpolation
 */
import { createStyleSet } from "./stylesets";
import { createThemeVariant } from "./themes";
import type { ThemeConfig } from "./types";

// Define base theme
const baseTheme: ThemeConfig = {
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

// Create dark variant
const darkTheme = createThemeVariant(baseTheme, "dark", {
  tokens: {
    color: {
      primary: "yellow-400"
    }
  }
});

console.log("Base theme ID:", baseTheme.id);
console.log("Dark theme ID:", darkTheme.id);
console.log("Dark theme primary color:", darkTheme.tokens?.color?.primary);

// Create styleset WITH themes registered
const styleset = createStyleSet({
  base: "flex items-center gap-2",
  variants: {
    intent: {
      primary: "bg-{color.primary} text-white"
    }
  },
  themes: {
    base: baseTheme,
    "base-dark": darkTheme
  }
});

// Test with base theme
const baseResult = styleset({ intent: "primary", theme: "base" });
console.log("\nBase theme result:");
console.log(baseResult);
console.log("Should contain: bg-indigo-600");
console.log("Contains indigo-600?", baseResult.includes("indigo-600"));

// Test with dark theme
const darkResult = styleset({ intent: "primary", theme: "base-dark" });
console.log("\nDark theme result:");
console.log(darkResult);
console.log("Should contain: bg-yellow-400");
console.log("Contains yellow-400?", darkResult.includes("yellow-400"));

// Test without theme (should not interpolate)
const noThemeResult = styleset({ intent: "primary" });
console.log("\nNo theme result:");
console.log(noThemeResult);
console.log("Should still contain placeholder: bg-{color.primary}");
