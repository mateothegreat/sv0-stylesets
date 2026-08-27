import { describe, expect, test } from "vitest";
import { createStyleSet } from "./stylesets";

describe("createStyleSet - rest arguments bug", () => {
  test("should merge variant props with second argument class value", () => {
    const styleSet = createStyleSet({
      base: "base-class",
      variants: {
        intent: {
          primary: "bg-blue-500",
          secondary: "bg-gray-500"
        },
        size: {
          sm: "text-sm",
          lg: "text-lg"
        },
        effect: {
          shadow: "shadow-md",
          none: "shadow-none"
        },
        focus: {
          visible: "focus:ring-2",
          hidden: "focus:ring-0"
        }
      }
    });

    // Simulate the user's pattern
    const built = {
      intent: "primary" as const,
      size: "sm" as const,
      effect: "shadow" as const,
      focus: "visible" as const,
      class: "custom-extra-class"
    };

    const style = styleSet(
      {
        intent: built.intent,
        size: built.size,
        effect: built.effect,
        focus: built.focus
      },
      built.class
    );

    console.log("Result:", style);

    // Should contain base class
    expect(style).toContain("base-class");

    // Should contain variant classes
    expect(style).toContain("bg-blue-500");
    expect(style).toContain("text-sm");
    expect(style).toContain("shadow-md");
    expect(style).toContain("focus:ring-2");

    // Should contain the extra class from second argument
    expect(style).toContain("custom-extra-class");
  });

  test("should handle string class values in second argument", () => {
    const styleSet = createStyleSet({
      base: "btn",
      variants: {
        intent: {
          primary: "bg-blue-500"
        }
      }
    });

    const result = styleSet({ intent: "primary" }, "w-full h-12");

    console.log("Result with multiple classes:", result);

    expect(result).toContain("btn");
    expect(result).toContain("bg-blue-500");
    expect(result).toContain("w-full");
    expect(result).toContain("h-12");
  });

  test("should handle undefined/null as second argument", () => {
    const styleSet = createStyleSet({
      base: "btn",
      variants: {
        intent: {
          primary: "bg-blue-500"
        }
      }
    });

    const resultUndefined = styleSet({ intent: "primary" }, undefined);
    expect(resultUndefined).toContain("btn");
    expect(resultUndefined).toContain("bg-blue-500");

    const resultNull = styleSet({ intent: "primary" }, null);
    expect(resultNull).toContain("btn");
    expect(resultNull).toContain("bg-blue-500");
  });

  test("should handle empty string as second argument", () => {
    const styleSet = createStyleSet({
      base: "btn",
      variants: {
        intent: {
          primary: "bg-blue-500"
        }
      }
    });

    const result = styleSet({ intent: "primary" }, "");
    expect(result).toContain("btn");
    expect(result).toContain("bg-blue-500");
  });
});
