# Svelte 5 Integration Guide

Complete guide for using stylesets with Svelte 5's new features including `$props()`, snippets, and enhanced TypeScript support.

## Installation

```bash
npm install stylesets
```

## Basic Usage with Svelte 5

### 1. Define Your Variants

```typescript
// styles.ts
import { defineVariants, createComponentVariant } from 'stylesets/simple';

export const cardVariants = defineVariants({
  base: {
    root: "overflow-hidden rounded-lg",
    header: "border-b",
    content: "flex-1",
    footer: "border-t bg-gray-50"
  },
  variants: {
    variant: {
      default: {
        root: "bg-white border border-gray-200",
        header: "bg-gray-50 border-gray-200 px-6 py-4",
        content: "px-6 py-4",
        footer: "border-gray-200 px-6 py-4"
      },
      popup: {
        root: "bg-white shadow-lg",
        header: "bg-white px-6 py-4",
        content: "px-6 py-4",
        footer: "bg-white px-6 py-4"
      },
      elevated: {
        root: "bg-white shadow-xl",
        header: "bg-gradient-to-r from-gray-50 to-white px-6 py-4",
        content: "px-6 py-4",
        footer: "bg-gray-50 px-6 py-4"
      }
    },
    size: {
      sm: {
        header: "px-4 py-2 text-sm",
        content: "px-4 py-3 text-sm",
        footer: "px-4 py-2 text-xs"
      },
      md: {
        header: "px-6 py-4 text-base",
        content: "px-6 py-4 text-base",
        footer: "px-6 py-4 text-sm"
      },
      lg: {
        header: "px-8 py-6 text-lg",
        content: "px-8 py-6 text-base",
        footer: "px-8 py-6 text-base"
      }
    }
  },
  defaultVariants: {
    variant: "default",
    size: "md"
  }
});

// Create enhanced component variant with additional classes
export const dialogVariant = createComponentVariant(cardVariants, {
  overlay: "fixed inset-0 bg-black/50 animate-in fade-in duration-200",
  root: "animate-in fade-in zoom-in-95 duration-200",
  content: "animate-in fade-in slide-in-from-bottom-4 duration-300"
});
```

### 2. Using in Svelte 5 Components

```svelte
<!-- Card.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { dialogVariant } from './styles';
  
  // Define props with proper typing
  interface Props {
    variant?: 'default' | 'popup' | 'elevated';
    size?: 'sm' | 'md' | 'lg';
    title?: string;
    children?: Snippet;
    footer?: Snippet;
    onClose?: () => void;
  }
  
  let { 
    variant = 'default',
    size = 'md',
    title,
    children,
    footer,
    onClose
  }: Props = $props();
  
  // Get typed styles - fully type-safe!
  const styles = dialogVariant({ variant, size });
</script>

<div class={styles.overlay.toString()} onclick={onClose}>
  <div class={styles.root.toString()} onclick={(e) => e.stopPropagation()}>
    {#if title}
      <div class={styles.header.toString()}>
        <h2 class="text-lg font-semibold">{title}</h2>
      </div>
    {/if}
    
    <div class={styles.content.toString()}>
      {@render children?.()}
    </div>
    
    {#if footer}
      <div class={styles.footer.toString()}>
        {@render footer()}
      </div>
    {/if}
  </div>
</div>
```

## Advanced Patterns

### Dynamic Variant Selection

```svelte
<script lang="ts">
  import { cardVariants } from './styles';
  
  interface Props {
    variant?: 'default' | 'popup' | 'elevated';
    size?: 'sm' | 'md' | 'lg';
    compact?: boolean;
    children?: Snippet;
  }
  
  let { variant, size, compact, children }: Props = $props();
  
  // Computed variant based on props
  $: actualSize = compact ? 'sm' : (size || 'md');
  
  // Reactive styles
  $: styles = cardVariants({ 
    variant: variant || 'default', 
    size: actualSize 
  });
</script>

<div class={styles.root.toString()}>
  <div class={styles.content.toString()}>
    {@render children?.()}
  </div>
</div>
```

### Component Composition with Variants

