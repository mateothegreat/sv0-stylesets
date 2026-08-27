StyleSets transforms the traditional "just styles" mindset into a **composable,
accessible design system runtime** that includes developer guardrails.

# **Why StyleSets?**

Out-of-box you get a comprehensive suite of styling tools that provide:

- **Composition over duplication**: You can define a “base” button once, then
  compose a “dark mode” or “brand B” button without rewriting variants.
- **Theme portability**: Swap entire look‑and‑feel by passing a different theme
  override.
- **DX**: Type inference still works — devs get autocomplete for merged variants
  and recipes.
- **UX**: Theming changes are atomic and consistent across components.

<aside>
<img src="/icons/dance_green.svg" alt="/icons/dance_green.svg" width="40px" />

## **Theming That Won't Make You Pull Your Hair Out**

Hey there, fellow code warrior! Whether you're slinging React components,
crafting Svelte magic, or Vue-ing the world, we both know theming can be a
special kind of torture. Let's commiserate about those theming nightmares we've
all had:

- **The "Why is that button still blue?!" syndrome**: You've just spent hours
  implementing dark mode, only to discover your nav dropdowns missed the memo.
  Classic!
- **Copy-paste purgatory**: "I'll just duplicate this button.jsx and make the
  danger version." Fast-forward three months: "Wait, which of these 17 button
  files is the source of truth?!"
- **Props gone wild**:
  `return <Button size="sm" variant="primary" isOutlined={true} theme={isDarkMode ? 'dark' : 'light'} disabled={isLoading} />`
  — Your components looking like they're applying for a mortgage with all that
  paperwork.
- **The "I'm afraid to touch this" refactor**: "The designer wants a slightly
  different shade of blue? Let me just update these 47 places and pray nothing
  breaks!"

StyleSets delivers the sweet, sweet relief you've been dreaming of:

- **Write once, theme everywhere**:
  `const dangerButton = composeStyles(baseButton, dangerTheme)` and boom—your
  button has a dangerous new personality without a code clone in sight.
- **One token to rule them all**: When your designer Slacks you "can we try
  #3B82F6 instead?" you update ONE token and watch the changes ripple through
  your entire app. Like magic, but actually just good engineering.
- **Variants without the drama**:
  `applyVariants(button, ["primary", "compact"])` and you're done. No 20-line
  ternary operators hiding in your render functions.
- **Debugging that makes sense**: When something looks funky, you'll know
  exactly which theme override is responsible—no more "which of these 12 CSS
  files is causing this?"

So when your PM drops the "We need to support three more brands by Tuesday"
bomb, you won't need to update your resume in panic. Just compose new themes
that inherit from your base and go grab coffee instead. Your future self will
thank you. Profusely.

</aside>

# **Developer Experience (DX)**

StyleSets offers an intuitive developer experience that balances flexibility
with structure. Developers benefit from a consistent mental model with type-safe
APIs that promote best practices without being opinionated about implementation
details. You can use as little or as much functionality as needed while
maintaining compatibility with your existing codebase.

## **Lightweight, Modular Architecture**

Organized as a clean, modular workspace similar to Lerna/Turborepo/PNPM with
focused and atomic exports:

- `@lib/tokens` → design tokens (colors, spacing, typography)
- `@lib/utils` → pure functions (`mergeConfig`, `applyVariant`, `composeStyles`)
- `@lib/a11y` → accessibility primitives (`focusRing`, `reducedMotion`)
- `@lib/theme` → higher-order theme composer (`composeTheme(base, overrides)`)
- `@lib/integrations/svelte` → Svelte bindings (stores, actions)
- `@lib/integrations/tailwind` → Tailwind plugin generator

### **Pattern 1: Themed Variants (The Idiomatic Approach)**

StyleSets makes theme variants easy to create and maintain at scale. With the
Themed Variant pattern, you define base styles once and then create themed
variations without duplicating code. This approach allows for efficient
management of multiple themes while maintaining a single source of truth for
your component styles.

```tsx
const button = createVariant({
  variants: {
    intent: {
      primary: (theme) => `bg-${theme.colors.primary}`
    }
  }
});
```

### **Pattern 2: Higher-Order Theme Composer**

StyleSets provides a powerful theme composition API that lets you easily combine
base styles with theme overrides. You'll learn how this approach eliminates
duplication and enables clean, maintainable theme variations across your entire
design system.

```tsx
export const composeTheme<V, R>(
  baseConfig: StylerConfig<V, R>,
  themeOverrides: Partial<StylerConfig<V, R>>
) => {
  const mergedConfig = deepMergeConfig(baseConfig, themeOverrides);
  ...
  return createStyleSet(mergedConfig);
}
```

### **Pattern 3: Design Token Integration**

Seamlessly manage, transform, and apply design tokens across your projects by
integrating with your existing design token tools and workflows. Simply bring
your own TypeScript, JSON, or CSS to create a cohesive, usable system.

Instead of hard‑coding Tailwind classes in overrides, allow **token
references**:

