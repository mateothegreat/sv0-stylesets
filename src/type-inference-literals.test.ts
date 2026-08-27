import { describe, expectTypeOf, test } from "vitest";
import { createStyleSet } from "./stylesets";
import type { VariantProps } from "./types";

describe("Type inference with literal keys", () => {
  test("should preserve literal string keys for object-style variants", () => {
    const styleSet = createStyleSet({
      variants: {
        intent: {
          default: "bg-primary",
          action: "bg-green-600",
          destructive: "bg-destructive",
          outline: "border",
          secondary: "bg-secondary",
          ghost: "hover:bg-accent",
          link: "text-primary underline"
        },
        size: {
          sm: "px-3 py-0.75",
          default: "px-4 py-2",
          lg: "px-6 py-2",
          icon: "size-6"
        }
      }
    });

    type Props = VariantProps<typeof styleSet>;

    // Should infer literal types, not string
    expectTypeOf<Props["intent"]>().toEqualTypeOf<
      "default" | "action" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined
    >();

    expectTypeOf<Props["size"]>().toEqualTypeOf<
      "sm" | "default" | "lg" | "icon" | null | undefined
    >();
  });

  test("should preserve literal string keys for more complex variants", () => {
    const styleSet = createStyleSet({
      variants: {
        spacing: {
          none: "gap-0",
          sm: "gap-2",
          md: "gap-4",
          lg: "gap-8"
        },
        rounded: {
          none: "rounded-none",
          sm: "rounded-sm",
          md: "rounded-md",
          lg: "rounded-lg",
          full: "rounded-full"
        }
      }
    });

    type Props = VariantProps<typeof styleSet>;

    expectTypeOf<Props["spacing"]>().toEqualTypeOf<
      "none" | "sm" | "md" | "lg" | null | undefined
    >();

    expectTypeOf<Props["rounded"]>().toEqualTypeOf<
      "none" | "sm" | "md" | "lg" | "full" | null | undefined
    >();
  });

  test("should handle boolean types for string-style variants", () => {
    const styleSet = createStyleSet({
      variants: {
        focus: "ring-2 ring-blue-500",
        disabled: "opacity-50 cursor-not-allowed"
      }
    });

    type Props = VariantProps<typeof styleSet>;

    expectTypeOf<Props["focus"]>().toEqualTypeOf<boolean | null | undefined>();
    expectTypeOf<Props["disabled"]>().toEqualTypeOf<boolean | null | undefined>();
  });

  test("should handle mixed object and string-style variants", () => {
    const styleSet = createStyleSet({
      variants: {
        intent: {
          primary: "bg-blue-500",
          secondary: "bg-gray-500"
        },
        size: {
          sm: "text-sm",
          lg: "text-lg"
        },
        focus: "ring-2",
        disabled: "opacity-50"
      }
    });

    type Props = VariantProps<typeof styleSet>;

    expectTypeOf<Props["intent"]>().toEqualTypeOf<
      "primary" | "secondary" | null | undefined
    >();
    expectTypeOf<Props["size"]>().toEqualTypeOf<"sm" | "lg" | null | undefined>();
    expectTypeOf<Props["focus"]>().toEqualTypeOf<boolean | null | undefined>();
    expectTypeOf<Props["disabled"]>().toEqualTypeOf<boolean | null | undefined>();
  });

  test("should work with real button example", () => {
    const buttonStyles = createStyleSet({
      base: "inline-flex items-center justify-center",
      variants: {
        intent: {
          default: "bg-primary text-primary-foreground",
          action: "bg-green-600 text-white",
          destructive: "bg-destructive text-destructive-foreground",
          outline: "border hover:bg-accent",
          secondary: "bg-secondary text-secondary-foreground",
          ghost: "hover:bg-accent hover:text-accent-foreground",
          link: "text-primary underline-offset-4"
        },
        size: {
          sm: "px-3 py-0.75",
          default: "px-4 py-2",
          lg: "px-6 py-2",
          icon: "size-6"
        },
        effect: {
          press: "active:scale-96",
          shake: "shake",
          bounce: "bounce",
          wobble: "wobble",
          ripple: "ripple"
        },
        focus: "focus:ring-2 focus:ring-focus-ring"
      },
      defaultVariants: {
        intent: "default",
        size: "default"
      }
    });

    type ButtonProps = VariantProps<typeof buttonStyles>;

    // Test that literal keys are preserved
    expectTypeOf<ButtonProps["intent"]>().toEqualTypeOf<
      | "default"
      | "action"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link"
      | null
      | undefined
    >();

    expectTypeOf<ButtonProps["size"]>().toEqualTypeOf<
      "sm" | "default" | "lg" | "icon" | null | undefined
    >();

    expectTypeOf<ButtonProps["effect"]>().toEqualTypeOf<
      "press" | "shake" | "bounce" | "wobble" | "ripple" | null | undefined
    >();

    expectTypeOf<ButtonProps["focus"]>().toEqualTypeOf<boolean | null | undefined>();

    // Test that the props work in practice
    const validProps: ButtonProps = {
      intent: "primary",
      size: "sm",
      effect: "press",
      focus: true
    };

    // These should not compile (commented to avoid errors)
    // const invalidIntent: ButtonProps = { intent: "invalid" };
    // const invalidSize: ButtonProps = { size: "invalid" };
    // const invalidFocus: ButtonProps = { focus: "invalid" };
  });

  test("should not allow arbitrary string values for object-style variants", () => {
    const styleSet = createStyleSet({
      variants: {
        color: {
          red: "text-red-500",
          blue: "text-blue-500"
        }
      }
    });

    type Props = VariantProps<typeof styleSet>;

    // Should only allow "red" | "blue", not arbitrary strings
    expectTypeOf<Props["color"]>().toEqualTypeOf<"red" | "blue" | null | undefined>();

    // This should compile
    const valid: Props = { color: "red" };

    // This should NOT compile (commented to avoid type errors)
    // const invalid: Props = { color: "green" };
  });

  test("should handle numeric keys", () => {
    const styleSet = createStyleSet({
      variants: {
        level: {
          1: "text-sm",
          2: "text-base",
          3: "text-lg"
        }
      }
    });

    type Props = VariantProps<typeof styleSet>;

    // Numeric keys should be preserved
    expectTypeOf<Props["level"]>().toEqualTypeOf<1 | 2 | 3 | null | undefined>();
  });

  test("should treat array-style variants as boolean (truthy flags)", () => {
    const styleSet = createStyleSet({
      variants: {
        animated: ["transition-all", "duration-200", "ease-in-out"],
        shadow: ["shadow-sm", "shadow-md"]
      }
    });

    type Props = VariantProps<typeof styleSet>;

    // Arrays should be treated as truthy flags, not as objects
    expectTypeOf<Props["animated"]>().toEqualTypeOf<boolean | null | undefined>();
    expectTypeOf<Props["shadow"]>().toEqualTypeOf<boolean | null | undefined>();
  });

  test("should distinguish between arrays and objects correctly", () => {
    const styleSet = createStyleSet({
      variants: {
        // Object-style: should return literal keys
        size: {
          sm: "text-sm",
          md: "text-base",
          lg: "text-lg"
        },
        // Array-style: should return boolean
        animated: ["transition-all", "duration-200"],
        // String-style: should return boolean
        focus: "ring-2 ring-blue-500"
      }
    });

    type Props = VariantProps<typeof styleSet>;

    // Object-style should have literal keys
    expectTypeOf<Props["size"]>().toEqualTypeOf<"sm" | "md" | "lg" | null | undefined>();

    // Array-style should be boolean
    expectTypeOf<Props["animated"]>().toEqualTypeOf<boolean | null | undefined>();

    // String-style should be boolean
    expectTypeOf<Props["focus"]>().toEqualTypeOf<boolean | null | undefined>();
  });

  test("should work with select item example", () => {
    const itemStyleSet = createStyleSet({
      variants: {
        size: {
          default: "px-2 py-1.5",
          sm: "px-1.5 py-1",
          lg: "px-3 py-2"
        },
        state: {
          default: "bg-white",
          selected: "bg-blue-100",
          highlighted: "bg-gray-100",
          disabled: "opacity-50"
        },
        intent: {
          default: "text-gray-900",
          primary: "text-blue-900",
          success: "text-green-900"
        }
      }
    });

    type ItemProps = VariantProps<typeof itemStyleSet>;

    // All should be object-style variants with literal keys
    expectTypeOf<ItemProps["size"]>().toEqualTypeOf<
      "default" | "sm" | "lg" | null | undefined
    >();
    expectTypeOf<ItemProps["state"]>().toEqualTypeOf<
      "default" | "selected" | "highlighted" | "disabled" | null | undefined
    >();
    expectTypeOf<ItemProps["intent"]>().toEqualTypeOf<
      "default" | "primary" | "success" | null | undefined
    >();

    // Should be able to assign these types
    const validSize: ItemProps["size"] = "default";
    const validState: ItemProps["state"] = "selected";
    const validIntent: ItemProps["intent"] = "primary";

    // These should NOT compile (commented to avoid errors)
    // const invalidSize: ItemProps["size"] = "invalid";
    // const invalidSize2: ItemProps["size"] = true;
    // const invalidSize3: ItemProps["size"] = false;
  });
});
