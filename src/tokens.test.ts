import { beforeEach, describe, expect, test } from "vitest";
import { TokenResolver, globalTokenResolver, registerTokens, resolveToken } from "./tokens.js";
import type { TokenRegistry, TokenResolutionContext } from "./types";

describe("TokenResolver", () => {
  let resolver: TokenResolver;

  beforeEach(() => {
    resolver = new TokenResolver();
  });

  test("should resolve simple token references", () => {
    const tokens: TokenRegistry = {
      color: {
        primary: "blue-500",
        secondary: "gray-500"
      }
    };

    resolver.register("color", tokens.color!);

    const result = resolver.resolve("color.primary");
    expect(result.value).toBe("blue-500");
    expect(result.wasResolved).toBe(true);
  });

  test("should resolve nested token references", () => {
    const tokens: TokenRegistry = {
      color: {
        primary: "blue-500",
        text: "text-{color.primary}"
      }
    };

    resolver.register("color", tokens.color!);

    const result = resolver.resolve("color.text");
    expect(result.value).toBe("text-blue-500");
    expect(result.wasResolved).toBe(true);
  });

  test("should handle object tokens with descriptions", () => {
    const tokens: TokenRegistry = {
      color: {
        primary: {
          value: "blue-500",
          description: "Primary brand color"
        }
      }
    };

    resolver.register("color", tokens.color!);

    const result = resolver.resolve("color.primary");
    expect(result.value).toBe("blue-500");
    expect(result.wasResolved).toBe(true);
  });

  test("should return original value for unresolved tokens", () => {
    const result = resolver.resolve("nonexistent.token");
    expect(result.value).toBe("nonexistent.token");
    expect(result.wasResolved).toBe(false);
  });

  test("should detect token references in strings", () => {
    expect(resolver.hasTokenReferences("text-{color.primary}")).toBe(true);
    expect(resolver.hasTokenReferences("text-blue-500")).toBe(false);
    expect(resolver.hasTokenReferences("{spacing.md} {color.primary}")).toBe(true);
  });

  test("should replace multiple token references in a string", () => {
    const tokens: TokenRegistry = {
      color: { primary: "blue-500", text: "gray-900" },
      spacing: { md: "1rem" }
    };

    resolver.register("color", tokens.color!);
    resolver.register("spacing", tokens.spacing!);

    const result = resolver.replaceTokens("p-{spacing.md} text-{color.text} bg-{color.primary}");
    expect(result.value).toBe("p-1rem text-gray-900 bg-blue-500");
    expect(result.wasResolved).toBe(true);
  });

  test("should apply accessibility transformations in context", () => {
    const tokens: TokenRegistry = {
      animation: {
        spin: "animate-spin transition-all duration-300"
      }
    };

    resolver.register("animation", tokens.animation!);

    const context: TokenResolutionContext = {
      preferences: {
        reducedMotion: true
      }
    };

    const result = resolver.resolve("animation.spin", context);
    expect(result.value).toContain("transition-none");
    expect(result.value).toContain("duration-0");
  });

  test("should handle high contrast preferences", () => {
    const tokens: TokenRegistry = {
      color: {
        muted: "text-gray-500 bg-gray-100"
      }
    };

    resolver.register("color", tokens.color!);

    const context: TokenResolutionContext = {
      preferences: {
        highContrast: true
      }
    };

    const result = resolver.resolve("color.muted", context);
    expect(result.value).toContain("text-black dark:text-white");
    expect(result.value).toContain("bg-white dark:bg-black");
  });

  test("should resolve multiple token references", () => {
    const tokens: TokenRegistry = {
      color: { primary: "blue-500", secondary: "gray-500" }
    };

    resolver.register("color", tokens.color!);

    const results = resolver.resolveMultiple(["color.primary", "color.secondary", "invalid.token"]);

    expect(results).toHaveLength(3);
    expect(results[0].value).toBe("blue-500");
    expect(results[0].wasResolved).toBe(true);
    expect(results[1].value).toBe("gray-500");
    expect(results[1].wasResolved).toBe(true);
    expect(results[2].value).toBe("invalid.token");
    expect(results[2].wasResolved).toBe(false);
  });

  test("should cache resolved tokens", () => {
    const tokens: TokenRegistry = {
      color: { primary: "blue-500" }
    };

    resolver.register("color", tokens.color!);

    const result1 = resolver.resolve("color.primary");
    const result2 = resolver.resolve("color.primary");

    expect(result1.value).toBe(result2.value);
    expect(result1.wasResolved).toBe(result2.wasResolved);
  });

  test("should clear cache when tokens are updated", () => {
    resolver.register("color", { primary: "blue-500" });

    const result1 = resolver.resolve("color.primary");
    expect(result1.value).toBe("blue-500");

    resolver.register("color", { primary: "red-500" });

    const result2 = resolver.resolve("color.primary");
    expect(result2.value).toBe("red-500");
  });

  test("should get available tokens by category", () => {
    const colorTokens = { primary: "blue-500", secondary: "gray-500" };
    resolver.register("color", colorTokens);

    const tokens = resolver.getTokens("color");
    expect(tokens).toEqual(colorTokens);
  });

  test("should get all registered categories", () => {
    resolver.register("color", { primary: "blue-500" });
    resolver.register("spacing", { md: "1rem" });

    const categories = resolver.getCategories();
    expect(categories).toContain("color");
    expect(categories).toContain("spacing");
  });
});

describe("Global token resolver", () => {
  test("should register and resolve tokens globally", () => {
    registerTokens("test", { value: "test-value" });

    const result = resolveToken("test.value");
    expect(result.value).toBe("test-value");
    expect(result.wasResolved).toBe(true);
  });

  test("should use global resolver instance", () => {
    globalTokenResolver.register("global", { token: "global-value" });

    const result = globalTokenResolver.resolve("global.token");
    expect(result.value).toBe("global-value");
    expect(result.wasResolved).toBe(true);
  });
});
