<script lang="ts">
  import {
    composeTheme,
    createAccessibilityConfig,
    createEnhancedStyleSet,
    createThemeVariant,
    defaultThemes,
    ThemeManager,
    type EnhancedStylerProps
  } from "../../../src";

  // =============================================================================
  // 1. ENHANCED BUTTON WITH TOKENS AND ACCESSIBILITY
  // =============================================================================

  const button = createEnhancedStyleSet({
    base: "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none",
    variants: {
      intent: {
        primary:
          "bg-{color.primary} text-white hover:bg-{color.primaryHover} border-{color.primary}",
        secondary:
          "bg-{color.secondary} text-{color.text} hover:bg-{color.secondaryHover} border-{color.border}",
        danger: "bg-{color.danger} text-white hover:bg-{color.dangerHover} border-{color.danger}",
        ghost: "hover:bg-{color.secondary} text-{color.text} border-transparent"
      },
      size: {
        sm: "h-{spacing.sm} px-{spacing.xs} text-sm",
        md: "h-{spacing.md} px-{spacing.sm}",
        lg: "h-{spacing.lg} px-{spacing.md} text-lg"
      },
      variant: {
        solid: "border",
        outline: "border-2 bg-transparent",
        ghost: "border-0"
      }
    },
    compoundVariants: [
      {
        intent: "primary",
        variant: "outline",
        class: "text-{color.primary} hover:bg-{color.primary} hover:text-white"
      },
      {
        intent: "danger",
        variant: "outline",
        class: "text-{color.danger} hover:bg-{color.danger} hover:text-white"
      }
    ],
    defaultVariants: {
      intent: "primary",
      size: "md",
      variant: "solid"
    },
    tokens: {
      color: {
        primary: "blue-600",
        primaryHover: "blue-700",
        secondary: "gray-200",
        secondaryHover: "gray-300",
        danger: "red-600",
        dangerHover: "red-700",
        text: "gray-900",
        border: "gray-300"
      },
      spacing: {
        xs: "0.75rem",
        sm: "2rem",
        md: "2.5rem",
        lg: "3rem"
      }
    },
    accessibility: createAccessibilityConfig({
      focusRing: "primary",
      reducedMotion: true,
      highContrast: true
    })
  });

  // =============================================================================
  // 2. LAYOUT SYSTEM WITH RECIPES
  // =============================================================================

  const layout = createEnhancedStyleSet({
    recipes: {
      container: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-{color.mode}",
      card: "bg-white rounded-lg shadow-md border border-{color.border} p-{spacing.card}",
      section: "mb-{spacing.section}",
      grid: "grid gap-{spacing.gap}",
      title: "text-2xl font-bold text-{color.text} mb-{spacing.titleMargin}",
      subtitle: "text-lg text-{color.muted} mb-{spacing.subtitleMargin}",
      code: "bg-{color.codeBg} border border-{color.border} rounded px-{spacing.xs} py-1 font-mono text-sm"
    },
    tokens: {
      color: {
        mode: "red-500",
        border: "gray-200",
        text: "gray-900",
        muted: "gray-600",
        codeBg: "gray-50"
      },
      spacing: {
        xs: "0.5rem",
        card: "1.5rem",
        section: "2rem",
        gap: "1rem",
        titleMargin: "1rem",
        subtitleMargin: "0.75rem"
      }
    },
    variants: {
      mode: {
        dark: "bg-{color.mode}",
        light: "bg-{color.mode}",
        neon: "bg-{color.mode}"
      }
    }
  });

  // =============================================================================
  // 3. THEME MANAGEMENT
  // =============================================================================

  const lightTheme = defaultThemes.light();
  const darkTheme = defaultThemes.dark();

  const customTheme = composeTheme(lightTheme, {
    id: "custom",
    name: "Custom Theme",
    tokens: {
      color: {
        mode: "pink-500",
        primary: "indigo-600",
        primaryHover: "indigo-700",
        accent: "orange-500"
      }
    },
    cssVariables: {
      "--theme-primary": "#4f46e5",
      "--theme-accent": "#f97316"
    }
  });

  const highContrastTheme = createThemeVariant(darkTheme, "high-contrast", {
    tokens: {
      color: {
        mode: "blue-500",
        primary: "yellow-400",
        background: "black",
        text: "white"
      }
    }
  });

  const themeManager = new ThemeManager([lightTheme, darkTheme, customTheme, highContrastTheme]);

  $effect(() => {
    console.log("themeManager", themeManager.resolveToken("color.mode"));
  });

  // =============================================================================
  // 4. FORM COMPONENTS WITH ACCESSIBILITY
  // =============================================================================

  const input = createEnhancedStyleSet({
    base: "w-full rounded-md border px-{spacing.sm} py-{spacing.xs} text-sm transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
    variants: {
      state: {
        default:
          "border-{color.border} focus:border-{color.primary} focus:ring-1 focus:ring-{color.primary}",
        error:
          "border-{color.danger} focus:border-{color.danger} focus:ring-1 focus:ring-{color.danger}",
        success: "border-green-500 focus:border-green-500 focus:ring-1 focus:ring-green-500"
      }
    },
    defaultVariants: {
      state: "default"
    },
    tokens: {
      color: {
        border: "gray-300",
        primary: "blue-500",
        danger: "red-500"
      },
      spacing: {
        xs: "0.5rem",
        sm: "0.75rem"
      }
    },
    accessibility: createAccessibilityConfig({
      focusRing: "primary"
    })
  });

  const label = createEnhancedStyleSet({
    base: "block text-sm font-medium text-{color.text} mb-{spacing.xs}",
    variants: {
      required: {
        true: "after:content-['*'] after:text-{color.danger} after:ml-1"
      }
    },
    tokens: {
      color: {
        text: "gray-700",
        danger: "red-500"
      },
      spacing: {
        xs: "0.25rem"
      }
    }
  });

  // =============================================================================
  // 5. REACTIVE STATE
  // =============================================================================

  let selectedTheme = $state("light");
  let reducedMotion = $state(false);
  let highContrast = $state(false);
  let accessibilityEnabled = $state(true);
  let selectedIntent = $state<"primary" | "secondary" | "danger" | "ghost">("primary");
  let selectedSize = $state<"sm" | "md" | "lg">("md");
  let selectedVariant = $state<"solid" | "outline" | "ghost">("solid");
  let showTokenResolution = $state(false);
  let formName = $state("");
  let formEmail = $state("");

  // Extract button props type for type safety
  type ButtonProps = EnhancedStylerProps<typeof button>;

  $effect(() => {
    if (typeof window !== "undefined") {
      themeManager.setActiveTheme(selectedTheme);
      themeManager.setPreferences({
        reducedMotion,
        highContrast,
        colorScheme: selectedTheme.includes("dark") ? "dark" : "light"
      });
    }
  });

  $effect(() => {
    console.log(layout({ mode: "neon", theme: "dark" }));
    console.log("selectedTheme", themeManager.resolveToken("color.mode"));
  });

  // Helper to show resolved classes
  function getResolvedClasses(component: any, props: any) {
    return component(props);
  }
