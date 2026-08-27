import { createStyleSet } from "./stylesets";

/**
 * Example: Smart Default Resolution in variants.select()
 *
 * Demonstrates how the select() method intelligently resolves defaults with priority:
 * 1. Explicit value (e.g., "heading.colors.muted")
 * 2. Value from defaultVariants
 * 3. Value from 'default' key in variant definition
 * 4. Skip if none of the above
 */

// Example from user's requirements
export const groupStyleSet = createStyleSet({
  base: ["flex flex-col"],
  variants: {
    spacing: {
      none: "",
      sm: "gap-0.5",
      default: "gap-1",
      lg: "gap-2"
    },
    padding: {
      none: "",
      sm: "p-1",
      default: "p-1.5",
      lg: "p-2"
    },
    heading: {
      colors: {
        default: "bg-popover-label",
        muted: "bg-muted",
        accent: "bg-accent"
      },
      spacing: {
        none: "",
        sm: "ml-2",
        default: "h-6 flex items-center text-sm text-muted-foreground select-none",
        lg: "ml-4"
      }
    }
  },
  defaultVariants: {
    heading: {
      spacing: "lg"
    }
  }
});

// ============================================================================
// PARENT VARIANT SELECTION
// ============================================================================

// Selecting parent "heading" returns all child defaults
const headingDefaults = groupStyleSet.variants.select("heading");
console.log("Parent 'heading' selection:", headingDefaults);
// Result: "bg-popover-label ml-4"
// - heading.colors uses 'default' key → "bg-popover-label"
// - heading.spacing uses defaultVariants → "lg" → "ml-4"

// ============================================================================
// EXPLICIT VALUE vs DEFAULT
// ============================================================================

// Explicit value takes highest priority
const explicitColor = groupStyleSet.variants.select("heading.colors.muted");
console.log("Explicit value:", explicitColor);
// Result: "bg-muted"

// No value provided - uses defaults
const implicitColor = groupStyleSet.variants.select("heading.colors");
console.log("Implicit (default) value:", implicitColor);
// Result: "bg-popover-label" (from 'default' key)

// ============================================================================
// PRIORITY DEMONSTRATION
// ============================================================================

// Priority 1: defaultVariants (when specified)
const spacingWithDefaultVariants = groupStyleSet.variants.select("heading.spacing");
console.log("Priority 1 (defaultVariants):", spacingWithDefaultVariants);
// Result: "ml-4" (from defaultVariants.heading.spacing = "lg")

// Priority 2: 'default' key (when no defaultVariants)
const spacingWithDefaultKey = groupStyleSet.variants.select("spacing");
console.log("Priority 2 ('default' key):", spacingWithDefaultKey);
// Result: "gap-1" (from spacing.default key, no defaultVariants.spacing)

// ============================================================================
// COMPLEX EXAMPLE: Multiple Selection Types
// ============================================================================

export const advancedStyleSet = createStyleSet({
  variants: {
    layout: {
      container: {
        size: {
          default: "max-w-md",
          sm: "max-w-sm",
          lg: "max-w-lg",
          xl: "max-w-xl"
        },
        padding: {
          default: "p-4",
          none: "",
          comfortable: "p-6"
        }
      },
      flex: {
        direction: {
          default: "flex-col",
          row: "flex-row"
        },
        align: {
          default: "items-start",
          center: "items-center",
          end: "items-end"
        }
      }
    }
  },
  defaultVariants: {
    layout: {
      container: {
        size: "lg" // Overrides 'default' key
      },
      flex: {
        direction: "row" // Overrides 'default' key
      }
    }
  }
});

// Select entire "layout" parent - gets all nested defaults
const allLayoutDefaults = advancedStyleSet.variants.select("layout");
console.log("All layout defaults:", allLayoutDefaults);
// Result: "max-w-lg p-4 flex-row items-start"
// - container.size: uses defaultVariants → "lg" → "max-w-lg"
// - container.padding: uses 'default' key → "p-4"
// - flex.direction: uses defaultVariants → "row" → "flex-row"
// - flex.align: uses 'default' key → "items-start"

// Select specific nested parent "layout.container"
const containerDefaults = advancedStyleSet.variants.select("layout.container");
console.log("Container defaults:", containerDefaults);
// Result: "max-w-lg p-4"

// Select with explicit values
const explicitLayout = advancedStyleSet.variants.select(
  "layout.container.size.xl",
  "layout.container.padding.comfortable",
  "layout.flex.align.center"
);
console.log("Explicit values:", explicitLayout);
// Result: "max-w-xl p-6 items-center"

// ============================================================================
// PRACTICAL USE CASE: Component Styling
// ============================================================================

export const buttonStyleSet = createStyleSet({
  base: "inline-flex items-center justify-center font-medium transition-colors",
  variants: {
    appearance: {
      intent: {
        default: "bg-blue-500 text-white hover:bg-blue-600",
        primary: "bg-green-500 text-white hover:bg-green-600",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
        danger: "bg-red-500 text-white hover:bg-red-600"
      },
      variant: {
        default: "",
        outline: "bg-transparent border-2",
        ghost: "bg-transparent hover:bg-opacity-10"
      }
    },
    sizing: {
      size: {
        default: "px-4 py-2 text-base",
        xs: "px-2 py-1 text-xs",
        sm: "px-3 py-1.5 text-sm",
        lg: "px-5 py-2.5 text-lg",
        xl: "px-6 py-3 text-xl"
      },
      rounded: {
        default: "rounded-md",
        none: "rounded-none",
        sm: "rounded-sm",
        full: "rounded-full"
      }
    }
  },
  defaultVariants: {
    sizing: {
      rounded: "full" // Custom default different from 'default' key
    }
  }
});

// Get all appearance defaults (uses 'default' keys)
const defaultAppearance = buttonStyleSet.variants.select("appearance");
console.log("Default appearance:", defaultAppearance);
// Result: "bg-blue-500 text-white hover:bg-blue-600"

// Get all sizing defaults (mix of defaultVariants and 'default' keys)
const defaultSizing = buttonStyleSet.variants.select("sizing");
console.log("Default sizing:", defaultSizing);
// Result: "px-4 py-2 text-base rounded-full"
// - size: 'default' key → "px-4 py-2 text-base"
// - rounded: defaultVariants → "full" → "rounded-full"

// Get complete default button styles
const defaultButton = buttonStyleSet.variants.select("appearance", "sizing");
console.log("Default button:", defaultButton);
// Result: "bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 text-base rounded-full"

// Custom button with explicit values
const customButton = buttonStyleSet.variants.select(
  "appearance.intent.danger",
  "appearance.variant.outline",
  "sizing.size.lg"
  // sizing.rounded will use defaultVariants → "full"
);
console.log("Custom button:", customButton);
// Result includes: bg-red-500, border-2, px-5 py-2.5 text-lg, rounded-full

// ============================================================================
// EDGE CASES
// ============================================================================

export const edgeCaseStyleSet = createStyleSet({
  variants: {
    optional: {
      none: "",
      default: "", // Empty string default
      some: "text-base"
    },
    noDefault: {
      a: "variant-a",
      b: "variant-b"
      // No 'default' key and no defaultVariants
    }
  }
});

// Empty string default is still used
const emptyDefault = edgeCaseStyleSet.variants.select("optional");
console.log("Empty default:", emptyDefault);
// Result: "" (empty string from 'default' key)

// No default available - skipped
const noDefault = edgeCaseStyleSet.variants.select("noDefault");
console.log("No default:", noDefault);
// Result: "" (no default found, skipped)

console.log("\n✅ All examples completed!");