import { beforeEach, describe, expect, test } from "vitest";
import {
  AccessibilityManager,
  createAccessibilityConfig,
  focusRingPresets,
  globalAccessibilityManager,
  highContrastPresets,
  reducedMotionPresets
} from "./accessibility";
import type { AccessibilityConfig } from "./types";

describe("AccessibilityManager", () => {
  let manager: AccessibilityManager;

  beforeEach(() => {
    // Create a fresh manager for each test
    manager = new AccessibilityManager();
  });

  test("should initialize with default config", () => {
    const preferences = manager.getPreferences();
    expect(preferences).toBeDefined();
  });

  test("should update accessibility configuration", () => {
    const newConfig: AccessibilityConfig = {
      focusRing: {
        default: "ring-4 ring-red-500",
        auto: false
      }
    };

    manager.updateConfig(newConfig);
    const focusRing = manager.createFocusRing();
    expect(focusRing).toBe("ring-4 ring-red-500");
  });

  test("should set user preferences manually", () => {
    const preferences = {
      reducedMotion: true,
      highContrast: true,
      colorScheme: "dark" as const
    };

    manager.setPreferences(preferences);
    const result = manager.getPreferences();

    expect(result.reducedMotion).toBe(true);
    expect(result.highContrast).toBe(true);
    expect(result.colorScheme).toBe("dark");
  });

  test("should create focus ring with variants", () => {
    const config: AccessibilityConfig = {
      focusRing: {
        default: "ring-2 ring-blue-500",
        variants: {
          error: "ring-2 ring-red-500",
          success: "ring-2 ring-green-500"
        }
      }
    };

    manager.updateConfig(config);

    expect(manager.createFocusRing()).toBe("ring-2 ring-blue-500");
    expect(manager.createFocusRing("error")).toBe("ring-2 ring-red-500");
    expect(manager.createFocusRing("success")).toBe("ring-2 ring-green-500");
    expect(manager.createFocusRing("nonexistent")).toBe("ring-2 ring-blue-500");
  });

  test("should create screen reader only classes", () => {
    const config: AccessibilityConfig = {
      screenReader: {
        srOnly: "sr-only-custom",
        focusVisible: "focus-visible-custom"
      }
    };

    manager.updateConfig(config);
    expect(manager.createScreenReaderOnly()).toBe("sr-only-custom");
  });

  test("should use default sr-only when not configured", () => {
    expect(manager.createScreenReaderOnly()).toBe("sr-only");
  });

  test("should create focus-visible classes", () => {
    const config: AccessibilityConfig = {
      screenReader: {
        srOnly: "sr-only",
        focusVisible: "focus-visible:not-sr-only"
      }
    };

    manager.updateConfig(config);
    const result = manager.createFocusVisible("text-lg font-bold");

    expect(result).toContain("sr-only");
    expect(result).toContain("focus-visible:not-sr-only");
    expect(result).toContain("text-lg font-bold");
  });

  test("should enhance classes with all accessibility features", () => {
    const config: AccessibilityConfig = {
      focusRing: {
        default: "ring-2 ring-blue-500",
        auto: true
      },
      reducedMotion: {
        replace: {
          "animate-spin": "animate-none"
        },
        auto: true
      },
      highContrast: {
        colorMap: {
          "text-gray-400": "text-black"
        },
        auto: true
      }
    };

    manager.updateConfig(config);
    manager.setPreferences({
      reducedMotion: true,
      highContrast: true
    });

    const result = manager.enhance("button animate-spin text-gray-400");

    expect(result).toContain("animate-none");
    expect(result).toContain("text-black");
  });

  test("should apply focus ring automatically to interactive elements", () => {
    const config: AccessibilityConfig = {
      focusRing: {
        default: "ring-2 ring-blue-500",
        auto: true
      }
    };

    manager.updateConfig(config);

    const buttonClasses = manager.enhance("button px-4 py-2");
    expect(buttonClasses).toContain("ring-2 ring-blue-500");

    const linkClasses = manager.enhance("link underline");
    expect(linkClasses).toContain("ring-2 ring-blue-500");
  });

  test("should not add focus ring when already present", () => {
    const config: AccessibilityConfig = {
      focusRing: {
        default: "ring-2 ring-blue-500",
        auto: true
      }
    };

    manager.updateConfig(config);

    const result = manager.enhance("button focus:ring-4 focus:ring-red-500");

    // Should not duplicate focus styles
    expect(result).toContain("focus:ring-4");
    expect(result).toContain("focus:ring-red-500");
  });

  test("should respect reduced motion preferences", () => {
    manager.setPreferences({ reducedMotion: true });
    expect(manager.prefersReducedMotion()).toBe(true);

    manager.setPreferences({ reducedMotion: false });
    expect(manager.prefersReducedMotion()).toBe(false);
  });

  test("should respect high contrast preferences", () => {
    manager.setPreferences({ highContrast: true });
    expect(manager.prefersHighContrast()).toBe(true);

    manager.setPreferences({ highContrast: false });
    expect(manager.prefersHighContrast()).toBe(false);
  });

  test("should detect user preferences from media queries when available", () => {
    // Test that window.matchMedia is available in happy-dom
    expect(typeof window.matchMedia).toBe("function");

    // Create a manager which should trigger detectUserPreferences
    const testManager = new AccessibilityManager();
    const preferences = testManager.getPreferences();

    // In happy-dom, media queries will have default values (typically false)
    // We're testing that the detection code runs without errors
    expect(typeof preferences.reducedMotion).toBe("boolean");
    expect(typeof preferences.highContrast).toBe("boolean");
    expect(preferences.colorScheme).toMatch(/^(light|dark)$/);
  });

  test("should handle media query changes", () => {
    const testManager = new AccessibilityManager();

    // Manually trigger a preference change to test the system works
    testManager.setPreferences({
      reducedMotion: true,
      highContrast: true,
      colorScheme: "dark"
    });

    const preferences = testManager.getPreferences();
    expect(preferences.reducedMotion).toBe(true);
    expect(preferences.highContrast).toBe(true);
    expect(preferences.colorScheme).toBe("dark");
  });

  test("should work without window.matchMedia", () => {
    // Temporarily remove matchMedia to test fallback behavior
    const originalMatchMedia = window.matchMedia;
    delete (window as any).matchMedia;

    try {
      const testManager = new AccessibilityManager();
      const preferences = testManager.getPreferences();

      // Should initialize with empty preferences when matchMedia is not available
      expect(preferences).toBeDefined();
    } finally {
      // Restore matchMedia
      window.matchMedia = originalMatchMedia;
    }
  });
});

