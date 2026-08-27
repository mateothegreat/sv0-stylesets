<script lang="ts">
  import { createAccessibilityConfig, createEnhancedStyleSet, defaultThemes } from "../../../src";

  // Create a simple themed component system
  const ui = createEnhancedStyleSet({
    base: "font-sans",
    recipes: {
      mode: "bg-{color.dark}",
      container: "max-w-2xl mx-auto p-6",
      card: "bg-{color.surface} border border-{color.border} rounded-lg p-{spacing.card} shadow-sm",
      button:
        "px-{spacing.button} py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-{color.primary} focus:ring-offset-2",
      input:
        "w-full px-3 py-2 border border-{color.border} rounded-md focus:outline-none focus:border-{color.primary} focus:ring-1 focus:ring-{color.primary}",
      title: "text-2xl font-bold text-{color.text} mb-4",
      text: "text-{color.text}",
      muted: "text-{color.muted}"
    },
    variants: {
      mode: {
        dark: "bg-{color.background}",
        light: "bg-{color.background}",
        neon: "bg-{color.background}"
      },
      buttonStyle: {
        primary: "bg-{color.primary} text-white hover:bg-{color.primaryHover}",
        secondary: "bg-{color.secondary} text-{color.text} hover:bg-{color.secondaryHover}",
        outline:
          "border border-{color.primary} text-{color.primary} hover:bg-{color.primary} hover:text-white"
      }
    },
    tokens: {
      color: {
        background: "unset-default",
        light: "bg-white",
        neon: "bg-pink-500",
        primary: "blue-600",
        primaryHover: "blue-700",
        secondary: "gray-200",
        secondaryHover: "gray-300",
        surface: "white",
        text: "gray-900",
        muted: "gray-600",
        border: "gray-300"
      },
      spacing: {
        card: "1.5rem",
        button: "1rem"
      }
    },
    themes: {
      light: {
        tokens: {
          color: {
            background: "white",
            primary: "blue-600",
            primaryHover: "blue-700",
            secondary: "gray-100",
            secondaryHover: "gray-200",
            surface: "white",
            text: "gray-900",
            muted: "gray-600",
            border: "gray-200"
          }
        }
      },
      dark: {
        tokens: {
          color: {
            background: "black",
            primary: "blue-500",
            primaryHover: "blue-600",
            secondary: "gray-700",
            secondaryHover: "gray-600",
            surface: "gray-800",
            text: "gray-100",
            muted: "gray-400",
            border: "gray-600"
          }
        }
      },
      neon: {
        tokens: {
          color: {
            background: "pink-500",
            primary: "cyan-400",
            primaryHover: "cyan-500",
            secondary: "purple-600",
            secondaryHover: "purple-700",
            surface: "black",
            text: "cyan-100",
            muted: "cyan-300",
            border: "cyan-600"
          }
        }
      }
    },
    accessibility: createAccessibilityConfig({
      focusRing: "primary",
      reducedMotion: true,
      highContrast: true
    })
  });

  let currentTheme = $state("dark");
  let name = $state("");
  let email = $state("");

  $inspect(ui.themes);

  console.log("theme", defaultThemes.dark());

  console.log("ui", ui({ mode: "neon", theme: "dark" }).toString());
</script>

{ui.mode.toString()}
<div class={ui.container.toString()}>
  <div class={ui.card.toString()}>
    <h1 class={ui.title.toString()}>Theme Showcase</h1>
    <p class={ui.text.toString()}>
      This demonstrates how themes can be switched dynamically while maintaining full type safety
      and accessibility features.
    </p>
  </div>

  <!-- Theme Selector -->
  <div class={ui.card.toString()}>
    <h2 class="text-xl font-semibold mb-4">Select Theme</h2>
    <div class="grid grid-cols-3 gap-4">
      {#each ["light", "dark", "neon"] as theme}
        <button
          class={ui.select("button") +
            " " +
            ui({
              buttonStyle: currentTheme === theme ? "primary" : "secondary",
              theme: currentTheme
            })}
          onclick={() => (currentTheme = theme)}>
          {theme.charAt(0).toUpperCase() + theme.slice(1)}
        </button>
      {/each}
    </div>
  </div>

  <!-- Component Examples with Selected Theme -->
  <div class={ui.card.with("", { theme: currentTheme })}>
    <h2 class="text-xl font-semibold mb-4">Components with {currentTheme} theme</h2>

    <!-- Buttons -->
    <div class="mb-6">
      <h3 class={ui.muted.toString()}>Buttons</h3>
      <div class="flex gap-3 mt-2">
        <button
          class={ui.select("button") + " " + ui({ buttonStyle: "primary", theme: currentTheme })}>
          Primary
        </button>
        <button
          class={ui.select("button") + " " + ui({ buttonStyle: "secondary", theme: currentTheme })}>
          Secondary
        </button>
        <button
          class={ui.select("button") + " " + ui({ buttonStyle: "outline", theme: currentTheme })}>
          Outline
        </button>
      </div>
    </div>

    <!-- Form -->
    <div class="mb-6">
      <h3 class={ui.muted.toString()}>Form Elements</h3>
      <div class="space-y-4 mt-2">
        <div>
          <label class="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            bind:value={name}
            class={ui.input.with("", { theme: currentTheme })}
            placeholder="Enter your name" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            bind:value={email}
            class={ui.input.with("", { theme: currentTheme })}
            placeholder="Enter your email" />
        </div>
      </div>
    </div>

    <!-- Text Examples -->
    <div class="space-y-2">
      <p class={ui.text.with("", { theme: currentTheme })}>Regular text in the current theme</p>
      <p class={ui.muted.with("", { theme: currentTheme })}>Muted text in the current theme</p>
    </div>
  </div>

  <!-- Token Values -->
  <div class={ui.card.toString()}>
    <h2 class="text-xl font-semibold mb-4">Current Theme Tokens</h2>
    <div class="grid grid-cols-2 gap-4 text-sm">
      <div>
        <h3 class="font-medium mb-2">Colors</h3>
        <div class="space-y-1 font-mono text-xs">
          <div>primary: <span class="bg-gray-100 px-2 py-1 rounded">blue-600</span></div>
          <div>surface: <span class="bg-gray-100 px-2 py-1 rounded">white</span></div>
          <div>text: <span class="bg-gray-100 px-2 py-1 rounded">gray-900</span></div>
        </div>
      </div>
      <div>
        <h3 class="font-medium mb-2">Spacing</h3>
        <div class="space-y-1 font-mono text-xs">
          <div>card: <span class="bg-gray-100 px-2 py-1 rounded">1.5rem</span></div>
          <div>button: <span class="bg-gray-100 px-2 py-1 rounded">1rem</span></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Accessibility Notice -->
  <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
    <h3 class="font-semibold text-blue-900 mb-2">✨ Accessibility Features Active</h3>
    <ul class="text-sm text-blue-800 space-y-1">
      <li>• Focus rings automatically applied to interactive elements</li>
      <li>• High contrast support for better visibility</li>
      <li>• Reduced motion preferences respected</li>
      <li>• Keyboard navigation fully supported</li>
    </ul>
  </div>
</div>
