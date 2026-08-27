# Accessibility Guide

Build inclusive, accessible user interfaces with StyleSets' built-in accessibility features.

## Table of Contents

- [Introduction](#introduction)
- [Accessibility Configuration](#accessibility-configuration)
- [Focus Management](#focus-management)
- [Reduced Motion](#reduced-motion)
- [High Contrast Mode](#high-contrast-mode)
- [Screen Reader Support](#screen-reader-support)
- [Keyboard Navigation](#keyboard-navigation)
- [ARIA Attributes](#aria-attributes)
- [Testing for Accessibility](#testing-for-accessibility)
- [Best Practices](#best-practices)

## Introduction

StyleSets provides built-in accessibility features that help you create inclusive user interfaces that work for everyone, including users with disabilities. The library automatically handles many accessibility concerns while giving you full control when needed.

## Accessibility Configuration

### Basic Setup

Enable accessibility features in your StyleSet:

```typescript
import { createStyleSet } from '@sv0/stylesets';

const button = createStyleSet({
  base: 'px-4 py-2 rounded',
  variants: {
    intent: { primary: 'bg-blue-600', secondary: 'bg-gray-600' },
  },
  accessibility: {
    focusRing: {
      default: 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      auto: true, // Automatically apply to interactive elements
    },
    reducedMotion: {
      replace: {
        'transition-all': 'transition-none',
        'animate-spin': 'animate-none',
      },
      auto: true, // Respect user's motion preferences
    },
  },
});
```

### Complete Accessibility Config

```typescript
import { createAccessibilityConfig } from '@sv0/stylesets';

const a11yConfig = createAccessibilityConfig({
  focusRing: 'primary', // Use preset or custom ClassValue
  reducedMotion: true,
  highContrast: true,
});

const component = createStyleSet({
  base: 'component-base',
  variants: { /* ... */ },
  accessibility: a11yConfig,
});
```

## Focus Management

### Automatic Focus Rings

StyleSets can automatically apply focus rings to interactive elements:

```typescript
const button = createStyleSet({
  base: 'px-4 py-2',
  variants: {
    intent: { primary: 'bg-blue-600' },
  },
  accessibility: {
    focusRing: {
      default: 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      auto: true, // Automatically applied when needed
    },
  },
});

// The focus ring is automatically added to interactive elements
const className = button({ intent: 'primary' });
```

### Focus Ring Variants

Different focus styles for different contexts:

```typescript
const input = createStyleSet({
  base: 'border rounded px-3 py-2',
  variants: {
    state: {
      default: 'border-gray-300',
      error: 'border-red-500',
      success: 'border-green-500',
    },
  },
  accessibility: {
    focusRing: {
      default: 'focus:ring-2 focus:ring-blue-500',
      variants: {
        error: 'focus:ring-2 focus:ring-red-500',
        success: 'focus:ring-2 focus:ring-green-500',
      },
      auto: true,
    },
  },
});
```

### Focus Ring Presets

Use built-in focus ring presets:

```typescript
import { focusRingPresets } from '@sv0/stylesets';

const styles = createStyleSet({
  base: 'component-base',
  accessibility: {
    focusRing: {
      default: focusRingPresets.primary,
      variants: {
        danger: focusRingPresets.error,
        success: focusRingPresets.success,
      },
      auto: true,
    },
  },
});
```

Available presets:
- `default` - Standard blue focus ring
- `tight` - Minimal 1px ring
- `loose` - Large 4px ring
- `primary`, `secondary`, `success`, `warning`, `error` - Semantic colors
- `dark`, `light` - Theme-specific

### Focus-Visible Only

Show focus only for keyboard navigation:

```typescript
import { AccessibilityManager } from '@sv0/stylesets';

const a11yManager = new AccessibilityManager({
  screenReader: {
    srOnly: 'sr-only',
    focusVisible: 'focus-visible:not-sr-only',
  },
});

// Create skip link
const skipLink = a11yManager.createFocusVisible('px-4 py-2 bg-blue-600 text-white');
```

## Reduced Motion

### Respecting User Preferences

Automatically replace animations for users who prefer reduced motion:

```typescript
const card = createStyleSet({
  base: 'rounded-lg transition-all duration-300',
  variants: {
    expanded: {
      true: 'shadow-lg scale-105',
      false: 'shadow hover:shadow-md',
    },
  },
  accessibility: {
    reducedMotion: {
      replace: {
        'transition-all': 'transition-none',
        'duration-300': 'duration-0',
        'scale-105': '',
        'hover:shadow-md': '',
      },
      auto: true, // Automatically applied based on user preference
    },
  },
});
```

### Reduced Motion Presets

Use built-in presets for common animations:

```typescript
import { reducedMotionPresets } from '@sv0/stylesets';

const styles = createStyleSet({
  base: 'component-base',
  accessibility: {
    reducedMotion: {
      replace: {
        ...reducedMotionPresets.animations, // spin, ping, pulse, bounce
        ...reducedMotionPresets.transitions, // all, colors, opacity, transform
        ...reducedMotionPresets.durations, // All duration classes
      },
      auto: true,
    },
  },
});
```

### Detecting Motion Preferences

```typescript
import { AccessibilityManager } from '@sv0/stylesets';

const a11yManager = new AccessibilityManager();

// Check preference
if (a11yManager.prefersReducedMotion()) {
  // Use static styles
} else {
  // Use animated styles
}

// Listen for changes (browser handles this automatically)
// The AccessibilityManager automatically detects and responds to changes
```

## High Contrast Mode

### Automatic High Contrast Support

```typescript
const text = createStyleSet({
  base: 'text-base',
  variants: {
    muted: {
      true: 'text-gray-600',
      false: 'text-gray-900',
    },
  },
  accessibility: {
    highContrast: {
      colorMap: {
        'text-gray-600': 'text-black', // Higher contrast alternative
        'bg-gray-100': 'bg-white',
      },
      auto: true, // Apply when user prefers high contrast
    },
  },
});
```

### High Contrast Presets

```typescript
import { highContrastPresets } from '@sv0/stylesets';

const styles = createStyleSet({
  base: 'component-base',
  accessibility: {
    highContrast: {
      colorMap: {
        ...highContrastPresets.text,
        ...highContrastPresets.backgrounds,
        ...highContrastPresets.borders,
      },
      auto: true,
    },
  },
});
```

## Screen Reader Support

### Screen Reader Only Classes

Hide content visually but keep it accessible to screen readers:

```typescript
import { AccessibilityManager } from '@sv0/stylesets';

const a11yManager = new AccessibilityManager({
  screenReader: {
    srOnly: 'sr-only', // Tailwind's screen reader only class
    focusVisible: 'focus-visible:not-sr-only',
  },
});

// Create screen reader only text
const srOnlyClass = a11yManager.createScreenReaderOnly();
```

Usage in Svelte:

```svelte
<button>
  <span class={a11yManager.createScreenReaderOnly()}>
    Close dialog
  </span>
  <svg aria-hidden="true"><!-- X icon --></svg>
</button>
```

### Skip Links

```svelte
<script lang="ts">
  import { AccessibilityManager } from '@sv0/stylesets';

  const a11y = new AccessibilityManager({
    screenReader: {
      srOnly: 'sr-only',
      focusVisible: 'focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-50',
    },
  });

  const skipLinkClass = a11y.createFocusVisible(
    'px-4 py-2 bg-blue-600 text-white rounded'
  );
</script>

<a href="#main-content" class={skipLinkClass}>
  Skip to main content
</a>
```

## Keyboard Navigation

### Focus Management in Interactive Components

```svelte
<script lang="ts">
  import { button } from './styles';

  interface Props {
    onclick?: () => void;
    disabled?: boolean;
  }

  let { onclick, disabled = false }: Props = $props();

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onclick?.();
    }
  }
</script>

<button
  class={button()}
  {disabled}
  {onclick}
  onkeydown={handleKeyDown}
  tabindex={disabled ? -1 : 0}
>
  <slot />
</button>
```

### Roving Tabindex Pattern

For lists and grids:

```svelte
<script lang="ts">
  let activeIndex = $state(0);

  function handleKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      activeIndex = (index + 1) % items.length;
      focusItem(activeIndex);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      activeIndex = (index - 1 + items.length) % items.length;
      focusItem(activeIndex);
    }
  }

  function focusItem(index: number) {
    document.getElementById(`item-${index}`)?.focus();
  }
</script>

<div role="toolbar" aria-label="Toolbar">
  {#each items as item, index}
    <button
      id="item-{index}"
      tabindex={index === activeIndex ? 0 : -1}
      onkeydown={(e) => handleKeyDown(e, index)}
    >
      {item.label}
    </button>
  {/each}
</div>
```

## ARIA Attributes

### Common ARIA Patterns

**Buttons:**
```svelte
<button
  aria-label="Close dialog"
  aria-pressed={isPressed}
  aria-disabled={isDisabled}
>
  <svg aria-hidden="true"><!-- Icon --></svg>
</button>
```

**Toggles:**
```svelte
<button
  role="switch"
  aria-checked={isOn}
  onclick={() => isOn = !isOn}
>
  {isOn ? 'On' : 'Off'}
</button>
```

**Disclosure:**
```svelte
<button
  aria-expanded={isExpanded}
  aria-controls="panel-{id}"
>
  Toggle
</button>
<div id="panel-{id}" role="region">
  Content
</div>
```

**Live Regions:**
```svelte
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  {statusMessage}
</div>
```

## Testing for Accessibility

### Automated Testing

```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { axe, toHaveNoViolations } from 'jest-axe';
import Button from './Button.svelte';

expect.extend(toHaveNoViolations);

describe('Button accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(Button, { props: { children: 'Click me' } });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should be keyboard accessible', async () => {
    const { getByRole } = render(Button);
    const button = getByRole('button');

    button.focus();
    expect(document.activeElement).toBe(button);
  });

  it('should have proper ARIA attributes', () => {
    const { getByRole } = render(Button, {
      props: { loading: true, children: 'Loading' }
    });

    const button = getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
  });
});
```

### Manual Testing Checklist

- [ ] **Keyboard Navigation**
  - Can reach all interactive elements with Tab
  - Can activate with Enter/Space
  - Can navigate within components with arrow keys
  - Focus is visible at all times

- [ ] **Screen Reader**
  - All interactive elements have accessible names
  - State changes are announced
  - Instructions are provided where needed
  - Error messages are associated with inputs

- [ ] **Color Contrast**
  - Text has 4.5:1 contrast ratio (3:1 for large text)
  - Interactive elements have 3:1 contrast with surroundings
  - Focus indicators have sufficient contrast

- [ ] **Motion**
  - Animations respect `prefers-reduced-motion`
  - No flashing content (3 times per second)
  - Infinite animations can be paused

- [ ] **Zoom & Reflow**
  - Content is usable at 200% zoom
  - No horizontal scrolling at mobile widths
  - Text can be resized without loss of functionality

## Best Practices

### 1. Always Provide Text Alternatives

```svelte
<!-- ❌ Bad: Icon button without label -->
<button class={button()}>
  <svg><!-- Icon --></svg>
</button>

<!-- ✅ Good: Accessible name provided -->
<button class={button()} aria-label="Close dialog">
  <svg aria-hidden="true"><!-- Icon --></svg>
</button>

<!-- ✅ Better: Visible label with icon -->
<button class={button()}>
  <svg aria-hidden="true" class="mr-2"><!-- Icon --></svg>
  Close
</button>
```

### 2. Use Semantic HTML

```svelte
<!-- ❌ Bad: Div button -->
<div onclick={handleClick}>Click me</div>

<!-- ✅ Good: Real button -->
<button onclick={handleClick}>Click me</button>

<!-- ❌ Bad: Generic container -->
<div class="card">
  <div class="title">Article Title</div>
  <div class="content">Content...</div>
</div>

<!-- ✅ Good: Semantic HTML -->
<article class="card">
  <h2 class="title">Article Title</h2>
  <p class="content">Content...</p>
</article>
```

### 3. Manage Focus Appropriately

```svelte
<script lang="ts">
  let isModalOpen = $state(false);
  let previousFocus: HTMLElement | null = null;

  function openModal() {
    previousFocus = document.activeElement as HTMLElement;
    isModalOpen = true;

    // Focus first focusable element in modal
    setTimeout(() => {
      document.querySelector<HTMLElement>('[data-modal] button')?.focus();
    });
  }

  function closeModal() {
    isModalOpen = false;

    // Return focus to trigger element
    previousFocus?.focus();
  }
</script>
```

### 4. Provide Clear Error Messages

```svelte
<script lang="ts">
  let emailError = $state('');

  function validateEmail(value: string) {
    if (!value) {
      emailError = 'Email is required';
    } else if (!isValidEmail(value)) {
      emailError = 'Please enter a valid email address';
    } else {
      emailError = '';
    }
  }
</script>

<div>
  <label for="email">Email</label>
  <input
    id="email"
    type="email"
    aria-invalid={!!emailError}
    aria-describedby={emailError ? 'email-error' : undefined}
    onblur={(e) => validateEmail(e.currentTarget.value)}
  />
  {#if emailError}
    <div id="email-error" role="alert" class="text-red-600">
      {emailError}
    </div>
  {/if}
</div>
```

### 5. Test with Real Assistive Technologies

- **Screen Readers:** NVDA (Windows), JAWS (Windows), VoiceOver (Mac/iOS), TalkBack (Android)
- **Keyboard Only:** Unplug your mouse and navigate
- **Browser Extensions:** axe DevTools, WAVE, Lighthouse
- **Color Tools:** Contrast checkers, colorblind simulators

## Resources

### Tools

- [axe DevTools](https://www.deque.com/axe/devtools/) - Browser extension
- [WAVE](https://wave.webaim.org/) - Web accessibility evaluation tool
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Built into Chrome DevTools
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/) - Desktop app

### Guidelines

- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/) - Web Content Accessibility Guidelines
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) - WAI-ARIA patterns
- [Inclusive Components](https://inclusive-components.design/) - Accessible component patterns
- [WebAIM](https://webaim.org/) - Accessibility resources and training

### StyleSets Resources

- [Accordion Demo](../demos/accordion.md) - Accessible accordion example
- [Tabs Demo](../demos/tabs.md) - Accessible tabs example
- [API Reference](../api/README.md) - Accessibility API documentation

## Next Steps

- Review [Examples](../examples/README.md) for accessible component implementations
- Check [Theming Guide](./theming.md) for accessible color choices
- Explore [Demos](../demos/) for interactive accessibility examples