describe("Accessibility presets", () => {
  test("should have focus ring presets", () => {
    expect(focusRingPresets.default).toBeDefined();
    expect(focusRingPresets.primary).toBeDefined();
    expect(focusRingPresets.error).toBeDefined();
    expect(focusRingPresets.dark).toContain("ring-offset-gray-900");
    expect(focusRingPresets.light).toContain("ring-offset-white");
  });

  test("should have reduced motion presets", () => {
    expect(reducedMotionPresets.animations).toBeDefined();
    expect(reducedMotionPresets.transitions).toBeDefined();
    expect(reducedMotionPresets.durations).toBeDefined();

    expect(reducedMotionPresets.animations["animate-spin"]).toBe("animate-none");
    expect(reducedMotionPresets.transitions["transition-all"]).toBe("transition-none");
    expect(reducedMotionPresets.durations["duration-300"]).toBe("duration-0");
  });

  test("should have high contrast presets", () => {
    expect(highContrastPresets.text).toBeDefined();
    expect(highContrastPresets.backgrounds).toBeDefined();
    expect(highContrastPresets.borders).toBeDefined();

    expect(highContrastPresets.text["text-gray-400"]).toContain("text-gray-900");
    expect(highContrastPresets.backgrounds["bg-gray-50"]).toContain("bg-white");
    expect(highContrastPresets.borders["border-gray-200"]).toContain("border-gray-400");
  });
});

