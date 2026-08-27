import { locators, page } from "@vitest/browser/context";
import { beforeEach, describe, expect, test } from "vitest";
import { render } from "vitest-browser-svelte";
import Basic from "../demo/src/routes/basic.svelte";
import { createStyleSet } from "./stylesets";
import type { EnhancedStylerConfig } from "./types/themes";

declare module "@vitest/browser/context" {
  interface LocatorSelectors {
    getByDataAttribute(attribute: string, value: string): Locator;
  }
}

locators.extend({
  getByDataAttribute(attribute, value) {
    return `[data-${attribute}="${value}"]`;
  }
});

describe("Theme System Integration", () => {
  let basicConfig: EnhancedStylerConfig<any, any>;

  beforeEach(() => {
    basicConfig = {
      base: "component",
      variants: {
        intent: {
          primary: "bg-{color.primary} text-{color.text}",
          secondary: "bg-{color.secondary} text-{color.secondaryText}"
        },
        size: {
          small: "text-sm px-{spacing.small}",
          large: "text-lg px-{spacing.large}"
        }
      },
      tokens: {
        color: {
          primary: "blue-500",
          text: "white",
          secondary: "gray-500",
          secondaryText: "gray-900"
        },
        spacing: {
          small: "2",
          large: "6"
        }
      },
      themes: {
        dark: {
          tokens: {
            color: {
              primary: "blue-400",
              text: "gray-100",
              secondary: "gray-700",
              secondaryText: "gray-200"
            },
            spacing: {
              small: "3",
              large: "8"
            }
          }
        },
        light: {
          tokens: {
            color: {
              primary: "blue-600",
              text: "gray-900",
              secondary: "gray-200",
              secondaryText: "gray-800"
            }
          }
        },
        neon: {
          tokens: {
            color: {
              primary: "pink-500",
              text: "cyan-100",
              secondary: "purple-600",
              secondaryText: "purple-100"
            }
          }
        }
      }
    };
  });

  test("should apply theme-specific tokens correctly", () => {
    const styler = createStyleSet(basicConfig);

    // Test default theme
    const defaultResult = styler({ intent: "primary" });
    expect(defaultResult).toContain("bg-blue-500");
    expect(defaultResult).toContain("text-white");

    // Test dark theme
    const darkResult = styler({ intent: "primary", theme: "dark" });
    expect(darkResult).toContain("bg-blue-400");
    expect(darkResult).toContain("text-gray-100");

    // Test light theme
    const lightResult = styler({ intent: "primary", theme: "light" });
    expect(lightResult).toContain("bg-blue-600");
    expect(lightResult).toContain("text-gray-900");

    // Test neon theme
    const neonResult = styler({ intent: "primary", theme: "neon" });
    expect(neonResult).toContain("bg-pink-500");
    expect(neonResult).toContain("text-cyan-100");
  });

  test("should handle theme switching between multiple calls", () => {
    const styler = createStyleSet(basicConfig);

    // First call with dark theme
    const darkResult = styler({ intent: "primary", theme: "dark" });
    expect(darkResult).toContain("bg-blue-400");

    // Second call with light theme should switch correctly
    const lightResult = styler({ intent: "primary", theme: "light" });
    expect(lightResult).toContain("bg-blue-600");

    // Third call with neon theme should switch correctly
    const neonResult = styler({ intent: "primary", theme: "neon" });
    expect(neonResult).toContain("bg-pink-500");

    // Back to default (no theme specified)
    const defaultResult = styler({ intent: "primary" });
    expect(defaultResult).toContain("bg-blue-500");
  });

  test("should handle theme switching with multiple variants", () => {
    const styler = createStyleSet(basicConfig);

    // Test multiple variants with dark theme
    const darkMultiResult = styler({
      intent: "secondary",
      size: "large",
      theme: "dark"
    });
    expect(darkMultiResult).toContain("bg-gray-700");
    expect(darkMultiResult).toContain("text-gray-200");
    expect(darkMultiResult).toContain("px-8");

    // Switch to light theme with same variants
    const lightMultiResult = styler({
      intent: "secondary",
      size: "large",
      theme: "light"
    });
    expect(lightMultiResult).toContain("bg-gray-200");
    expect(lightMultiResult).toContain("text-gray-800");
    expect(lightMultiResult).toContain("px-6"); // Should use default spacing
  });

  test("should handle theme switching with recipes", () => {
    const styler = createStyleSet({
      recipes: {
        button: "bg-{color.primary} text-{color.text} px-{spacing.small} py-2",
        card: "bg-{color.secondary} border border-{color.primary}"
      },
      tokens: {
        color: {
          primary: "blue-500",
          text: "white",
          secondary: "gray-100"
        },
        spacing: {
          small: "4"
        }
      },
      themes: {
        dark: {
          tokens: {
            color: {
              primary: "blue-400",
              text: "gray-100",
              secondary: "gray-800"
            },
            spacing: {
              small: "3"
            }
          }
        },
        neon: {
          tokens: {
            color: {
              primary: "pink-500",
              text: "cyan-100",
              secondary: "black"
            }
          }
        }
      }
    });

    // Test default recipe
    expect(styler.button.toString()).toContain("bg-blue-500");
    expect(styler.button.toString()).toContain("text-white");
    expect(styler.button.toString()).toContain("px-4");

    // Apply dark theme and test recipe
    styler({ theme: "dark" });
    expect(styler.button.toString()).toContain("bg-blue-400");
    expect(styler.button.toString()).toContain("text-gray-100");
    expect(styler.button.toString()).toContain("px-3");

    // Apply neon theme and test recipe
    styler({ theme: "neon" });
    expect(styler.button.toString()).toContain("bg-pink-500");
    expect(styler.button.toString()).toContain("text-cyan-100");
    expect(styler.button.toString()).toContain("px-4"); // Should use default

    // Test card recipe with neon theme
    expect(styler.card.toString()).toContain("bg-black");
    expect(styler.card.toString()).toContain("border-pink-500");
  });

  test("should handle recipe selectors with theme switching", () => {
    const styler = createStyleSet({
      recipes: {
        container: "max-w-{layout.container} mx-auto",
        card: "bg-{color.surface} shadow-{shadow.card}"
      },
      tokens: {
        layout: {
          container: "7xl"
        },
        color: {
          surface: "white"
        },
        shadow: {
          card: "lg"
        }
      },
      themes: {
        dark: {
          tokens: {
            color: {
              surface: "gray-800"
            },
            shadow: {
              card: "2xl"
            }
          }
        }
      }
    });

    // Test recipe selection with default theme
    const defaultSelect = styler.select("container", "card");
    expect(defaultSelect).toContain("max-w-7xl");
    expect(defaultSelect).toContain("bg-white");
    expect(defaultSelect).toContain("shadow-lg");

    // Apply dark theme and test selection
    styler({ theme: "dark" });
    const darkSelect = styler.select("container", "card");
    expect(darkSelect).toContain("max-w-7xl");
    expect(darkSelect).toContain("bg-gray-800");
    expect(darkSelect).toContain("shadow-2xl");
  });

  test("should handle nested token references with themes", () => {
    const styler = createStyleSet({
      base: "border-{color.border} text-{color.text}",
      tokens: {
        color: {
          border: "{color.primary}",
          primary: "blue-500",
          text: "{color.primary}"
        }
      },
      themes: {
        custom: {
          tokens: {
            color: {
              border: "{color.primary}",
              primary: "green-500",
              text: "green-900"
            }
          }
        }
      }
    });

    // Test default nested resolution
    const defaultResult = styler();
    expect(defaultResult).toContain("border-blue-500");
    expect(defaultResult).toContain("text-blue-500");

    // Test theme nested resolution
    const themedResult = styler({ theme: "custom" });
    expect(themedResult).toContain("border-green-500");
    expect(themedResult).toContain("text-green-900");
  });

  test("should handle theme switching with compound variants", () => {
    const styler = createStyleSet({
      base: "btn",
      variants: {
        intent: {
          primary: "bg-{color.primary}",
          secondary: "bg-{color.secondary}"
        },
        size: {
          small: "px-{spacing.small}",
          large: "px-{spacing.large}"
        }
      },
      compoundVariants: [
        {
          intent: "primary",
          size: "large",
          class: "font-bold shadow-{shadow.primary}"
        }
      ],
      tokens: {
        color: {
          primary: "blue-500",
          secondary: "gray-500"
        },
        spacing: {
          small: "2",
          large: "6"
        },
        shadow: {
          primary: "lg"
        }
      },
      themes: {
        dark: {
          tokens: {
            color: {
              primary: "blue-400",
              secondary: "gray-700"
            },
            shadow: {
              primary: "xl"
            }
          }
        }
      }
    });

    // Test compound variant with default theme
    const defaultCompound = styler({ intent: "primary", size: "large" });
    expect(defaultCompound).toContain("bg-blue-500");
    expect(defaultCompound).toContain("px-6");
    expect(defaultCompound).toContain("shadow-lg");

    // Test compound variant with dark theme
    const darkCompound = styler({ intent: "primary", size: "large", theme: "dark" });
    expect(darkCompound).toContain("bg-blue-400");
    expect(darkCompound).toContain("px-6");
    expect(darkCompound).toContain("shadow-xl");
  });

  test("should handle theme switching with accessibility", () => {
    const styler = createStyleSet({
      base: "button bg-{color.primary}",
      tokens: {
        color: {
          primary: "blue-500"
        }
      },
      themes: {
        dark: {
          tokens: {
            color: {
              primary: "blue-400"
            }
          }
        }
      },
      accessibility: {
        focusRing: {
          default: "focus:ring-{color.primary}",
          auto: true
        }
      }
    });

    // Test with dark theme and accessibility
    const result = styler({ theme: "dark" });
    expect(result).toContain("bg-blue-400");
    expect(result).toContain("focus:ring-blue-400");
  });

  test("should clear token cache when theme switches", () => {
    const styler = createStyleSet({
      base: "bg-{color.primary}",
      tokens: {
        color: {
          primary: "blue-500"
        }
      },
      themes: {
        theme1: {
          tokens: {
            color: {
              primary: "red-500"
            }
          }
        },
        theme2: {
          tokens: {
            color: {
              primary: "green-500"
            }
          }
        }
      }
    });

    // First call with theme1
    const result1 = styler({ theme: "theme1" });
    expect(result1).toContain("bg-red-500");

    // Switch to theme2 - should not use cached value
    const result2 = styler({ theme: "theme2" });
    expect(result2).toContain("bg-green-500");

    // Switch back to theme1
    const result3 = styler({ theme: "theme1" });
    expect(result3).toContain("bg-red-500");
  });

  test("should handle complex theme switching scenarios", () => {
    const styler = createStyleSet({
      base: "component",
      variants: {
        state: {
          active: "bg-{color.active} text-{color.activeText}",
          inactive: "bg-{color.inactive} text-{color.inactiveText}"
        }
      },
      recipes: {
        highlight: "border-{color.accent} shadow-{shadow.glow}"
      },
      tokens: {
        color: {
          active: "blue-600",
          activeText: "white",
          inactive: "gray-200",
          inactiveText: "gray-700",
          accent: "blue-500"
        },
        shadow: {
          glow: "lg"
        }
      },
      themes: {
        purple: {
          tokens: {
            color: {
              active: "purple-600",
              activeText: "purple-100",
              inactive: "purple-200",
              inactiveText: "purple-800",
              accent: "purple-400"
            }
          }
        },
        sunset: {
          tokens: {
            color: {
              active: "orange-500",
              activeText: "yellow-100",
              inactive: "orange-100",
              inactiveText: "orange-900",
              accent: "yellow-400"
            },
            shadow: {
              glow: "xl"
            }
          }
        }
      }
    });

    // Test complex scenario with multiple theme switches
    const defaultActive = styler({ state: "active" });
    expect(defaultActive).toContain("bg-blue-600");
    expect(defaultActive).toContain("text-white");

    const purpleInactive = styler({ state: "inactive", theme: "purple" });
    expect(purpleInactive).toContain("bg-purple-200");
    expect(purpleInactive).toContain("text-purple-800");

    const sunsetActive = styler({ state: "active", theme: "sunset" });
    expect(sunsetActive).toContain("bg-orange-500");
    expect(sunsetActive).toContain("text-yellow-100");

    // Test recipe with sunset theme
    styler({ theme: "sunset" });
    expect(styler.highlight.toString()).toContain("border-yellow-400");
    expect(styler.highlight.toString()).toContain("shadow-xl");
  });
});

