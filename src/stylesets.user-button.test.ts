import { describe, expect, it } from "vitest";
import { createStyleSet } from "./stylesets";

describe("User Button Configuration - Debug", () => {
  const styleSet = createStyleSet({
    base: [
      "inline-flex shrink-0 items-center justify-center gap-2",
      "whitespace-nowrap text-sm font-medium",
      "rounded-md outline-none shadow-xs",
      "transition-all",
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
          "hover:bg-destructive/80"
        ],
        outline: [
          "border",
          "shadow-xs",
          "hover:bg-accent hover:text-accent-foreground",
          "dark:border-input dark:hover:bg-input/50"
        ],
        secondary: [
          "bg-secondary text-secondary-foreground",
          "shadow-xs",
          "hover:bg-secondary/80"
        ],
        ghost: ["hover:bg-accent hover:text-accent-foreground", "dark:hover:bg-accent/80"],
        link: ["text-primary underline-offset-4", "hover:underline"]
      },
      size: {
        sm: ["gap-1.5 px-3 py-0.75", "rounded-md", "has-[>svg]:px-2.5"],
        default: ["px-4 py-2", "has-[>svg]:px-3", "text-base"],
        lg: ["rounded-md", "px-6 py-2", "has-[>svg]:px-4"],
        icon: ["size-6"]
      },
      effect: {
        press: "active:scale-96 active:shadow-none duration-100",
        shake: "shake",
        bounce: "bounce",
        wobble: "wobble",
        ripple: "ripple"
      },
      focus: "focus:ring-2 focus:ring-focus-ring focus:border-focus-ring"
    },
    defaultVariants: {
      intent: "default",
      size: "default"
    }
  });

  it("should have correct focus variant definition", () => {
    // Debug: Check what the variants object contains
    console.log("Variants:", styleSet.variants);
  });

  it("should apply focus classes when focus is true", () => {
    const result = styleSet({ focus: true });
    console.log("Result with focus:true:", result);
    console.log("Length:", result.length);

    expect(result).toContain("focus:ring-2");
    expect(result).toContain("focus:ring-focus-ring");
    expect(result).toContain("focus:border-focus-ring");
  });

  it("should apply focus classes when focus is 1", () => {
    const result = styleSet({ focus: 1 });
    console.log("Result with focus:1:", result);
    console.log("Length:", result.length);

    expect(result).toContain("focus:ring-2");
    expect(result).toContain("focus:ring-focus-ring");
    expect(result).toContain("focus:border-focus-ring");
  });

  it("should apply all variants including focus with number", () => {
    const result = styleSet({
      intent: "default",
      size: "default",
      effect: "press",
      focus: 1
    });

    console.log("Full result:", result);
    console.log("Length:", result.length);
    console.log("Split by space:", result.split(" "));

    // Should have base classes
    expect(result).toContain("inline-flex");

    // Should have intent classes
    expect(result).toContain("bg-primary");

    // Should have size classes
    expect(result).toContain("px-4");

    // Should have effect classes
    expect(result).toContain("active:scale-96");

    // Should have focus classes
    expect(result).toContain("focus:ring-2");
    expect(result).toContain("focus:ring-focus-ring");
    expect(result).toContain("focus:border-focus-ring");
  });

  it("should not apply focus classes when focus is 0", () => {
    const result = styleSet({ focus: 0 });
    console.log("Result with focus:0:", result);

    expect(result).not.toContain("focus:ring-2");
  });

  it("should apply with additional class parameter", () => {
    const result = styleSet(
      {
        intent: "default",
        size: "default",
        effect: "press",
        focus: 1
      },
      "custom-class"
    );

    console.log("Result with extra class:", result);
    expect(result).toContain("custom-class");
    expect(result).toContain("focus:ring-2");
  });
});