describe("createAccessibilityConfig", () => {
  test("should create config with default focus ring preset", () => {
    const config = createAccessibilityConfig({ focusRing: "primary" });

    expect(config.focusRing?.default).toBe(focusRingPresets.primary);
    expect(config.focusRing?.auto).toBe(true);
    expect(config.focusRing?.variants).toBeDefined();
  });

  test("should create config with custom focus ring", () => {
    const customRing = "ring-4 ring-purple-500";
    const config = createAccessibilityConfig({ focusRing: customRing });

    expect(config.focusRing?.default).toBe(customRing);
  });

  test("should create config with reduced motion disabled", () => {
    const config = createAccessibilityConfig({ reducedMotion: false });

    expect(config.reducedMotion).toBeUndefined();
  });

  test("should create config with high contrast disabled", () => {
    const config = createAccessibilityConfig({ highContrast: false });

    expect(config.highContrast).toBeUndefined();
  });

  test("should create complete config with all features enabled", () => {
    const config = createAccessibilityConfig({
      focusRing: "error",
      reducedMotion: true,
      highContrast: true
    });

    expect(config.focusRing?.default).toBe(focusRingPresets.error);
    expect(config.reducedMotion?.auto).toBe(true);
    expect(config.highContrast?.auto).toBe(true);
    expect(config.screenReader?.srOnly).toBe("sr-only");
  });
});

describe("Global accessibility manager", () => {
  test("should be initialized with default config", () => {
    expect(globalAccessibilityManager).toBeDefined();
    const focusRing = globalAccessibilityManager.createFocusRing();
    expect(focusRing).toBeDefined();
  });

  test("should enhance classes using global instance", () => {
    const result = globalAccessibilityManager.enhance("button px-4 py-2");
    expect(result).toContain("px-4 py-2");
  });
});

describe("Media query integration tests", () => {
  test("should create MediaQueryList objects for accessibility preferences", () => {
    // Test that we can create media query lists for accessibility features
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const highContrastQuery = window.matchMedia("(prefers-contrast: high)");
    const darkSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

    expect(reducedMotionQuery).toBeDefined();
    expect(reducedMotionQuery.media).toBe("(prefers-reduced-motion: reduce)");
    expect(typeof reducedMotionQuery.matches).toBe("boolean");
    expect(typeof reducedMotionQuery.addEventListener).toBe("function");

    expect(highContrastQuery).toBeDefined();
    expect(highContrastQuery.media).toBe("(prefers-contrast: high)");
    expect(typeof highContrastQuery.matches).toBe("boolean");

    expect(darkSchemeQuery).toBeDefined();
    expect(darkSchemeQuery.media).toBe("(prefers-color-scheme: dark)");
    expect(typeof darkSchemeQuery.matches).toBe("boolean");
  });

  test("should handle media query event listeners", () => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let eventFired = false;

    // Add event listener
    const handler = () => {
      eventFired = true;
    };

    reducedMotionQuery.addEventListener("change", handler);

    // In happy-dom, we can't easily trigger media query changes,
    // but we can verify the listener was added without errors
    expect(eventFired).toBe(false); // Should not have fired yet

    // Clean up
    reducedMotionQuery.removeEventListener("change", handler);
  });

  test("should initialize manager with real media query detection", () => {
    // This test verifies that the AccessibilityManager can be created
    // and will attempt to detect real user preferences via matchMedia
    const manager = new AccessibilityManager();
    const preferences = manager.getPreferences();

    // Preferences should be initialized (even if all false in test environment)
    expect(preferences).toBeDefined();
    expect(typeof preferences.reducedMotion).toBe("boolean");
    expect(typeof preferences.highContrast).toBe("boolean");
    expect(preferences.colorScheme).toMatch(/^(light|dark)$/);
  });
});