```tsx
const darkTheme = {
  tokens: {
    brand: {
      bg: "bg-gray-900"
      h1: "text-blue-500 font-bold text-xl"
    }
    text: "text-white",
    focus: {
      ring: "ring-blue-400"
    }
  },
  overrides: {
    variants: {
      intent: {
        primary: "{brand.*} {text} hover:bg-gray-800"
      }
    },
    a11y: {
      focus: { ring: "{focus.ring}" }
    }
  }
};
```

You can also load your tokens from json files such as:

```tsx
{
  "color": {
    "brand": {
      "primary": "#0070F3",
      "secondary": "#EA4335"
    }
  },
  "radius": {
    "button": "6px"
  }
}
```

## **Portability**

StyleSets creates a portable design system that can be implemented across
different frameworks and projects with minimal friction:

- **Exposes all primitives**: \*\*\*\*Let advanced users build their own style
  factories from your building blocks.
- **Token‑first design support**: Allows you to keep all colors, spacing, and
  typography in a token map so swapping themes is just swapping the token
  object.
- **Plugin system oriented**: Allows users to inject their own resolvers (e.g.,
  `resolveStateClasses` for ARIA/data attributes).
- **Preset packs**: Ships with optional packs such as `@stylesets/a11y`,
  `@stylesets/forms`, `@stylesets/animations` — each just exports a set of
  recipes and resolvers.
- **Portability**: You can use `resolveVariants` in a CLI to generate static
  CSS, or in a design token pipeline, without pulling in the whole style set.
- **Testability**: Each function is tiny and pure — easy to unit test.
- **Composable**: You can build new factories (`createThemeSet`, `composeTheme`)
  by reusing the same primitives.
- **Framework‑agnostic**: The core doesn’t care if it’s used in Svelte, React,
  Vue, or even Node for precomputation.
- **Tree‑shakable**: Consumers can import only what they need.

## Accessibility

Accessibility is not an "add-on." It must be **first-class**, baked into the
styling utilities and design tokens. StyleSets provides developers with
accessible defaults out of the box, including opt-out options. Users should
experience consistent, predictable, and customizable accessibility features
throughout.

Top-down configuration approach that cascades through your application, where
higher-level settings establish defaults that can be selectively overridden at
lower levels:

```tsx
a11y: {
  focusRing: true, // enable focus-visible rings
  reducedMotion: true, // auto-generate reduced motion variants
  highContrast: "variant" // "variant" | "theme" | false
}
```

Integrate accessibility features through simple composable functions:

```tsx
import { composeTheme, focusRing, reducedMotion } from "@lib/core";

const dark = composeTheme(lightTheme, {
  colors: { background: "#000", text: "#fff" }
});

const a11y = {
  focus: focusRing(),
  motion: reducedMotion(),
  contrast: highContrast()
};

const myTheme = composeTheme(dark, { a11y });
```

StyleSets makes accessibility a core focus with these guiding principles:

- **Built-in defaults**: Accessibility features come pre-configured with
  sensible defaults that respect user preferences.
- **Customizable options**: Flexible controls for focus indicators, motion
  reduction, and contrast enhancement that can be adjusted at multiple levels.
- **Seamless integration**: Accessibility features integrate naturally with
  component styling without requiring separate implementation.

### Examples

What these simple examples gives you: predictable, legible focus; motion that
never disrespects user preferences; high‑contrast that “just works.”

**Button with accessible defaults:**

```tsx
export const button = createStyleSet({
  a11y: { focus: { preset: "brand" }, motion: { respectReduced: true } },
  base: "inline-flex items-center gap-2 rounded-md font-medium focus-default",
  variants: {
    intent: {
      primary: "bg-brand-600 text-white hover:bg-brand-700",
      secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
    },
    size: {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-5 text-base"
    }
  },
  compoundVariants: [
    { intent: "primary", class: "hc:bg-[CanvasText] hc:text-[Canvas]" }
  ],
  defaultVariants: { intent: "primary", size: "md" },
  recipes: {
    iconOnly: "justify-center aspect-square p-0"
  }
});
```

Usage with states:

```html
<button
  class={button({ intent: 'secondary' })}
  aria-disabled={loading || undefined}
  aria-invalid={invalid || undefined}>
  Save
</button>
```

**Card with high‑contrast mapping via data theme:**

```tsx
export const card = createStyleSet({
  a11y: { contrast: { strategy: "both" } },
  base: "rounded-lg border border-neutral-200 bg-white contrast-high:bg-black contrast-high:text-white"
});
```

**Motion‑safe accordion**

```html
<div class="overflow-hidden">
  <div class={motion.transition('transition-all duration-300 data-[state=open]:max-h-96 max-h-0')}>
    {@render children?.()}
  </div>
</div>
```

Another value-add is the built-in state-aware selectors that encourage semantic
state representation through ARIA/data attributes instead of additional variants
such as:

- **Error state:**
  `aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-60 ...`
- **Disabled state:**
  `aria-disabled:opacity-50 aria-disabled:cursor-not-allowed`
- **Expanded/open:** `data-[state=open]:rotate-180 ...`
- **Motion safety**: `motion-reduce:animate-none ...`

Bundle these as optional recipes on components where relevant!
