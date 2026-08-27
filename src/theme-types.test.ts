import { describe, expect, it } from "vitest";
import { createStyleSet, ThemeManager, type ExtractThemeIds, type ExtractThemeIdsFromArray } from "./index";

describe("Theme Type Constraints", () => {
  describe("ExtractThemeIds", () => {
    it("should extract theme IDs from themes object", () => {
      const themes = {
        light: { tokens: {} },
        dark: { tokens: {} },
        custom: { tokens: {} }
      } as const;

      type ThemeIds = ExtractThemeIds<typeof themes>;

      // Type assertion tests (compile-time checks)
      const validId: ThemeIds = "light";
      const validId2: ThemeIds = "dark";
      const validId3: ThemeIds = "custom";

      expect(validId).toBe("light");
      expect(validId2).toBe("dark");
      expect(validId3).toBe("custom");
    });
  });

  describe("ExtractThemeIdsFromArray", () => {
    it("should extract theme IDs from theme config array", () => {
      const themeConfigs = [
        { id: "ocean" as const, name: "Ocean" },
        { id: "forest" as const, name: "Forest" },
        { id: "sunset" as const, name: "Sunset" }
      ] as const;

      type ThemeIds = ExtractThemeIdsFromArray<typeof themeConfigs>;

      // Type assertion tests (compile-time checks)
      const validId: ThemeIds = "ocean";
      const validId2: ThemeIds = "forest";
      const validId3: ThemeIds = "sunset";

      expect(validId).toBe("ocean");
      expect(validId2).toBe("forest");
      expect(validId3).toBe("sunset");
    });
  });

  describe("createStyleSet with typed themes", () => {
    it("should infer theme IDs from themes configuration", () => {
      const themes = {
        light: {
          tokens: {
            color: {
              primary: "blue-600",
              background: "white"
            }
          }
        },
        dark: {
          tokens: {
            color: {
              primary: "blue-400",
              background: "gray-900"
            }
          }
        }
      } as const;

      const button = createStyleSet({
        base: "px-4 py-2",
        variants: {
          intent: {
            primary: "bg-{color.primary}",
            secondary: "bg-gray-200"
          }
        },
        themes
      });

      // Test runtime behavior with different themes
      const lightResult = button({ theme: "light", intent: "primary" });
      expect(lightResult).toContain("px-4");

      const darkResult = button({ theme: "dark", intent: "primary" });
      expect(darkResult).toContain("px-4");
    });

    it("should work with theme switching", () => {
      const themes = {
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
              primary: "blue-500"
            }
          }
        }
      } as const;

      const component = createStyleSet({
        base: "base",
        variants: {
          variant: {
            a: "bg-{color.primary}",
            b: "text-{color.primary}"
          }
        },
        tokens: {
          color: {
            primary: "gray-500"
          }
        },
        themes
      });

      // Default (no theme)
      const defaultResult = component({ variant: "a" });
      expect(defaultResult).toContain("bg-gray-500");

      // With theme1
      const theme1Result = component({ variant: "a", theme: "theme1" });
      expect(theme1Result).toContain("bg-red-500");

      // With theme2
      const theme2Result = component({ variant: "a", theme: "theme2" });
      expect(theme2Result).toContain("bg-blue-500");
    });
  });

  describe("ThemeManager with typed themes", () => {
    it("should work with type-safe theme IDs", () => {
      const themeConfigs = [
        {
          id: "light" as const,
          name: "Light Theme",
          tokens: {
            color: {
              primary: { value: "blue-600", description: "Primary color" },
              background: { value: "white", description: "Background" }
            }
          }
        },
        {
          id: "dark" as const,
          name: "Dark Theme",
          tokens: {
            color: {
              primary: { value: "blue-400", description: "Primary color" },
              background: { value: "gray-900", description: "Background" }
            }
          }
        }
      ] as const;

      type ThemeIds = ExtractThemeIdsFromArray<typeof themeConfigs>;

      const manager = new ThemeManager(themeConfigs);

      // Type-safe theme switching
      const setTheme = (id: ThemeIds): boolean => {
        return manager.setActiveTheme(id);
      };

      expect(setTheme("light")).toBe(true);
      expect(manager.getActiveTheme()?.id).toBe("light");

      expect(setTheme("dark")).toBe(true);
      expect(manager.getActiveTheme()?.id).toBe("dark");
    });

    it("should share ThemeManager across multiple StyleSets", () => {
      const themeConfigs = [
        {
          id: "ocean" as const,
          name: "Ocean",
          tokens: {
            color: {
              primary: { value: "blue-500", description: "Primary" }
            }
          }
        },
        {
          id: "forest" as const,
          name: "Forest",
          tokens: {
            color: {
              primary: { value: "green-500", description: "Primary" }
            }
          }
        }
      ] as const;

      const themeManager = new ThemeManager(themeConfigs);

      const button = createStyleSet({
        base: "btn",
        variants: {
          variant: {
            primary: "bg-{color.primary}"
          }
        },
        tokens: {
          color: {
            primary: "gray-500"
          }
        },
        themeManager
      });

      const card = createStyleSet({
        base: "card",
        variants: {
          variant: {
            primary: "border-{color.primary}"
          }
        },
        tokens: {
          color: {
            primary: "gray-300"
          }
        },
        themeManager
      });

      // Both StyleSets share the same ThemeManager
      expect(button.themes).toBe(card.themes);
    });
  });

  describe("Real-world usage patterns", () => {
    it("should support app-wide theme system", () => {
      const APP_THEMES = {
        default: {
          tokens: {
            color: {
              primary: "indigo-600",
              text: "gray-900"
            }
          }
        },
        dark: {
          tokens: {
            color: {
              primary: "indigo-400",
              text: "gray-100"
            }
          }
        }
      } as const;

      type AppTheme = ExtractThemeIds<typeof APP_THEMES>;

      const heading = createStyleSet({
        base: "font-bold text-{color.text}",
        variants: {
          size: {
            sm: "text-lg",
            lg: "text-4xl"
          }
        },
        themes: APP_THEMES
      });

      const paragraph = createStyleSet({
        base: "text-{color.text}",
        variants: {
          muted: {
            true: "opacity-60",
            false: "opacity-100"
          }
        },
        themes: APP_THEMES
      });

      // Theme context class
      class ThemeContext {
        #theme: AppTheme = "default";

        setTheme(theme: AppTheme): void {
          this.#theme = theme;
        }

        getTheme(): AppTheme {
          return this.#theme;
        }
      }

      const context = new ThemeContext();

      // Use in components
      context.setTheme("dark");

      const headingResult = heading({
        size: "lg",
        theme: context.getTheme()
      });

      const paragraphResult = paragraph({
        muted: false,
        theme: context.getTheme()
      });

      expect(headingResult).toContain("font-bold");
      expect(paragraphResult).toContain("opacity-100");
    });

    it("should work with Svelte 5 reactivity patterns", () => {
      const themes = {
        light: {
          tokens: {
            color: {
              bg: "white",
              text: "black"
            }
          }
        },
        dark: {
          tokens: {
            color: {
              bg: "black",
              text: "white"
            }
          }
        }
      } as const;

      type Theme = ExtractThemeIds<typeof themes>;

      // Simulate $state() and $derived() pattern
      class ThemeStore {
        #currentTheme: Theme = "light";

        get current(): Theme {
          return this.#currentTheme;
        }

        set current(value: Theme) {
          this.#currentTheme = value;
        }

        toggle(): void {
          this.#currentTheme = this.#currentTheme === "light" ? "dark" : "light";
        }
      }

      const themeStore = new ThemeStore();

      const component = createStyleSet({
        base: "component bg-{color.bg} text-{color.text}",
        variants: {
          variant: {
            a: "variant-a",
            b: "variant-b"
          }
        },
        themes
      });

      // Initial theme
      let result = component({ variant: "a", theme: themeStore.current });
      expect(result).toContain("bg-white");

      // Toggle theme
      themeStore.toggle();
      result = component({ variant: "a", theme: themeStore.current });
      expect(result).toContain("bg-black");

      // Toggle back
      themeStore.toggle();
      result = component({ variant: "a", theme: themeStore.current });
      expect(result).toContain("bg-white");
    });
  });

  describe("Type safety verification", () => {
    it("should constrain theme prop to defined theme IDs", () => {
      const themes = {
        themeA: { tokens: {} },
        themeB: { tokens: {} }
      } as const;

      const styler = createStyleSet({
        base: "base",
        themes
      });

      // These should work (compile-time check)
      styler({ theme: "themeA" });
      styler({ theme: "themeB" });
      styler({ theme: undefined }); // Optional

      // Runtime verification
      const resultA = styler({ theme: "themeA" });
      const resultB = styler({ theme: "themeB" });

      expect(resultA).toBe("base");
      expect(resultB).toBe("base");
    });
  });
});
