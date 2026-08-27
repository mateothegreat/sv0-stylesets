import { describe, expect, test } from "vitest";
import { createStyleSet } from "./stylesets";
import type { EnhancedStylerConfig } from "./types";

describe("createStyleSet", () => {
  test("should create basic StyleSet with variants", () => {
    const button = createStyleSet({
      base: "btn",
      variants: {
        intent: {
          primary: "bg-blue-500",
          secondary: "bg-gray-500"
        },
        size: {
          small: "px-2 py-1",
          large: "px-6 py-3"
        }
      },
      defaultVariants: {
        intent: "primary",
        size: "small"
      }
    });

    expect(button()).toContain("btn");
    expect(button()).toContain("bg-blue-500");
    expect(button()).toContain("px-2 py-1");
    expect(button({ intent: "secondary" })).toContain("bg-gray-500");
    expect(button({ size: "large" })).toContain("px-6 py-3");
  });

  test("should handle compound variants", () => {
    const button = createStyleSet({
      base: "btn",
      variants: {
        intent: {
          primary: "bg-blue-500",
          secondary: "bg-gray-500"
        },
        size: {
          small: "px-2 py-1",
          large: "px-6 py-3"
        }
      },
      compoundVariants: [
        {
          intent: "primary",
          size: "large",
          class: "font-bold"
        }
      ]
    });

    expect(button({ intent: "primary", size: "large" })).toContain("font-bold");
    expect(button({ intent: "secondary", size: "large" })).not.toContain("font-bold");
  });

  test("should support recipes", () => {
    const layout = createStyleSet({
      recipes: {
        container: "max-w-7xl mx-auto px-4",
        card: "bg-white shadow rounded-lg",
        title: "text-2xl font-bold"
      }
    });

    expect(layout.container.toString()).toBe("max-w-7xl mx-auto px-4");
    expect(layout.card.with("p-6")).toContain("bg-white shadow rounded-lg p-6");
    expect(layout.select("container", "title")).toContain(
      "max-w-7xl mx-auto px-4 text-2xl font-bold"
    );
  });

  test("should resolve design tokens", () => {
    const button = createStyleSet({
      base: "btn",
      variants: {
        intent: {
          primary: "bg-{color.primary}",
          secondary: "bg-{color.secondary}"
        }
      },
      tokens: {
        color: {
          primary: "blue-500",
          secondary: "gray-500"
        }
      }
    });

    const result = button({ intent: "primary" });
    expect(result).toContain("bg-blue-500");

    const secondaryResult = button({ intent: "secondary" });
    expect(secondaryResult).toContain("bg-gray-500");
  });

  test("should apply variant classes correctly", () => {
    const component = createStyleSet({
      base: "component",
      variants: {
        theme: {
          primary: "text-blue-500 border-blue-500"
        }
      },
      defaultVariants: {
        theme: "primary"
      }
    });

    // Test with explicit variant
    const result = component({ theme: "primary" });
    expect(result).toContain("component");
    expect(result).toContain("text-blue-500");
    expect(result).toContain("border-blue-500");

    // Test with default variant
    const defaultResult = component();
    expect(defaultResult).toContain("component");
    expect(defaultResult).toContain("text-blue-500");
    expect(defaultResult).toContain("border-blue-500");
  });

  test("should apply accessibility enhancements", () => {
    const button = createStyleSet({
      base: "button px-4 py-2",
      accessibility: {
        focusRing: {
          default: "focus:ring-2 focus:ring-blue-500",
          auto: true
        }
      }
    });

    const result = button();
    expect(result).toContain("focus:ring-2 focus:ring-blue-500");
  });

  test("should support theme switching", () => {
    const config: EnhancedStylerConfig<{}, {}> = {
      base: "component",
      themes: {
        light: {
          tokens: {
            color: { primary: "blue-500" }
          }
        },
        dark: {
          tokens: {
            color: { primary: "blue-400" }
          }
        }
      }
    };

    const component = createStyleSet(config);

    // Theme should be accessible through the themes manager
    expect(component.themes.getTheme("light")).toBeDefined();
    expect(component.themes.getTheme("dark")).toBeDefined();
  });

  test("should handle class and className props", () => {
    const button = createStyleSet({
      base: "btn",
      variants: {
        intent: {
          primary: "bg-blue-500"
        }
      }
    });

    const withClass = button({ intent: "primary", class: "w-full" });
    expect(withClass).toContain("btn");
    expect(withClass).toContain("bg-blue-500");
    expect(withClass).toContain("w-full");

    const withClassName = button({ intent: "primary", className: "h-12" });
    expect(withClassName).toContain("btn");
    expect(withClassName).toContain("bg-blue-500");
    expect(withClassName).toContain("h-12");
  });

  test("should support rest parameters", () => {
    const button = createStyleSet({
      base: "btn",
      variants: {
        intent: {
          primary: "bg-blue-500"
        }
      }
    });

    const result = button({ intent: "primary" }, "extra-class", "another-class");
    expect(result).toContain("btn");
    expect(result).toContain("bg-blue-500");
    expect(result).toContain("extra-class");
    expect(result).toContain("another-class");
  });

  test("should expose variant selector functions", () => {
    const button = createStyleSet({
      variants: {
        intent: {
          primary: "bg-blue-500",
          secondary: "bg-gray-500"
        },
        size: {
          small: "px-2 py-1",
          large: "px-6 py-3"
        }
      }
    });

    // Check that variant selectors are functions
    expect(typeof button.variants.intent).toBe("function");
    expect(typeof button.variants.size).toBe("function");

    // Check that they work correctly
    expect(button.variants.intent("primary")).toBe("bg-blue-500");
    expect(button.variants.intent("secondary")).toBe("bg-gray-500");
    expect(button.variants.size("small")).toBe("px-2 py-1");
    expect(button.variants.size("large")).toBe("px-6 py-3");

    // Check that select method exists
    expect(typeof button.variants.select).toBe("function");
  });

  test("should handle null and undefined variant values", () => {
    const button = createStyleSet({
      base: "btn",
      variants: {
        intent: {
          primary: "bg-blue-500",
          secondary: "bg-gray-500"
        }
      },
      defaultVariants: {
        intent: "primary"
      }
    });

    const withNull = button({ intent: null });
    expect(withNull).toContain("btn");
    expect(withNull).not.toContain("bg-blue-500");
    expect(withNull).not.toContain("bg-gray-500");

    const withUndefined = button();
    expect(withUndefined).toContain("btn");
    expect(withUndefined).toContain("bg-blue-500"); // Should use default
  });

  test("should work with theme parameter", () => {
    const component = createStyleSet({
      base: "component",
      themes: {
        custom: {
          base: "custom-base",
          tokens: {
            color: { primary: "custom-blue" }
          }
        }
      }
    });

    // Theme parameter should trigger theme switching
    const result = component({ theme: "custom" });
    expect(result).toContain("component");
  });

  test("should allow disabling accessibility", () => {
    const button = createStyleSet({
      base: "button",
      accessibility: {
        focusRing: {
          default: "focus:ring-2 focus:ring-blue-500",
          auto: true
        }
      }
    });

    const withA11y = button();
    expect(withA11y).toContain("focus:ring-2");

    const withoutA11y = button({ accessibility: false });
    expect(withoutA11y).not.toContain("focus:ring-2");
  });

  test("should expose manager instances", () => {
    const styler = createStyleSet({
      base: "component",
      tokens: {
        color: { primary: "blue-500" }
      },
      accessibility: {
        focusRing: {
          default: "focus:ring-2",
          auto: true
        }
      }
    });

    expect(styler.tokens).toBeDefined();
    expect(styler.accessibility).toBeDefined();
    expect(styler.themes).toBeDefined();
    expect(typeof styler.withTheme).toBe("function");
    expect(typeof styler.withAccessibility).toBe("function");
  });

  test("should work as backward-compatible createStyleSet", () => {
    const button = createStyleSet({
      base: "btn",
      variants: {
        intent: {
          primary: "bg-blue-500",
          secondary: "bg-gray-500"
        }
      },
      defaultVariants: {
        intent: "primary"
      }
    });

    expect(button()).toContain("btn");
    expect(button()).toContain("bg-blue-500");
    expect(button({ intent: "secondary" })).toContain("bg-gray-500");
  });
});
