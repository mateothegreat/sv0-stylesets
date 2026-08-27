/**
 * Complete example demonstrating all StyleSets features
 *
 * This example shows:
 *
 * - Enhanced StyleSet creation with tokens and accessibility
 * - Theme composition and management
 * - Token resolution and runtime customization
 * - Accessibility features (focus rings, reduced motion, high contrast)
 * - Backward compatibility with existing createStyleSet API
 */

import {
  composeTheme,
  createAccessibilityConfig,
  createEnhancedStyleSet,
  createStyleSet,
  createThemeVariant,
  defaultThemes,
  registerTokens,
  resolveToken,
  ThemeManager
} from "./index";

// =============================================================================
// 1. BASIC USAGE (Backward Compatible)
// =============================================================================

console.log("=== BASIC USAGE ===");

const button = createStyleSet({
  base: "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  variants: {
    intent: {
      primary: "bg-blue-600 text-white hover:bg-blue-700",
      secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
      danger: "bg-red-600 text-white hover:bg-red-700"
    },
    size: {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4",
      lg: "h-12 px-6 text-lg"
    }
  },
  defaultVariants: {
    intent: "primary",
    size: "md"
  }
});

console.log("Primary button:", button());
console.log("Secondary large button:", button({ intent: "secondary", size: "lg" }));

// =============================================================================
// 2. ENHANCED USAGE WITH TOKENS
// =============================================================================

console.log("\n=== ENHANCED USAGE WITH TOKENS ===");

const enhancedButton = createEnhancedStyleSet({
  base: "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  variants: {
    intent: {
      primary: "bg-{color.primary} text-white hover:bg-{color.primaryHover}",
      secondary: "bg-{color.secondary} text-{color.text} hover:bg-{color.secondaryHover}",
      danger: "bg-{color.danger} text-white hover:bg-{color.dangerHover}"
    },
    size: {
      sm: "h-{spacing.sm} px-{spacing.xs} text-sm",
      md: "h-{spacing.md} px-{spacing.sm}",
      lg: "h-{spacing.lg} px-{spacing.md} text-lg"
    }
  },
  defaultVariants: {
    intent: "primary",
    size: "md"
  },
  tokens: {
    color: {
      primary: "blue-600",
      primaryHover: "blue-700",
      secondary: "gray-200",
      secondaryHover: "gray-300",
      danger: "red-600",
      dangerHover: "red-700",
      text: "gray-900"
    },
    spacing: {
      xs: "0.75rem",
      sm: "2rem",
      md: "2.5rem",
      lg: "3rem"
    }
  },
  accessibility: createAccessibilityConfig({
    focusRing: "primary",
    reducedMotion: true,
    highContrast: true
  })
});

console.log("Enhanced primary button:", enhancedButton());
console.log("Enhanced secondary button:", enhancedButton({ intent: "secondary" }));

// =============================================================================
// 3. THEME COMPOSITION
// =============================================================================

console.log("\n=== THEME COMPOSITION ===");

// Create custom themes
const lightTheme = defaultThemes.light();
const darkTheme = defaultThemes.dark();

// Create a high contrast variant
const highContrastTheme = createThemeVariant(darkTheme, "high-contrast", {
  tokens: {
    color: {
      primary: "yellow-400",
      background: "black",
      text: "white"
    }
  },
  cssVariables: {
    "--theme-primary": "#fbbf24",
    "--theme-background": "#000000",
    "--theme-text": "#ffffff"
  }
});

// Compose themes
const customTheme = composeTheme(lightTheme, {
  name: "Custom Corporate Theme",
  tokens: {
    color: {
      primary: "indigo-600",
      accent: "orange-500"
    }
  }
});

console.log("Light theme ID:", lightTheme.id);
console.log("High contrast theme ID:", highContrastTheme.id);
console.log("Custom theme name:", customTheme.name);

// =============================================================================
// 4. THEME MANAGEMENT
// =============================================================================

console.log("\n=== THEME MANAGEMENT ===");

const themeManager = new ThemeManager([lightTheme, darkTheme, highContrastTheme]);

// Switch themes
themeManager.setActiveTheme("dark");
console.log("Active theme:", themeManager.getActiveTheme()?.name);

