import { createStyleSet } from "./stylesets";

// Example demonstrating the new object selector functionality
const groupStyleSet = createStyleSet({
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
        default: "ml-3",
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

// ========================================
// String selectors (existing functionality)
// ========================================

// Select all child defaults for a parent variant
const withSelectorString = groupStyleSet.variants.select("heading");
console.log("String selector (parent):", withSelectorString);
// Result: "bg-popover-label ml-4"

// Select specific values using dot notation
const withDotNotation = groupStyleSet.variants.select("heading.colors.muted", "spacing.sm");
console.log("Dot notation:", withDotNotation);
// Result: "bg-muted gap-0.5"

// ========================================
// Object selectors (NEW functionality)
// ========================================

// Select using object notation
const withObjectSelector = groupStyleSet.variants.select({
  heading: {
    colors: "muted"
  }
});
console.log("Object selector:", withObjectSelector);
// Result: "bg-muted ml-4" (includes default for heading.spacing)

// Mix object and string selectors
const withMixedSelectors = groupStyleSet.variants.select(
  {
    heading: {
      colors: "muted"
    }
  },
  "spacing.sm",
  "padding"
);
console.log("Mixed selectors:", withMixedSelectors);
// Result: "bg-muted ml-4 gap-0.5 p-1.5"

// Multiple object selectors
const withMultipleObjects = groupStyleSet.variants.select(
  {
    heading: {
      colors: "accent",
      spacing: "sm"
    }
  },
  {
    spacing: "lg",
    padding: "sm"
  }
);
console.log("Multiple object selectors:", withMultipleObjects);
// Result: "bg-accent ml-2 gap-2 p-1"

// ========================================
// Type-safe object selectors
// ========================================

// TypeScript will autocomplete and validate the variant values
const typeSafeSelector = groupStyleSet.variants.select({
  spacing: "sm",        // ✓ Valid value
  padding: "lg",        // ✓ Valid value
  heading: {
    colors: "accent",   // ✓ Valid nested value
    spacing: "default"  // ✓ Valid nested value
  }
  // spacing: "invalid" // ✗ TypeScript error: not a valid value
});
console.log("Type-safe selector:", typeSafeSelector);
