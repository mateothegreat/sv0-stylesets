# SvelteKit SSR Guide

This guide covers the implications and best practices for using StyleSets with SvelteKit's Server-Side Rendering (SSR).

## Table of Contents

- [Understanding the Issues](#understanding-the-issues)
- [Critical Problems](#critical-problems)
- [Solutions](#solutions)
- [Complete Working Example](#complete-working-example)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Understanding the Issues

SvelteKit renders pages on the server first, then hydrates them on the client. This creates several challenges for theme management:

### 1. **Global State Pollution**

```typescript
// ❌ PROBLEM: Global ThemeManager shared across all requests
export const themeManager = new ThemeManager([light, dark]);
themeManager.setActiveTheme('dark'); // ⚠️ This affects ALL users!

// User A requests page → Gets 'dark' theme
// User B requests page → Also gets 'dark' theme (wrong!)
```

**Why it's a problem**: In SSR, server code is shared across ALL users. Setting a theme globally means User A's preference affects User B's rendering.

### 2. **Document/Window Access**

```typescript
// ❌ PROBLEM: These APIs don't exist on the server
document.documentElement.setAttribute('data-theme', themeId);
window.matchMedia('(prefers-color-scheme: dark)');
localStorage.getItem('theme');

// Server Error: ReferenceError: document is not defined
```

**Current code has checks** but they mean CSS variables won't be set during SSR:

```typescript
// From themes.ts line 121-123
if (typeof document !== "undefined") {
  this.applyThemeToDocument(theme);
}
```

### 3. **Hydration Mismatches**

```typescript
// Server renders:   <div class="bg-blue-600">
// Client hydrates:  <div class="bg-yellow-400">
// Result: Svelte warning + visual flash
```

### 4. **Flash of Unstyled Content (FOUC)**

Without proper SSR handling:
1. Server renders with default theme
2. Page loads with default styles
3. Client JS loads and switches theme
4. **User sees a jarring flash**

## Critical Problems

### Problem 1: Global ThemeManager in SSR Context

```typescript
// ❌ BAD: Don't use global ThemeManager in SSR
// File: src/lib/theme-config.ts
export const globalThemeManager = new ThemeManager([light, dark]);

// File: +page.server.ts
import { globalThemeManager } from '$lib/theme-config';

export async function load() {
  // ⚠️ DANGER: This is shared across all requests!
  globalThemeManager.setActiveTheme('dark');

  return {
    theme: globalThemeManager.getActiveTheme()
  };
}
```

**What happens:**
- Request 1 (User A wants light) → Sets 'light' globally
- Request 2 (User B wants dark) → Sets 'dark' globally
- Request 3 (User A refreshes) → Gets 'dark' (wrong!)

### Problem 2: CSS Variables Not Applied on Server

```typescript
// From themes.ts:199-224
private applyThemeToDocument(theme: ThemeConfig): void {
  const root = document.documentElement; // ❌ Doesn't exist on server

  if (theme.cssVariables) {
    Object.entries(theme.cssVariables).forEach(([property, value]) => {
      root.style.setProperty(property, value); // ❌ Not in SSR HTML
    });
  }
}
```

**Impact:** Server-rendered HTML lacks CSS variables, causing FOUC.

### Problem 3: Token Resolution Works, But Variables Don't

The good news: Token interpolation works fine in SSR because it's pure string manipulation:

```typescript
// ✅ WORKS in SSR:
const button = createStyleSet({
  variants: {
    intent: {
      primary: "bg-{color.primary}" // → "bg-blue-600"
    }
  },
  tokens: {
    color: { primary: "blue-600" }
  }
});

// Server HTML: <button class="bg-blue-600">
```

But CSS variables won't work:

```typescript
// ❌ CSS VARIABLES DON'T WORK in SSR:
const theme = {
  cssVariables: {
    '--primary': '#3b82f6'
  }
};

// Server HTML: <html style=""> ← Empty, no CSS vars!
```

## Solutions

### Solution 1: Request-Scoped Theme Management

Create a new ThemeManager for **each request**:

```typescript
// ❌ BAD: Global instance
export const themeManager = new ThemeManager([light, dark]);

// ✅ GOOD: Factory function
export function createThemeManager() {
  return new ThemeManager([light, dark]);
}
```

**Usage in SvelteKit:**

```typescript
// +page.server.ts
import { createThemeManager } from '$lib/theme-config';

export async function load({ cookies }) {
  // ✅ New instance per request
  const themeManager = createThemeManager();

  // Get user's theme preference
  const userTheme = cookies.get('theme') || 'light';
  themeManager.setActiveTheme(userTheme);

  return {
    theme: themeManager.getActiveTheme()
  };
}
```

### Solution 2: Inline Critical CSS Variables

Inject CSS variables in the server-rendered HTML:

```svelte
<!-- +layout.svelte -->
<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  // Build CSS variable string for SSR
  const cssVars = $derived(() => {
    if (!data.theme?.cssVariables) return '';

    return Object.entries(data.theme.cssVariables)
      .map(([key, value]) => `${key}:${value}`)
      .join(';');
  });
</script>

<svelte:head>
  {#if cssVars()}
    <style>
      :root {
        {cssVars()}
      }
    </style>
  {/if}
</svelte:head>

<slot />
```

### Solution 3: Prevent Hydration Mismatches

Ensure server and client render with the same theme:

```svelte
<!-- +page.svelte -->
<script lang="ts">
  import { browser } from '$app/environment';
  import { themeStore } from '$lib/stores/theme.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  // Initialize theme from server data
  $effect(() => {
    if (browser && data.theme) {
      // Only apply on client after hydration
      themeStore.setTheme(data.theme.id);
    }
  });
</script>
```

### Solution 4: Use Cookies for Theme Persistence

```typescript
// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Read theme from cookie
  const theme = event.cookies.get('theme') || 'light';

  // Make theme available to all load functions
  event.locals.theme = theme;

  return resolve(event, {
    transformPageChunk: ({ html }) => {
      // Inject theme into HTML before sending
      return html.replace('%theme%', theme);
    }
  });
};
```

```html
<!-- app.html -->
<!DOCTYPE html>
<html lang="en" data-theme="%theme%">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    %sveltekit.head%
  </head>
  <body>
    <div>%sveltekit.body%</div>
  </body>
</html>
```

## Complete Working Example

### 1. Theme Configuration

```typescript
// src/lib/theme-config.ts
import { ThemeManager, type ThemeConfig } from '@sv0/stylesets';

export const lightTheme: ThemeConfig = {
  id: 'light',
  name: 'Light',
  tokens: {
    color: {
      primary: 'blue-600',
      background: 'white',
      text: 'gray-900'
    }
  },
  cssVariables: {
    '--color-primary': '#2563eb',
    '--color-bg': '#ffffff',
    '--color-text': '#111827'
  }
};

export const darkTheme: ThemeConfig = {
  id: 'dark',
  name: 'Dark',
  tokens: {
    color: {
      primary: 'blue-400',
      background: 'gray-900',
      text: 'gray-100'
    }
  },
  cssVariables: {
    '--color-primary': '#60a5fa',
    '--color-bg': '#111827',
    '--color-text': '#f9fafb'
  }
};

// ✅ Factory function instead of global instance
export function createThemeManager() {
  return new ThemeManager([lightTheme, darkTheme]);
}

// Export themes for reference
export const themes = {
  light: lightTheme,
  dark: darkTheme
};
```

### 2. Server Load Function

```typescript
// src/routes/+layout.server.ts
import { createThemeManager } from '$lib/theme-config';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
  // ✅ Create request-scoped ThemeManager
  const themeManager = createThemeManager();

  // Get user's theme preference from cookie
  const userThemeId = cookies.get('theme') || 'light';
  themeManager.setActiveTheme(userThemeId);

  const currentTheme = themeManager.getActiveTheme();

  return {
    theme: currentTheme,
    themeId: userThemeId
  };
};
```

### 3. Theme Store (Client-Side)

```typescript
// src/lib/stores/theme.svelte.ts
import { createThemeManager, themes } from '$lib/theme-config';
import { browser } from '$app/environment';

class ThemeStore {
  #manager = createThemeManager();
  #currentThemeId = $state('light');

  constructor() {
    // Initialize from localStorage on client
    if (browser) {
      const saved = localStorage.getItem('theme');
      if (saved && (saved === 'light' || saved === 'dark')) {
        this.#currentThemeId = saved;
        this.#manager.setActiveTheme(saved);
      }
    }
  }

  get currentThemeId() {
    return this.#currentThemeId;
  }

  get currentTheme() {
    return this.#manager.getActiveTheme();
  }

  setTheme(themeId: string) {
    this.#manager.setActiveTheme(themeId);
    this.#currentThemeId = themeId;

    if (browser) {
      // Save to localStorage
      localStorage.setItem('theme', themeId);

      // Update cookie for SSR
      document.cookie = `theme=${themeId}; path=/; max-age=31536000`;

      // Apply to document
      document.documentElement.setAttribute('data-theme', themeId);

      // Apply CSS variables
      const theme = themes[themeId as keyof typeof themes];
      if (theme.cssVariables) {
        Object.entries(theme.cssVariables).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value);
        });
      }
    }
  }

  get manager() {
    return this.#manager;
  }
}

export const themeStore = new ThemeStore();
```

### 4. Layout Component

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { browser } from '$app/environment';
  import { themeStore } from '$lib/stores/theme.svelte';
  import type { LayoutData } from './$types';

  let { data, children }: { data: LayoutData; children: any } = $props();

  // Initialize theme from server data on mount
  $effect(() => {
    if (browser && data.theme) {
      // Set theme on client to match server
      themeStore.setTheme(data.themeId);
    }
  });

  // Generate CSS variables string for SSR
  const cssVarsStyle = $derived(() => {
    if (!data.theme?.cssVariables) return '';

    return Object.entries(data.theme.cssVariables)
      .map(([key, value]) => `${key}:${value}`)
      .join(';');
  });
</script>

<svelte:head>
  <!-- Inject CSS variables for SSR -->
  {#if cssVarsStyle()}
    <style>
      :root {{ cssVarsStyle() }}
    </style>
  {/if}
</svelte:head>

<!-- Set data-theme attribute for SSR -->
<div data-theme={data.themeId}>
  {@render children()}
</div>
```

### 5. Theme Toggle Component

```svelte
<!-- src/lib/components/ThemeToggle.svelte -->
<script lang="ts">
  import { themeStore } from '$lib/stores/theme.svelte';

  function toggleTheme() {
    const newTheme = themeStore.currentThemeId === 'light' ? 'dark' : 'light';
    themeStore.setTheme(newTheme);
  }
</script>

<button onclick={toggleTheme}>
  {themeStore.currentThemeId === 'light' ? '🌙' : '☀️'}
  Switch to {themeStore.currentThemeId === 'light' ? 'Dark' : 'Light'} Mode
</button>
```

### 6. Using StyleSets with SSR

```typescript
// src/lib/components/Button.ts
import { createStyleSet } from '@sv0/stylesets';
import { themeStore } from '$lib/stores/theme.svelte';

export const button = createStyleSet({
  base: 'px-4 py-2 rounded font-medium transition-colors',
  variants: {
    intent: {
      primary: 'bg-{color.primary} text-white hover:opacity-90',
      secondary: 'bg-gray-200 text-{color.text} hover:bg-gray-300'
    }
  },
  // ✅ Use client-side theme manager
  themeManager: themeStore.manager
});
```

```svelte
<!-- src/lib/components/Button.svelte -->
<script lang="ts">
  import { button } from './Button';
  import { themeStore } from '$lib/stores/theme.svelte';

  let {
    intent = 'primary',
    children,
    ...props
  }: {
    intent?: 'primary' | 'secondary';
    children: any;
    [key: string]: any;
  } = $props();

  // Generate class with current theme
  const buttonClass = $derived(
    button({
      intent,
      theme: themeStore.currentThemeId
    })
  );
</script>

<button class={buttonClass} {...props}>
  {@render children()}
</button>
```

### 7. Server Hooks for Theme Injection

```typescript
// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Get theme from cookie or default to light
  const theme = event.cookies.get('theme') || 'light';

  // Make theme available to locals
  event.locals.theme = theme;

  // Inject theme into HTML
  return resolve(event, {
    transformPageChunk: ({ html }) => {
      return html.replace(
        '<html',
        `<html data-theme="${theme}"`
      );
    }
  });
};
```

## Best Practices

### 1. Always Use Request-Scoped Managers

```typescript
// ❌ DON'T: Global instance
export const themeManager = new ThemeManager([light, dark]);

// ✅ DO: Factory function
export function createThemeManager() {
  return new ThemeManager([light, dark]);
}
```

### 2. Synchronize Server and Client

```svelte
<script lang="ts">
  import { browser } from '$app/environment';

  // ✅ Initialize from server data
  let { data } = $props();

  $effect(() => {
    if (browser) {
      // Apply server theme on client
      applyTheme(data.theme);
    }
  });
</script>
```

### 3. Inject Critical CSS Early

```svelte
<svelte:head>
  <!-- ✅ Inline CSS variables to prevent FOUC -->
  <style>
    :root {
      --color-primary: {data.theme.cssVariables['--color-primary']};
      --color-bg: {data.theme.cssVariables['--color-bg']};
    }
  </style>
</svelte:head>
```

### 4. Use Cookies for Persistence

```typescript
// ✅ Server can read cookies for SSR
export const load = async ({ cookies }) => {
  const theme = cookies.get('theme') || 'light';
  return { theme };
};

// ✅ Client updates cookie
function setTheme(themeId: string) {
  document.cookie = `theme=${themeId}; path=/; max-age=31536000`;
}
```

### 5. Handle Browser-Only APIs Safely

```typescript
// ✅ Always check for browser
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)');
}

if (typeof document !== 'undefined') {
  document.documentElement.style.setProperty('--primary', '#3b82f6');
}

// ✅ Or use SvelteKit's browser helper
import { browser } from '$app/environment';

if (browser) {
  localStorage.setItem('theme', 'dark');
}
```

### 6. Prevent Hydration Mismatches

```svelte
<script lang="ts">
  import { browser } from '$app/environment';

  // ✅ Don't change theme during SSR
  let theme = $state('light');

  $effect(() => {
    if (browser) {
      // Only run on client
      theme = detectSystemTheme();
    }
  });
</script>

<!-- ✅ Use server data for initial render -->
<div data-theme={browser ? theme : data.serverTheme}>
```

## Troubleshooting

### Issue: "document is not defined"

**Cause:** Accessing `document` during SSR

**Solution:**
```typescript
// ❌ Wrong
const theme = document.querySelector('[data-theme]');

// ✅ Correct
if (typeof document !== 'undefined') {
  const theme = document.querySelector('[data-theme]');
}

// ✅ Or use SvelteKit helper
import { browser } from '$app/environment';

if (browser) {
  const theme = document.querySelector('[data-theme]');
}
```

### Issue: Flash of Unstyled Content (FOUC)

**Cause:** Theme applied after page renders

**Solution:**
1. Inject CSS variables in `<svelte:head>`
2. Set `data-theme` in `hooks.server.ts`
3. Use cookies to persist theme across requests

```typescript
// hooks.server.ts
export const handle: Handle = async ({ event, resolve }) => {
  const theme = event.cookies.get('theme') || 'light';

  return resolve(event, {
    transformPageChunk: ({ html }) => {
      // Inject theme BEFORE first paint
      return html.replace('<html', `<html data-theme="${theme}"`);
    }
  });
};
```

### Issue: Theme Changes Affect Other Users

**Cause:** Using global ThemeManager in SSR

**Solution:** Use request-scoped managers

```typescript
// ❌ Wrong: Global instance
export const themeManager = new ThemeManager([light, dark]);

export const load = async () => {
  themeManager.setActiveTheme('dark'); // ⚠️ Affects all users!
};

// ✅ Correct: Request-scoped instance
export const load = async () => {
  const themeManager = createThemeManager(); // ✅ Unique per request
  themeManager.setActiveTheme('dark');
};
```

### Issue: Hydration Mismatch Warning

**Cause:** Server renders with one theme, client hydrates with another

**Solution:** Ensure consistency

```svelte
<script lang="ts">
  // ✅ Initialize from server data
  let { data } = $props();

  $effect(() => {
    // Only update theme AFTER hydration
    if (browser && mounted) {
      updateTheme();
    }
  });
</script>
```

### Issue: CSS Variables Not Working

**Cause:** CSS variables not injected during SSR

**Solution:** Inline critical CSS

```svelte
<svelte:head>
  <style>
    :root {
      {#each Object.entries(data.theme.cssVariables) as [key, value]}
        {key}: {value};
      {/each}
    }
  </style>
</svelte:head>
```

## Performance Considerations

### 1. Minimize Theme Data in Server Response

```typescript
// ❌ Don't send entire theme config
return {
  theme: fullThemeConfig // Large payload
};

// ✅ Send only what's needed
return {
  themeId: 'dark',
  cssVariables: theme.cssVariables // Only CSS vars
};
```

### 2. Cache Theme Managers

```typescript
// ✅ Cache theme managers per request
const cache = new Map<string, ThemeManager>();

export const load = async ({ cookies }) => {
  const themeId = cookies.get('theme') || 'light';

  if (!cache.has(themeId)) {
    const manager = createThemeManager();
    manager.setActiveTheme(themeId);
    cache.set(themeId, manager);
  }

  return { theme: cache.get(themeId)!.getActiveTheme() };
};
```

### 3. Use Streaming for Theme Application

```typescript
// src/routes/+page.server.ts
export const load = async () => {
  return {
    streamed: {
      theme: getTheme() // Streamed after initial HTML
    }
  };
};
```

## Summary

### Key Takeaways

✅ **Use factory functions** instead of global ThemeManager instances
✅ **Inject CSS variables** in SSR HTML to prevent FOUC
✅ **Synchronize server/client** state to avoid hydration mismatches
✅ **Use cookies** for theme persistence across requests
✅ **Check for `browser`** before accessing DOM APIs
✅ **Create request-scoped** ThemeManagers in load functions

### SSR-Safe Pattern

```typescript
// 1. Factory function for ThemeManager
export function createThemeManager() { ... }

// 2. Request-scoped in server
export const load = async ({ cookies }) => {
  const manager = createThemeManager();
  return { theme: manager.getActiveTheme() };
};

// 3. Client-side store
export const themeStore = new ThemeStore();

// 4. Synchronize in layout
$effect(() => {
  if (browser) {
    themeStore.setTheme(data.themeId);
  }
});
```

With these patterns, StyleSets works seamlessly with SvelteKit SSR! 🎉
