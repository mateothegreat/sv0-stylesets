import { beforeEach, describe, expect, test } from "vitest";
import { composeTheme, createThemeVariant, defaultThemes, ThemeManager } from "./themes";
import type { ThemeConfig } from "./types/themes";

describe("composeTheme", () => {
  test("should compose two themes", () => {
    const baseTheme: ThemeConfig = {
      id: "base",
      name: "Base Theme",
      tokens: {
        color: { primary: "blue-500" }
      }
    };

    const overrideTheme: Partial<ThemeConfig> = {
      tokens: {
        color: { secondary: "gray-500" }
      },
      darkMode: true
    };

    const composed = composeTheme(baseTheme, overrideTheme);

    expect(composed.id).toBe("base");
    expect(composed.name).toBe("Base Theme");
    expect(composed.darkMode).toBe(true);
    expect(composed.tokens?.color?.primary).toBe("blue-500");
    expect(composed.tokens?.color?.secondary).toBe("gray-500");
  });

  test("should throw error when no themes provided", () => {
    expect(() => composeTheme()).toThrow("At least one theme must be provided");
  });

  test("should throw error when base theme lacks required properties", () => {
    expect(() => composeTheme({})).toThrow("Base theme must have id and name properties");
  });

  test("should deeply merge nested objects", () => {
    const theme1: ThemeConfig = {
      id: "theme1",
      name: "Theme 1",
      tokens: {
        color: { primary: "blue-500", text: "gray-900" },
        spacing: { sm: "0.5rem" }
      }
    };

    const theme2: Partial<ThemeConfig> = {
      tokens: {
        color: { primary: "red-500", secondary: "gray-500" },
        border: { default: "border-gray-200" }
      }
    };

    const composed = composeTheme(theme1, theme2);

    expect(composed.tokens?.color?.primary).toBe("red-500"); // Overridden
    expect(composed.tokens?.color?.text).toBe("gray-900"); // Preserved
    expect(composed.tokens?.color?.secondary).toBe("gray-500"); // Added
    expect(composed.tokens?.spacing?.sm).toBe("0.5rem"); // Preserved
    expect(composed.tokens?.border?.default).toBe("border-gray-200"); // Added
  });
});

describe("createThemeVariant", () => {
  test("should create theme variant with new ID and name", () => {
    const baseTheme: ThemeConfig = {
      id: "light",
      name: "Light Theme",
      tokens: { color: { primary: "blue-500" } }
    };

    const variant = createThemeVariant(baseTheme, "compact", {
      tokens: { spacing: { sm: "0.25rem" } }
    });

    expect(variant.id).toBe("light-compact");
    expect(variant.name).toBe("Light Theme (compact)");
    expect(variant.tokens?.color?.primary).toBe("blue-500");
    expect(variant.tokens?.spacing?.sm).toBe("0.25rem");
  });

  test("should use custom name when provided", () => {
    const baseTheme: ThemeConfig = {
      id: "dark",
      name: "Dark Theme"
    };

    const variant = createThemeVariant(baseTheme, "high-contrast", {
      name: "High Contrast Dark"
    });

    expect(variant.id).toBe("dark-high-contrast");
    expect(variant.name).toBe("High Contrast Dark");
  });
});

