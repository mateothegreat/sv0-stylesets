# Global ThemeManager Pattern

This guide explains how to use a single, global `ThemeManager` instance across multiple StyleSets to avoid redundancy and maintain centralized theme control.

## The Problem

By default, each `createStyleSet` call creates its own isolated `ThemeManager` instance. This leads to:

1. **Theme Duplication**: You must pass the same themes to every StyleSet
2. **No Central Control**: Each StyleSet manages its own theme state
3. **Maintenance Overhead**: Updating themes requires changes in multiple places

## The Solution: Global ThemeManager

Pass a shared `ThemeManager` instance to all your StyleSets.

### Step 1: Create Global ThemeManager

```typescript
// theme-config.ts
import { ThemeManager, defaultThemes, type ThemeConfig } from '@sv0/stylesets';

// Define your themes
export const lightTheme = defaultThemes.light();
export const darkTheme = defaultThemes.dark();

// Custom theme
export const brandTheme: ThemeConfig = {
  id: 'brand',
  name: 'Brand Theme',
  tokens: {
    color: {
      primary: 'indigo-600',
      secondary: 'pink-600',
    }
  }
};

// Create ONE global ThemeManager
export const globalThemeManager = new ThemeManager([
  lightTheme,
  darkTheme,
  brandTheme
]);

// Set initial theme
globalThemeManager.setActiveTheme('light');
```

### Step 2: Share ThemeManager Across StyleSets

```typescript
// components/button.ts
import { createStyleSet } from '@sv0/stylesets';
import { globalThemeManager } from '../theme-config';

export const button = createStyleSet({
  base: 'px-4 py-2 rounded',
  variants: {
    intent: {
      primary: 'bg-{color.primary} text-white',
      secondary: 'bg-{color.secondary} text-white',
    }
  },
  // ✅ Pass the global ThemeManager
  themeManager: globalThemeManager
});
```

```typescript
// components/card.ts
import { createStyleSet } from '@sv0/stylesets';
import { globalThemeManager } from '../theme-config';

export const card = createStyleSet({
  base: 'p-6 rounded-lg shadow',
  variants: {
    variant: {
      primary: 'border-2 border-{color.primary}',
      secondary: 'border-2 border-{color.secondary}',
    }
  },
  // ✅ Same ThemeManager instance
  themeManager: globalThemeManager
});
```

### Step 3: Use in Components

```typescript
// App.svelte or your component
import { globalThemeManager } from './theme-config';
import { button } from './components/button';
import { card } from './components/card';

// Get current theme
const currentTheme = globalThemeManager.getActiveTheme();

// Use with components
const buttonClass = button({
  intent: 'primary',
  theme: currentTheme?.id
});

const cardClass = card({
  variant: 'secondary',
  theme: currentTheme?.id
});

// Switch theme globally - affects ALL stylesets
globalThemeManager.setActiveTheme('dark');
```

## Comparison: Old vs New Pattern

### ❌ Old Pattern (Redundant)

```typescript
// Define themes
const lightTheme = { /* ... */ };
const darkTheme = { /* ... */ };

// Create global ThemeManager
const globalThemeManager = new ThemeManager([lightTheme, darkTheme]);

// But then ALSO pass themes to every StyleSet
const button = createStyleSet({
  variants: { /* ... */ },
  themes: {  // ❌ Duplication!
    light: lightTheme,
    dark: darkTheme
  }
});

const card = createStyleSet({
  variants: { /* ... */ },
  themes: {  // ❌ Duplication again!
    light: lightTheme,
    dark: darkTheme
  }
});
```

### ✅ New Pattern (DRY - Don't Repeat Yourself)

```typescript
// Define themes ONCE
const lightTheme = { /* ... */ };
const darkTheme = { /* ... */ };

// Create global ThemeManager ONCE
const globalThemeManager = new ThemeManager([lightTheme, darkTheme]);

// Share ThemeManager across StyleSets
const button = createStyleSet({
  variants: { /* ... */ },
  themeManager: globalThemeManager  // ✅ No duplication!
});

const card = createStyleSet({
  variants: { /* ... */ },
  themeManager: globalThemeManager  // ✅ No duplication!
});
```

## Svelte 5 Integration

### Complete Example with Reactive Theme Switching

```svelte
<script lang="ts">
  import { globalThemeManager } from './theme-config';
  import { button } from './components/button';
  import { card } from './components/card';

  // Reactive state for current theme
  let currentThemeId = $state(globalThemeManager.getActiveTheme()?.id || 'light');

  // Theme switching function
  function switchTheme(themeId: string) {
    globalThemeManager.setActiveTheme(themeId);
    currentThemeId = themeId;

    // Apply to document for CSS variables
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', themeId);
    }
  }

  // Get all available themes
  const themes = globalThemeManager.getAllThemes();
</script>

<div>
  <!-- Theme switcher -->
  <select
    value={currentThemeId}
    onchange={(e) => switchTheme(e.currentTarget.value)}
  >
    {#each themes as theme}
      <option value={theme.id}>{theme.name}</option>
    {/each}
  </select>

  <!-- Components automatically use current theme -->
  <button class={button({ intent: 'primary', theme: currentThemeId })}>
    Click Me
  </button>

  <div class={card({ variant: 'secondary', theme: currentThemeId })}>
    Card Content
  </div>
</div>
```

## Advanced: Theme Context Provider

For even cleaner integration, create a theme context:

```typescript
// theme-context.svelte.ts
import { globalThemeManager } from './theme-config';

class ThemeContext {
  #themeId = $state(globalThemeManager.getActiveTheme()?.id || 'light');

  get currentThemeId() {
    return this.#themeId;
  }

  setTheme(themeId: string) {
    globalThemeManager.setActiveTheme(themeId);
    this.#themeId = themeId;

    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', themeId);
    }
  }

  get themes() {
    return globalThemeManager.getAllThemes();
  }
}

export const themeContext = new ThemeContext();
```

