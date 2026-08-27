import { describe, expect, it } from "vitest";
import { createStyleSet } from "./stylesets";

describe("createStyleSet - Smart Default Resolution in select()", () => {
  describe("parent variant selection", () => {
    it("should select all child defaults when selecting parent variant", () => {
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
              default: "h-6 flex items-center text-sm text-muted-foreground select-none",
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

      // Test from user example: selecting "heading" should give "bg-popover-label ml-4"
      const result = groupStyleSet.variants.select("heading");
      expect(result).toContain("bg-popover-label"); // from colors.default
      expect(result).toContain("ml-4"); // from defaultVariants.heading.spacing = "lg"
    });

    it("should use 'default' key when no defaultVariants specified", () => {
      const styleSet = createStyleSet({
        variants: {
          button: {
            intent: {
              default: "bg-blue-500",
              primary: "bg-green-500",
              secondary: "bg-gray-500"
            },
            size: {
              default: "px-4 py-2",
              sm: "px-2 py-1",
              lg: "px-6 py-3"
            }
          }
        }
      });

      const result = styleSet.variants.select("button");
      expect(result).toContain("bg-blue-500"); // from intent.default
      expect(result).toContain("px-4 py-2"); // from size.default
    });

    it("should prefer defaultVariants over 'default' key", () => {
      const styleSet = createStyleSet({
        variants: {
          container: {
            size: {
              default: "max-w-md",
              sm: "max-w-sm",
              lg: "max-w-lg"
            },
            padding: {
              default: "p-4",
              none: "",
              comfortable: "p-6"
            }
          }
        },
        defaultVariants: {
          container: {
            size: "lg", // This should win over "default"
            padding: "comfortable" // This should win over "default"
          }
        }
      });

      const result = styleSet.variants.select("container");
      expect(result).toContain("max-w-lg"); // from defaultVariants, not "default"
      expect(result).toContain("p-6"); // from defaultVariants, not "default"
      expect(result).not.toContain("max-w-md");
      expect(result).not.toContain("p-4");
    });

    it("should skip variants without defaults", () => {
      const styleSet = createStyleSet({
        variants: {
          group: {
            color: {
              red: "text-red-500",
              blue: "text-blue-500"
              // No 'default' key
            },
            size: {
              default: "text-base",
              sm: "text-sm"
            }
          }
        }
        // No defaultVariants for group.color
      });

      const result = styleSet.variants.select("group");
      expect(result).toContain("text-base"); // size has default
      expect(result).not.toContain("text-red-500"); // color has no default, should skip
      expect(result).not.toContain("text-blue-500");
    });
  });

  describe("specific path selection", () => {
    it("should use explicit value when provided", () => {
      const styleSet = createStyleSet({
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

      // Explicit value should be used
      const result = styleSet.variants.select("heading.colors.muted");
      expect(result).toBe("bg-muted");
    });

    it("should use defaultVariants when no value provided", () => {
      const styleSet = createStyleSet({
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
            colors: "muted"
          }
        }
      });

      // No value provided, should use defaultVariants
      const result = styleSet.variants.select("heading.colors");
      expect(result).toBe("bg-muted");
    });

    it("should use 'default' key when no defaultVariants and no value", () => {
      const styleSet = createStyleSet({
        variants: {
          button: {
            size: {
              default: "px-4 py-2",
              sm: "px-2 py-1"
            }
          }
        }
      });

      const result = styleSet.variants.select("button.size");
      expect(result).toBe("px-4 py-2");
    });

    it("should skip when no default can be resolved", () => {
      const styleSet = createStyleSet({
        variants: {
          custom: {
            variant: {
              a: "variant-a",
              b: "variant-b"
              // No 'default' key
            }
          }
        }
        // No defaultVariants
      });

      const result = styleSet.variants.select("custom.variant");
      expect(result).toBe("");
    });
  });

  describe("priority order", () => {
    it("should follow priority: explicit value > defaultVariants > 'default' key", () => {
      const styleSet = createStyleSet({
        variants: {
          test: {
            value: {
              default: "value-default",
              a: "value-a",
              b: "value-b",
              c: "value-c"
            }
          }
        },
        defaultVariants: {
          test: {
            value: "b"
          }
        }
      });

      // Priority 1: Explicit value
      const explicit = styleSet.variants.select("test.value.c");
      expect(explicit).toBe("value-c");

      // Priority 2: defaultVariants (when no explicit value)
      const withDefault = styleSet.variants.select("test.value");
      expect(withDefault).toBe("value-b"); // from defaultVariants, not "default"

      // Priority 3: 'default' key (create new instance without defaultVariants)
      const styleSet2 = createStyleSet({
        variants: {
          test: {
            value: {
              default: "value-default",
              a: "value-a"
            }
          }
        }
      });

      const fallback = styleSet2.variants.select("test.value");
      expect(fallback).toBe("value-default"); // from 'default' key
    });
  });

  describe("mixed selections", () => {
    it("should handle mix of parent, path, and explicit selections", () => {
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
              muted: "bg-muted"
            },
            spacing: {
              default: "ml-3",
              sm: "ml-2",
              lg: "ml-4"
            }
          }
        },
        defaultVariants: {
          spacing: "sm",
          heading: {
            spacing: "lg"
          }
        }
      });

      // Mix: parent ("heading"), path with default ("spacing"), explicit ("heading.colors.muted")
      const result = groupStyleSet.variants.select(
        "heading",
        "spacing",
        "heading.colors.muted"
      );

      // "heading" processes first and gives: bg-popover-label (colors.default) + ml-4 (spacing from defaultVariants)
      // Then "heading.colors.muted" adds bg-muted
      // tailwind-merge will keep the last bg-* class, so bg-muted wins
      expect(result).toContain("bg-muted"); // from explicit value (overrides bg-popover-label)
      expect(result).not.toContain("bg-popover-label"); // overridden by bg-muted
      expect(result).toContain("ml-4"); // from heading.spacing defaultVariant

      // "spacing" should give: gap-0.5 (from defaultVariants = "sm")
      expect(result).toContain("gap-0.5");
    });
  });

  describe("deeply nested defaults", () => {
    it("should resolve defaults in deeply nested structures", () => {
      const styleSet = createStyleSet({
        variants: {
          layout: {
            container: {
              size: {
                default: "max-w-md",
                sm: "max-w-sm",
                lg: "max-w-lg"
              },
              padding: {
                default: "p-4",
                none: "",
                comfortable: "p-6"
              }
            },
            flex: {
              direction: {
                default: "flex-col",
                row: "flex-row"
              },
              align: {
                default: "items-start",
                center: "items-center"
              }
            }
          }
        },
        defaultVariants: {
          layout: {
            flex: {
              direction: "row"
            }
          }
        }
      });

      // Select entire "layout" parent
      const result = styleSet.variants.select("layout");

      // Should get defaults from all nested children
      expect(result).toContain("max-w-md"); // container.size.default
      expect(result).toContain("p-4"); // container.padding.default
      expect(result).toContain("flex-row"); // flex.direction from defaultVariants
      expect(result).toContain("items-start"); // flex.align.default
    });

    it("should select specific nested parent", () => {
      const styleSet = createStyleSet({
        variants: {
          layout: {
            container: {
              size: {
                default: "max-w-md",
                lg: "max-w-lg"
              },
              padding: {
                default: "p-4",
                comfortable: "p-6"
              }
            }
          }
        },
        defaultVariants: {
          layout: {
            container: {
              padding: "comfortable"
            }
          }
        }
      });

      // Select just "layout.container"
      const result = styleSet.variants.select("layout.container");

      expect(result).toContain("max-w-md"); // size.default
      expect(result).toContain("p-6"); // padding from defaultVariants
      expect(result).not.toContain("p-4");
    });
  });

  describe("edge cases", () => {
    it("should handle empty string defaults", () => {
      const styleSet = createStyleSet({
        variants: {
          optional: {
            none: "",
            default: "",
            some: "text-base"
          }
        }
      });

      const result = styleSet.variants.select("optional");
      expect(result).toBe(""); // default is empty string
    });

    it("should handle variants with only one option (no default)", () => {
      const styleSet = createStyleSet({
        variants: {
          single: {
            only: "text-single"
          }
        }
      });

      const result = styleSet.variants.select("single");
      expect(result).toBe(""); // No default, should be empty
    });
  });
});