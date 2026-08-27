import { describe, expect, it } from "vitest";
import { createStyleSet } from "./stylesets";

describe("createStyleSet - Truthy Variants", () => {
  describe("String-style variants (truthy flags)", () => {
    const styleSet = createStyleSet({
      base: "btn",
      variants: {
        intent: {
          primary: "bg-blue-500 text-white",
          secondary: "bg-gray-500 text-white"
        },
        size: {
          sm: "text-sm px-2 py-1",
          md: "text-base px-4 py-2"
        },
        focus: "ring-2 ring-blue-500 border-blue-500",
        disabled: "opacity-50 pointer-events-none"
      },
      defaultVariants: {
        intent: "primary",
        size: "md"
      }
    });

    it("applies string variant when prop is true", () => {
      const result = styleSet({ focus: true });
      expect(result).toContain("ring-2");
      expect(result).toContain("ring-blue-500");
      expect(result).toContain("border-blue-500");
    });

    it("does not apply string variant when prop is false", () => {
      const result = styleSet({ focus: false });
      expect(result).not.toContain("ring-2");
      expect(result).not.toContain("ring-blue-500");
      expect(result).not.toContain("border-blue-500");
    });

    it("applies string variant when prop is truthy string", () => {
      const result = styleSet({ focus: "yes" });
      expect(result).toContain("ring-2");
      expect(result).toContain("ring-blue-500");
      expect(result).toContain("border-blue-500");
    });

    it("applies string variant when prop is truthy number", () => {
      const result = styleSet({ focus: 1 });
      expect(result).toContain("ring-2");
      expect(result).toContain("ring-blue-500");
      expect(result).toContain("border-blue-500");
    });

    it("does not apply string variant when prop is 0", () => {
      const result = styleSet({ focus: 0 });
      expect(result).not.toContain("ring-2");
    });

    it("does not apply string variant when prop is empty string", () => {
      const result = styleSet({ focus: "" });
      expect(result).not.toContain("ring-2");
    });

    it("does not apply string variant when prop is null", () => {
      const result = styleSet({ focus: null });
      expect(result).not.toContain("ring-2");
    });

    it("does not apply string variant when prop is undefined", () => {
      const result = styleSet({ focus: undefined });
      expect(result).not.toContain("ring-2");
    });

    it("applies multiple string variants simultaneously", () => {
      const result = styleSet({ focus: true, disabled: true });
      expect(result).toContain("ring-2");
      expect(result).toContain("opacity-50");
      expect(result).toContain("pointer-events-none");
    });

    it("combines object-style and string-style variants", () => {
      const result = styleSet({
        intent: "primary",
        size: "sm",
        focus: true
      });
      expect(result).toContain("bg-blue-500");
      expect(result).toContain("text-sm");
      expect(result).toContain("ring-2");
    });

    it("respects default variants while applying string variants", () => {
      const result = styleSet({ focus: true });
      // Should apply default variants
      expect(result).toContain("bg-blue-500"); // default intent: primary
      expect(result).toContain("text-base"); // default size: md
      // And the string variant
      expect(result).toContain("ring-2");
    });
  });

  describe("Array-style variants (truthy flags)", () => {
    const styleSet = createStyleSet({
      base: "component",
      variants: {
        effect: ["animate-pulse", "transition-all", "duration-300"],
        highlight: ["shadow-lg", "border-2", "border-yellow-400"]
      }
    });

    it("applies array variant when prop is true", () => {
      const result = styleSet({ effect: true });
      expect(result).toContain("animate-pulse");
      expect(result).toContain("transition-all");
      expect(result).toContain("duration-300");
    });

    it("does not apply array variant when prop is false", () => {
      const result = styleSet({ effect: false });
      expect(result).not.toContain("animate-pulse");
      expect(result).not.toContain("transition-all");
    });

    it("applies array variant when prop is truthy", () => {
      const result = styleSet({ effect: "active" });
      expect(result).toContain("animate-pulse");
      expect(result).toContain("transition-all");
      expect(result).toContain("duration-300");
    });

    it("applies multiple array variants", () => {
      const result = styleSet({ effect: true, highlight: true });
      expect(result).toContain("animate-pulse");
      expect(result).toContain("shadow-lg");
      expect(result).toContain("border-yellow-400");
    });
  });

  describe("Mixed variant types with compound variants", () => {
    const styleSet = createStyleSet({
      base: "button",
      variants: {
        intent: {
          primary: "bg-blue-500",
          danger: "bg-red-500"
        },
        focus: "ring-2 ring-offset-2",
        active: "scale-95"
      },
      compoundVariants: [
        {
          intent: "primary",
          focus: true,
          class: "ring-blue-500"
        },
        {
          intent: "danger",
          focus: true,
          class: "ring-red-500"
        }
      ]
    });

    it("applies compound variants with string-style variants", () => {
      const result = styleSet({ intent: "primary", focus: true });
      expect(result).toContain("bg-blue-500");
      expect(result).toContain("ring-2");
      expect(result).toContain("ring-blue-500");
    });

    it("applies different compound variant based on string variant", () => {
      const result = styleSet({ intent: "danger", focus: true });
      expect(result).toContain("bg-red-500");
      expect(result).toContain("ring-2");
      expect(result).toContain("ring-red-500");
    });

    it("does not apply compound variant when string variant is false", () => {
      const result = styleSet({ intent: "primary", focus: false });
      expect(result).toContain("bg-blue-500");
      expect(result).not.toContain("ring-2");
      expect(result).not.toContain("ring-blue-500");
    });

    it("applies multiple string variants with compound variants", () => {
      const result = styleSet({
        intent: "primary",
        focus: true,
        active: true
      });
      expect(result).toContain("bg-blue-500");
      expect(result).toContain("ring-2");
      expect(result).toContain("ring-blue-500");
      expect(result).toContain("scale-95");
    });

    it("applies compound variant with truthy string value instead of true", () => {
      const result = styleSet({ intent: "primary", focus: "active" });
      expect(result).toContain("bg-blue-500");
      expect(result).toContain("ring-2");
      expect(result).toContain("ring-blue-500");
    });

    it("applies compound variant with truthy number value instead of true", () => {
      const result = styleSet({ intent: "primary", focus: 1 });
      expect(result).toContain("bg-blue-500");
      expect(result).toContain("ring-2");
      expect(result).toContain("ring-blue-500");
    });
  });

  describe("Real-world button example from user", () => {
    const styleSet = createStyleSet({
      base: [
        "inline-flex shrink-0 items-center justify-center gap-2",
        "whitespace-nowrap text-sm font-medium",
        "rounded-md outline-none shadow-xs",
        "transition-all",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        "dark:aria-invalid:ring-destructive/40",
        "disabled:pointer-events-none disabled:opacity-25",
        "aria-disabled:pointer-events-none aria-disabled:opacity-50",
        "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
      ],
      variants: {
        intent: {
          default: [
            "bg-primary text-primary-foreground",
            "shadow-xs",
            "hover:bg-primary/80"
          ],
          destructive: [
            "bg-destructive text-destructive-foreground",
            "shadow-xs",
            "hover:bg-destructive/80",
            "dark:bg-destructive dark:focus-visible:ring-destructive/40"
          ]
        },
        size: {
          sm: ["gap-1.5 px-3 py-0.75", "rounded-md", "has-[>svg]:px-2.5"],
          default: ["px-4 py-2", "has-[>svg]:px-3", "text-base"]
        },
        effect: {
          press: "active:scale-96 active:shadow-none duration-100",
          shake: "shake",
          bounce: "bounce"
        },
        focus: "focus:ring-2 focus:ring-focus-ring focus:border-focus-ring"
      },
      defaultVariants: {
        intent: "default",
        size: "default"
      }
    });

    it("applies all variants correctly in user example", () => {
      const result = styleSet({
        intent: "default",
        size: "default",
        effect: "press",
        focus: true
      });

      // Base classes
      expect(result).toContain("inline-flex");
      expect(result).toContain("items-center");

      // Intent variant
      expect(result).toContain("bg-primary");
      expect(result).toContain("text-primary-foreground");

      // Size variant
      expect(result).toContain("px-4");
      expect(result).toContain("py-2");

      // Effect variant (object-style)
      expect(result).toContain("active:scale-96");

      // Focus variant (string-style truthy flag)
      expect(result).toContain("focus:ring-2");
      expect(result).toContain("focus:ring-focus-ring");
      expect(result).toContain("focus:border-focus-ring");
    });

    it("conditionally applies focus variant", () => {
      const withFocus = styleSet({
        intent: "default",
        size: "default",
        focus: true
      });
      expect(withFocus).toContain("focus:ring-2");

      const withoutFocus = styleSet({
        intent: "default",
        size: "default",
        focus: false
      });
      expect(withoutFocus).not.toContain("focus:ring-2");
    });

    it("works with truthy string value for focus", () => {
      const result = styleSet({
        intent: "default",
        size: "default",
        focus: "active"
      });

      expect(result).toContain("focus:ring-2");
      expect(result).toContain("focus:ring-focus-ring");
    });

    it("applies defaults and optional string variant", () => {
      const result = styleSet({ focus: true });

      // Should have defaults
      expect(result).toContain("bg-primary"); // default intent
      expect(result).toContain("px-4"); // default size

      // And the string variant
      expect(result).toContain("focus:ring-2");
    });
  });

  describe("Type safety and edge cases", () => {
    const styleSet = createStyleSet({
      base: "base",
      variants: {
        regular: { a: "class-a", b: "class-b" },
        flag: "flag-classes"
      }
    });

    it("handles mixed empty/falsy values gracefully", () => {
      const result = styleSet({
        regular: "a",
        flag: false
      });
      expect(result).toContain("class-a");
      expect(result).not.toContain("flag-classes");
    });

    it("handles all props being falsy", () => {
      const result = styleSet({
        regular: null,
        flag: false
      });
      expect(result).toBe("base");
    });

    it("handles undefined vs null correctly for string variants", () => {
      const withUndefined = styleSet({ flag: undefined });
      const withNull = styleSet({ flag: null });
      const withoutProp = styleSet({});

      expect(withUndefined).toBe("base");
      expect(withNull).toBe("base");
      expect(withoutProp).toBe("base");
    });
  });
});