describe("Browser Theme Switching Demo", () => {
  test("should change theme when clicking theme buttons", async () => {
    render(Basic, {
      mode: "light"
    });

    // Get the initial theme indicator
    const themeIndicator = page.getByDataAttribute("theme", "light");
    await expect.element(themeIndicator).toHaveTextContent("light");

    // Click dark theme button
    const darkButton = page.getByRole("button", { name: "dark" });
    await darkButton.click();

    // Verify theme changed to dark
    const darkThemeIndicator = page.getByDataAttribute("theme", "dark");
    await expect.element(darkThemeIndicator).toHaveTextContent("dark");

    // Click neon theme button
    const neonButton = page.getByRole("button", { name: "neon" });
    await neonButton.click();

    // Verify theme changed to neon
    const neonThemeIndicator = page.getByDataAttribute("theme", "neon");
    await expect.element(neonThemeIndicator).toHaveTextContent("neon");

    // Click light theme button
    const lightButton = page.getByRole("button", { name: "light" });
    await lightButton.click();

    // Verify theme changed back to light
    const lightThemeIndicator = page.getByDataAttribute("theme", "light");
    await expect.element(lightThemeIndicator).toHaveTextContent("light");
  });

  test("should apply theme-specific CSS classes in demo", async () => {
    render(Basic, {
      mode: "light"
    });

    // Get a button that uses theme tokens
    const primaryButton = page.getByRole("button", { name: "Primary" });

    // Check initial light theme classes
    await expect.element(primaryButton).toHaveClass(/bg-blue-600/); // Light theme primary color

    // Switch to dark theme
    const darkButton = page.getByRole("button", { name: "dark" });
    await darkButton.click();

    // Check that classes have changed to dark theme
    await expect.element(primaryButton).toHaveClass(/bg-blue-500/); // Dark theme primary color

    // Switch to neon theme
    const neonButton = page.getByRole("button", { name: "neon" });
    await neonButton.click();

    // Check that classes have changed to neon theme
    await expect.element(primaryButton).toHaveClass(/bg-cyan-400/); // Neon theme primary color
  });
});
