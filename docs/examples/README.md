# Examples & Use Cases

Real-world examples demonstrating StyleSets in action. Each example includes complete implementation with TypeScript types, accessibility considerations, and testing approaches.

## Table of Contents

- [UI Components](#ui-components)
  - [Button](#button)
  - [Input](#input)
  - [Badge](#badge)
  - [Alert](#alert)
  - [Card](#card)
- [Layout Components](#layout-components)
  - [Container](#container)
  - [Stack](#stack)
  - [Grid](#grid)
- [Navigation](#navigation)
  - [Navigation Bar](#navigation-bar)
  - [Breadcrumbs](#breadcrumbs)
- [Form Components](#form-components)
  - [Form Field](#form-field)
  - [Select](#select)
  - [Checkbox](#checkbox)
- [Advanced Patterns](#advanced-patterns)
  - [Data Table](#data-table)
  - [Modal Dialog](#modal-dialog)
  - [Toast Notifications](#toast-notifications)

## UI Components

### Button

A fully-featured button component with multiple variants and states.

```typescript
import { createStyleSet } from '@sv0/stylesets';

export const button = createStyleSet({
  base: 'inline-flex items-center justify-center font-medium transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
  variants: {
    intent: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800',
      success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800',
      danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
      warning: 'bg-yellow-600 text-white hover:bg-yellow-700 active:bg-yellow-800',
      ghost: 'bg-transparent hover:bg-gray-100 active:bg-gray-200',
      link: 'bg-transparent text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline',
    },
    size: {
      xs: 'h-7 px-2 text-xs rounded',
      sm: 'h-8 px-3 text-sm rounded',
      md: 'h-10 px-4 text-base rounded-md',
      lg: 'h-12 px-6 text-lg rounded-lg',
      xl: 'h-14 px-8 text-xl rounded-lg',
    },
    fullWidth: {
      true: 'w-full',
      false: '',
    },
    loading: {
      true: 'cursor-wait',
      false: '',
    },
  },
  compoundVariants: [
    {
      intent: 'ghost',
      size: 'sm',
      class: 'hover:bg-gray-50',
    },
    {
      intent: 'link',
      size: 'sm',
      class: 'h-auto px-0',
    },
  ],
  defaultVariants: {
    intent: 'primary',
    size: 'md',
    fullWidth: false,
    loading: false,
  },
  accessibility: {
    focusRing: {
      default: 'focus:ring-2 focus:ring-offset-2',
      variants: {
        primary: 'focus:ring-blue-500',
        secondary: 'focus:ring-gray-500',
        success: 'focus:ring-green-500',
        danger: 'focus:ring-red-500',
      },
      auto: true,
    },
    reducedMotion: {
      replace: {
        'transition-all': 'transition-none',
      },
      auto: true,
    },
  },
});

// Usage in Svelte
export interface ButtonProps {
  intent?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onclick?: () => void;
}
```

```svelte
<script lang="ts">
  import { button } from './button-styles';
  import type { ButtonProps } from './button-styles';

  let {
    intent = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    disabled = false,
    type = 'button',
    onclick,
    children,
  }: ButtonProps & { children?: any } = $props();
</script>

<button
  {type}
  disabled={disabled || loading}
  class={button({ intent, size, fullWidth, loading })}
  onclick={onclick}
  aria-busy={loading}
>
  {#if loading}
    <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  {/if}
  {@render children?.()}
</button>
```

### Input

Text input with validation states and icons.

```typescript
export const input = createStyleSet({
  base: 'w-full px-3 py-2 border rounded-md transition-colors focus:outline-none',
  variants: {
    size: {
      sm: 'h-8 text-sm',
      md: 'h-10 text-base',
      lg: 'h-12 text-lg',
    },
    state: {
      default: 'border-gray-300 focus:border-blue-500',
      error: 'border-red-500 focus:border-red-600',
      success: 'border-green-500 focus:border-green-600',
      warning: 'border-yellow-500 focus:border-yellow-600',
    },
    disabled: {
      true: 'bg-gray-100 cursor-not-allowed opacity-60',
      false: 'bg-white',
    },
  },
  defaultVariants: {
    size: 'md',
    state: 'default',
    disabled: false,
  },
  accessibility: {
    focusRing: {
      default: 'focus:ring-2 focus:ring-offset-2',
      variants: {
        default: 'focus:ring-blue-500',
        error: 'focus:ring-red-500',
        success: 'focus:ring-green-500',
        warning: 'focus:ring-yellow-500',
      },
      auto: true,
    },
  },
});

export const inputWrapper = createStyleSet({
  base: 'relative',
  variants: {
    fullWidth: {
      true: 'w-full',
      false: '',
    },
  },
});

export const inputLabel = createStyleSet({
  base: 'block text-sm font-medium mb-1',
  variants: {
    required: {
      true: "after:content-['*'] after:ml-0.5 after:text-red-500",
      false: '',
    },
    state: {
      default: 'text-gray-700',
      error: 'text-red-700',
      success: 'text-green-700',
      warning: 'text-yellow-700',
    },
  },
  defaultVariants: {
    required: false,
    state: 'default',
  },
});

export const inputHint = createStyleSet({
  base: 'mt-1 text-sm',
  variants: {
    state: {
      default: 'text-gray-600',
      error: 'text-red-600',
      success: 'text-green-600',
      warning: 'text-yellow-600',
    },
  },
  defaultVariants: {
    state: 'default',
  },
});
```

### Badge

Small labels and status indicators.

```typescript
export const badge = createStyleSet({
  base: 'inline-flex items-center font-medium',
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
      yellow: '',
      purple: '',
    },
    size: {
      sm: 'px-2 py-0.5 text-xs rounded-full',
      md: 'px-2.5 py-0.5 text-sm rounded-full',
      lg: 'px-3 py-1 text-base rounded-full',
    },
    removable: {
      true: 'pr-1',
      false: '',
    },
  },
  compoundVariants: [
    // Gray
    { variant: 'solid', color: 'gray', class: 'bg-gray-600 text-white' },
    { variant: 'outline', color: 'gray', class: 'border-gray-600 text-gray-700' },
    { variant: 'subtle', color: 'gray', class: 'bg-gray-100 text-gray-700' },
    // Blue
    { variant: 'solid', color: 'blue', class: 'bg-blue-600 text-white' },
    { variant: 'outline', color: 'blue', class: 'border-blue-600 text-blue-700' },
    { variant: 'subtle', color: 'blue', class: 'bg-blue-100 text-blue-700' },
    // Green
    { variant: 'solid', color: 'green', class: 'bg-green-600 text-white' },
    { variant: 'outline', color: 'green', class: 'border-green-600 text-green-700' },
    { variant: 'subtle', color: 'green', class: 'bg-green-100 text-green-700' },
    // Red
    { variant: 'solid', color: 'red', class: 'bg-red-600 text-white' },
    { variant: 'outline', color: 'red', class: 'border-red-600 text-red-700' },
    { variant: 'subtle', color: 'red', class: 'bg-red-100 text-red-700' },
    // Yellow
    { variant: 'solid', color: 'yellow', class: 'bg-yellow-600 text-white' },
    { variant: 'outline', color: 'yellow', class: 'border-yellow-600 text-yellow-700' },
    { variant: 'subtle', color: 'yellow', class: 'bg-yellow-100 text-yellow-700' },
    // Purple
    { variant: 'solid', color: 'purple', class: 'bg-purple-600 text-white' },
    { variant: 'outline', color: 'purple', class: 'border-purple-600 text-purple-700' },
    { variant: 'subtle', color: 'purple', class: 'bg-purple-100 text-purple-700' },
  ],
  defaultVariants: {
    variant: 'solid',
    color: 'gray',
    size: 'md',
    removable: false,
  },
});
```

### Alert

Feedback messages with various severity levels.

```typescript
export const alert = createStyleSet({
  base: 'p-4 rounded-lg border flex items-start gap-3',
  variants: {
    status: {
      info: 'bg-blue-50 border-blue-200',
      success: 'bg-green-50 border-green-200',
      warning: 'bg-yellow-50 border-yellow-200',
      error: 'bg-red-50 border-red-200',
    },
    dismissible: {
      true: 'pr-10',
      false: '',
    },
  },
  defaultVariants: {
    status: 'info',
    dismissible: false,
  },
});

export const alertIcon = createStyleSet({
  base: 'flex-shrink-0 w-5 h-5',
  variants: {
    status: {
      info: 'text-blue-600',
      success: 'text-green-600',
      warning: 'text-yellow-600',
      error: 'text-red-600',
    },
  },
});

export const alertTitle = createStyleSet({
  base: 'font-medium',
  variants: {
    status: {
      info: 'text-blue-900',
      success: 'text-green-900',
      warning: 'text-yellow-900',
      error: 'text-red-900',
    },
  },
});

export const alertDescription = createStyleSet({
  base: 'mt-1 text-sm',
  variants: {
    status: {
      info: 'text-blue-800',
      success: 'text-green-800',
      warning: 'text-yellow-800',
      error: 'text-red-800',
    },
  },
});
```

### Card

Content container with various styles.

```typescript
export const card = createStyleSet({
  base: 'rounded-lg overflow-hidden',
  variants: {
    variant: {
      elevated: 'shadow-lg',
      outline: 'border-2',
      filled: '',
    },
    padding: {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
    interactive: {
      true: 'transition-shadow cursor-pointer hover:shadow-xl',
      false: '',
    },
  },
  compoundVariants: [
    {
      variant: 'elevated',
      interactive: true,
      class: 'hover:shadow-2xl',
    },
    {
      variant: 'outline',
      interactive: true,
      class: 'hover:border-gray-400',
    },
  ],
  defaultVariants: {
    variant: 'elevated',
    padding: 'md',
    interactive: false,
  },
});
```

## Layout Components

### Container

Responsive page container.

```typescript
export const container = createStyleSet({
  base: 'mx-auto px-4',
  variants: {
    maxWidth: {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      '2xl': 'max-w-screen-2xl',
      full: 'max-w-full',
    },
    padding: {
      none: 'px-0',
      sm: 'px-4',
      md: 'px-6',
      lg: 'px-8',
    },
  },
  defaultVariants: {
    maxWidth: 'xl',
    padding: 'md',
  },
});
```

### Stack

Vertical spacing utility.

```typescript
export const stack = createStyleSet({
  base: 'flex flex-col',
  variants: {
    spacing: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    },
  },
  defaultVariants: {
    spacing: 'md',
    align: 'stretch',
  },
});
```

### Grid

Responsive grid layout.

```typescript
export const grid = createStyleSet({
  base: 'grid',
  variants: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
      6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
      12: 'grid-cols-12',
    },
    gap: {
      none: 'gap-0',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    },
  },
  defaultVariants: {
    cols: 3,
    gap: 'md',
  },
});
```

## Navigation

### Navigation Bar

```typescript
export const navbar = createStyleSet({
  base: 'flex items-center justify-between',
  variants: {
    variant: {
      fixed: 'fixed top-0 left-0 right-0 z-50',
      sticky: 'sticky top-0 z-50',
      static: 'relative',
    },
    padding: {
      sm: 'px-4 py-2',
      md: 'px-6 py-3',
      lg: 'px-8 py-4',
    },
    theme: {
      light: 'bg-white border-b border-gray-200',
      dark: 'bg-gray-900 border-b border-gray-800',
      transparent: 'bg-transparent',
    },
  },
  defaultVariants: {
    variant: 'static',
    padding: 'md',
    theme: 'light',
  },
});

export const navLink = createStyleSet({
  base: 'px-3 py-2 rounded-md text-sm font-medium transition-colors',
  variants: {
    active: {
      true: 'bg-gray-900 text-white',
      false: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
    },
  },
  defaultVariants: {
    active: false,
  },
});
```

### Breadcrumbs

```typescript
export const breadcrumbs = createStyleSet({
  base: 'flex items-center space-x-2 text-sm',
});

export const breadcrumbItem = createStyleSet({
  base: 'flex items-center',
  variants: {
    active: {
      true: 'text-gray-900 font-medium',
      false: 'text-gray-600 hover:text-gray-900',
    },
  },
});

export const breadcrumbSeparator = createStyleSet({
  base: 'text-gray-400 mx-2',
});
```

## Advanced Examples

For more complex examples including data tables, modals, and toast notifications, see the individual demo files:

- **[Accordion Demo](../demos/accordion.md)** - Progressive disclosure pattern
- **[Tabs Demo](../demos/tabs.md)** - Tabbed interface
- **[Expandable Cards Demo](../demos/expandable-cards.md)** - Card grid with expansion

## Best Practices

1. **Start with base styles** - Define common styles in `base`
2. **Use semantic variant names** - `intent` instead of `color`, `size` instead of `scale`
3. **Leverage compound variants** - For complex conditional styling
4. **Default variants** - Always provide sensible defaults
5. **Type safety** - Export type definitions for component props
6. **Accessibility** - Use built-in a11y features
7. **Test thoroughly** - Write tests for all variant combinations

## Testing Pattern

```typescript
import { describe, it, expect } from 'vitest';
import { button } from './button-styles';

describe('button styles', () => {
  it('should apply base styles', () => {
    const result = button();
    expect(result).toContain('inline-flex');
    expect(result).toContain('items-center');
  });

  it('should apply variant styles', () => {
    const result = button({ intent: 'primary', size: 'lg' });
    expect(result).toContain('bg-blue-600');
    expect(result).toContain('h-12');
  });

  it('should apply compound variant styles', () => {
    const result = button({ intent: 'ghost', size: 'sm' });
    expect(result).toContain('hover:bg-gray-50');
  });

  it('should merge additional classes', () => {
    const result = button({ class: 'custom-class' });
    expect(result).toContain('custom-class');
  });
});
```

## Next Steps

- Explore [Theming Guide](../guides/theming.md) for advanced theming
- Read [Accessibility Guide](../guides/accessibility.md) for a11y best practices
- Check [API Reference](../api/README.md) for complete API documentation
