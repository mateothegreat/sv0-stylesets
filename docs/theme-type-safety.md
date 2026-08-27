# Theme Type Safety Guide

Type-safe theme handling for `createStyleSet()` and `ThemeManager` to constrain theme values like `'dark'` or `'light'` with full TypeScript autocompletion.

## Quick Start

### Method 1: Type-safe themes with `createStyleSet()`

```typescript
import { createStyleSet, type ExtractThemeIds } from '@sv0/stylesets';

// Define themes with 'as const' for literal types
const myThemes = {
  light: {
    tokens: { color: { primary: "blue-600" } }
  },
  dark: {
    tokens: { color: { primary: "blue-400" } }
  },
  highContrast: {
    tokens: { color: { primary: "yellow-400" } }
  }
} as const;

// Extract theme IDs as a union type
type MyThemeIds = ExtractThemeIds<typeof myThemes>;
// Result: 'light' | 'dark' | 'highContrast'

// Create StyleSet - TypeScript infers theme types automatically
const button = createStyleSet({
  base: "px-4 py-2",
  variants: {
    intent: {
      primary: "bg-{color.primary}"
    }
  },
  themes: myThemes
});

// ✅ Type-safe with autocompletion
button({ theme: "light" });
button({ theme: "dark" });

// ❌ TypeScript error - 'invalid' is not a valid theme
// button({ theme: "invalid" });
```

### Method 2: Type-safe themes with `ThemeManager`

```typescript
import { ThemeManager, type ExtractThemeIdsFromArray } from '@sv0/stylesets';

// Define theme configs as const array
const themeConfigs = [
  {
    id: "ocean" as const,
    name: "Ocean Blue",
    tokens: { color: { primary: "blue-500" } }
  },
  {
    id: "forest" as const,
    name: "Forest Green",
    tokens: { color: { primary: "green-600" } }
  }
] as const;

// Extract theme IDs from array
type AppThemeIds = ExtractThemeIdsFromArray<typeof themeConfigs>;
// Result: 'ocean' | 'forest'

// Create ThemeManager
const manager = new ThemeManager(themeConfigs);

// Type-safe theme switcher
function setTheme(id: AppThemeIds): boolean {
  return manager.setActiveTheme(id);
}

// ✅ Type-safe
setTheme("ocean");
setTheme("forest");

// ❌ TypeScript error
// setTheme("invalid");
```

## Complete Examples

### App-Wide Theme System

```typescript
import { createStyleSet, type ExtractThemeIds } from '@sv0/stylesets';

// 1. Define global theme registry
const APP_THEMES = {
  default: {
    tokens: {
      color: {
        primary: "indigo-600",
        text: "gray-900"
      }
    }
  },
  corporate: {
    tokens: {
      color: {
        primary: "blue-700",
        text: "slate-900"
      }
    }
  },
  darkMode: {
    tokens: {
      color: {
        primary: "indigo-400",
        text: "gray-100"
      }
    },
    darkMode: true
  }
} as const;

// 2. Export theme type for app-wide use
export type AppTheme = ExtractThemeIds<typeof APP_THEMES>;
// Result: 'default' | 'corporate' | 'darkMode'

// 3. Create components with typed themes
const heading = createStyleSet({
  base: "font-bold text-{color.text}",
  variants: {
    size: { sm: "text-lg", lg: "text-4xl" }
  },
  themes: APP_THEMES
});

const paragraph = createStyleSet({
  base: "text-{color.text}",
  themes: APP_THEMES
});

// 4. Create theme context
class ThemeContext {
  #theme: AppTheme = "default";

  setTheme(theme: AppTheme): void {
    this.#theme = theme;
  }

  getTheme(): AppTheme {
    return this.#theme;
  }
}

const themeContext = new ThemeContext();

// 5. Use in components
themeContext.setTheme("darkMode");
heading({ size: "lg", theme: themeContext.getTheme() });
```

### Svelte 5 Integration

```typescript
// theme-store.svelte.ts
import { type ExtractThemeIds } from '@sv0/stylesets';

const themes = {
  light: { tokens: { color: { bg: "white", text: "black" } } },
  dark: { tokens: { color: { bg: "black", text: "white" } } }
} as const;

export type Theme = ExtractThemeIds<typeof themes>;

class ThemeStore {
  #currentTheme = $state<Theme>("light");

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

export const themeStore = new ThemeStore();
```

```svelte
<!-- MyComponent.svelte -->
<script lang="ts">
  import { createStyleSet } from '@sv0/stylesets';
  import { themeStore, type Theme } from './theme-store.svelte';

  const themes = {
    light: { tokens: { color: { bg: "white" } } },
    dark: { tokens: { color: { bg: "black" } } }
  } as const;

  const component = createStyleSet({
    base: "component bg-{color.bg}",
    themes
  });

  // Reactive classes based on theme
  const classes = $derived(component({
    theme: themeStore.current
  }));
</script>

<div class={classes}>
  <button onclick={() => themeStore.toggle()}>
    Toggle Theme
  </button>
</div>
```

### Component Props with Theme Types

