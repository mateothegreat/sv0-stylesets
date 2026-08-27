import { describe, expect, test } from "vitest";
import type {
  AccessibilityConfig,
  DesignToken,
  EnhancedStylerConfig,
  ThemeConfig,
  TokenRegistry
} from "./types";

describe("Types", () => {
  test("DesignToken type should support string values", () => {
    const token: DesignToken = "blue-500";
    expect(typeof token).toBe("string");
  });

  test("DesignToken type should support object values", () => {
    const token: DesignToken = {
      value: "blue-500",
      description: "Primary color",
      runtime: true
    };
    expect(token.value).toBe("blue-500");
    expect(token.description).toBe("Primary color");
    expect(token.runtime).toBe(true);
  });

  test("TokenRegistry should support multiple categories", () => {
    const registry: TokenRegistry = {
      color: {
        primary: "blue-500",
        secondary: { value: "gray-500", description: "Secondary color" }
      },
      spacing: {
        sm: "0.5rem",
        md: "1rem"
      }
    };

    expect(registry.color?.primary).toBe("blue-500");
    expect((registry.color?.secondary as any)?.value).toBe("gray-500");
    expect(registry.spacing?.sm).toBe("0.5rem");
  });

  test("AccessibilityConfig should support focus ring configuration", () => {
    const config: AccessibilityConfig = {
      focusRing: {
        default: "ring-2 ring-blue-500",
        variants: {
          primary: "ring-2 ring-blue-500",
          secondary: "ring-2 ring-gray-500"
        },
        auto: true
      }
    };

    expect(config.focusRing?.default).toBe("ring-2 ring-blue-500");
    expect(config.focusRing?.variants?.primary).toBe("ring-2 ring-blue-500");
    expect(config.focusRing?.auto).toBe(true);
  });

  test("ThemeConfig should support complete theme definition", () => {
    const theme: ThemeConfig = {
      id: "light",
      name: "Light Theme",
      darkMode: false,
      tokens: {
        color: {
          primary: "blue-500"
        }
      },
      accessibility: {
        focusRing: {
          default: "ring-2 ring-blue-500",
          auto: true
        }
      },
      cssVariables: {
        "--primary": "#3b82f6"
      }
    };

    expect(theme.id).toBe("light");
    expect(theme.name).toBe("Light Theme");
    expect(theme.darkMode).toBe(false);
    expect(theme.tokens?.color?.primary).toBe("blue-500");
    expect(theme.cssVariables?.["--primary"]).toBe("#3b82f6");
  });

  test("EnhancedStylerConfig should extend basic config with new features", () => {
    const config: EnhancedStylerConfig<
      { intent: { primary: string; secondary: string } },
      { button: string }
    > = {
      base: "btn",
      variants: {
        intent: {
          primary: "bg-blue-500",
          secondary: "bg-gray-500"
        }
      },
      defaultVariants: {
        intent: "primary"
      },
      recipes: {
        button: "px-4 py-2"
      },
      tokens: {
        color: {
          primary: "blue-500"
        }
      },
      accessibility: {
        focusRing: {
          default: "ring-2 ring-blue-500",
          auto: true
        }
      }
    };

    expect(config.base).toBe("btn");
    expect(config.variants?.intent.primary).toBe("bg-blue-500");
    expect(config.defaultVariants?.intent).toBe("primary");
    expect(config.recipes?.button).toBe("px-4 py-2");
    expect(config.tokens?.color?.primary).toBe("blue-500");
    expect(config.accessibility?.focusRing?.default).toBe("ring-2 ring-blue-500");
  });
});
