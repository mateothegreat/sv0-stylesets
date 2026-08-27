import { createStyleSet, type VariantProps } from "./index";

// Test the exact example from the user
const groupStyleSet = createStyleSet({
  base: "flex flex-col",
  variants: {
    spacing: {
      default: "space-y-2",
      none: "space-y-0",
      sm: "space-y-1",
      lg: "space-y-4"
    },
    padding: {
      none: "p-0",
      sm: "p-2",
      lg: "p-4"
    }
  }
});

// This should now correctly infer the types
type TestType = VariantProps<typeof groupStyleSet>;

// Hover over TestType in your IDE to see:
// type TestType = {
//   spacing?: "default" | "none" | "sm" | "lg" | null;
//   padding?: "none" | "sm" | "lg" | null;
// }

// Test that the correct values work
const correctUsage: TestType = {
  spacing: "sm",
  padding: "lg"
};

// Test with null
const withNull: TestType = {
  spacing: null,
  padding: null
};

// Test with undefined (optional)
const withUndefined: TestType = {};

// This should error - boolean not allowed
// @ts-expect-error
const wrongType: TestType = {
  spacing: true,
  padding: false
};

console.log("Type test completed. If no TypeScript errors except the expected one, the fix is working!");

export { TestType, correctUsage };