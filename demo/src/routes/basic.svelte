<script lang="ts">
  import Basic from "$components/basic.svelte";
  import { createAccessibilityConfig, createEnhancedStyleSet } from "@sv0/stylesets";
  import { random } from "../util/random";

  let ref: Basic;

  let r = $state(false);
  let timeout: NodeJS.Timeout;

  let { mode }: { mode: string } = $props();

  let currentTheme = $state("light");

  const ui = createEnhancedStyleSet({
    base: "font-sans",
    recipes: {
      mode: "bg-{color.dark}",
      container: "max-w-2xl mx-auto p-6",
      card: "bg-{color.background} border border-{color.border} rounded-lg p-{spacing.card} shadow-sm",
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
        primary: "aaa bg-{color.primary} text-white hover:bg-{color.primaryHover}",
        secondary: "bbb bg-{color.secondary} text-{color.text} hover:bg-{color.secondaryHover}",
        outline:
          "ccc border border-{color.primary} text-{color.primary} hover:bg-{color.primary} hover:text-white"
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
        variants: {
          buttonStyle: {
            extra: "bg-red-500 text-white hover:bg-red-600",
            primary: "bg-yellow-500 text-white hover:bg-yellow-600",
            secondary: "bg-blue-500 text-white hover:bg-blue-600",
            outline: "border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
          }
        },
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
        variants: {
          buttonStyle: {
            extra: "bg-red-500 text-white hover:bg-red-600",
            primary: "bg-yellow-500 text-white hover:bg-yellow-600",
            secondary: "bg-blue-500 text-white hover:bg-blue-600",
            outline: "border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
          }
        },
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
        variants: {
          buttonStyle: {
            extra: "bg-red-500 text-white hover:bg-red-600",
            primary: "bg-yellow-500 text-white hover:bg-yellow-600",
            secondary: "bg-blue-500 text-white hover:bg-blue-600",
            outline: "border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
          }
        },
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

  $effect(() => {
    if (r) {
      clearInterval(timeout);
      timeout = setInterval(() => {
        intent = random(["primary", "secondary", "default"]);
        size = random(["small", "medium", "default"]);
      }, 500);
    } else {
      clearInterval(timeout);
    }
  });
</script>

<pre>{JSON.stringify(Object.keys(ui.select("button")), null, 2)}</pre>

<div class="dark">
  <div class={ui.container.toString()}>
    <div class={ui.card.toString()}>
      <h1 class={ui.title.toString()}>Basic Demo</h1>
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
            {theme}
          </button>
        {/each}
      </div>
    </div>

    <!-- Component Examples with Selected Theme -->
    <div class={ui.card.with("", { theme: currentTheme })}>
      <h2 class="text-xl font-semibold mb-4">
        Current theme:
        <span data-theme={currentTheme} class="text-blue-500">{currentTheme}</span>
      </h2>

      <!-- Buttons -->
      <div class="mb-6">
        <h3 class={ui.muted.toString()}>Buttons</h3>
        <div class="flex gap-3 mt-2">
          <button
            class={ui.select("button") + " " + ui({ buttonStyle: "primary", theme: currentTheme })}>
            Primary
          </button>
          <button
            class={ui.select("button") +
              " " +
              ui({ buttonStyle: "secondary", theme: currentTheme })}>
            Secondary
          </button>
          <button
            class={ui.select("button") + " " + ui({ buttonStyle: "outline", theme: currentTheme })}>
            Outline
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-4 items-start">
        <button onclick={() => (r = !r)}>
          Random ({r ? "on" : "off"})
        </button>
        <Basic
          bind:this={ref}
          intent="chagneme"
          size="changeme"
          href="https://www.google.com"
          class="flex bg-slate-500 flex-col items-center justify-center">
          <div>Hello</div>
        </Basic>
      </div>

      <table>
        <tbody>
          <tr>
            <td>ui.select("button")</td>
            <td>{ui.select("button")}</td>
          </tr>
          <tr>
            <td>ui(&#123; buttonStyle: &quot;primary&quot;, theme: currentTheme &#125;)</td>
            <td>{ui({ buttonStyle: "primary", theme: currentTheme })}</td>
          </tr>
        </tbody>
      </table>
      <!-- Text Examples -->
      <div class="space-y-2">
        {ui({ mode: currentTheme })}
        <p class={ui.text.with("", { theme: currentTheme })}>Regular text in the current theme</p>
        <p class={ui.muted.with("", { theme: currentTheme })}>Muted text in the current theme</p>
      </div>
    </div>
  </div>
</div>

<!-- <svelte:head>
  <script lang="ts">
    document.body.classList.add("dark");
  </script>
</svelte:head> -->
