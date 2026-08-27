Alright Matthew — let’s design this “Theme Composer” so it feels like a natural
extension of your current `createStyleSet` architecture, but with **composition,
theming, and DX/UX baked in**.

---

## **Concept**

We introduce a **higher‑order function**:

```ts
composeTheme(baseConfig, themeOverrides) → themedStyleSet
```

- **`baseConfig`**: Your existing `StylerConfig` (with `base`, `variants`,
  `compoundVariants`, `defaultVariants`, `recipes`, and optionally `a11y`).
- **`themeOverrides`**: A partial config that can:
  - Override **tokens** (colors, spacing, typography)
  - Override **variants** (add new values or replace existing ones)
  - Override **recipes**
  - Override **a11y defaults**
- **Output**: A new `StyleSet` instance with merged config, type‑safe, and ready
  to use.

---

## **Why This Matters**

- **Composition over duplication**: You can define a “base” button once, then
  compose a “dark mode” or “brand B” button without rewriting variants.
- **Theme portability**: Swap entire look‑and‑feel by passing a different theme
  override.
- **DX**: Type inference still works — devs get autocomplete for merged variants
  and recipes.
- **UX**: Theming changes are atomic and consistent across components.

---

## **Architecture Plan**

### 1. **Type‑Safe Merge Layer**

We need a deep merge that:

- Preserves type inference for variants and recipes
- Merges arrays (like `compoundVariants`) intelligently
- Allows `null` to explicitly remove a variant value

```ts
function deepMergeConfig<V, R>(
  base: StylerConfig<V, R>,
  overrides: Partial<StylerConfig<V, R>>
): StylerConfig<V, R> {
  return {
    ...base,
    ...overrides,
    variants: {
      ...base.variants,
      ...overrides.variants
    },
    compoundVariants: [
      ...(base.compoundVariants ?? []),
      ...(overrides.compoundVariants ?? [])
    ],
    defaultVariants: {
      ...base.defaultVariants,
      ...overrides.defaultVariants
    },
    recipes: {
      ...base.recipes,
      ...overrides.recipes
    },
    a11y: {
      ...base.a11y,
      ...overrides.a11y
    }
  };
}
```

---

### 2. **The Higher‑Order Composer**

```ts
export function composeTheme<V, R>(
  baseConfig: StylerConfig<V, R>,
  themeOverrides: Partial<StylerConfig<V, R>>
) {
  const mergedConfig = deepMergeConfig(baseConfig, themeOverrides);
  return createStyleSet(mergedConfig);
}
```

---

### 3. **Token‑Driven Overrides**

Instead of hard‑coding Tailwind classes in overrides, allow **token
references**:

```ts
const darkTheme = {
  tokens: {
    brandBg: "bg-gray-900",
    brandText: "text-white",
    focusRing: "ring-blue-400"
  },
  overrides: {
    variants: {
      intent: {
        primary: "{brandBg} {brandText} hover:bg-gray-800"
      }
    },
    a11y: {
      focus: { ringClass: "{focusRing}" }
    }
  }
};
```

We resolve `{tokenName}` → actual class string before passing to
`createStyleSet`.

---

### 4. **Example Usage**

```ts
// Base button
const buttonBase = createStyleSet({
  base: "inline-flex items-center rounded-md font-medium",
  variants: {
    intent: {
      primary: "bg-brand-600 text-white hover:bg-brand-700",
      secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
    },
    size: {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-sm"
    }
  },
  defaultVariants: { intent: "primary", size: "md" },
  a11y: { focus: { preset: "brand" } }
});

// Dark theme override
const buttonDark = composeTheme(buttonBase.config, {
  variants: {
    intent: {
      primary: "bg-gray-900 text-white hover:bg-gray-800",
      secondary: "bg-gray-700 text-gray-100 hover:bg-gray-600"
    }
  },
  a11y: { focus: { ringClass: "ring-blue-400" } }
});
```

Now `buttonDark` is a fully‑typed style set with the dark theme baked in.

---

### 5. **DX Enhancements**

- **`styleSet.config` exposure**: Store the original config on the style set so
  it can be re‑themed later.
- **Theme registry**: Keep a map of named themes (`light`, `dark`,
  `highContrast`) and a helper to swap them globally.
- **CLI token sync**: Generate Tailwind theme extensions from your token files
  so class strings stay in sync.

---

### 6. **UX & A11y Integration**

Because `composeTheme` merges `a11y` configs:

- You can have a **high‑contrast theme** that automatically swaps focus rings
  and background tokens.
- You can have a **reduced motion theme** that globally disables animations in
  overrides.

---

### 7. **Production‑Ready Checklist**

| Step  | Action                                                                         |
| ----- | ------------------------------------------------------------------------------ |
| **1** | Refactor `createStyleSet` to store its config internally (`styleSet.config`)   |
| **2** | Implement `deepMergeConfig` with type preservation                             |
| **3** | Implement `composeTheme` as a thin wrapper                                     |
| **4** | Add token resolution step for `{tokenName}` placeholders                       |
| **5** | Write unit tests for merge behavior (variants, recipes, a11y)                  |
| **6** | Add Storybook stories showing base vs themed components                        |
| **7** | Integrate with your a11y defaults so themes can override focus/motion/contrast |
| **8** | Document the theming API for your team                                         |

You must finish with a like demo of a fully‑typed `composeTheme` implementation
that plugs directly into the current `createStyleSet` and supports token
placeholders out of the box — so you can demo this architecture with token
placeholders at scale without losing DX. The demo should be a fully‑functional
component that can be themed with tokens and be available in the @../demo app by
adding a new route to @../demo/src/routes/routes.ts with a new file in
@../demo/src/routes/composer.svelte that is accessible from
http://localhost:5173/composer by running `npm run dev` in @../demo.