```svelte
<!-- Button.svelte -->
<script lang="ts">
  import { defineVariants, createComponentVariant } from 'stylesets/simple';
  import type { Snippet } from 'svelte';
  
  const buttonBase = defineVariants({
    base: "px-4 py-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2",
    variants: {
      variant: {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
      },
      size: {
        sm: "text-sm px-3 py-1.5",
        md: "text-base px-4 py-2",
        lg: "text-lg px-6 py-3"
      },
      fullWidth: {
        true: "w-full",
        false: ""
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false
    }
  });
  
  interface Props {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    disabled?: boolean;
    children?: Snippet;
    onclick?: (e: MouseEvent) => void;
  }
  
  let {
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    children,
    onclick
  }: Props = $props();
  
  $: classes = buttonBase({ variant, size, fullWidth });
  $: finalClasses = disabled 
    ? `${classes.toString()} opacity-50 cursor-not-allowed`
    : classes.toString();
</script>

<button 
  class={finalClasses}
  {disabled}
  {onclick}
>
  {@render children?.()}
</button>
```

### Nested Component Structures

```svelte
<!-- Modal.svelte -->
<script lang="ts">
  import { defineVariants, createComponentVariant } from 'stylesets/simple';
  import type { Snippet } from 'svelte';
  
  const modalVariants = defineVariants({
    base: {
      overlay: "fixed inset-0 z-50 bg-black/50",
      container: "fixed inset-0 z-50 flex items-center justify-center p-4",
      modal: "relative bg-white rounded-lg shadow-xl",
      header: "px-6 py-4 border-b",
      content: "px-6 py-4",
      footer: "px-6 py-4 border-t bg-gray-50 flex justify-end gap-2"
    },
    variants: {
      size: {
        sm: {
          modal: "max-w-md w-full"
        },
        md: {
          modal: "max-w-lg w-full"
        },
        lg: {
          modal: "max-w-2xl w-full"
        },
        xl: {
          modal: "max-w-4xl w-full"
        },
        fullscreen: {
          container: "p-0",
          modal: "w-full h-full max-w-none rounded-none"
        }
      },
      variant: {
        default: {
          modal: "bg-white",
          header: "bg-gray-50"
        },
        dark: {
          modal: "bg-gray-900 text-white",
          header: "bg-gray-800 border-gray-700",
          content: "text-gray-100",
          footer: "bg-gray-800 border-gray-700"
        }
      }
    },
    defaultVariants: {
      size: "md",
      variant: "default"
    }
  });
  
  const modal = createComponentVariant(modalVariants, {
    overlay: "animate-in fade-in duration-200",
    modal: "animate-in fade-in zoom-in-95 duration-200"
  });
  
  interface Props {
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
    variant?: 'default' | 'dark';
    title?: string;
    open?: boolean;
    children?: Snippet;
    footer?: Snippet;
    onClose?: () => void;
  }
  
  let {
    size = 'md',
    variant = 'default',
    title,
    open = false,
    children,
    footer,
    onClose
  }: Props = $props();
  
  const styles = modal({ size, variant });
  
  function handleEscape(e: KeyboardEvent) {
    if (e.key === 'Escape' && open) {
      onClose?.();
    }
  }
</script>

<svelte:window onkeydown={handleEscape} />

{#if open}
  <div class={styles.overlay.toString()} onclick={onClose} />
  <div class={styles.container.toString()}>
    <div class={styles.modal.toString()} onclick={(e) => e.stopPropagation()}>
      {#if title}
        <div class={styles.header.toString()}>
          <h2 class="text-lg font-semibold">{title}</h2>
        </div>
      {/if}
      
      <div class={styles.content.toString()}>
        {@render children?.()}
      </div>
      
      {#if footer}
        <div class={styles.footer.toString()}>
          {@render footer()}
        </div>
      {/if}
    </div>
  </div>
{/if}
```

## Best Practices

### 1. Type Safety

Always define your variant types explicitly:

```typescript
// types.ts
import type { defineVariants } from 'stylesets/simple';

// Infer types from your variant definition
export type CardVariantProps = Parameters<typeof cardVariants>[0];
export type CardStyles = ReturnType<typeof cardVariants>;
```

### 2. Prop Destructuring with $props()

```svelte
<script lang="ts">
  interface Props {
    variant?: 'default' | 'elevated';
    size?: 'sm' | 'md' | 'lg';
    class?: string; // Allow additional classes
    children?: Snippet;
  }
  
  let { 
    variant = 'default',
    size = 'md',
    class: className = '',
    children,
    ...rest  // Capture remaining props
  }: Props = $props();
  
  const baseStyles = cardVariants({ variant, size });
  
  // Combine with additional classes
  $: rootClasses = `${baseStyles.root.toString()} ${className}`;
</script>

<div class={rootClasses} {...rest}>
  {@render children?.()}
</div>
```

### 3. Reactive Styles

