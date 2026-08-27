# Migration Guide

Migrate from other styling libraries to StyleSets with confidence.

## Table of Contents

- [From CVA (Class Variance Authority)](#from-cva)
- [From tailwind-variants](#from-tailwind-variants)
- [From styled-components](#from-styled-components)
- [From classnames/clsx](#from-classnamesclsx)
- [From CSS Modules](#from-css-modules)
- [Migration Checklist](#migration-checklist)

## From CVA

StyleSets was inspired by CVA and provides a superset of its functionality with additional features.

### Basic Variants

**Before (CVA):**
```typescript
import { cva } from 'class-variance-authority';

const button = cva('button', {
  variants: {
    intent: {
      primary: 'bg-blue-600 text-white',
      secondary: 'bg-gray-200 text-gray-900',
    },
    size: {
      small: 'text-sm',
      medium: 'text-base',
    },
  },
  defaultVariants: {
    intent: 'primary',
    size: 'medium',
  },
});
```

**After (StyleSets):**
```typescript
import { createStyleSet } from '@sv0/stylesets';

const button = createStyleSet({
  base: 'button', // Changed from first argument to base property
  variants: {
    intent: {
      primary: 'bg-blue-600 text-white',
      secondary: 'bg-gray-200 text-gray-900',
    },
    size: {
      small: 'text-sm',
      medium: 'text-base',
    },
  },
  defaultVariants: {
    intent: 'primary',
    size: 'medium',
  },
});
```

**Key Differences:**
- Base classes moved from first argument to `base` property
- Additional features: tokens, themes, accessibility, recipes

### Compound Variants

**Before (CVA):**
```typescript
const button = cva('button', {
  variants: { /* ... */ },
  compoundVariants: [
    {
      intent: 'primary',
      size: 'small',
      class: 'uppercase',
    },
  ],
});
```

**After (StyleSets):**
```typescript
const button = createStyleSet({
  base: 'button',
  variants: { /* ... */ },
  compoundVariants: [
    {
      intent: 'primary',
      size: 'small',
      class: 'uppercase', // Same syntax!
    },
  ],
});
```

**Key Differences:**
- Identical API for compound variants
- StyleSets provides better type inference

### Type Extraction

**Before (CVA):**
```typescript
import type { VariantProps } from 'class-variance-authority';

type ButtonProps = VariantProps<typeof button>;
```

**After (StyleSets):**
```typescript
import type { StylerProps } from '@sv0/stylesets';

type ButtonProps = StylerProps<typeof button>;
// Or use VariantProps for config-based extraction
```

### Additional Classes

**Before (CVA):**
```typescript
button({ intent: 'primary', class: 'mt-4' })
```

**After (StyleSets):**
```typescript
// Both work!
button({ intent: 'primary', class: 'mt-4' })
button({ intent: 'primary', className: 'mt-4' })

// Plus spread operator support
button({ intent: 'primary' }, 'mt-4', isActive && 'ring-2')
```

### Migration Checklist for CVA

- [ ] Replace `cva()` with `createStyleSet()`
- [ ] Move first argument (base classes) to `base` property
- [ ] Update type imports: `VariantProps` → `StylerProps`
- [ ] Consider adding accessibility features
- [ ] Consider adding design tokens for theming
- [ ] Test all variant combinations

## From tailwind-variants

tailwind-variants and StyleSets share similar APIs, making migration straightforward.

### Basic Usage

**Before (tailwind-variants):**
```typescript
import { tv } from 'tailwind-variants';

const button = tv({
  base: 'font-medium rounded',
  variants: {
    color: {
      primary: 'bg-blue-600 text-white',
      secondary: 'bg-purple-600 text-white',
    },
    size: {
      sm: 'text-sm px-3 py-1',
      md: 'text-base px-4 py-2',
    },
  },
  defaultVariants: {
    color: 'primary',
    size: 'md',
  },
});
```

**After (StyleSets):**
```typescript
import { createStyleSet } from '@sv0/stylesets';

const button = createStyleSet({
  base: 'font-medium rounded', // Same!
  variants: {
    color: {
      primary: 'bg-blue-600 text-white',
      secondary: 'bg-purple-600 text-white',
    },
    size: {
      sm: 'text-sm px-3 py-1',
      md: 'text-base px-4 py-2',
    },
  },
  defaultVariants: {
    color: 'primary',
    size: 'md',
  },
});
```

**Key Differences:**
- Nearly identical API
- StyleSets adds tokens, themes, and accessibility
- StyleSets has recipes feature

### Slots

**Before (tailwind-variants):**
```typescript
const card = tv({
  slots: {
    base: 'rounded border',
    header: 'font-bold p-4',
    body: 'p-4',
  },
});

// Usage
const { base, header, body } = card();
```

**After (StyleSets):**
```typescript
const card = createStyleSet({
  recipes: {
    base: 'rounded border',
    header: 'font-bold p-4',
    body: 'p-4',
  },
});

// Usage (property access)
const baseClass = card.base.toString();
const headerClass = card.header.toString();

// Or compose multiple
const composed = card.select('base', 'header');
```

### Responsive Variants

**Before (tailwind-variants):**
```typescript
const button = tv({
  base: 'rounded',
  variants: {
    size: {
      responsive: 'text-sm md:text-base lg:text-lg',
    },
  },
});
```

**After (StyleSets):**
```typescript
// Same approach - use Tailwind's responsive utilities
const button = createStyleSet({
  base: 'rounded',
  variants: {
    size: {
      responsive: 'text-sm md:text-base lg:text-lg',
    },
  },
});
```

### Migration Checklist for tailwind-variants

- [ ] Replace `tv()` with `createStyleSet()`
- [ ] Convert `slots` to `recipes`
- [ ] Update slot access pattern (destructuring → property access)
- [ ] Consider adding accessibility features
- [ ] Consider adding design tokens
- [ ] Test all variant combinations

## From styled-components

Migrating from CSS-in-JS to utility-first styling requires a mindset shift.

### Basic Component

**Before (styled-components):**
```typescript
import styled from 'styled-components';

const Button = styled.button<{ $primary?: boolean }>`
  padding: 8px 16px;
  border-radius: 4px;
  background: ${props => props.$primary ? '#0066cc' : '#e0e0e0'};
  color: ${props => props.$primary ? 'white' : 'black'};

  &:hover {
    background: ${props => props.$primary ? '#0052a3' : '#d0d0d0'};
  }
`;
```

**After (StyleSets):**
```typescript
import { createStyleSet } from '@sv0/stylesets';

const button = createStyleSet({
  base: 'px-4 py-2 rounded',
  variants: {
    primary: {
      true: 'bg-blue-600 text-white hover:bg-blue-700',
      false: 'bg-gray-300 text-black hover:bg-gray-400',
    },
  },
  defaultVariants: {
    primary: false,
  },
});

// Usage in component
<button class={button({ primary: true })}>
  Click me
</button>
```

### With Props

**Before (styled-components):**
```typescript
const Button = styled.button<{ size: 'small' | 'large' }>`
  padding: ${props => props.size === 'small' ? '4px 8px' : '12px 24px'};
  font-size: ${props => props.size === 'small' ? '14px' : '18px'};
`;
```

**After (StyleSets):**
```typescript
const button = createStyleSet({
  base: 'rounded',
  variants: {
    size: {
      small: 'px-2 py-1 text-sm',
      large: 'px-6 py-3 text-lg',
    },
  },
});
```

### Theme Support

**Before (styled-components):**
```typescript
const Button = styled.button`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
`;

// With ThemeProvider
<ThemeProvider theme={darkTheme}>
  <Button>Click me</Button>
</ThemeProvider>
```

**After (StyleSets):**
```typescript
const button = createStyleSet({
  base: 'px-4 py-2',
  variants: {
    intent: {
      primary: 'bg-{color.primary} text-{color.text}',
    },
  },
  tokens: {
    color: {
      primary: 'blue-600',
      text: 'white',
    },
  },
  themes: {
    dark: {
      tokens: {
        color: {
          primary: 'blue-400',
          text: 'gray-900',
        },
      },
    },
  },
});

// Usage
<button class={button({ intent: 'primary', theme: 'dark' })}>
  Click me
</button>
```

### Migration Checklist for styled-components

- [ ] Convert CSS properties to Tailwind utility classes
- [ ] Replace props-based conditionals with variants
- [ ] Convert theme values to design tokens
- [ ] Replace ThemeProvider with theme prop
- [ ] Update component props to use class/className
- [ ] Consider using CSS variables for dynamic values
- [ ] Test across all breakpoints

## From classnames/clsx

If you're using `clsx` or `classnames` for conditional classes, StyleSets provides a more structured approach.

### Conditional Classes

**Before (clsx):**
```typescript
import clsx from 'clsx';

const buttonClass = clsx(
  'px-4 py-2 rounded',
  isPrimary && 'bg-blue-600 text-white',
  isSecondary && 'bg-gray-200 text-gray-900',
  isSmall && 'text-sm',
  isLarge && 'text-lg',
  isDisabled && 'opacity-50 cursor-not-allowed'
);
```

**After (StyleSets):**
```typescript
import { createStyleSet } from '@sv0/stylesets';

const button = createStyleSet({
  base: 'px-4 py-2 rounded',
  variants: {
    intent: {
      primary: 'bg-blue-600 text-white',
      secondary: 'bg-gray-200 text-gray-900',
    },
    size: {
      small: 'text-sm',
      large: 'text-lg',
    },
    disabled: {
      true: 'opacity-50 cursor-not-allowed',
    },
  },
});

// Usage
const buttonClass = button({
  intent: isPrimary ? 'primary' : 'secondary',
  size: isSmall ? 'small' : isLarge ? 'large' : undefined,
  disabled: isDisabled,
});
```

### Static Recipes

**Before (clsx):**
```typescript
const containerClass = clsx('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8');
const cardClass = clsx('bg-white', 'rounded-lg', 'shadow', 'p-6');
```

**After (StyleSets):**
```typescript
const layout = createStyleSet({
  recipes: {
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    card: 'bg-white rounded-lg shadow p-6',
  },
});

// Usage
const containerClass = layout.container.toString();
const cardClass = layout.card.toString();

// Or compose
const composedClass = layout.select('container', 'card');
```

### Migration Checklist for clsx

- [ ] Identify repeated class patterns
- [ ] Convert conditionals to variants
- [ ] Group related styles into recipes
- [ ] Replace manual class merging with StyleSets
- [ ] Add type safety with TypeScript
- [ ] Test all conditional branches

## From CSS Modules

### Basic Styles

**Before (CSS Modules):**
```css
/* Button.module.css */
.button {
  padding: 8px 16px;
  border-radius: 4px;
}

.primary {
  background: blue;
  color: white;
}

.secondary {
  background: gray;
  color: black;
}

.small {
  font-size: 14px;
}
```

```typescript
import styles from './Button.module.css';

const className = clsx(
  styles.button,
  isPrimary ? styles.primary : styles.secondary,
  isSmall && styles.small
);
```

**After (StyleSets):**
```typescript
import { createStyleSet } from '@sv0/stylesets';

const button = createStyleSet({
  base: 'px-4 py-2 rounded',
  variants: {
    intent: {
      primary: 'bg-blue-600 text-white',
      secondary: 'bg-gray-600 text-black',
    },
    size: {
      small: 'text-sm',
    },
  },
});

const className = button({ intent: isPrimary ? 'primary' : 'secondary', size: isSmall ? 'small' : undefined });
```

### Migration Checklist for CSS Modules

- [ ] Install and configure Tailwind CSS
- [ ] Convert CSS properties to utility classes
- [ ] Replace CSS file imports with StyleSet imports
- [ ] Update class application logic
- [ ] Remove CSS module files
- [ ] Test visual consistency
- [ ] Update build configuration

## General Migration Checklist

Regardless of which library you're migrating from:

### 1. Installation

```bash
npm install @sv0/stylesets clsx tailwind-merge
npm install -D tailwindcss
```

### 2. Setup Tailwind (if not already)

```bash
npx tailwindcss init
```

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### 3. Create StyleSets

Start with commonly used components:
- [ ] Buttons
- [ ] Inputs
- [ ] Cards
- [ ] Typography
- [ ] Layout components

### 4. Add Features Incrementally

- [ ] Start with basic variants
- [ ] Add compound variants where needed
- [ ] Introduce design tokens for theming
- [ ] Add accessibility features
- [ ] Create recipes for repeated patterns

### 5. Testing

- [ ] Visual regression testing
- [ ] Test all variant combinations
- [ ] Test responsive behavior
- [ ] Test theme switching
- [ ] Test accessibility features

### 6. Documentation

- [ ] Document component APIs
- [ ] Create usage examples
- [ ] Document theme tokens
- [ ] Update team documentation

## Gradual Migration Strategy

You don't have to migrate everything at once:

### Phase 1: New Components

Use StyleSets for all new components while keeping existing ones unchanged.

### Phase 2: High-Traffic Components

Migrate frequently used components for maximum impact.

### Phase 3: Complex Components

Migrate complex components that benefit most from type safety and variants.

### Phase 4: Simple Components

Complete migration with remaining simple components.

## Need Help?

- Check the [Examples](../examples/README.md) for reference implementations
- Review the [API Reference](../api/README.md) for detailed documentation
- See [Demos](../demos/) for complex component patterns
- Read the [Theming Guide](./theming.md) for theme migration
- Review the [Accessibility Guide](./accessibility.md) for a11y features

## Common Pitfalls

### 1. Over-complicating Variants

```typescript
// ❌ Too many variants
const button = createStyleSet({
  variants: {
    color: { /* 10 colors */ },
    size: { /* 5 sizes */ },
    radius: { /* 4 radii */ },
    shadow: { /* 3 shadows */ },
    // etc...
  },
});

// ✅ Start simple, add as needed
const button = createStyleSet({
  variants: {
    intent: { primary: '...', secondary: '...' },
    size: { sm: '...', md: '...', lg: '...' },
  },
});
```

### 2. Not Using Recipes

```typescript
// ❌ Repeating classes
const containerClass = 'max-w-7xl mx-auto px-4';
const anotherContainerClass = 'max-w-7xl mx-auto px-4';

// ✅ Use recipes
const layout = createStyleSet({
  recipes: {
    container: 'max-w-7xl mx-auto px-4',
  },
});
```

### 3. Forgetting Type Safety

```typescript
// ❌ Losing type information
const getButtonClass = (variant: string) => button({ intent: variant });

// ✅ Maintain type safety
type ButtonIntent = 'primary' | 'secondary';
const getButtonClass = (variant: ButtonIntent) => button({ intent: variant });
```

## Success Stories

After migration, teams typically see:

- **50% reduction** in styling-related bugs
- **Faster development** with autocompletion
- **Better consistency** across components
- **Easier theming** with design tokens
- **Improved accessibility** with built-in features

## Next Steps

1. Start with the [Getting Started Guide](../README.md)
2. Review [Examples](../examples/README.md) for your use case
3. Try the [Interactive Demos](../demos/)
4. Join the community and share your migration experience