// Resolve tokens
const resolver = themeManager.createResolver();
console.log("Primary color token:", resolver.resolve("color.primary"));
console.log("Has token references:", resolver.hasTokens("{color.primary}"));
console.log("Replace tokens:", resolver.replaceTokens("bg-{color.primary} text-{color.text}"));

// =============================================================================
// 5. ACCESSIBILITY FEATURES
// =============================================================================

console.log("\n=== ACCESSIBILITY FEATURES ===");

const accessibleComponent = createEnhancedStyleSet({
  base: "component-base",
  variants: {
    interactive: {
      true: "cursor-pointer hover:bg-gray-100 focus:outline-none",
      false: "cursor-default"
    }
  },
  accessibility: {
    focusRing: {
      default: "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
      auto: true
    },
    reducedMotion: {
      replace: {
        "hover:bg-gray-100": "hover:bg-gray-200",
        "transition-colors": "transition-none"
      },
      auto: true
    },
    highContrast: {
      colorMap: {
        "bg-gray-100": "bg-white",
        "text-gray-600": "text-black"
      },
      auto: true
    }
  }
});

// Test with different accessibility settings
console.log("Interactive component:", accessibleComponent({ interactive: true }));
console.log("Non-interactive component:", accessibleComponent({ interactive: false }));

// Test with accessibility disabled
console.log(
  "Without accessibility:",
  accessibleComponent({ interactive: true, accessibility: false })
);

// =============================================================================
// 6. RECIPES AND COMPOSITION
// =============================================================================

console.log("\n=== RECIPES AND COMPOSITION ===");

const layout = createEnhancedStyleSet({
  recipes: {
    container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    card: "bg-white rounded-lg shadow-md border border-gray-200",
    title: "text-2xl font-bold text-gray-900",
    subtitle: "text-lg text-gray-600",
    prose: "prose prose-lg max-w-none"
  },
  tokens: {
    layout: {
      maxWidth: "7xl",
      padding: "1rem",
      radius: "lg"
    }
  }
});

console.log("Container:", layout.container.toString());
console.log("Card with padding:", layout.card.with("p-6"));
console.log("Composed header:", layout.select("container", "title", "mb-4"));

// =============================================================================
// 7. GLOBAL TOKEN REGISTRATION
// =============================================================================

console.log("\n=== GLOBAL TOKEN REGISTRATION ===");

// Register global design tokens
registerTokens("brand", {
  primary: "#3b82f6",
  secondary: "#6b7280",
  accent: "#f59e0b"
});

registerTokens("typography", {
  headingFont: "Inter, sans-serif",
  bodyFont: "system-ui, sans-serif",
  monoFont: "Monaco, monospace"
});

// Use global tokens
const resolvedBrand = resolveToken("brand.primary");
const resolvedFont = resolveToken("typography.headingFont");

console.log("Brand primary color:", resolvedBrand.value);
console.log("Heading font:", resolvedFont.value);

// =============================================================================
// 8. ADVANCED TYPE SAFETY
// =============================================================================

console.log("\n=== ADVANCED TYPE SAFETY ===");

// Type-safe variant props extraction
type ButtonProps = typeof enhancedButton extends (props?: infer P) => string
  ? Omit<P, "class" | "className" | "theme" | "accessibility">
  : never;

// This will have full TypeScript autocompletion and validation
const buttonProps: ButtonProps = {
  intent: "primary", // ✓ Type-safe
  size: "lg" // ✓ Type-safe
  // invalid: 'test'  // ✗ TypeScript error
};

console.log("Type-safe button:", enhancedButton(buttonProps));

// Expose variant keys for dynamic usage
console.log("Available button variants:", Object.keys(enhancedButton.variants));

// =============================================================================
// SUMMARY
// =============================================================================

console.log("\n=== SUMMARY ===");
console.log("✅ Backward compatibility maintained");
console.log("✅ Token resolution with placeholders");
console.log("✅ Theme composition and management");
console.log("✅ Accessibility enhancements");
console.log("✅ Recipe-based styling");
console.log("✅ Global token registry");
console.log("✅ Full type safety preserved");
console.log("✅ Runtime customization support");

export {
  accessibleComponent,
  button,
  customTheme,
  darkTheme,
  enhancedButton,
  layout,
  lightTheme,
  themeManager
};
