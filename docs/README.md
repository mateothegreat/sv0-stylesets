# StyleSets Documentation

**Schema-driven CSS variant management for the modern TypeScript developer**

StyleSets is a powerful, type-safe styling library that combines the best aspects of CSS-in-JS with the flexibility of utility-first CSS frameworks like Tailwind. It provides two powerful tools: `createEnhancedStyleSet` for component-level variants and recipes for composing static style sets.

## Table of Contents

- [Getting Started](#getting-started)
- [Core Concepts](#core-concepts)
- [Quick Examples](#quick-examples)
- [Documentation](#documentation)
- [Features](#features)

## Getting Started

### Installation

```bash
npm install @sv0/stylesets clsx tailwind-merge
```

### Prerequisites

- TypeScript 5.9.2 or higher
- Tailwind CSS 4.1.12 or higher (recommended but not required)

### Your First StyleSet

```typescript
import { createStyleSet, type VariantProps } from '@sv0/stylesets';

const button = createStyleSet({
  base: 'inline-flex items-center justify-center rounded-md font-medium',
  variants: {
    intent: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    },
    size: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4',
      lg: 'h-12 px-6 text-lg',
    },
  },
  defaultVariants: {
    intent: 'primary',
    size: 'md',
  },
});

// ✨ Automatically extract variant types
interface ButtonProps extends VariantProps<typeof button> {
  disabled?: boolean;
}

// Usage
const className = button({ intent: 'secondary', size: 'lg' });
```

## Core Concepts

### 1. Variants

Variants are different visual states of a component. They're type-safe and provide full autocompletion:

```typescript
const alert = createStyleSet({
  base: 'p-4 rounded border',
  variants: {
    status: {
      info: 'bg-blue-50 border-blue-200 text-blue-900',
      success: 'bg-green-50 border-green-200 text-green-900',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
      error: 'bg-red-50 border-red-200 text-red-900',
    },
  },
});
```

### 2. Compound Variants

Apply styles when multiple variants are active:

```typescript
const button = createStyleSet({
  base: 'rounded',
  variants: {
    intent: {
      primary: 'bg-blue-600',
      secondary: 'bg-gray-600',
    },
    size: {
      sm: 'text-sm',
      lg: 'text-lg',
    },
  },
  compoundVariants: [
    {
      intent: 'primary',
      size: 'lg',
      class: 'shadow-lg transform hover:scale-105',
    },
  ],
});
```

### 3. Design Tokens

Use placeholders that resolve to actual values:

```typescript
const button = createEnhancedStyleSet({
  base: 'rounded-md',
  variants: {
    intent: {
      primary: 'bg-{color.primary} hover:bg-{color.primaryHover}',
    },
  },
  tokens: {
    color: {
      primary: 'blue-600',
      primaryHover: 'blue-700',
    },
  },
});
```

### 4. Recipes

Static, reusable class sets:

```typescript
const layout = createStyleSet({
  recipes: {
    container: 'max-w-7xl mx-auto px-4',
    card: 'bg-white rounded-lg shadow p-6',
    title: 'text-2xl font-bold',
  },
});

// Access recipes as properties
const containerClass = layout.container.toString();

// Extend recipes with additional classes
const cardWithBorder = layout.card.with('border border-gray-200');

// Compose multiple recipes
const header = layout.select('container', 'title', 'mb-4');
```

### 5. Themes

Create and switch between themes dynamically:

```typescript
const button = createEnhancedStyleSet({
  base: 'rounded',
  variants: {
    intent: {
      primary: 'bg-{color.primary}',
    },
  },
  tokens: {
    color: {
      primary: 'blue-600',
    },
  },
  themes: {
    dark: {
      tokens: {
        color: {
          primary: 'blue-400',
        },
      },
    },
  },
});

// Use with theme
const darkButton = button({ intent: 'primary', theme: 'dark' });
```

### 6. Accessibility

Built-in accessibility enhancements:

```typescript
const button = createEnhancedStyleSet({
  base: 'rounded',
  variants: {
    intent: { primary: 'bg-blue-600' },
  },
  accessibility: {
    focusRing: {
      default: 'focus:ring-2 focus:ring-blue-500',
      auto: true, // Automatically apply to interactive elements
    },
    reducedMotion: {
      replace: {
        'transition-all': 'transition-none',
      },
      auto: true, // Respect user's motion preferences
    },
  },
});
```

## Quick Examples

### Button Component

```typescript
const button = createStyleSet({
  base: 'inline-flex items-center justify-center font-medium transition-colors disabled:opacity-50',
  variants: {
    intent: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
      ghost: 'text-gray-700 hover:bg-gray-100',
      danger: 'bg-red-600 text-white hover:bg-red-700',
    },
    size: {
      sm: 'h-8 px-3 text-sm rounded',
      md: 'h-10 px-4 text-base rounded-md',
      lg: 'h-12 px-6 text-lg rounded-lg',
    },
    fullWidth: {
      true: 'w-full',
    },
  },
  compoundVariants: [
    {
      intent: 'ghost',
      size: 'sm',
      class: 'hover:text-gray-900',
    },
  ],
  defaultVariants: {
    intent: 'primary',
    size: 'md',
  },
});
```

### Badge Component

```typescript
const badge = createStyleSet({
  base: 'inline-flex items-center font-medium rounded-full',
  variants: {
    variant: {
      solid: '',
      outline: 'border-2 bg-transparent',
      subtle: '',
    },
    color: {
      gray: '',
      blue: '',
      green: '',
      red: '',
    },
    size: {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-sm',
      lg: 'px-3 py-1 text-base',
    },
  },
  compoundVariants: [
    // Gray variants
    { variant: 'solid', color: 'gray', class: 'bg-gray-600 text-white' },
    { variant: 'outline', color: 'gray', class: 'border-gray-600 text-gray-700' },
    { variant: 'subtle', color: 'gray', class: 'bg-gray-100 text-gray-700' },
    // Blue variants
    { variant: 'solid', color: 'blue', class: 'bg-blue-600 text-white' },
    { variant: 'outline', color: 'blue', class: 'border-blue-600 text-blue-700' },
    { variant: 'subtle', color: 'blue', class: 'bg-blue-100 text-blue-700' },
    // Green variants
    { variant: 'solid', color: 'green', class: 'bg-green-600 text-white' },
    { variant: 'outline', color: 'green', class: 'border-green-600 text-green-700' },
    { variant: 'subtle', color: 'green', class: 'bg-green-100 text-green-700' },
    // Red variants
    { variant: 'solid', color: 'red', class: 'bg-red-600 text-white' },
    { variant: 'outline', color: 'red', class: 'border-red-600 text-red-700' },
    { variant: 'subtle', color: 'red', class: 'bg-red-100 text-red-700' },
  ],
  defaultVariants: {
    variant: 'solid',
    color: 'gray',
    size: 'md',
  },
});
```

## Documentation

Explore comprehensive guides and examples:

- **[API Reference](./api/README.md)** - Complete API documentation
- **[Type Inference Guide](./guides/type-inference.md)** - Automatic type extraction
- **[Examples & Use Cases](./examples/README.md)** - Real-world component examples
- **[Theming Guide](./guides/theming.md)** - Creating and managing themes
- **[Multi-Layered Themes Guide](./guides/multi-layered-themes.md)** - Advanced theme composition and inheritance
- **[Theme Architecture Diagrams](./guides/multi-layered-themes-diagram.md)** - Visual guide to theme layering
- **[Global ThemeManager Pattern](./guides/global-theme-manager.md)** - Sharing themes across StyleSets
- **[SvelteKit SSR Guide](./guides/ssr-sveltekit.md)** - Using StyleSets with Server-Side Rendering
- **[Accessibility Guide](./guides/accessibility.md)** - Building accessible components
- **[Migration Guide](./guides/migration.md)** - Migrating from other libraries

### Interactive Demos

- **[Accordion Demo](./demos/accordion.md)** - Progressive disclosure with accordion
- **[Tabs Demo](./demos/tabs.md)** - Tabbed interface with dynamic content
- **[Expandable Cards Demo](./demos/expandable-cards.md)** - Card grid with expansion

## Features

### ✅ Bulletproof Type Safety

- **Automatic type inference** - Extract variant types without manual maintenance
- Compile-time validation prevents invalid prop combinations
- Schema-driven types that adapt as your design system evolves
- Strict mode support that catches excess properties
- IntelliSense heaven with auto-completion for all variants

### ✅ Design Token System

- Define tokens with placeholders like `{color.primary}`
- Runtime token resolution for dynamic theming
- Theme-specific token overrides
- Global token registry for consistency

### ✅ Theme Management

- Create multiple themes (light, dark, high-contrast, etc.)
- Switch themes dynamically at runtime
- Compose and merge themes
- CSS variable integration

### ✅ Accessibility First

- Automatic focus ring application
- Reduced motion support (respects user preferences)
- High contrast mode
- Screen reader utilities

### ✅ Developer Experience

- Single source of truth with `createStyleSet`
- Intuitive API for both variants and recipes
- Automatic class conflict resolution with `tailwind-merge`
- Conditional class composition with `clsx`
- Full TypeScript autocompletion

### ✅ Svelte 5 Integration

- Native reactivity support
- `$props()` compatibility with full type inference
- Runes-based reactive styling

### ✅ Framework Agnostic

- Works with any TypeScript project
- Optimized for Svelte but not limited to it
- Use with React, Vue, Angular, or vanilla JS

## Why StyleSets?

**Problem:** Managing component styles with variants is cumbersome and error-prone. You need type safety, dynamic theming, accessibility, and a great developer experience.

**Solution:** StyleSets provides a schema-driven approach that gives you:

1. **Type Safety** - Never pass invalid variant combinations
2. **Theming** - Dynamic themes with token resolution
3. **Accessibility** - Built-in a11y enhancements
4. **DX** - Intuitive API with full autocompletion
5. **Performance** - Automatic class deduplication and optimization

## Next Steps

1. Check out the **[API Reference](./api/README.md)** for detailed documentation
2. Explore **[Examples](./examples/README.md)** for real-world use cases
3. Try the **[Interactive Demos](./demos/)** to see StyleSets in action
4. Read the **[Theming Guide](./guides/theming.md)** to master themes
5. Learn **[Multi-Layered Theme Composition](./guides/multi-layered-themes.md)** for advanced theme architectures
6. Follow the **[Accessibility Guide](./guides/accessibility.md)** for inclusive design

## License

MIT

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.
