# Theming Guide

Learn how to create, manage, and switch between themes in your application using StyleSets' powerful theming system.

## Table of Contents

- [Introduction](#introduction)
- [Design Tokens](#design-tokens)
- [Creating Themes](#creating-themes)
- [Theme Management](#theme-management)
- [Dynamic Theme Switching](#dynamic-theme-switching)
- [CSS Variables Integration](#css-variables-integration)
- [Best Practices](#best-practices)

## Introduction

StyleSets provides a comprehensive theming system that allows you to:

- Define design tokens with placeholders
- Create multiple themes (light, dark, high-contrast, etc.)
- Switch themes dynamically at runtime
- Compose and merge themes
- Integrate with CSS variables
- Maintain type safety throughout

## Design Tokens

Design tokens are the foundation of your theming system. They represent design decisions as data.

### Basic Token Definition

```typescript
import { createStyleSet } from '@sv0/stylesets';

const button = createStyleSet({
  base: 'px-4 py-2 rounded',
  variants: {
    intent: {
      primary: 'bg-{color.primary} text-{color.onPrimary} hover:bg-{color.primaryHover}',
      secondary: 'bg-{color.secondary} text-{color.onSecondary} hover:bg-{color.secondaryHover}',
    },
  },
  tokens: {
    color: {
      primary: 'blue-600',
      primaryHover: 'blue-700',
      onPrimary: 'white',
      secondary: 'gray-200',
      secondaryHover: 'gray-300',
      onSecondary: 'gray-900',
    },
  },
});
```

### Token Categories

Organize tokens into logical categories:

```typescript
const tokens = {
  // Colors
  color: {
    primary: 'blue-600',
    secondary: 'gray-600',
    accent: 'indigo-600',
    success: 'green-600',
    warning: 'yellow-600',
    error: 'red-600',
    background: 'white',
    surface: 'gray-50',
    text: 'gray-900',
    textMuted: 'gray-600',
  },

  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },

  // Typography
  typography: {
    fontFamily: 'Inter, sans-serif',
    fontFamilyMono: 'Monaco, monospace',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
  },

  // Shadows
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },

  // Borders
  border: {
    default: 'border-gray-200',
    focus: 'border-blue-500',
    error: 'border-red-500',
  },
};
```

### Advanced Token Definitions

Tokens can include metadata:

```typescript
const tokens = {
  color: {
    primary: {
      value: 'blue-600',
      description: 'Primary brand color used for main actions',
      runtime: false, // Pre-resolved at build time
    },
    dynamic: {
      value: 'var(--user-preference)',
      description: 'User-selected color',
      runtime: true, // Resolved at runtime
    },
  },
};
```

## Creating Themes

### Using Default Themes

StyleSets provides two default themes out of the box:

```typescript
import { defaultThemes } from '@sv0/stylesets';

const light = defaultThemes.light();
const dark = defaultThemes.dark();

console.log(light.name); // 'Light'
console.log(dark.name); // 'Dark'
```

### Custom Theme

Create a completely custom theme:

```typescript
import type { ThemeConfig } from '@sv0/stylesets';

const brandTheme: ThemeConfig = {
  id: 'brand',
  name: 'Brand Theme',
  darkMode: false,
  tokens: {
    color: {
      primary: { value: 'indigo-600', description: 'Brand primary' },
      secondary: { value: 'pink-600', description: 'Brand secondary' },
      accent: { value: 'orange-500', description: 'Brand accent' },
      background: 'white',
      surface: 'gray-50',
      text: 'gray-900',
      textMuted: 'gray-600',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
  },
  accessibility: {
    focusRing: {
      default: 'focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
      auto: true,
    },
  },
  cssVariables: {
    '--theme-primary': '#4f46e5',
    '--theme-background': '#ffffff',
    '--theme-text': '#111827',
  },
};
```

### Theme Variants

Create variations of existing themes:

```typescript
import { createThemeVariant, defaultThemes } from '@sv0/stylesets';

const dark = defaultThemes.dark();

// High contrast dark theme
const highContrastDark = createThemeVariant(dark, 'high-contrast', {
  tokens: {
    color: {
      primary: 'yellow-400',
      background: 'black',
      text: 'white',
      surface: 'gray-900',
    },
  },
  cssVariables: {
    '--theme-primary': '#fbbf24',
    '--theme-background': '#000000',
    '--theme-text': '#ffffff',
  },
});
```

### Composing Themes

Merge multiple themes together:

```typescript
import { composeTheme, defaultThemes } from '@sv0/stylesets';

const light = defaultThemes.light();

const customTheme = composeTheme(
  light,
  {
    name: 'Custom Corporate',
    tokens: {
      color: {
        primary: 'indigo-600',
        accent: 'orange-500',
      },
    },
  },
  {
    accessibility: {
      focusRing: {
        default: 'focus:ring-4 focus:ring-indigo-500',
      },
    },
  }
);
```

## Theme Management

### ThemeManager

Use `ThemeManager` to handle multiple themes:

```typescript
import { ThemeManager, defaultThemes } from '@sv0/stylesets';

const themeManager = new ThemeManager([
  defaultThemes.light(),
  defaultThemes.dark(),
  brandTheme,
]);

// Set active theme
themeManager.setActiveTheme('dark');

// Get current theme
const current = themeManager.getActiveTheme();
console.log(current?.name); // 'Dark'

// Get all themes
const allThemes = themeManager.getAllThemes();
console.log(allThemes.map(t => t.name)); // ['Light', 'Dark', 'Brand Theme']
```

### Theme-Aware StyleSets

Integrate themes directly in your StyleSet:

```typescript
const button = createStyleSet({
  base: 'px-4 py-2 rounded',
  variants: {
    intent: {
      primary: 'bg-{color.primary} text-{color.onPrimary}',
    },
  },
  tokens: {
    color: {
      primary: 'blue-600',
      onPrimary: 'white',
    },
  },
  themes: {
    dark: {
      tokens: {
        color: {
          primary: 'blue-400',
          onPrimary: 'gray-900',
        },
      },
    },
    brand: {
      tokens: {
        color: {
          primary: 'indigo-600',
          onPrimary: 'white',
        },
      },
    },
  },
});

// Use with theme
const className = button({ intent: 'primary', theme: 'dark' });
```

## Dynamic Theme Switching

### In Svelte Components

```svelte
<script lang="ts">
  import { ThemeManager, defaultThemes } from '@sv0/stylesets';
  import { button } from './styles';

  const themeManager = new ThemeManager([
    defaultThemes.light(),
    defaultThemes.dark(),
  ]);

  let currentTheme = $state('light');

  function switchTheme(themeId: string) {
    themeManager.setActiveTheme(themeId);
    currentTheme = themeId;

    // Apply to document
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', themeId);
    }
  }
</script>

<div>
  <select bind:value={currentTheme} onchange={() => switchTheme(currentTheme)}>
    <option value="light">Light</option>
    <option value="dark">Dark</option>
  </select>

  <button class={button({ intent: 'primary', theme: currentTheme })}>
    Click Me
  </button>
</div>
```

### System Preference Detection

Detect and respect user's system preference:

```typescript
function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

// Listen for changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      const newTheme = e.matches ? 'dark' : 'light';
      themeManager.setActiveTheme(newTheme);
    });
}
```

### Persistent Theme Selection

Store user's theme preference:

```typescript
function saveTheme(themeId: string) {
  localStorage.setItem('theme', themeId);
}

function loadTheme(): string {
  return localStorage.getItem('theme') || getSystemTheme();
}

// On app initialization
const savedTheme = loadTheme();
themeManager.setActiveTheme(savedTheme);
```

## CSS Variables Integration

### Automatic CSS Variables

Themes can set CSS variables automatically:

```typescript
const theme: ThemeConfig = {
  id: 'brand',
  name: 'Brand',
  cssVariables: {
    '--color-primary': '#4f46e5',
    '--color-secondary': '#ec4899',
    '--spacing-unit': '0.25rem',
    '--font-family': 'Inter, sans-serif',
  },
};
```

When this theme is active, these CSS variables are set on `document.documentElement`.

### Using CSS Variables in Tokens

Reference CSS variables in your tokens:

```typescript
const button = createStyleSet({
  tokens: {
    color: {
      primary: 'var(--color-primary, blue-600)', // Fallback to blue-600
    },
  },
  variants: {
    intent: {
      primary: 'bg-{color.primary}',
    },
  },
});
```

### Custom Properties Pattern

Create a comprehensive design system:

```css
/* theme.css */
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-secondary: #6b7280;
  --color-accent: #f59e0b;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;

  /* Typography */
  --font-family-base: system-ui, sans-serif;
  --font-size-base: 1rem;
}

[data-theme="dark"] {
  --color-primary: #60a5fa;
  --color-secondary: #9ca3af;
  --color-accent: #fbbf24;
}
```

```typescript
const tokens = {
  color: {
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
    accent: 'var(--color-accent)',
  },
  spacing: {
    xs: 'var(--spacing-xs)',
    sm: 'var(--spacing-sm)',
    md: 'var(--spacing-md)',
  },
};
```

## Best Practices

### 1. Semantic Token Names

Use semantic names that describe purpose, not appearance:

```typescript
// ❌ Bad
tokens: {
  color: {
    blue600: 'blue-600',
    gray200: 'gray-200',
  }
}

// ✅ Good
tokens: {
  color: {
    primary: 'blue-600',
    surface: 'gray-200',
  }
}
```

### 2. Token Hierarchy

Organize tokens in a clear hierarchy:

```typescript
tokens: {
  color: {
    // Base colors
    primary: 'blue-600',
    secondary: 'gray-600',

    // Interactive states
    primaryHover: 'blue-700',
    primaryActive: 'blue-800',

    // Semantic colors
    success: 'green-600',
    warning: 'yellow-600',
    error: 'red-600',

    // Surface colors
    background: 'white',
    surface: 'gray-50',
    surfaceElevated: 'white',

    // Text colors
    text: 'gray-900',
    textMuted: 'gray-600',
    textOnPrimary: 'white',
  }
}
```

### 3. Contrast Ratios

Ensure sufficient contrast for accessibility:

```typescript
import { ThemeConfig } from '@sv0/stylesets';

// Use a contrast checker to validate
const validateContrast = (fg: string, bg: string): boolean => {
  // Implementation using color contrast library
  return true;
};

const theme: ThemeConfig = {
  id: 'brand',
  name: 'Brand',
  tokens: {
    color: {
      primary: 'blue-600', // 4.5:1 contrast with white
      text: 'gray-900', // 16:1 contrast with white
    },
  },
};
```

### 4. Theme Variants Over Separate Themes

Use theme variants for related themes:

```typescript
const baseTheme = defaultThemes.light();

const compactVariant = createThemeVariant(baseTheme, 'compact', {
  tokens: {
    spacing: {
      xs: '0.125rem',
      sm: '0.25rem',
      md: '0.5rem',
    },
  },
});
```

### 5. Test All Theme Combinations

Ensure your components work with all themes:

```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Button from './Button.svelte';

describe('Button with themes', () => {
  const themes = ['light', 'dark', 'brand'];

  themes.forEach(theme => {
    it(`should render correctly with ${theme} theme`, () => {
      const { container } = render(Button, { theme });
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
```

### 6. Document Your Tokens

Add descriptions to tokens for better maintainability:

```typescript
tokens: {
  color: {
    primary: {
      value: 'blue-600',
      description: 'Primary brand color used for main actions and emphasis',
    },
    secondary: {
      value: 'gray-600',
      description: 'Secondary color for less prominent actions',
    },
  }
}
```

## Advanced Patterns

### Context-Based Theming

Different themes for different sections:

```svelte
<script lang="ts">
  let marketingTheme = 'brand';
  let dashboardTheme = 'light';
</script>

<header class={navbar({ theme: marketingTheme })}>
  <!-- Marketing content -->
</header>

<main class={container({ theme: dashboardTheme })}>
  <!-- Dashboard content -->
</main>
```

### User-Customizable Themes

Allow users to customize their theme:

```typescript
function createUserTheme(preferences: UserPreferences): ThemeConfig {
  return {
    id: 'user-custom',
    name: 'Custom',
    tokens: {
      color: {
        primary: preferences.primaryColor,
        accent: preferences.accentColor,
      },
      spacing: {
        md: `${preferences.density}rem`,
      },
    },
  };
}
```

## Advanced Topics

For more sophisticated theme architectures, see:

- **[Multi-Layered Theme Composition](./multi-layered-themes.md)** - Complete guide to composing complex theme hierarchies with multiple inheritance layers (Foundation → Brand → Product → Environment → User)
- **[Theme Architecture Diagrams](./multi-layered-themes-diagram.md)** - Visual diagrams showing how theme layers compose and inherit

## Next Steps

- Explore [Accessibility Guide](./accessibility.md) for accessible theming
- Read [API Reference](../api/README.md) for complete theming API
- Check [Examples](../examples/README.md) for theme implementations
- Master [Multi-Layered Themes](./multi-layered-themes.md) for enterprise-scale theme systems
