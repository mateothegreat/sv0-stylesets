import { createStyleSet } from "./stylesets";

/**
 * Example: Nested Variants
 *
 * Demonstrates the use of infinitely nested variant structures
 */

// Example 1: Basic nested variants
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
        default: "ml-3",
        lg: "ml-4"
      }
    }
  },
  defaultVariants: {
    spacing: "default",
    padding: "none"
  }
});

// Usage 1: Props with nested variant values
const classes1 = groupStyleSet({
  heading: {
    colors: "muted",
    spacing: "sm"
  },
  spacing: "lg"
});
console.log("Nested variant props:", classes1);
// Result: "flex flex-col gap-2 bg-muted ml-2"

// Usage 2: Accessing nested selectors
const headingColor = groupStyleSet.variants.heading.colors("accent");
console.log("Nested selector:", headingColor);
// Result: "bg-accent"

// Usage 3: Using select() with nested paths
const selected = groupStyleSet.variants.select(
  "heading.colors.muted",
  "heading.spacing.lg",
  "spacing"
);
console.log("Select with nested paths:", selected);
// Result: "bg-muted ml-4 gap-1"

// Example 2: Mixed flat and nested variants
export const buttonStyleSet = createStyleSet({
  base: "inline-flex items-center justify-center",
  variants: {
    // Flat variant
    size: {
      sm: "text-sm px-2 py-1",
      md: "text-base px-4 py-2",
      lg: "text-lg px-6 py-3"
    },
    // Nested variant
    appearance: {
      intent: {
        primary: "bg-blue-500 text-white hover:bg-blue-600",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
        danger: "bg-red-500 text-white hover:bg-red-600"
      },
      variant: {
        solid: "",
        outline: "bg-transparent border-2",
        ghost: "bg-transparent hover:bg-opacity-10"
      }
    },
    // Another nested variant
    decorative: {
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        full: "rounded-full"
      },
      shadow: {
        none: "shadow-none",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg"
      }
    }
  },
  defaultVariants: {
    size: "md",
    appearance: {
      intent: "primary",
      variant: "solid"
    },
    decorative: {
      rounded: "md",
      shadow: "sm"
    }
  }
});

// Usage: Complex nested variant structure
const buttonClasses = buttonStyleSet({
  size: "lg",
  appearance: {
    intent: "danger",
    variant: "outline"
  },
  decorative: {
    rounded: "full",
    shadow: "lg"
  }
});
console.log("Complex button:", buttonClasses);
// Result: "inline-flex items-center justify-center text-lg px-6 py-3 bg-red-500 text-white hover:bg-red-600 bg-transparent border-2 rounded-full shadow-lg"

// Example 3: Deeply nested variants
export const advancedStyleSet = createStyleSet({
  variants: {
    layout: {
      container: {
        size: {
          sm: "max-w-sm",
          md: "max-w-md",
          lg: "max-w-lg",
          xl: "max-w-xl"
        },
        padding: {
          none: "",
          default: "px-4",
          comfortable: "px-6"
        }
      },
      flex: {
        direction: {
          row: "flex-row",
          col: "flex-col"
        },
        align: {
          start: "items-start",
          center: "items-center",
          end: "items-end"
        },
        justify: {
          start: "justify-start",
          center: "justify-center",
          end: "justify-end",
          between: "justify-between"
        }
      }
    }
  },
  defaultVariants: {
    layout: {
      container: {
        size: "md",
        padding: "default"
      },
      flex: {
        direction: "col",
        align: "start",
        justify: "start"
      }
    }
  }
});

// Usage: Deeply nested props
const layoutClasses = advancedStyleSet({
  layout: {
    container: {
      size: "xl",
      padding: "comfortable"
    },
    flex: {
      direction: "row",
      align: "center",
      justify: "between"
    }
  }
});
console.log("Deep nesting:", layoutClasses);
// Result: "max-w-xl px-6 flex-row items-center justify-between"

// Usage: Select with deeply nested paths
const deepSelect = advancedStyleSet.variants.select(
  "layout.container.size.lg",
  "layout.flex.direction.col",
  "layout.flex.align.center"
);
console.log("Deep select:", deepSelect);
// Result: "max-w-lg flex-col items-center"

// Example 4: Type-safe nested variants
type ButtonProps = {
  size?: "sm" | "md" | "lg";
  appearance?: {
    intent?: "primary" | "secondary" | "danger";
    variant?: "solid" | "outline" | "ghost";
  };
  decorative?: {
    rounded?: "none" | "sm" | "md" | "full";
    shadow?: "none" | "sm" | "md" | "lg";
  };
  class?: string;
};

function Button(props: ButtonProps) {
  return buttonStyleSet(props);
}

// Type-safe usage
const typeSafeButton = Button({
  size: "md",
  appearance: {
    intent: "primary",
    variant: "outline"
  },
  decorative: {
    rounded: "full"
  },
  class: "custom-class"
});
console.log("Type-safe button:", typeSafeButton);