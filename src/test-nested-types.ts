import { createStyleSet } from "./stylesets";
import type { VariantProps } from "./types";

// Test the exact example from the user's issue
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
        default: "h-6 flex items-center text-sm text-muted-foreground select-none",
        lg: "ml-4"
      }
    }
  },
  defaultVariants: {
    heading: {
      spacing: "lg"  // This should now work without type errors!
    }
  }
});

// Verify the types are correct
type Props = VariantProps<typeof groupStyleSet>;

// These should all compile without errors:
const props1: Props = {
  spacing: "sm",
  padding: "lg",
  heading: {
    colors: "muted",
    spacing: "default"
  }
};

const props2: Props = {
  heading: {
    colors: "accent"
  }
};

const props3: Props = {
  spacing: "default"
};

// Test object selectors
const result1 = groupStyleSet.variants.select({
  heading: {
    colors: "muted"
  }
});

const result2 = groupStyleSet.variants.select(
  {
    heading: {
      colors: "muted"
    }
  },
  "spacing.sm",
  "padding"
);

console.log("✓ All type checks passed!");
console.log("Result 1:", result1);
console.log("Result 2:", result2);