```svelte
<script lang="ts">
  import { themeContext } from './theme-context.svelte';
  import { button } from './components/button';

  // Simple reactive usage
  const buttonClass = $derived(
    button({ intent: 'primary', theme: themeContext.currentThemeId })
  );
</script>

<div>
  <select
    value={themeContext.currentThemeId}
    onchange={(e) => themeContext.setTheme(e.currentTarget.value)}
  >
    {#each themeContext.themes as theme}
      <option value={theme.id}>{theme.name}</option>
    {/each}
  </select>

  <button class={buttonClass}>
    Click Me
  </button>
</div>
```

## When to Use Each Approach

### Use Global ThemeManager When:

✅ You have multiple StyleSets that should share themes
✅ You want centralized theme control
✅ You want to avoid theme duplication
✅ You're building a design system or component library
✅ You need runtime theme switching across the entire app

### Use Local Themes When:

✅ You have a single isolated StyleSet
✅ The StyleSet has unique themes not shared elsewhere
✅ You want complete isolation (e.g., for a widget in another app)

## Migration Guide

### Before (with theme duplication):

```typescript
// OLD: themes.ts
export const themeManager = new ThemeManager([light, dark]);

// OLD: button.ts
export const button = createStyleSet({
  variants: { /* ... */ },
  themes: {  // Duplicating theme definitions
    light: light,
    dark: dark
  }
});
```

### After (with global ThemeManager):

```typescript
// NEW: themes.ts
export const globalThemeManager = new ThemeManager([light, dark]);

// NEW: button.ts
export const button = createStyleSet({
  variants: { /* ... */ },
  themeManager: globalThemeManager  // Just pass the instance!
});
```

**Benefits of migration:**
- Remove ~10-20 lines of duplicated theme registration per StyleSet
- Single source of truth for theme management
- Easier to add/remove themes (update once, affects all StyleSets)
- Better performance (shared ThemeManager instance)

## Complete Working Example

```typescript
// ============================================================================
// 1. Theme Configuration (theme-config.ts)
// ============================================================================
import { ThemeManager, type ThemeConfig } from '@sv0/stylesets';

export const lightTheme: ThemeConfig = {
  id: 'light',
  name: 'Light',
  tokens: {
    color: {
      primary: 'blue-600',
      secondary: 'gray-600',
      background: 'white',
      text: 'gray-900',
    }
  }
};

export const darkTheme: ThemeConfig = {
  id: 'dark',
  name: 'Dark',
  tokens: {
    color: {
      primary: 'blue-400',
      secondary: 'gray-400',
      background: 'gray-900',
      text: 'gray-100',
    }
  }
};

export const globalThemeManager = new ThemeManager([lightTheme, darkTheme]);
globalThemeManager.setActiveTheme('light');

// ============================================================================
// 2. Button Component (components/button.ts)
// ============================================================================
import { createStyleSet } from '@sv0/stylesets';
import { globalThemeManager } from '../theme-config';

export const button = createStyleSet({
  base: 'px-4 py-2 rounded font-medium',
  variants: {
    intent: {
      primary: 'bg-{color.primary} text-white hover:opacity-90',
      secondary: 'bg-{color.secondary} text-white hover:opacity-90',
    },
    size: {
      sm: 'text-sm px-3 py-1',
      md: 'text-base px-4 py-2',
      lg: 'text-lg px-6 py-3',
    }
  },
  themeManager: globalThemeManager
});

// ============================================================================
// 3. Card Component (components/card.ts)
// ============================================================================
import { createStyleSet } from '@sv0/stylesets';
import { globalThemeManager } from '../theme-config';

export const card = createStyleSet({
  base: 'p-6 rounded-lg shadow',
  recipes: {
    container: 'bg-{color.background}',
    title: 'text-{color.text} font-bold text-xl mb-4',
    body: 'text-{color.text}',
  },
  themeManager: globalThemeManager
});

// ============================================================================
// 4. Usage in App (App.svelte)
// ============================================================================
// <script lang="ts">
//   import { globalThemeManager } from './theme-config';
//   import { button } from './components/button';
//   import { card } from './components/card';
//
//   let theme = $state('light');
//
//   function toggleTheme() {
//     theme = theme === 'light' ? 'dark' : 'light';
//     globalThemeManager.setActiveTheme(theme);
//   }
// </script>
//
// <div>
//   <button
//     class={button({ intent: 'primary', size: 'md', theme })}
//     onclick={toggleTheme}
//   >
//     Toggle Theme
//   </button>
//
//   <div class={card.container.with(card.select('title', 'body'), { theme })}>
//     <h2>Card Title</h2>
//     <p>Card content adapts to theme automatically!</p>
//   </div>
// </div>
```

## Summary

**Key Takeaway**: Use the `themeManager` option in `createStyleSet` to share a single `ThemeManager` instance across all your StyleSets. This eliminates theme duplication and provides centralized theme management.

**Before**: Each StyleSet needed `themes: { light, dark }` configuration
**After**: Each StyleSet uses `themeManager: globalThemeManager`

**Benefits**:
- 🎯 Single source of truth
- 🔄 Centralized theme switching
- 📉 Less code duplication
- ⚡ Better performance
- 🛠️ Easier maintenance

## Next Steps

- Read [Theming Guide](./theming.md) for theme basics
- Explore [Multi-Layered Themes](./multi-layered-themes.md) for advanced composition
- Check [API Reference](../api/themes.md) for ThemeManager API
