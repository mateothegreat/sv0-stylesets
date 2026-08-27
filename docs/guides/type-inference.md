# Type Inference Guide

Learn how to leverage StyleSets' powerful type inference to automatically extract variant types and eliminate manual type maintenance.

## Table of Contents

- [Introduction](#introduction)
- [Basic Type Extraction](#basic-type-extraction)
- [Type Helper Functions](#type-helper-functions)
- [Component Props Pattern](#component-props-pattern)
- [Advanced Patterns](#advanced-patterns)
- [Best Practices](#best-practices)

## Introduction

StyleSets provides automatic type inference for variants, eliminating the need to manually maintain TypeScript types. Instead of duplicating variant definitions, you can extract types directly from your StyleSet configuration.

### Before: Manual Type Maintenance ❌

```typescript
// Define StyleSet
const button = createStyleSet({
  variants: {
    intent: { primary: '...', secondary: '...', danger: '...' },
    size: { sm: '...', md: '...', lg: '...' },
  },
});

// Manually duplicate types (error-prone!)
interface ButtonProps {
  intent?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}
```

### After: Automatic Type Inference ✅

```typescript
import { createStyleSet, type VariantProps } from '@sv0/stylesets';

// Define StyleSet
const button = createStyleSet({
  variants: {
    intent: { primary: '...', secondary: '...', danger: '...' },
    size: { sm: '...', md: '...', lg: '...' },
  },
});

// Automatically extract types!
interface ButtonProps extends VariantProps<typeof button> {
  disabled?: boolean;
}
// Result: { intent?: 'primary' | 'secondary' | 'danger'; size?: 'sm' | 'md' | 'lg'; disabled?: boolean }
```

## Basic Type Extraction

### Using VariantProps

The `VariantProps` type helper extracts all variant props from a StyleSet:

```typescript
import { createStyleSet, type VariantProps } from '@sv0/stylesets';

const alert = createStyleSet({
  base: 'p-4 rounded border',
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
});

// Extract variant types
type AlertVariants = VariantProps<typeof alert>;
// Result: {
//   status?: 'info' | 'success' | 'warning' | 'error' | null;
//   dismissible?: 'true' | 'false' | null;
// }
```

## Type Helper Functions

StyleSets provides several type helpers for different use cases:

### 1. VariantProps

Extract all variant props from a StyleSet:

```typescript
import { type VariantProps } from '@sv0/stylesets';

const button = createStyleSet({
  variants: {
    intent: { primary: '...', secondary: '...' },
    size: { sm: '...', md: '...', lg: '...' },
  },
});

type ButtonVariants = VariantProps<typeof button>;
// Result: { intent?: 'primary' | 'secondary'; size?: 'sm' | 'md' | 'lg' }
```

### 2. InferVariantKeys

Extract keys for a specific variant:

```typescript
import { type InferVariantKeys } from '@sv0/stylesets';

const button = createStyleSet({
  variants: {
    intent: { primary: '...', secondary: '...', danger: '...' },
    size: { sm: '...', md: '...', lg: '...' },
  },
});

type IntentKeys = InferVariantKeys<typeof button, 'intent'>;
// Result: 'primary' | 'secondary' | 'danger'

type SizeKeys = InferVariantKeys<typeof button, 'size'>;
// Result: 'sm' | 'md' | 'lg'
```

### 3. InferVariantNames

Extract all variant names:

```typescript
import { type InferVariantNames } from '@sv0/stylesets';

const button = createStyleSet({
  variants: {
    intent: { primary: '...' },
    size: { sm: '...' },
    disabled: { true: '...' },
  },
});

type VariantNames = InferVariantNames<typeof button>;
// Result: 'intent' | 'size' | 'disabled'
```

### 4. InferRecipeNames

Extract recipe names:

```typescript
import { type InferRecipeNames } from '@sv0/stylesets';

const layout = createStyleSet({
  recipes: {
    container: 'max-w-7xl mx-auto',
    card: 'bg-white rounded',
    title: 'text-2xl font-bold',
  },
});

type RecipeNames = InferRecipeNames<typeof layout>;
// Result: 'container' | 'card' | 'title'
```

## Component Props Pattern

The recommended pattern for Svelte components:

### Complete Example

```svelte
<script lang="ts">
  import { createStyleSet, type VariantProps } from '@sv0/stylesets';

  // 1. Define StyleSet
  const button = createStyleSet({
    base: 'inline-flex items-center justify-center font-medium',
    variants: {
      intent: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700',
        danger: 'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'md',
      fullWidth: false,
    },
  });

  // 2. Extract variant types and add component-specific props
  export interface ButtonProps extends VariantProps<typeof button> {
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onclick?: () => void;
    children?: any;
  }

  // 3. Use in component props with full type safety
  let {
    intent = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    type = 'button',
    onclick,
    children,
  }: ButtonProps = $props();
</script>

<button
  {type}
  {disabled}
  class={button({ intent, size, fullWidth })}
  {onclick}
>
  {@render children?.()}
</button>
```

### Benefits

1. **No Type Duplication** - Variant types are automatically inferred
2. **Single Source of Truth** - StyleSet definition drives types
3. **Type Safety** - Full IntelliSense and compile-time checking
4. **Easy Refactoring** - Change variants once, types update everywhere
5. **Self-Documenting** - Types reflect actual implementation

## Advanced Patterns

### Union Types for Dynamic Variants

```typescript
const badge = createStyleSet({
  variants: {
    variant: { solid: '...', outline: '...', subtle: '...' },
    color: { gray: '...', blue: '...', green: '...', red: '...' },
  },
});

// Extract specific variant keys
type BadgeVariant = InferVariantKeys<typeof badge, 'variant'>;
type BadgeColor = InferVariantKeys<typeof badge, 'color'>;

// Use in function signatures
function getBadgeStyle(variant: BadgeVariant, color: BadgeColor) {
  return badge({ variant, color });
}

// Type-safe usage
getBadgeStyle('solid', 'blue'); // ✅ Valid
getBadgeStyle('invalid', 'blue'); // ❌ Type error
```

### Conditional Types

```typescript
const input = createStyleSet({
  variants: {
    state: { default: '...', error: '...', success: '...' },
    size: { sm: '...', md: '...', lg: '...' },
  },
});

type InputState = InferVariantKeys<typeof input, 'state'>;

// Conditional message based on state
interface InputProps extends VariantProps<typeof input> {
  message?: InputState extends 'error' | 'success' ? string : never;
}
```

### Discriminated Unions

```typescript
const card = createStyleSet({
  variants: {
    variant: { elevated: '...', outline: '...', filled: '...' },
    interactive: { true: '...', false: '...' },
  },
});

type CardVariant = InferVariantKeys<typeof card, 'variant'>;

// Create discriminated union
type CardConfig =
  | { variant: Extract<CardVariant, 'elevated'>; elevation: number }
  | { variant: Extract<CardVariant, 'outline'>; borderWidth: number }
  | { variant: Extract<CardVariant, 'filled'>; backgroundColor: string };
```

### Generic Component Factory

```typescript
function createComponent<T extends ReturnType<typeof createStyleSet>>(
  styleSet: T
) {
  type Props = VariantProps<T> & {
    children?: any;
  };

  return (props: Props) => {
    const { children, ...variantProps } = props;
    return {
      className: styleSet(variantProps),
      children,
    };
  };
}

// Usage
const button = createStyleSet({ /* ... */ });
const Button = createComponent(button);
```

### Type Guards

```typescript
const button = createStyleSet({
  variants: {
    intent: { primary: '...', secondary: '...', danger: '...' },
  },
});

type ButtonIntent = InferVariantKeys<typeof button, 'intent'>;

// Type guard function
function isButtonIntent(value: string): value is ButtonIntent {
  return ['primary', 'secondary', 'danger'].includes(value);
}

// Usage
function handleIntent(intent: string) {
  if (isButtonIntent(intent)) {
    // TypeScript knows intent is ButtonIntent here
    return button({ intent });
  }
}
```

### Extracting from Multiple StyleSets

```typescript
const button = createStyleSet({ variants: { intent: { primary: '...' } } });
const input = createStyleSet({ variants: { state: { error: '...' } } });
const select = createStyleSet({ variants: { variant: { outline: '...' } } });

// Combine variants from multiple StyleSets
type FormElementProps =
  & VariantProps<typeof button>
  & VariantProps<typeof input>
  & VariantProps<typeof select>;
// Result: { intent?: ...; state?: ...; variant?: ... }
```

## Best Practices

### 1. Export StyleSets

Export your StyleSets so types can be extracted in other files:

```typescript
// button-styles.ts
export const button = createStyleSet({ /* ... */ });

// Button.svelte
import { button, type VariantProps } from './button-styles';
type ButtonProps = VariantProps<typeof button>;
```

### 2. Use Interface Extension

Prefer `extends` over intersection types:

```typescript
// ✅ Good: Clear hierarchy
interface ButtonProps extends VariantProps<typeof button> {
  disabled?: boolean;
}

// ❌ Less clear
type ButtonProps = VariantProps<typeof button> & {
  disabled?: boolean;
};
```

### 3. Document Extracted Types

Add JSDoc comments to extracted types:

```typescript
/**
 * Button component props
 * @see button StyleSet for variant options
 */
export interface ButtonProps extends VariantProps<typeof button> {
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Click handler */
  onclick?: () => void;
}
```

### 4. Create Utility Types

Build reusable utility types for common patterns:

```typescript
// util-types.ts
import type { VariantProps } from '@sv0/stylesets';

export type ComponentProps<T, Additional = {}> =
  & VariantProps<T>
  & Additional
  & { class?: string; children?: any };

// Usage
import type { ComponentProps } from './util-types';

interface ButtonProps extends ComponentProps<typeof button, {
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}> {}
```

### 5. Leverage Type Inference

Let TypeScript infer types when possible:

```typescript
const button = createStyleSet({ /* ... */ });

// ✅ Type is inferred
const className = button({ intent: 'primary' });

// ❌ Unnecessary type annotation
const className: string = button({ intent: 'primary' });
```

### 6. Test Your Types

Write type tests to ensure types work as expected:

```typescript
import { expectTypeOf } from 'vitest';

const button = createStyleSet({ /* ... */ });
type ButtonProps = VariantProps<typeof button>;

// Test that types are correct
expectTypeOf<ButtonProps>().toMatchTypeOf<{
  intent?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}>();
```

## Type-Safe Recipes

Extract recipe names for type-safe recipe access:

```typescript
const layout = createStyleSet({
  recipes: {
    container: 'max-w-7xl mx-auto',
    card: 'bg-white rounded',
    title: 'text-2xl font-bold',
  },
});

type RecipeName = InferRecipeNames<typeof layout>;

// Type-safe recipe selector
function getRecipe(name: RecipeName) {
  return layout[name].toString();
}

getRecipe('container'); // ✅ Valid
getRecipe('invalid'); // ❌ Type error
```

## Next Steps

- Review [API Reference](../api/README.md) for complete type documentation
- Check [Examples](../examples/README.md) for real-world usage
- Explore [Demos](../demos/) for component patterns
- Read [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/) for advanced TypeScript

## Resources

- [TypeScript Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