Use Svelte's reactivity for dynamic styling:

```svelte
<script lang="ts">
  let isActive = $state(false);
  let isError = $state(false);
  
  $: variant = isError ? 'danger' : isActive ? 'primary' : 'default';
  $: styles = buttonVariants({ variant, size: 'md' });
</script>
```

### 4. Performance Optimization

Memoize variant calculations when needed:

```svelte
<script lang="ts">
  import { derived } from 'svelte/store';
  
  let variant = $state('default');
  let size = $state('md');
  
  // Only recalculate when dependencies change
  const styles = $derived.by(() => {
    return cardVariants({ variant, size });
  });
</script>
```

## TypeScript Tips

### Extract Component Props Type

```typescript
// styles.ts
import { defineVariants, createComponentVariant } from 'stylesets/simple';

export const cardVariants = defineVariants({
  // ... variant config
} as const); // Use 'as const' for better type inference

// Extract props type
export type CardVariantProps = Parameters<typeof cardVariants>[0];

// In component
interface Props extends CardVariantProps {
  children?: Snippet;
  class?: string;
}
```

### Type-Safe Style Access

```svelte
<script lang="ts">
  const styles = cardVariants({ variant: 'default', size: 'md' });
  
  // TypeScript knows the exact structure
  // styles.root, styles.header, styles.content, styles.footer
  
  // Each property has toString() method
  const rootClasses: string = styles.root.toString();
</script>
```

## Migration from Traditional Class Approaches

### Before (Traditional)

```svelte
<script>
  export let variant = 'default';
  export let size = 'md';
  
  $: classes = `
    card
    ${variant === 'elevated' ? 'card--elevated' : ''}
    ${size === 'lg' ? 'card--large' : ''}
    ${size === 'sm' ? 'card--small' : ''}
  `;
</script>

<div class={classes}>
  <slot />
</div>
```

### After (With Stylesets)

```svelte
<script lang="ts">
  import { cardVariants } from './styles';
  import type { Snippet } from 'svelte';
  
  interface Props {
    variant?: 'default' | 'elevated';
    size?: 'sm' | 'md' | 'lg';
    children?: Snippet;
  }
  
  let { variant = 'default', size = 'md', children }: Props = $props();
  
  const styles = cardVariants({ variant, size });
</script>

<div class={styles.root.toString()}>
  <div class={styles.content.toString()}>
    {@render children?.()}
  </div>
</div>
```

## Common Patterns

### Conditional Rendering with Variants

```svelte
<script lang="ts">
  import { combineVariants, conditionalVariant } from 'stylesets/simple';
  
  let isLoading = $state(false);
  let hasError = $state(false);
  
  $: styles = combineVariants([
    cardVariants({ variant: 'default', size: 'md' }),
    conditionalVariant(isLoading, { root: "opacity-50 pointer-events-none" }),
    conditionalVariant(hasError, { root: "border-red-500" })
  ]);
</script>
```

### Forwarding Variant Props

```svelte
<!-- ParentComponent.svelte -->
<script lang="ts">
  import ChildCard from './ChildCard.svelte';
  import type { CardVariantProps } from './styles';
  
  interface Props extends CardVariantProps {
    title: string;
  }
  
  let { title, ...variantProps }: Props = $props();
</script>

<ChildCard {...variantProps}>
  <h1>{title}</h1>
</ChildCard>
```

## Troubleshooting

### Issue: TypeScript errors with `.toString()`

**Solution**: Ensure you're calling `.toString()` on variant results:

```svelte
<!-- ❌ Wrong -->
<div class={styles.root}>

<!-- ✅ Correct -->
<div class={styles.root.toString()}>
```

### Issue: Props not reactive

**Solution**: Use `$:` or `$derived` for reactive calculations:

```svelte
<script lang="ts">
  let { variant, size }: Props = $props();
  
  // ❌ Not reactive
  const styles = cardVariants({ variant, size });
  
  // ✅ Reactive
  $: styles = cardVariants({ variant, size });
  
  // ✅ Also reactive (Svelte 5)
  const styles = $derived(cardVariants({ variant, size }));
</script>
```

### Issue: Complex nested structures

**Solution**: Use the card pattern for consistent structure:

```typescript
// All variants define the same object keys
const variants = defineVariants({
  base: {
    root: "...",
    header: "...",
    content: "..."
  },
  variants: {
    variant: {
      default: {
        root: "...",
        header: "...",
        content: "..."
      }
    }
  }
});
```

This ensures proper type inference and flattening of the structure.