</script>

{layout.container}<br />
{layout({ mode: "neon", theme: "dark" })}

<div class={layout.container.toString()}>
  <div class={layout.section.toString()}>
    <h1 class={layout.title.toString()}>StyleSets Enhanced Demo</h1>
    <p class={layout.subtitle.toString()}>
      Comprehensive demonstration of all StyleSets features including tokens, themes, and
      accessibility.
    </p>
  </div>

  <!-- Theme Controls -->
  <div class={layout.card.toString()}>
    <h2 class="text-xl font-semibold mb-4">Theme & Accessibility Controls</h2>

    <div class={layout.grid.toString() + " grid-cols-1 md:grid-cols-2 lg:grid-cols-4"}>
      <!-- Theme Selection -->
      <div>
        <label class={label()}>Theme</label>
        <select
          bind:value={selectedTheme}
          onclick={() => console.log("selectedTheme", selectedTheme, themeManager.getActiveTheme())}
          class={input()}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="custom">Custom</option>
          <option value="dark-high-contrast">High Contrast</option>
        </select>
      </div>

      <!-- Accessibility Options -->
      <div>
        <label class={label()}>
          <input type="checkbox" bind:checked={reducedMotion} class="mr-2" />
          Reduced Motion
        </label>
        <label class={label()}>
          <input type="checkbox" bind:checked={highContrast} class="mr-2" />
          High Contrast
        </label>
      </div>

      <!-- Button Controls -->
      <div>
        <label class={label()}>Button Intent</label>
        <select bind:value={selectedIntent} class={input()}>
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="danger">Danger</option>
          <option value="ghost">Ghost</option>
        </select>
      </div>

      <div>
        <label class={label()}>Button Size</label>
        <select bind:value={selectedSize} class={input()}>
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
        </select>
      </div>
    </div>
  </div>

  <!-- Button Showcase -->
  <div class={layout.card.toString()}>
    <h2 class="text-xl font-semibold mb-4">Enhanced Buttons with Tokens</h2>

    <div class={layout.grid.toString() + " grid-cols-2 md:grid-cols-3"}>
      <!-- Solid Variants -->
      <div>
        <h3 class="font-medium mb-2">Solid Variants</h3>
        <div class="space-y-2">
          <button
            class={button({
              intent: selectedIntent,
              size: selectedSize,
              variant: "solid",
              accessibility: accessibilityEnabled
            })}>
            {selectedIntent}
            {selectedSize}
          </button>
          <button class={button({ intent: "primary", size: "sm", variant: "solid" })}>
            Primary Small
          </button>
          <button class={button({ intent: "danger", size: "lg", variant: "solid" })}>
            Danger Large
          </button>
        </div>
      </div>

      <!-- Outline Variants -->
      <div>
        <h3 class="font-medium mb-2">Outline Variants</h3>
        <div class="space-y-2">
          <button
            class={button({
              intent: selectedIntent,
              size: selectedSize,
              variant: "outline",
              accessibility: accessibilityEnabled
            })}>
            {selectedIntent} Outline
          </button>
          <button class={button({ intent: "primary", size: "md", variant: "outline" })}>
            Primary Outline
          </button>
          <button class={button({ intent: "danger", size: "md", variant: "outline" })}>
            Danger Outline
          </button>
        </div>
      </div>

      <!-- Ghost Variants -->
      <div>
        <h3 class="font-medium mb-2">Ghost Variants</h3>
        <div class="space-y-2">
          <button
            class={button({
              intent: "ghost",
              size: selectedSize,
              variant: "ghost",
              accessibility: accessibilityEnabled
            })}>
            Ghost Button
          </button>
          <button class={button({ intent: "secondary", size: "md", variant: "ghost" })}>
            Secondary Ghost
          </button>
          <button disabled class={button({ intent: "primary", size: "md", variant: "ghost" })}>
            Disabled Ghost
          </button>
        </div>
      </div>
    </div>

    <!-- Accessibility Toggle -->
    <div class="mt-4 p-4 bg-blue-50 rounded-md">
      <label class={label()}>
        <input type="checkbox" bind:checked={accessibilityEnabled} class="mr-2" />
        Enable Accessibility Features (Focus rings, reduced motion handling)
      </label>
    </div>
  </div>

  <!-- Form Components -->
  <div class={layout.card.toString()}>
    <h2 class="text-xl font-semibold mb-4">Form Components with Accessibility</h2>

    <form class="space-y-4">
      <div>
        <label for="name" class={label({ required: true })}>Name</label>
        <input
          id="name"
          type="text"
          bind:value={formName}
          class={input({ state: formName.length < 2 && formName.length > 0 ? "error" : "default" })}
          placeholder="Enter your name" />
        {#if formName.length < 2 && formName.length > 0}
          <p class="text-sm text-red-600 mt-1">Name must be at least 2 characters</p>
        {/if}
      </div>

      <div>
        <label for="email" class={label({ required: true })}>Email</label>
        <input
          id="email"
          type="email"
          bind:value={formEmail}
          class={input({
            state: formEmail.includes("@") || formEmail.length === 0 ? "default" : "error"
          })}
          placeholder="Enter your email" />
        {#if !formEmail.includes("@") && formEmail.length > 0}
          <p class="text-sm text-red-600 mt-1">Please enter a valid email</p>
        {/if}
      </div>

      <button type="submit" class={button({ intent: "primary", size: "md", class: "w-full" })}>
        Submit Form
      </button>
    </form>
  </div>

  <!-- Recipe Composition -->
  <div class={layout.card.toString()}>
    <h2 class="text-xl font-semibold mb-4">Recipe Composition</h2>

    <div class="space-y-4">
      <div class={layout.select("grid", "grid-cols-1 md:grid-cols-3")}>
        <div>
          <h3 class="font-medium mb-2">Individual Recipes</h3>
          <div class="space-y-2">
            <div class={layout.code.toString()}>layout.container</div>
            <div class={layout.code.toString()}>layout.card</div>
            <div class={layout.code.toString()}>layout.title</div>
          </div>
        </div>

        <div>
          <h3 class="font-medium mb-2">Recipe Extensions</h3>
          <div class="space-y-2">
            <div class={layout.code.with("text-blue-600")}>layout.code.with('text-blue-600')</div>
            <div class={layout.card.with("border-2 border-blue-500")}>Card with custom border</div>
          </div>
        </div>

        <div>
          <h3 class="font-medium mb-2">Recipe Composition</h3>
          <div class={layout.select("code", "bg-yellow-100")}>
            layout.select('code', 'bg-yellow-100')
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Token Resolution Debug -->
  <div class={layout.card.toString()}>
    <h2 class="text-xl font-semibold mb-4">Token Resolution Debug</h2>

    <button
      class={button({ intent: "secondary", size: "sm" })}
      onclick={() => (showTokenResolution = !showTokenResolution)}>
      {showTokenResolution ? "Hide" : "Show"} Token Resolution
    </button>

    {#if showTokenResolution}
      <div class="mt-4 space-y-2">
        <div class="bg-gray-50 p-4 rounded-md">
          <h4 class="font-medium mb-2">Current Button Classes:</h4>
          <code class="text-xs break-all">
            {getResolvedClasses(button, {
              intent: selectedIntent,
              size: selectedSize,
              variant: selectedVariant
            })}
          </code>
        </div>

        <div class="bg-gray-50 p-4 rounded-md">
          <h4 class="font-medium mb-2">Token Values in Current Theme:</h4>
          <div class="text-xs space-y-1">
            <div>
              color.primary: <span class={layout.code.toString()}
                >{themeManager.resolveToken("color.primary")}</span>
            </div>
            <div>
              color.secondary: <span class={layout.code.toString()}
                >{themeManager.resolveToken("color.secondary")}</span>
            </div>
            <div>
              spacing.md: <span class={layout.code.toString()}
                >{themeManager.resolveToken("spacing.md")}</span>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 p-4 rounded-md">
          <h4 class="font-medium mb-2">Theme Manager State:</h4>
          <div class="text-xs space-y-1">
            <div>
              Active Theme: <span class={layout.code.toString()}
                >{themeManager.getActiveTheme()?.name || "None"}</span>
            </div>
            <div>
              Available Themes: <span class={layout.code.toString()}
                >{themeManager
                  .getAllThemes()
                  .map((t) => t.name)
                  .join(", ")}</span>
            </div>
            <div>
              Reduced Motion: <span class={layout.code.toString()}>{reducedMotion.toString()}</span>
            </div>
            <div>
              High Contrast: <span class={layout.code.toString()}>{highContrast.toString()}</span>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Feature Summary -->
  <div class={layout.card.toString()}>
    <h2 class="text-xl font-semibold mb-4">Features Demonstrated</h2>

    <div class={layout.grid.toString() + " grid-cols-1 md:grid-cols-2"}>
      <div>
        <h3 class="font-medium mb-2">✅ Core Features</h3>
        <ul class="text-sm space-y-1 text-gray-700">
          <li>• Enhanced StyleSet creation</li>
          <li>• Token resolution with placeholders</li>
          <li>• Theme composition and switching</li>
          <li>• Recipe-based styling</li>
          <li>• Compound variants</li>
          <li>• Default variants</li>
        </ul>
      </div>

      <div>
        <h3 class="font-medium mb-2">✅ Advanced Features</h3>
        <ul class="text-sm space-y-1 text-gray-700">
          <li>• Accessibility enhancements</li>
          <li>• Focus ring management</li>
          <li>• Reduced motion support</li>
          <li>• High contrast mode</li>
          <li>• Runtime theme switching</li>
          <li>• Type-safe props extraction</li>
        </ul>
      </div>
    </div>

    <div class="mt-4 p-4 bg-green-50 rounded-md">
      <p class="text-sm text-green-800">
        🎉 All features maintain 100% backward compatibility with the original StyleSets API while
        adding powerful new capabilities for modern design system development.
      </p>
    </div>
  </div>
</div>

<style>
  /* Ensure styles work across themes */
  :global(.dark) {
    color-scheme: dark;
  }

  :global([data-theme="dark"]) {
    --theme-background: #111827;
    --theme-text: #f9fafb;
  }

  :global([data-theme="custom"]) {
    --theme-primary: #4f46e5;
    --theme-accent: #f97316;
  }

  :global([data-theme="dark-high-contrast"]) {
    --theme-background: #000000;
    --theme-text: #ffffff;
    --theme-primary: #fbbf24;
  }
</style>
