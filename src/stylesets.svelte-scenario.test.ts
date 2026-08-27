import { describe, expect, test } from "vitest";
import { createStyleSet } from "./stylesets";

describe("createStyleSet - Svelte component scenario", () => {
  test("should work with Svelte component prop pattern", () => {
    // Create a styleset that mimics a button component
    const button = createStyleSet({
      base: "btn inline-flex items-center justify-center",
      variants: {
        intent: {
          primary: "bg-blue-500 text-white hover:bg-blue-600",
          secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
          danger: "bg-red-500 text-white hover:bg-red-600"
        },
        size: {
          sm: "text-sm px-3 py-1.5",
          md: "text-base px-4 py-2",
          lg: "text-lg px-6 py-3"
        },
        effect: {
          shadow: "shadow-md hover:shadow-lg",
          outline: "border-2 border-current",
          ghost: "bg-transparent"
        },
        focus: {
          visible: "focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
          hidden: "focus:outline-none"
        }
      },
      defaultVariants: {
        intent: "primary",
        size: "md",
        effect: "shadow",
        focus: "visible"
      }
    });

    // Simulate a Svelte component receiving props
    interface ButtonProps {
      intent?: "primary" | "secondary" | "danger";
      size?: "sm" | "md" | "lg";
      effect?: "shadow" | "outline" | "ghost";
      focus?: "visible" | "hidden";
      class?: string;
    }

    // Simulate what happens in a Svelte component
    const componentProps: ButtonProps = {
      intent: "primary",
      size: "sm",
      effect: "shadow",
      focus: "visible",
      class: "w-full rounded-lg"
    };

    // This is the pattern the user described
    const built = {
      intent: componentProps.intent,
      size: componentProps.size,
      effect: componentProps.effect,
      focus: componentProps.focus,
      class: componentProps.class
    };

    // Pattern 1: Pass variant props in first arg, extra class in second arg
    const style1 = button(
      {
        intent: built.intent,
        size: built.size,
        effect: built.effect,
        focus: built.focus
      },
      built.class
    );

    console.log("Style 1 (separate args):", style1);

    expect(style1).toContain("btn");
    expect(style1).toContain("inline-flex");
    expect(style1).toContain("bg-blue-500");
    expect(style1).toContain("text-sm");
    expect(style1).toContain("shadow-md");
    expect(style1).toContain("focus:ring-2");
    expect(style1).toContain("w-full");
    expect(style1).toContain("rounded-lg");

    // Pattern 2: Pass everything including class prop in first arg
    const style2 = button({
      intent: built.intent,
      size: built.size,
      effect: built.effect,
      focus: built.focus,
      class: built.class
    });

    console.log("Style 2 (class in props):", style2);

    expect(style2).toContain("btn");
    expect(style2).toContain("inline-flex");
    expect(style2).toContain("bg-blue-500");
    expect(style2).toContain("text-sm");
    expect(style2).toContain("shadow-md");
    expect(style2).toContain("focus:ring-2");
    expect(style2).toContain("w-full");
    expect(style2).toContain("rounded-lg");

    // Both should produce the same result
    expect(style1).toBe(style2);
  });

  test("should handle dynamic prop values", () => {
    const button = createStyleSet({
      base: "btn",
      variants: {
        intent: {
          primary: "bg-blue-500",
          secondary: "bg-gray-500"
        },
        size: {
          sm: "text-sm",
          lg: "text-lg"
        }
      }
    });

    // Simulate reactive state changes
    let currentIntent: "primary" | "secondary" = "primary";
    let currentSize: "sm" | "lg" = "sm";
    let currentClass = "extra-class-1";

    const getStyle = () => {
      return button(
        {
          intent: currentIntent,
          size: currentSize
        },
        currentClass
      );
    };

    // Initial state
    let style = getStyle();
    expect(style).toContain("bg-blue-500");
    expect(style).toContain("text-sm");
    expect(style).toContain("extra-class-1");
    expect(style).not.toContain("extra-class-2");

    // Change props
    currentIntent = "secondary";
    currentSize = "lg";
    currentClass = "extra-class-2";

    style = getStyle();
    expect(style).toContain("bg-gray-500");
    expect(style).toContain("text-lg");
    expect(style).toContain("extra-class-2");
    expect(style).not.toContain("extra-class-1");
    expect(style).not.toContain("bg-blue-500");
  });

  test("should handle undefined and empty string class values", () => {
    const button = createStyleSet({
      base: "btn",
      variants: {
        intent: {
          primary: "bg-blue-500"
        }
      }
    });

    // Test with undefined
    const style1 = button({ intent: "primary" }, undefined);
    expect(style1).toContain("btn");
    expect(style1).toContain("bg-blue-500");

    // Test with empty string
    const style2 = button({ intent: "primary" }, "");
    expect(style2).toContain("btn");
    expect(style2).toContain("bg-blue-500");

    // Test with empty string in class prop
    const style3 = button({ intent: "primary", class: "" });
    expect(style3).toContain("btn");
    expect(style3).toContain("bg-blue-500");

    // Test with multiple empty values
    const style4 = button({ intent: "primary" }, "", undefined, "");
    expect(style4).toContain("btn");
    expect(style4).toContain("bg-blue-500");
  });

  test("should handle conditional class values", () => {
    const button = createStyleSet({
      base: "btn",
      variants: {
        intent: {
          primary: "bg-blue-500"
        }
      }
    });

    const isFullWidth = true;
    const isRounded = false;

    const style = button(
      { intent: "primary" },
      isFullWidth && "w-full",
      isRounded && "rounded-full"
    );

    expect(style).toContain("btn");
    expect(style).toContain("bg-blue-500");
    expect(style).toContain("w-full");
    expect(style).not.toContain("rounded-full");
  });
});
