import { createStyleSet } from "./stylesets";

// Example usage of the new variants.select() functionality
export const styleSet = createStyleSet({
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
    custom: {
      foo: "bg-red-500",
      bar: "bg-blue-500"
    }
  },
  defaultVariants: {
    spacing: "default",
    padding: "none"
  }
});

// Example 1: Select specific variant values using "variant.key" format
const example1 = styleSet.variants.select("padding.sm", "custom.bar", "spacing.lg");
console.log("Example 1 - Specific values:", example1);
// Result: "p-1 bg-blue-500 gap-2"

// Example 2: Use default values by specifying just the variant name
const example2 = styleSet.variants.select("spacing", "padding");
console.log("Example 2 - Default values:", example2);
// Result: "gap-1" (spacing default is "default", padding default is "none" which is empty)

// Example 3: Mix both formats
const example3 = styleSet.variants.select("padding.sm", "custom.bar", "spacing");
console.log("Example 3 - Mixed format:", example3);
// Result: "p-1 bg-blue-500 gap-1"

// Example 4: Use in component props pattern
interface ComponentProps {
  // ... other props
  class?: string;
}

function getComponentClasses(props: ComponentProps) {
  // Select base variant classes
  const baseClasses = styleSet.variants.select(
    "spacing.default",
    "padding.sm"
  );

  // Combine with additional classes
  return `${baseClasses} ${props.class || ''}`.trim();
}

// Example 5: Dynamic variant selection
function getDynamicClasses(variant: "foo" | "bar", size: "sm" | "lg") {
  return styleSet.variants.select(
    `custom.${variant}`,
    `spacing.${size}`,
    "padding" // Use default padding
  );
}

console.log("Dynamic classes (bar, lg):", getDynamicClasses("bar", "lg"));
// Result: "bg-blue-500 gap-2"

// Traditional usage still works
const traditionalUsage = styleSet({
  spacing: "lg",
  padding: "sm",
  class: "additional-class"
});
console.log("Traditional usage:", traditionalUsage);
// Result: "flex flex-col gap-2 p-1 additional-class"