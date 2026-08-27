/**
 * Test file to verify VariantProps type inference is working correctly
 */

import { createStyleSet, type VariantProps } from "./index";

// Test case 1: Object-style variants
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
  },
  defaultVariants: {
    spacing: "default",
    padding: "none"
  }
});

// This should correctly type the variants
type GroupVariants = VariantProps<typeof groupStyleSet>;

// Type test - these should be the only valid values
const validProps: GroupVariants = {
  spacing: "default", // ✅ Should work
  padding: "sm"       // ✅ Should work
};

const validPropsWithNull: GroupVariants = {
  spacing: null,      // ✅ Should work
  padding: null       // ✅ Should work
};

const validPropsUndefined: GroupVariants = {
  spacing: undefined,  // ✅ Should work
  padding: undefined   // ✅ Should work
};

// These should cause type errors
// @ts-expect-error - boolean should not be allowed
const invalidBooleanProps: GroupVariants = {
  spacing: true,
  padding: false
};

// @ts-expect-error - arbitrary strings should not be allowed
const invalidStringProps: GroupVariants = {
  spacing: "invalid",
  padding: "wrong"
};

// Test case 2: Boolean (string/array) variants
const booleanVariantSet = createStyleSet({
  variants: {
    fullWidth: "w-full",             // String variant (boolean flag)
    disabled: ["opacity-50", "cursor-not-allowed"], // Array variant (boolean flag)
    visible: {                        // Object variant (specific keys)
      show: "block",
      hide: "hidden",
      partial: "opacity-50"
    }
  }
});

type BooleanVariants = VariantProps<typeof booleanVariantSet>;

// Valid boolean variant usage
const validBooleanProps: BooleanVariants = {
  fullWidth: true,     // ✅ Boolean for string variant
  disabled: false,     // ✅ Boolean for array variant
  visible: "show"      // ✅ Specific key for object variant
};

const validBooleanPropsWithNull: BooleanVariants = {
  fullWidth: null,
  disabled: null,
  visible: null
};

// Invalid usage
// @ts-expect-error - string not allowed for boolean variant
const invalidBooleanString: BooleanVariants = {
  fullWidth: "yes"
};

// @ts-expect-error - boolean not allowed for object variant
const invalidObjectBoolean: BooleanVariants = {
  visible: true
};

// Test case 3: Mixed variants in real component scenario
const buttonStyleSet = createStyleSet({
  base: "px-4 py-2 rounded transition-colors",
  variants: {
    intent: {
      primary: "bg-blue-500 text-white hover:bg-blue-600",
      secondary: "bg-gray-500 text-white hover:bg-gray-600",
      danger: "bg-red-500 text-white hover:bg-red-600"
    },
    size: {
      sm: "text-sm py-1 px-2",
      md: "text-base py-2 px-4",
      lg: "text-lg py-3 px-6"
    },
    fullWidth: "w-full",
    disabled: "opacity-50 cursor-not-allowed pointer-events-none"
  },
  defaultVariants: {
    intent: "primary",
    size: "md"
  }
});

type ButtonVariants = VariantProps<typeof buttonStyleSet>;

// Valid button props
const validButtonProps: ButtonVariants = {
  intent: "primary",   // ✅ Specific string literal
  size: "lg",         // ✅ Specific string literal
  fullWidth: true,    // ✅ Boolean for string variant
  disabled: false     // ✅ Boolean for string variant
};

// Verify the type is correctly inferred (hover over in IDE to check)
type TestGroupVariants = {
  spacing?: "default" | "none" | "sm" | "lg" | null;
  padding?: "none" | "sm" | "lg" | null;
};

type TestBooleanVariants = {
  fullWidth?: boolean | null;
  disabled?: boolean | null;
  visible?: "show" | "hide" | "partial" | null;
};

type TestButtonVariants = {
  intent?: "primary" | "secondary" | "danger" | null;
  size?: "sm" | "md" | "lg" | null;
  fullWidth?: boolean | null;
  disabled?: boolean | null;
};

// These should be assignable if types are correct
const _testGroup: TestGroupVariants = validProps;
const _testBoolean: TestBooleanVariants = validBooleanProps;
const _testButton: TestButtonVariants = validButtonProps;

// Export for testing
export {
  groupStyleSet,
  booleanVariantSet,
  buttonStyleSet,
  type GroupVariants,
  type BooleanVariants,
  type ButtonVariants
};