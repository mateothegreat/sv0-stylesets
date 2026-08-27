import { describe, expect, test } from "vitest";
import { createStyleSet } from "./stylesets";

describe("StyleSet variant selectors", () => {
  describe("object-style variants", () => {
    test("should select individual variant classes", () => {
      const styleSet = createStyleSet({
        base: "flex items-center justify-between rounded-lg border p-3",
        variants: {
          intent: {
            info: "border-blue-200 bg-blue-50 text-blue-900",
            success: "border-green-200 bg-green-50 text-green-900",
            warning: "border-yellow-200 bg-yellow-50 text-yellow-900",
            error: "border-red-200 bg-red-50 text-red-900"
          },
          size: {
            xs: "gap-2 py-1.5 px-2.5 text-xs",
            sm: "gap-2.5 py-2 px-3 text-sm",
            md: "gap-3 p-3 text-base",
            lg: "gap-4 p-5 text-lg"
          }
        },
        defaultVariants: {
          intent: "info",
          size: "sm"
        }
      });

      expect(styleSet.variants.intent("info")).toBe("border-blue-200 bg-blue-50 text-blue-900");
      expect(styleSet.variants.intent("success")).toBe(
        "border-green-200 bg-green-50 text-green-900"
      );
      expect(styleSet.variants.intent("warning")).toBe(
        "border-yellow-200 bg-yellow-50 text-yellow-900"
      );
      expect(styleSet.variants.intent("error")).toBe("border-red-200 bg-red-50 text-red-900");
    });

    test("should select size variant classes", () => {
      const styleSet = createStyleSet({
        base: "flex items-center",
        variants: {
          size: {
            xs: "gap-2 py-1.5 px-2.5 text-xs",
            sm: "gap-2.5 py-2 px-3 text-sm",
            md: "gap-3 p-3 text-base",
            lg: "gap-4 p-5 text-lg"
          }
        },
        defaultVariants: {
          size: "sm"
        }
      });

      expect(styleSet.variants.size("xs")).toBe("gap-2 py-1.5 px-2.5 text-xs");
      expect(styleSet.variants.size("sm")).toBe("gap-2.5 py-2 px-3 text-sm");
      expect(styleSet.variants.size("md")).toBe("gap-3 p-3 text-base");
      expect(styleSet.variants.size("lg")).toBe("gap-4 p-5 text-lg");
    });

    test("should return empty string for non-existent variant values", () => {
      const styleSet = createStyleSet({
        variants: {
          intent: {
            primary: "bg-blue-500",
            secondary: "bg-gray-500"
          }
        }
      });

      expect(styleSet.variants.intent("nonexistent" as any)).toBe("");
    });

    test("should handle numeric variant keys", () => {
      const styleSet = createStyleSet({
        variants: {
          level: {
            1: "text-sm",
            2: "text-base",
            3: "text-lg"
          }
        }
      });

      expect(styleSet.variants.level(1 as any)).toBe("text-sm");
      expect(styleSet.variants.level(2 as any)).toBe("text-base");
      expect(styleSet.variants.level(3 as any)).toBe("text-lg");
    });
  });

  describe("string-style variants (truthy flags)", () => {
    test("should return classes when value is truthy", () => {
      const styleSet = createStyleSet({
        variants: {
          focus: "ring-2 ring-blue-500",
          disabled: "opacity-50 cursor-not-allowed"
        }
      });

      expect(styleSet.variants.focus(true)).toBe("ring-2 ring-blue-500");
      expect(styleSet.variants.disabled(true)).toBe("opacity-50 cursor-not-allowed");
    });

    test("should return empty string when value is falsy", () => {
      const styleSet = createStyleSet({
        variants: {
          focus: "ring-2 ring-blue-500",
          disabled: "opacity-50 cursor-not-allowed"
        }
      });

      expect(styleSet.variants.focus(false)).toBe("");
      expect(styleSet.variants.disabled(false)).toBe("");
      expect(styleSet.variants.focus(undefined)).toBe("");
      expect(styleSet.variants.focus(null as any)).toBe("");
      expect(styleSet.variants.focus(0 as any)).toBe("");
    });

    test("should handle array-style variants", () => {
      const styleSet = createStyleSet({
        variants: {
          animated: ["transition-all", "duration-200", "ease-in-out"]
        }
      });

      expect(styleSet.variants.animated(true)).toBe("transition-all duration-200 ease-in-out");
      expect(styleSet.variants.animated(false)).toBe("");
    });
  });

  describe("mixed variants", () => {
    test("should handle both object and string variants", () => {
      const styleSet = createStyleSet({
        variants: {
          intent: {
            primary: "bg-blue-500",
            secondary: "bg-gray-500"
          },
          focus: "ring-2 ring-blue-500",
          size: {
            sm: "text-sm",
            lg: "text-lg"
          },
          disabled: "opacity-50"
        }
      });

      expect(styleSet.variants.intent("primary")).toBe("bg-blue-500");
      expect(styleSet.variants.focus(true)).toBe("ring-2 ring-blue-500");
      expect(styleSet.variants.size("sm")).toBe("text-sm");
      expect(styleSet.variants.disabled(true)).toBe("opacity-50");
    });
  });

  describe("edge cases", () => {
    test("should handle empty variants object", () => {
      const styleSet = createStyleSet({
        base: "flex"
      });

      expect(styleSet.variants).toEqual({});
    });

    test("should handle undefined variants", () => {
      const styleSet = createStyleSet({
        base: "flex"
      });

      expect(styleSet.variants).toEqual({});
    });

    test("should handle variant with empty string value", () => {
      const styleSet = createStyleSet({
        variants: {
          intent: {
            none: "",
            primary: "bg-blue-500"
          }
        }
      });

      expect(styleSet.variants.intent("none")).toBe("");
      expect(styleSet.variants.intent("primary")).toBe("bg-blue-500");
    });

    test("should handle variant with null value", () => {
      const styleSet = createStyleSet({
        variants: {
          intent: {
            primary: "bg-blue-500",
            secondary: null as any
          }
        }
      });

      expect(styleSet.variants.intent("secondary")).toBe("");
    });
  });

  describe("integration with full component", () => {
    test("should work alongside main StyleSet function", () => {
      const callout = createStyleSet({
        base: "flex items-center justify-between rounded-lg border p-3",
        variants: {
          intent: {
            info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100",
            success:
              "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100",
            warning:
              "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100",
            error:
              "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100"
          },
          size: {
            xs: "gap-2 py-1.5 px-2.5 text-xs",
            sm: "gap-2.5 py-2 px-3 text-sm",
            md: "gap-3 p-3 text-base",
            lg: "gap-4 p-5 text-lg"
          }
        },
        defaultVariants: {
          intent: "info",
          size: "sm"
        }
      });

      // Test the main function.
      const fullClasses = callout({ intent: "success", size: "md" });
      expect(fullClasses).toContain("flex");
      expect(fullClasses).toContain("border-green-200");
      expect(fullClasses).toContain("gap-3");

      // Test variant selectors independently.
      const intentClasses = callout.variants.intent("success");
      expect(intentClasses).toBe(
        "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100"
      );

      const sizeClasses = callout.variants.size("md");
      expect(sizeClasses).toBe("gap-3 p-3 text-base");
    });

    test("should allow composing variant classes manually", () => {
      const button = createStyleSet({
        base: "inline-flex items-center justify-center rounded-md font-medium",
        variants: {
          intent: {
            primary: "bg-blue-500 text-white",
            secondary: "bg-gray-200 text-gray-900"
          },
          size: {
            sm: "px-3 py-1.5 text-sm",
            lg: "px-6 py-3 text-lg"
          }
        }
      });

      // Manually compose variant classes.
      const intentClasses = button.variants.intent("primary");
      const sizeClasses = button.variants.size("lg");

      expect(intentClasses).toBe("bg-blue-500 text-white");
      expect(sizeClasses).toBe("px-6 py-3 text-lg");

      // Can be combined with clsx or twMerge separately if needed.
    });
  });

  describe("type safety", () => {
    test("should have correct TypeScript types", () => {
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
          focus: "ring-2 ring-blue-500"
        }
      });

      // These should all type-check correctly.
      styleSet.variants.intent("primary");
      styleSet.variants.intent("secondary");
      styleSet.variants.size("sm");
      styleSet.variants.size("lg");
      styleSet.variants.focus(true);
      styleSet.variants.focus(false);
      styleSet.variants.focus();

      // The following would be type errors (commented out):
      // styleSet.variants.intent('invalid');
      // styleSet.variants.size('invalid');
      // styleSet.variants.focus('invalid');
    });
  });
});