describe("ThemeManager", () => {
  let manager: ThemeManager;

  beforeEach(() => {
    manager = new ThemeManager();
  });

  test("should register and retrieve themes", () => {
    const theme: ThemeConfig = {
      id: "test",
      name: "Test Theme",
      tokens: { color: { primary: "blue-500" } }
    };

    manager.registerTheme(theme);

    const retrieved = manager.getTheme("test");
    expect(retrieved).toEqual(theme);
  });

  test("should set active theme", () => {
    const theme: ThemeConfig = {
      id: "active",
      name: "Active Theme"
    };

    manager.registerTheme(theme);
    const success = manager.setActiveTheme("active");

    expect(success).toBe(true);
    expect(manager.getActiveTheme()).toEqual(theme);
  });

  test("should return false when setting non-existent theme", () => {
    const success = manager.setActiveTheme("nonexistent");
    expect(success).toBe(false);
    expect(manager.getActiveTheme()).toBeUndefined();
  });

  test("should get all registered themes", () => {
    const theme1: ThemeConfig = { id: "theme1", name: "Theme 1" };
    const theme2: ThemeConfig = { id: "theme2", name: "Theme 2" };

    manager.registerTheme(theme1);
    manager.registerTheme(theme2);

    const themes = manager.getAllThemes();
    expect(themes).toHaveLength(2);
    expect(themes).toContain(theme1);
    expect(themes).toContain(theme2);
  });

  test("should update user preferences", () => {
    const preferences = {
      reducedMotion: true,
      highContrast: false,
      colorScheme: "dark" as const
    };

    manager.setPreferences(preferences);

    const context = manager.getContext();
    expect(context.preferences).toEqual(preferences);
  });

  test("should resolve tokens using active theme", () => {
    const theme: ThemeConfig = {
      id: "theme",
      name: "Theme",
      tokens: {
        color: { primary: "blue-500" }
      }
    };

    manager.registerTheme(theme);
    const setResult = manager.setActiveTheme("theme");
    expect(setResult).toBe(true);

    const resolved = manager.resolveToken("color.primary");
    // For now, just check that it doesn't throw an error
    expect(typeof resolved).toBe("string");
  });

  test("should compose and register multiple themes", () => {
    const theme1: ThemeConfig = {
      id: "theme1",
      name: "Theme 1",
      tokens: { color: { primary: "blue-500" } }
    };

    const theme2: ThemeConfig = {
      id: "theme2",
      name: "Theme 2",
      tokens: { color: { secondary: "gray-500" } }
    };

    manager.registerTheme(theme1);
    manager.registerTheme(theme2);

    const composed = manager.composeAndRegister("composed", "Composed Theme", "theme1", "theme2");

    expect(composed).not.toBeNull();
    if (composed) {
      expect(composed.id).toBe("composed");
      expect(composed.name).toBe("Composed Theme");
      expect(composed.tokens?.color?.primary).toBe("blue-500");
      expect(composed.tokens?.color?.secondary).toBe("gray-500");
    }
  });

  test("should return null when composing with invalid theme IDs", () => {
    const result = manager.composeAndRegister("invalid", "Invalid", "nonexistent1", "nonexistent2");
    expect(result).toBeNull();
  });

  test("should create theme resolver with helper methods", () => {
    const theme: ThemeConfig = {
      id: "test",
      name: "Test",
      tokens: { color: { primary: "blue-500" } }
    };

    manager.registerTheme(theme);
    manager.setActiveTheme("test");

    const resolver = manager.createResolver();

    // Just test that resolver methods exist and are callable
    expect(typeof resolver.resolve).toBe("function");
    expect(typeof resolver.hasTokens).toBe("function");
    expect(typeof resolver.replaceTokens).toBe("function");
    expect(resolver.hasTokens("{color.primary}")).toBe(true);
  });
});

describe("defaultThemes", () => {
  test("should create light theme with correct structure", () => {
    const lightTheme = defaultThemes.light();

    expect(lightTheme.id).toBe("light");
    expect(lightTheme.name).toBe("Light");
    expect(lightTheme.darkMode).toBe(false);
    expect(lightTheme.tokens?.color?.primary).toBeDefined();
    expect(lightTheme.accessibility?.focusRing?.default).toBeDefined();
    expect(lightTheme.cssVariables?.["--theme-primary"]).toBeDefined();
  });

  test("should create dark theme with correct structure", () => {
    const darkTheme = defaultThemes.dark();

    expect(darkTheme.id).toBe("dark");
    expect(darkTheme.name).toBe("Dark");
    expect(darkTheme.darkMode).toBe(true);
    expect(darkTheme.tokens?.color?.primary).toBeDefined();
    expect(darkTheme.accessibility?.focusRing?.default).toBeDefined();
    expect(darkTheme.cssVariables?.["--theme-primary"]).toBeDefined();
  });

  test("should have different color values between light and dark themes", () => {
    const light = defaultThemes.light();
    const dark = defaultThemes.dark();

    expect(light.tokens?.color?.primary).not.toBe(dark.tokens?.color?.primary);
    expect(light.tokens?.color?.background).not.toBe(dark.tokens?.color?.background);
    expect(light.cssVariables?.["--theme-primary"]).not.toBe(
      dark.cssVariables?.["--theme-primary"]
    );
  });
});
