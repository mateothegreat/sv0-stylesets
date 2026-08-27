import { createStyleSet } from "./stylesets";
import type { VariantProps } from "./types";

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
      spacing: "lg"
    }
  }
});

// select() call results in: "bg-popover-label ml-4"
const withSelectorString = groupStyleSet.variants.select("heading");

// select() call results in: "bg-muted ml-4 gap-0.5 p-1.5"
const withObject = groupStyleSet.variants.select(
  {
    heading: {
      colors: "muted"
    }
  },
  "spacing.sm",
  "padding"
);

const style = styleSet(
  {
    spacing: "default",
    padding: "none"
  },
  "bg-red-500"
);

type S = typeof styleSet;
type V = VariantProps<S>;

const v: V = {
  spacing: "default",
  padding: "none"
};
