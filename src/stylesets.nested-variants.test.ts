import { describe, expect, it } from "vitest";
import { createStyleSet } from "./stylesets";

describe("createStyleSet - Nested Variants", () => {
  describe("basic nested variants", () => {
    it("should handle nested variant structure", () => {
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
              default: "ml-3",
              lg: "ml-4"
            }
          }
        },
        defaultVariants: {
          spacing: "default"
        }
      });

      // Test basic prop usage
      const result1 = groupStyleSet();
      expect(result1).toContain("flex flex-col");
      expect(result1).toContain("gap-1");

      // Test nested variant props
      const result2 = groupStyleSet({ heading: { colors: "muted", spacing: "sm" } });
      expect(result2).toContain("bg-muted");
      expect(result2).toContain("ml-2");
    });

    it("should handle deeply nested variants", () => {
      const styleSet = createStyleSet({
        variants: {
          level1: {
            level2: {
              level3: {
                deep: "text-deep",
                shallow: "text-shallow"
              }
            }
          }
        }
      });

      const result = styleSet({ level1: { level2: { level3: "deep" } } });
      expect(result).toBe("text-deep");
    });
  });

  describe("nested variant selectors", () => {
    it("should create nested selector functions", () => {
      const groupStyleSet = createStyleSet({
        variants: {
          heading: {
            colors: {
              default: "bg-popover-label",
              muted: "bg-muted",
              accent: "bg-accent"
            },
            spacing: {
              none: "",
              sm: "ml-2",
              default: "ml-3",
              lg: "ml-4"
            }
          }
        }
      });

      // Test that nested selectors exist and are functions
      expect(typeof groupStyleSet.variants.heading).toBe("object");
      expect(typeof groupStyleSet.variants.heading.colors).toBe("function");
      expect(typeof groupStyleSet.variants.heading.spacing).toBe("function");

      // Test that selectors return correct classes
      expect(groupStyleSet.variants.heading.colors("muted")).toBe("bg-muted");
      expect(groupStyleSet.variants.heading.spacing("sm")).toBe("ml-2");
    });
  });

  describe("nested variant select() method", () => {
    it("should select nested variants using dot notation", () => {
      const groupStyleSet = createStyleSet({
        variants: {
          spacing: {
            none: "",
            sm: "gap-0.5",
            default: "gap-1"
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
              default: "ml-3"
            }
          }
        },
        defaultVariants: {
          spacing: "default"
        }
      });

      // Test selecting nested variants with full path
      const result1 = groupStyleSet.variants.select("heading.colors.muted", "heading.spacing.sm");
      expect(result1).toContain("bg-muted");
      expect(result1).toContain("ml-2");

      // Test mixing flat and nested selections
      const result2 = groupStyleSet.variants.select("spacing.sm", "heading.colors.accent");
      expect(result2).toContain("gap-0.5");
      expect(result2).toContain("bg-accent");
    });

    it("should use defaultVariants for nested variants", () => {
      const groupStyleSet = createStyleSet({
        variants: {
          heading: {
            colors: {
              default: "bg-popover-label",
              muted: "bg-muted"
            }
          }
        },
        defaultVariants: {
          heading: {
            colors: "default"
          }
        }
      });

      // Select using just the path (should use default)
      const result = groupStyleSet.variants.select("heading.colors");
      expect(result).toBe("bg-popover-label");
    });
  });

  describe("mixed flat and nested variants", () => {
    it("should handle both flat and nested variants in the same config", () => {
      const styleSet = createStyleSet({
        base: "flex",
        variants: {
          // Flat variant
          size: {
            sm: "text-sm",
            md: "text-base",
            lg: "text-lg"
          },
          // Nested variant
          button: {
            intent: {
              primary: "bg-blue-500",
              secondary: "bg-gray-500"
            },
            rounded: {
              none: "rounded-none",
              sm: "rounded-sm",
              full: "rounded-full"
            }
          }
        },
        defaultVariants: {
          size: "md"
        }
      });

      // Test flat variant
      const result1 = styleSet({ size: "lg" });
      expect(result1).toContain("flex");
      expect(result1).toContain("text-lg");

      // Test nested variant
      const result2 = styleSet({ button: { intent: "primary", rounded: "full" } });
      expect(result2).toContain("bg-blue-500");
      expect(result2).toContain("rounded-full");

      // Test both together
      const result3 = styleSet({ size: "sm", button: { intent: "secondary", rounded: "sm" } });
      expect(result3).toContain("text-sm");
      expect(result3).toContain("bg-gray-500");
      expect(result3).toContain("rounded-sm");
    });
  });

  describe("type safety", () => {
    it("should infer correct types for nested variants", () => {
      const groupStyleSet = createStyleSet({
        variants: {
          heading: {
            colors: {
              default: "bg-popover-label",
              muted: "bg-muted",
              accent: "bg-accent"
            }
          }
        }
      });

      // These should compile without errors (type-only test)
      const _result1: string = groupStyleSet({ heading: { colors: "muted" } });
      const _result2: string = groupStyleSet.variants.heading.colors("accent");
      const _result3: string = groupStyleSet.variants.select("heading.colors.muted");

      expect(true).toBe(true); // Placeholder assertion
    });
  });

  describe("edge cases", () => {
    it("should handle empty nested objects", () => {
      const styleSet = createStyleSet({
        variants: {
          nested: {
            empty: {}
          }
        }
      });

      const result = styleSet({});
      expect(result).toBe("");
    });

    it("should handle null values in nested variants", () => {
      const styleSet = createStyleSet({
        variants: {
          button: {
            intent: {
              primary: "bg-blue-500",
              secondary: "bg-gray-500"
            }
          }
        }
      });

      // Null should be treated as "don't apply"
      const result = styleSet({ button: { intent: null as any } });
      expect(result).not.toContain("bg-blue-500");
      expect(result).not.toContain("bg-gray-500");
    });
  });
});