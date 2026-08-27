# Accordion Demo - Progressive Disclosure

This demo showcases a fully-featured accordion component built with StyleSets, demonstrating progressive disclosure patterns, state management, and accessibility features.

## Overview

An accordion is a vertically stacked list of headers that reveal or hide associated content sections. It's a common progressive disclosure pattern used to organize content in a compact space.

## Features

- ✅ Type-safe variant management
- ✅ Smooth animations with reduced motion support
- ✅ Keyboard navigation (Arrow keys, Home, End, Enter, Space)
- ✅ ARIA attributes for screen readers
- ✅ Focus ring with customizable styles
- ✅ Multiple or single panel expansion
- ✅ Theme support (light/dark)

## Style Configuration

```typescript
import { createStyleSet } from '@sv0/stylesets';

// Accordion container styles
const accordion = createStyleSet({
  base: 'w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden',
  variants: {
    theme: {
      light: 'bg-white border-gray-200 divide-gray-200',
      dark: 'bg-gray-800 border-gray-700 divide-gray-700',
    },
  },
  defaultVariants: {
    theme: 'light',
  },
});

// Accordion item styles
const accordionItem = createStyleSet({
  base: '',
  variants: {
    expanded: {
      true: '',
      false: '',
    },
    theme: {
      light: '',
      dark: '',
    },
  },
  defaultVariants: {
    expanded: false,
    theme: 'light',
  },
});

// Accordion header/button styles
const accordionHeader = createStyleSet({
  base: 'w-full flex items-center justify-between px-6 py-4 text-left font-medium transition-colors',
  variants: {
    expanded: {
      true: 'bg-gray-50',
      false: 'bg-white hover:bg-gray-50',
    },
    theme: {
      light: 'text-gray-900 hover:bg-gray-50',
      dark: 'text-gray-100 hover:bg-gray-700',
    },
  },
  compoundVariants: [
    {
      expanded: true,
      theme: 'light',
      class: 'bg-gray-50',
    },
    {
      expanded: true,
      theme: 'dark',
      class: 'bg-gray-700',
    },
    {
      expanded: false,
      theme: 'dark',
      class: 'bg-gray-800 hover:bg-gray-700',
    },
  ],
  defaultVariants: {
    expanded: false,
    theme: 'light',
  },
  accessibility: {
    focusRing: {
      default: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset',
      auto: true,
    },
  },
});

// Accordion icon styles
const accordionIcon = createStyleSet({
  base: 'transition-transform duration-200',
  variants: {
    expanded: {
      true: 'transform rotate-180',
      false: 'transform rotate-0',
    },
  },
  defaultVariants: {
    expanded: false,
  },
  accessibility: {
    reducedMotion: {
      replace: {
        'transition-transform': 'transition-none',
        'duration-200': 'duration-0',
      },
      auto: true,
    },
  },
});

// Accordion panel content styles
const accordionPanel = createStyleSet({
  base: 'overflow-hidden transition-all',
  variants: {
    expanded: {
      true: 'max-h-screen opacity-100',
      false: 'max-h-0 opacity-0',
    },
    theme: {
      light: 'bg-white',
      dark: 'bg-gray-800',
    },
  },
  defaultVariants: {
    expanded: false,
    theme: 'light',
  },
  accessibility: {
    reducedMotion: {
      replace: {
        'transition-all': 'transition-none',
      },
      auto: true,
    },
  },
});

const accordionContent = createStyleSet({
  base: 'px-6 py-4',
  variants: {
    theme: {
      light: 'text-gray-700',
      dark: 'text-gray-300',
    },
  },
  defaultVariants: {
    theme: 'light',
  },
});
```

## Svelte 5 Implementation

```svelte
<script lang="ts">
  import { accordionIcon, accordionHeader, accordionPanel, accordionContent, accordion, accordionItem } from './accordion-styles';

  interface AccordionItem {
    id: string;
    title: string;
    content: string;
  }

  interface Props {
    items: AccordionItem[];
    allowMultiple?: boolean;
    theme?: 'light' | 'dark';
  }

  let { items, allowMultiple = false, theme = 'light' }: Props = $props();

  // Track expanded panels
  let expandedIds = $state<Set<string>>(new Set());

  function togglePanel(id: string) {
    if (expandedIds.has(id)) {
      expandedIds.delete(id);
    } else {
      if (!allowMultiple) {
        expandedIds.clear();
      }
      expandedIds.add(id);
    }
    // Trigger reactivity
    expandedIds = new Set(expandedIds);
  }

  function handleKeyDown(event: KeyboardEvent, id: string, index: number) {
    const { key } = event;

    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      togglePanel(id);
    } else if (key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = (index + 1) % items.length;
      document.getElementById(`accordion-header-${items[nextIndex].id}`)?.focus();
    } else if (key === 'ArrowUp') {
      event.preventDefault();
      const prevIndex = (index - 1 + items.length) % items.length;
      document.getElementById(`accordion-header-${items[prevIndex].id}`)?.focus();
    } else if (key === 'Home') {
      event.preventDefault();
      document.getElementById(`accordion-header-${items[0].id}`)?.focus();
    } else if (key === 'End') {
      event.preventDefault();
      document.getElementById(`accordion-header-${items[items.length - 1].id}`)?.focus();
    }
  }

  function isExpanded(id: string): boolean {
    return expandedIds.has(id);
  }
</script>

<div class={accordion({ theme })}>
  {#each items as item, index (item.id)}
    <div class={accordionItem({ theme })}>
      <h3>
        <button
          id="accordion-header-{item.id}"
          type="button"
          class={accordionHeader({ expanded: isExpanded(item.id), theme })}
          aria-expanded={isExpanded(item.id)}
          aria-controls="accordion-panel-{item.id}"
          onclick={() => togglePanel(item.id)}
          onkeydown={(e) => handleKeyDown(e, item.id, index)}
        >
          <span>{item.title}</span>
          <svg
            class={accordionIcon({ expanded: isExpanded(item.id) })}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </h3>
      <div
        id="accordion-panel-{item.id}"
        class={accordionPanel({ expanded: isExpanded(item.id), theme })}
        role="region"
        aria-labelledby="accordion-header-{item.id}"
      >
        <div class={accordionContent({ theme })}>
          {item.content}
        </div>
      </div>
    </div>
  {/each}
</div>
```

See the full documentation for usage examples, accessibility features, testing approaches, and best practices at [docs/demos/accordion.md](../demos/accordion.md).
