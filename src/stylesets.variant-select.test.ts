import { describe, expect, it } from "vitest";
import { createStyleSet } from "./stylesets";
import type { VariantProps } from "./types";

describe("createStyleSet - variants.select()", () => {
  describe("basic variant selection", () => {
    it("should select specific variant values using variant.key format", () => {
      const styleSet = createStyleSet({
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

      // Test selecting specific variant values
      const result = styleSet.variants.select("padding.sm", "custom.bar", "spacing.lg");
      expect(result).toBe("p-1 bg-blue-500 gap-2");
    });

    it("should use defaultVariants when variant name is provided without key", () => {
      const styleSet = createStyleSet({
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
          }
        },
        defaultVariants: {
          spacing: "default",
          padding: "sm"
        }
      });

      // Test using default values
      const result = styleSet.variants.select("spacing", "padding");
      expect(result).toBe("gap-1 p-1");
    });

    it("should handle mixed selection formats", () => {
      const styleSet = createStyleSet({
        base: ["flex"],
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

      // Mix of variant.key and variant formats
      const result = styleSet.variants.select("padding.sm", "custom.bar", "spacing");
      expect(result).toBe("p-1 bg-blue-500 gap-1");
    });
  });

  describe("edge cases", () => {
    it("should ignore invalid variant names", () => {
      const styleSet = createStyleSet({
        variants: {
          spacing: {
            sm: "gap-0.5",
            lg: "gap-2"
          }
        }
      });

      const result = styleSet.variants.select("invalid.key", "spacing.sm");
      expect(result).toBe("gap-0.5");
    });

    it("should ignore invalid variant keys", () => {
      const styleSet = createStyleSet({
        variants: {
          spacing: {
            sm: "gap-0.5",
            lg: "gap-2"
          }
        }
      });

      const result = styleSet.variants.select("spacing.invalid", "spacing.sm");
      expect(result).toBe("gap-0.5");
    });

    it("should handle empty selection", () => {
      const styleSet = createStyleSet({
        variants: {
          spacing: {
            sm: "gap-0.5",
            lg: "gap-2"
          }
        }
      });

      const result = styleSet.variants.select();
      expect(result).toBe("");
    });

    it("should handle variants without defaultVariants", () => {
      const styleSet = createStyleSet({
        variants: {
          spacing: {
            sm: "gap-0.5",
            lg: "gap-2"
          }
        }
      });

      // Without defaultVariants, using just variant name should not select anything
      const result = styleSet.variants.select("spacing");
      expect(result).toBe("");
    });

    it("should handle null defaultVariant value", () => {
      const styleSet = createStyleSet({
        variants: {
          spacing: {
            sm: "gap-0.5",
            lg: "gap-2"
          }
        },
        defaultVariants: {
          spacing: null as any
        }
      });

      const result = styleSet.variants.select("spacing");
      expect(result).toBe("");
    });
  });

  describe("with truthy/falsy variants", () => {
    it("should handle string-style (truthy) variants", () => {
      const styleSet = createStyleSet({
        variants: {
          focus: "ring-2 ring-blue-500",
          disabled: "opacity-50 cursor-not-allowed"
        },
        defaultVariants: {
          focus: true,
          disabled: false
        }
      });

      // Select using variant.true format for truthy variants
      const result1 = styleSet.variants.select("focus.true", "disabled.true");
      expect(result1).toBe("ring-2 ring-blue-500 opacity-50 cursor-not-allowed");

      // Select using default values
      const result2 = styleSet.variants.select("focus", "disabled");
      // focus defaults to true, disabled defaults to false
      expect(result2).toBe("ring-2 ring-blue-500");
    });

    it("should handle array-style (truthy) variants", () => {
      const styleSet = createStyleSet({
        variants: {
          highlighted: ["bg-yellow-100", "border-yellow-300"]
        },
        defaultVariants: {
          highlighted: true
        }
      });

      const result1 = styleSet.variants.select("highlighted.true");
      expect(result1).toBe("bg-yellow-100 border-yellow-300");

      const result2 = styleSet.variants.select("highlighted");
      expect(result2).toBe("bg-yellow-100 border-yellow-300");
    });
  });

  describe("with tailwind-merge", () => {
    it("should properly merge conflicting classes", () => {
      const styleSet = createStyleSet({
        variants: {
          padding: {
            sm: "p-2",
            lg: "p-8"
          },
          spacing: {
            default: "p-4",
            large: "p-6"
          }
        }
      });

      // Should merge conflicting padding classes
      const result = styleSet.variants.select("padding.sm", "spacing.large");
      // p-6 should win as it comes last
      expect(result).toBe("p-6");
    });
  });

  describe("with compoundVariants", () => {
    it("should work alongside regular variant selection", () => {
      const styleSet = createStyleSet({
        variants: {
          intent: {
            primary: "bg-blue-500 text-white",
            secondary: "bg-gray-500 text-white"
          },
          size: {
            sm: "px-2 py-1 text-sm",
            lg: "px-4 py-2 text-lg"
          }
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "lg",
            class: "font-bold"
          }
        ],
        defaultVariants: {
          intent: "primary",
          size: "lg"
        }
      });

      // Test that select works independently of compound variants
      const result1 = styleSet.variants.select("intent.primary", "size.lg");
      expect(result1).toBe("bg-blue-500 text-white px-4 py-2 text-lg");

      // Using the main function should still apply compound variants
      const result2 = styleSet({ intent: "primary", size: "lg" });
      expect(result2).toBe("bg-blue-500 text-white px-4 py-2 text-lg font-bold");
    });
  });

  describe("with tokens", () => {
    it.skip("should process tokens in selected variants", () => {
      // TODO: Token processing in select requires registering tokens first
      // This is a more complex feature that needs additional implementation
      const styleSet = createStyleSet({
        variants: {
          spacing: {
            sm: "$spacing.sm",
            lg: "$spacing.lg"
          }
        },
        tokens: {
          spacing: {
            sm: "gap-2",
            lg: "gap-8"
          }
        }
      });

      const result = styleSet.variants.select("spacing.sm");
      expect(result).toBe("gap-2");
    });
  });

  describe("with accessibility enhancements", () => {
    it.skip("should apply accessibility enhancements to selected variants", () => {
      // TODO: Accessibility enhancements in select need proper context setup
      const styleSet = createStyleSet({
        variants: {
          interactive: {
            button: "px-4 py-2"
          }
        },
        accessibility: {
          highContrast: {
            "px-4": "px-5",
            "py-2": "py-3"
          }
        }
      });

      // Enable high contrast
      styleSet.accessibility.setPreferences({ highContrast: true });

      const result = styleSet.variants.select("interactive.button");
      expect(result).toBe("px-5 py-3");
    });
  });

  describe("type safety", () => {
    it("should have select method on variants object", () => {
      const styleSet = createStyleSet({
        variants: {
          spacing: {
            sm: "gap-0.5",
            lg: "gap-2"
          }
        }
      });

      expect(typeof styleSet.variants.select).toBe("function");
    });

    it("should properly type the variants object with select method", () => {
      const styleSet = createStyleSet({
        variants: {
          spacing: {
            sm: "gap-0.5",
            lg: "gap-2"
          }
        }
      });

      // Type check - this should compile without errors
      const result: string = styleSet.variants.select("spacing.sm");
      expect(typeof result).toBe("string");
    });
  });

  describe("complex real-world scenario", () => {
    it("should handle complex component styling selections", () => {
      const componentStyles = createStyleSet({
        base: "rounded-lg shadow-md",
        variants: {
          intent: {
            primary: "bg-blue-500 text-white hover:bg-blue-600",
            secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
            danger: "bg-red-500 text-white hover:bg-red-600"
          },
          size: {
            xs: "text-xs px-2 py-1",
            sm: "text-sm px-3 py-1.5",
            md: "text-base px-4 py-2",
            lg: "text-lg px-5 py-2.5",
            xl: "text-xl px-6 py-3"
          },
          variant: {
            solid: "",
            outline: "bg-transparent border-2",
            ghost: "bg-transparent hover:bg-opacity-10"
          },
          fullWidth: "w-full",
          disabled: "opacity-50 cursor-not-allowed pointer-events-none"
        },
        defaultVariants: {
          intent: "primary",
          size: "md",
          variant: "solid",
          fullWidth: false,
          disabled: false
        }
      });

      // Complex selection with multiple formats
      const buttonClasses = componentStyles.variants.select(
        "intent.danger",
        "size.lg",
        "variant.outline",
        "disabled.true"
      );

      // Note: bg-transparent from outline variant overrides bg-red-500 from intent.danger
      // This is correct tailwind-merge behavior - later classes win
      expect(buttonClasses).toContain("bg-transparent");
      expect(buttonClasses).toContain("text-white");
      expect(buttonClasses).toContain("px-5");
      expect(buttonClasses).toContain("py-2.5");
      expect(buttonClasses).toContain("border-2");
      expect(buttonClasses).toContain("opacity-50");
      expect(buttonClasses).toContain("cursor-not-allowed");

      // Using defaults
      const defaultButtonClasses = componentStyles.variants.select("intent", "size");
      expect(defaultButtonClasses).toContain("bg-blue-500");
      expect(defaultButtonClasses).toContain("px-4");
      expect(defaultButtonClasses).toContain("py-2");
    });
  });

  describe("object selector support", () => {
    describe("basic object selectors", () => {
      it("should support object selectors for flat variants", () => {
        const styleSet = createStyleSet({
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

        // Test object selector
        const result = styleSet.variants.select({
          spacing: "sm",
          padding: "lg",
          custom: "bar"
        });

        expect(result).toContain("gap-0.5");
        expect(result).toContain("p-2");
        expect(result).toContain("bg-blue-500");
      });

      it("should support object selectors for nested variants", () => {
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
            heading: {
              spacing: "lg"
            }
          }
        });

        // Test nested object selector
        const result = groupStyleSet.variants.select({
          heading: {
            colors: "muted"
          }
        });

        // Should include both the explicit value and the default for sibling variant
        expect(result).toContain("bg-muted");
        expect(result).toContain("ml-4"); // heading.spacing defaults to "lg"
      });

      it("should support mixed object and string selectors", () => {
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
            heading: {
              spacing: "lg"
            }
          }
        });

        // Mix object and string selectors
        const result = groupStyleSet.variants.select(
          {
            heading: {
              colors: "muted"
            }
          },
          "spacing.sm",
          "padding"
        );

        expect(result).toContain("bg-muted");
        expect(result).toContain("gap-0.5");
        // padding defaults to "none" which is empty string, so shouldn't add classes
      });
    });

    describe("user example from issue", () => {
      it("should match the exact user example - selecting parent variant with string", () => {
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
            heading: {
              spacing: "lg"
            }
          }
        });

        // String selector for parent - should select all child defaults
        const withSelectorString = groupStyleSet.variants.select("heading");

        // Should include default color and default spacing (lg)
        expect(withSelectorString).toContain("ml-4"); // heading.spacing defaults to "lg"
        // No default for colors, but "default" key exists
        expect(withSelectorString).toContain("bg-popover-label"); // heading.colors has "default" key
      });

      it("should match the exact user example - selecting with object and strings", () => {
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
            heading: {
              spacing: "lg"
            }
          }
        });

        // Mixed object and string selectors
        const withObject = groupStyleSet.variants.select(
          {
            heading: {
              colors: "muted"
            }
          },
          "spacing.sm",
          "padding"
        );

        // Expected: "bg-muted ml-4 gap-0.5 p-1.5"
        expect(withObject).toContain("bg-muted"); // explicit value from object
        expect(withObject).toContain("ml-4"); // heading.spacing defaults to "lg"
        expect(withObject).toContain("gap-0.5"); // spacing.sm
        // padding has no defaultVariants, but has "default" key
        expect(withObject).toContain("p-1.5"); // padding has "default" key
      });
    });

    describe("edge cases with object selectors", () => {
      it("should handle empty object selector", () => {
        const styleSet = createStyleSet({
          variants: {
            spacing: {
              sm: "gap-0.5",
              lg: "gap-2"
            }
          }
        });

        const result = styleSet.variants.select({});
        expect(result).toBe("");
      });

      it("should handle object selector with null values", () => {
        const styleSet = createStyleSet({
          variants: {
            spacing: {
              sm: "gap-0.5",
              lg: "gap-2"
            },
            padding: {
              sm: "p-1",
              lg: "p-2"
            }
          }
        });

        const result = styleSet.variants.select({
          spacing: "sm",
          padding: null as any
        });

        expect(result).toBe("gap-0.5");
      });

      it("should handle object selector with undefined values", () => {
        const styleSet = createStyleSet({
          variants: {
            spacing: {
              sm: "gap-0.5",
              lg: "gap-2"
            },
            padding: {
              sm: "p-1",
              lg: "p-2"
            }
          }
        });

        const result = styleSet.variants.select({
          spacing: "sm",
          padding: undefined
        });

        expect(result).toBe("gap-0.5");
      });

      it("should handle object selector with truthy variants", () => {
        const styleSet = createStyleSet({
          variants: {
            focus: "ring-2 ring-blue-500",
            disabled: "opacity-50 cursor-not-allowed"
          },
          defaultVariants: {
            focus: true,
            disabled: false
          }
        });

        const result = styleSet.variants.select({
          focus: true,
          disabled: true
        });

        expect(result).toContain("ring-2");
        expect(result).toContain("ring-blue-500");
        expect(result).toContain("opacity-50");
        expect(result).toContain("cursor-not-allowed");
      });

      it("should handle deeply nested object selectors", () => {
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

        const result = styleSet.variants.select({
          level1: {
            level2: {
              level3: "deep"
            }
          }
        });

        expect(result).toBe("text-deep");
      });
    });

    describe("type safety with object selectors", () => {
      it("should allow properly typed object selectors", () => {
        const styleSet = createStyleSet({
          variants: {
            spacing: {
              sm: "gap-0.5",
              lg: "gap-2"
            },
            padding: {
              sm: "p-1",
              lg: "p-2"
            }
          }
        });

        // This should compile without errors
        const result: string = styleSet.variants.select({
          spacing: "sm",
          padding: "lg"
        });

        expect(typeof result).toBe("string");
      });

      it("should allow mixed typed selectors", () => {
        const styleSet = createStyleSet({
          variants: {
            spacing: {
              sm: "gap-0.5",
              lg: "gap-2"
            },
            padding: {
              sm: "p-1",
              lg: "p-2"
            }
          }
        });

        // This should compile without errors
        const result: string = styleSet.variants.select(
          { spacing: "sm" },
          "padding.lg"
        );

        expect(typeof result).toBe("string");
      });
    });

    describe("with tailwind-merge", () => {
      it("should properly merge conflicting classes from object selectors", () => {
        const styleSet = createStyleSet({
          variants: {
            padding: {
              sm: "p-2",
              lg: "p-8"
            },
            spacing: {
              default: "p-4",
              large: "p-6"
            }
          }
        });

        // Should merge conflicting padding classes from object selector
        const result = styleSet.variants.select({
          padding: "sm",
          spacing: "large"
        });

        // p-6 should win as it comes last (order of object keys matters in iteration)
        expect(result).toBe("p-6");
      });

      it("should properly merge classes between object and string selectors", () => {
        const styleSet = createStyleSet({
          variants: {
            padding: {
              sm: "p-2",
              lg: "p-8"
            },
            margin: {
              sm: "m-2",
              lg: "m-8"
            }
          }
        });

        // Object selector first, then string selector
        const result1 = styleSet.variants.select(
          { padding: "sm" },
          "padding.lg"
        );

        // String selector should win since it comes later
        expect(result1).toBe("p-8");

        // String selector first, then object selector
        const result2 = styleSet.variants.select(
          "padding.sm",
          { padding: "lg" }
        );

        // Object selector should win since it comes later
        expect(result2).toBe("p-8");
      });
    });
  });
});