```typescript
import { createStyleSet, type ExtractThemeIds } from '@sv0/stylesets';

const themes = {
  light: { tokens: {} },
  dark: { tokens: {} }
} as const;

type ThemeIds = ExtractThemeIds<typeof themes>;

const button = createStyleSet({
  base: "btn",
  variants: {
    intent: {
      primary: "bg-primary",
      secondary: "bg-secondary"
    }
  },
  themes
});

// Type-safe component props
type ButtonProps = {
  intent?: "primary" | "secondary";
  theme?: ThemeIds; // <-- Constrained to 'light' | 'dark'
  children?: string;
};

function Button(props: ButtonProps) {
  return button({
    intent: props.intent,
    theme: props.theme // Type-safe!
  });
}

// ✅ Usage
Button({ theme: "light", intent: "primary" });
Button({ theme: "dark", intent: "secondary" });
```

### Shared ThemeManager Across StyleSets

```typescript
import { createStyleSet, ThemeManager, type ExtractThemeIdsFromArray } from '@sv0/stylesets';

// Define themes once
const themeConfigs = [
  { id: "light" as const, name: "Light", tokens: { color: { primary: "blue-600" } } },
  { id: "dark" as const, name: "Dark", tokens: { color: { primary: "blue-400" } } }
] as const;

type ThemeIds = ExtractThemeIdsFromArray<typeof themeConfigs>;

// Create shared ThemeManager
const themeManager = new ThemeManager(themeConfigs);

// All StyleSets share the same ThemeManager
const button = createStyleSet({
  base: "btn",
  variants: { size: { sm: "text-sm", lg: "text-lg" } },
  themeManager
});

const card = createStyleSet({
  base: "card",
  variants: { elevated: { true: "shadow-lg", false: "shadow" } },
  themeManager
});

// Change theme globally
function setGlobalTheme(theme: ThemeIds): void {
  themeManager.setActiveTheme(theme);
}

setGlobalTheme("dark"); // Affects all StyleSets
```

## API Reference

### Type Utilities

#### `ExtractThemeIds<T>`

Extract theme IDs from a themes configuration object.

```typescript
type ExtractThemeIds<T extends Record<string, any>> = keyof T & string;
```

**Usage:**
```typescript
const themes = {
  light: {...},
  dark: {...}
} as const;

type ThemeIds = ExtractThemeIds<typeof themes>;
// Result: 'light' | 'dark'
```

#### `ExtractThemeIdsFromArray<T>`

Extract theme IDs from an array of ThemeConfig objects.

```typescript
type ExtractThemeIdsFromArray<T extends ReadonlyArray<ThemeConfig>> = T[number]["id"];
```

**Usage:**
```typescript
const configs = [
  { id: "light" as const, name: "Light" },
  { id: "dark" as const, name: "Dark" }
] as const;

type ThemeIds = ExtractThemeIdsFromArray<typeof configs>;
// Result: 'light' | 'dark'
```

### Updated Types

#### `EnhancedStyleSet<V, R, ThemeIds>`

The StyleSet type now accepts a third generic parameter for theme IDs:

```typescript
type EnhancedStyleSet<
  V,                              // Variants type
  R extends Record<string, ClassValue> | undefined,  // Recipes type
  ThemeIds extends string = string  // Theme IDs type (defaults to string)
>
```

**Theme prop type:**
```typescript
{
  theme?: ThemeIds;  // Constrained to defined theme IDs
  // ... other props
}
```

## Best Practices

### 1. Always use `as const`

```typescript
// ✅ Good - preserves literal types
const themes = {
  light: {...},
  dark: {...}
} as const;

// ❌ Bad - widens to Record<string, any>
const themes = {
  light: {...},
  dark: {...}
};
```

### 2. Define themes outside createStyleSet

```typescript
// ✅ Good - can extract type
const myThemes = {...} as const;
type MyThemeIds = ExtractThemeIds<typeof myThemes>;
const styler = createStyleSet({ themes: myThemes });

// ❌ Bad - can't extract type easily
const styler = createStyleSet({
  themes: {...}
});
```

### 3. Use a single AppTheme type

```typescript
// themes.ts
export const APP_THEMES = {...} as const;
export type AppTheme = ExtractThemeIds<typeof APP_THEMES>;

// components.ts
import type { AppTheme } from './themes';

function MyComponent(props: { theme?: AppTheme }) {
  // ...
}
```

### 4. Centralize theme management

```typescript
// Create a theme store/context/manager
class ThemeManager {
  #theme: AppTheme = "default";

  setTheme(theme: AppTheme) {
    this.#theme = theme;
    // Update all components
  }
}

export const themeManager = new ThemeManager();
```

### 5. For ThemeManager, use const arrays

```typescript
// ✅ Good
const configs = [
  { id: "light" as const, name: "Light" },
  { id: "dark" as const, name: "Dark" }
] as const;

// ❌ Bad - loses literal types
const configs = [
  { id: "light", name: "Light" },
  { id: "dark", name: "Dark" }
];
```

## See Also

- [Full example with all patterns](../src/theme-types.example.ts)
- [Theme types test suite](../src/theme-types.test.ts)
- [Main documentation](./README.md)
