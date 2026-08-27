# Tabs Demo - Progressive Disclosure

This demo showcases a fully-featured tabs component built with StyleSets, demonstrating progressive disclosure through tabbed navigation with state management and accessibility features.

## Overview

Tabs organize related content into separate views that users can switch between. Only one panel is visible at a time, making it an efficient way to organize dense information without overwhelming users.

## Features

- ✅ Type-safe tab management
- ✅ Smooth transitions with reduced motion support
- ✅ Keyboard navigation (Arrow keys, Home, End, Tab)
- ✅ ARIA attributes for screen readers (tablist, tab, tabpanel)
- ✅ Focus management and visual indicators
- ✅ Multiple tab variants (underline, pills, enclosed)
- ✅ Theme support with design tokens
- ✅ Lazy loading support for panels

## Style Configuration

```typescript
import { createStyleSet } from '@sv0/stylesets';

// Tab list container
const tabList = createStyleSet({
  base: 'flex',
  variants: {
    variant: {
      underline: 'border-b border-gray-200 gap-8',
      pills: 'gap-2 p-1 bg-gray-100 rounded-lg',
      enclosed: 'border-b border-gray-200',
    },
    orientation: {
      horizontal: 'flex-row',
      vertical: 'flex-col',
    },
    theme: {
      light: '',
      dark: 'border-gray-700',
    },
  },
  compoundVariants: [
    {
      variant: 'pills',
      theme: 'dark',
      class: 'bg-gray-800',
    },
  ],
  defaultVariants: {
    variant: 'underline',
    orientation: 'horizontal',
    theme: 'light',
  },
});

// Individual tab button
const tab = createStyleSet({
  base: 'px-4 py-2 font-medium transition-all focus:outline-none',
  variants: {
    variant: {
      underline: 'border-b-2 -mb-px',
      pills: 'rounded-md',
      enclosed: 'border border-transparent border-b-0 rounded-t-lg',
    },
    active: {
      true: '',
      false: '',
    },
    disabled: {
      true: 'cursor-not-allowed opacity-50',
      false: 'cursor-pointer',
    },
    theme: {
      light: '',
      dark: '',
    },
  },
  compoundVariants: [
    // Underline variant
    {
      variant: 'underline',
      active: true,
      theme: 'light',
      class: 'border-blue-600 text-blue-600',
    },
    {
      variant: 'underline',
      active: false,
      theme: 'light',
      class: 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300',
    },
    {
      variant: 'underline',
      active: true,
      theme: 'dark',
      class: 'border-blue-400 text-blue-400',
    },
    {
      variant: 'underline',
      active: false,
      theme: 'dark',
      class: 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600',
    },
    // Pills variant
    {
      variant: 'pills',
      active: true,
      theme: 'light',
      class: 'bg-white shadow text-gray-900',
    },
    {
      variant: 'pills',
      active: false,
      theme: 'light',
      class: 'text-gray-700 hover:bg-gray-50',
    },
    {
      variant: 'pills',
      active: true,
      theme: 'dark',
      class: 'bg-gray-700 text-white',
    },
    {
      variant: 'pills',
      active: false,
      theme: 'dark',
      class: 'text-gray-300 hover:bg-gray-700',
    },
    // Enclosed variant
    {
      variant: 'enclosed',
      active: true,
      theme: 'light',
      class: 'border-gray-200 border-b-white bg-white text-gray-900',
    },
    {
      variant: 'enclosed',
      active: false,
      theme: 'light',
      class: 'text-gray-600 hover:text-gray-800',
    },
    {
      variant: 'enclosed',
      active: true,
      theme: 'dark',
      class: 'border-gray-700 border-b-gray-800 bg-gray-800 text-white',
    },
    {
      variant: 'enclosed',
      active: false,
      theme: 'dark',
      class: 'text-gray-400 hover:text-gray-200',
    },
  ],
  defaultVariants: {
    variant: 'underline',
    active: false,
    disabled: false,
    theme: 'light',
  },
  accessibility: {
    focusRing: {
      default: 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
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

// Tab panels container
const tabPanels = createStyleSet({
  base: 'mt-4',
  variants: {
    variant: {
      underline: '',
      pills: '',
      enclosed: 'border border-gray-200 border-t-0 rounded-b-lg p-4',
    },
    theme: {
      light: '',
      dark: 'border-gray-700',
    },
  },
  compoundVariants: [
    {
      variant: 'enclosed',
      theme: 'light',
      class: 'bg-white',
    },
    {
      variant: 'enclosed',
      theme: 'dark',
      class: 'bg-gray-800',
    },
  ],
  defaultVariants: {
    variant: 'underline',
    theme: 'light',
  },
});

// Individual tab panel
const tabPanel = createStyleSet({
  base: 'focus:outline-none',
  variants: {
    hidden: {
      true: 'hidden',
      false: 'block animate-fadeIn',
    },
    theme: {
      light: 'text-gray-900',
      dark: 'text-gray-100',
    },
  },
  defaultVariants: {
    hidden: false,
    theme: 'light',
  },
  accessibility: {
    focusRing: {
      default: 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      auto: false,
    },
    reducedMotion: {
      replace: {
        'animate-fadeIn': '',
      },
      auto: true,
    },
  },
});
```

## Svelte 5 Implementation

```svelte
<script lang="ts">
  import { tabList, tab, tabPanels, tabPanel } from './tabs-styles';

  interface TabItem {
    id: string;
    label: string;
    content: string | (() => Promise<string>); // Support lazy loading
    disabled?: boolean;
  }

  interface Props {
    tabs: TabItem[];
    variant?: 'underline' | 'pills' | 'enclosed';
    orientation?: 'horizontal' | 'vertical';
    theme?: 'light' | 'dark';
    defaultTab?: string;
    onChange?: (tabId: string) => void;
  }

  let {
    tabs,
    variant = 'underline',
    orientation = 'horizontal',
    theme = 'light',
    defaultTab,
    onChange,
  }: Props = $props();

  // Active tab state
  let activeTabId = $state(defaultTab || tabs[0]?.id);

  // Lazy loaded content cache
  let loadedContent = $state<Map<string, string>>(new Map());

  // Set active tab
  function setActiveTab(tabId: string) {
    const targetTab = tabs.find((t) => t.id === tabId);
    if (targetTab?.disabled) return;

    activeTabId = tabId;
    onChange?.(tabId);

    // Load content if it's a function
    const tabContent = targetTab?.content;
    if (typeof tabContent === 'function' && !loadedContent.has(tabId)) {
      tabContent().then((content) => {
        loadedContent.set(tabId, content);
        loadedContent = new Map(loadedContent);
      });
    }
  }

  // Get content for a tab (handle lazy loading)
  function getContent(tabItem: TabItem): string {
    if (typeof tabItem.content === 'string') {
      return tabItem.content;
    }
    return loadedContent.get(tabItem.id) || 'Loading...';
  }

  // Keyboard navigation
  function handleKeyDown(event: KeyboardEvent, currentIndex: number) {
    const { key } = event;
    let newIndex = currentIndex;

    if (key === 'ArrowRight' && orientation === 'horizontal') {
      event.preventDefault();
      newIndex = (currentIndex + 1) % tabs.length;
    } else if (key === 'ArrowLeft' && orientation === 'horizontal') {
      event.preventDefault();
      newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (key === 'ArrowDown' && orientation === 'vertical') {
      event.preventDefault();
      newIndex = (currentIndex + 1) % tabs.length;
    } else if (key === 'ArrowUp' && orientation === 'vertical') {
      event.preventDefault();
      newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (key === 'Home') {
      event.preventDefault();
      newIndex = 0;
    } else if (key === 'End') {
      event.preventDefault();
      newIndex = tabs.length - 1;
    } else {
      return;
    }

    // Skip disabled tabs
    while (tabs[newIndex]?.disabled && newIndex !== currentIndex) {
      newIndex = key === 'ArrowRight' || key === 'ArrowDown'
        ? (newIndex + 1) % tabs.length
        : (newIndex - 1 + tabs.length) % tabs.length;
    }

    if (!tabs[newIndex]?.disabled) {
      setActiveTab(tabs[newIndex].id);
      document.getElementById(`tab-${tabs[newIndex].id}`)?.focus();
    }
  }
</script>

<div>
  <div
    role="tablist"
    aria-orientation={orientation}
    class={tabList({ variant, orientation, theme })}
  >
    {#each tabs as tabItem, index (tabItem.id)}
      <button
        id="tab-{tabItem.id}"
        role="tab"
        type="button"
        aria-selected={activeTabId === tabItem.id}
        aria-controls="panel-{tabItem.id}"
        tabindex={activeTabId === tabItem.id ? 0 : -1}
        disabled={tabItem.disabled}
        class={tab({
          variant,
          active: activeTabId === tabItem.id,
          disabled: tabItem.disabled,
          theme,
        })}
        onclick={() => setActiveTab(tabItem.id)}
        onkeydown={(e) => handleKeyDown(e, index)}
      >
        {tabItem.label}
      </button>
    {/each}
  </div>

  <div class={tabPanels({ variant, theme })}>
    {#each tabs as tabItem (tabItem.id)}
      <div
        id="panel-{tabItem.id}"
        role="tabpanel"
        aria-labelledby="tab-{tabItem.id}"
        tabindex={0}
        class={tabPanel({ hidden: activeTabId !== tabItem.id, theme })}
      >
        {getContent(tabItem)}
      </div>
    {/each}
  </div>
</div>
```

## Usage Example

```svelte
<script lang="ts">
  import Tabs from './Tabs.svelte';

  const productTabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: `
        <h2>Product Overview</h2>
        <p>Discover the key features and benefits of our product.</p>
      `,
    },
    {
      id: 'specs',
      label: 'Specifications',
      content: async () => {
        // Lazy load content
        const response = await fetch('/api/product/specs');
        return await response.text();
      },
    },
    {
      id: 'reviews',
      label: 'Reviews',
      content: `
        <h2>Customer Reviews</h2>
        <p>See what our customers are saying about this product.</p>
      `,
    },
    {
      id: 'support',
      label: 'Support',
      content: `
        <h2>Support & Documentation</h2>
        <p>Get help and access documentation for this product.</p>
      `,
      disabled: true, // Coming soon
    },
  ];

  function handleTabChange(tabId: string) {
    console.log('Active tab:', tabId);
    // Track analytics, update URL, etc.
  }
</script>

<Tabs
  tabs={productTabs}
  variant="underline"
  theme="light"
  defaultTab="overview"
  onChange={handleTabChange}
/>
```

## Accessibility Features

### ARIA Attributes

- `role="tablist"`: Identifies the tab container
- `role="tab"`: Identifies each tab button
- `role="tabpanel"`: Identifies each content panel
- `aria-selected`: Indicates the active tab
- `aria-controls`: Links tab to its panel
- `aria-labelledby`: Links panel to its tab
- `aria-orientation`: Indicates horizontal or vertical layout

### Keyboard Navigation

- **Arrow Right/Down**: Move to next tab
- **Arrow Left/Up**: Move to previous tab
- **Home**: Move to first tab
- **End**: Move to last tab
- **Tab**: Move focus to active panel or next focusable element

### Focus Management

- Only active tab is in tab order (`tabindex`)
- Automatic focus ring application
- Focus panel when activated
- Skip disabled tabs in keyboard navigation

### Motion Preferences

- Respects `prefers-reduced-motion`
- Removes fade animations when user prefers reduced motion

## Advanced Features

### With Design Tokens

```typescript
const tab = createStyleSet({
  base: 'px-4 py-2 font-medium',
  variants: {
    active: {
      true: 'border-{color.primary} text-{color.primary}',
      false: 'border-transparent text-{color.muted} hover:text-{color.text}',
    },
  },
  tokens: {
    color: {
      primary: 'blue-600',
      text: 'gray-900',
      muted: 'gray-600',
    },
  },
  themes: {
    dark: {
      tokens: {
        color: {
          primary: 'blue-400',
          text: 'gray-100',
          muted: 'gray-400',
        },
      },
    },
  },
});
```

### URL-based Tab Navigation

```svelte
<script lang="ts">
  import { page } from '$app/stores'; // SvelteKit example
  import Tabs from './Tabs.svelte';

  let activeTab = $state($page.url.searchParams.get('tab') || 'overview');

  function handleTabChange(tabId: string) {
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tabId);
    window.history.pushState({}, '', url);
  }
</script>

<Tabs tabs={productTabs} defaultTab={activeTab} onChange={handleTabChange} />
```

### With Icons

```typescript
interface TabItem {
  id: string;
  label: string;
  icon?: string; // Icon component or SVG path
  content: string;
}
```

```svelte
<button class={tab({ ... })}>
  {#if tabItem.icon}
    <span class="mr-2">{@html tabItem.icon}</span>
  {/if}
  {tabItem.label}
</button>
```

### Vertical Tabs

```svelte
<Tabs
  tabs={settingsTabs}
  variant="pills"
  orientation="vertical"
  theme="light"
/>
```

## Testing

```typescript
import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Tabs from './Tabs.svelte';

describe('Tabs', () => {
  const tabs = [
    { id: '1', label: 'Tab 1', content: 'Content 1' },
    { id: '2', label: 'Tab 2', content: 'Content 2' },
    { id: '3', label: 'Tab 3', content: 'Content 3', disabled: true },
  ];

  it('should render all tabs', () => {
    const { getByText } = render(Tabs, { tabs });
    expect(getByText('Tab 1')).toBeInTheDocument();
    expect(getByText('Tab 2')).toBeInTheDocument();
    expect(getByText('Tab 3')).toBeInTheDocument();
  });

  it('should activate tab when clicked', async () => {
    const { getByText } = render(Tabs, { tabs });

    const tab2 = getByText('Tab 2').closest('button');
    await fireEvent.click(tab2!);

    expect(tab2?.getAttribute('aria-selected')).toBe('true');
    expect(getByText('Content 2')).toBeVisible();
  });

  it('should not activate disabled tab', async () => {
    const { getByText } = render(Tabs, { tabs });

    const tab3 = getByText('Tab 3').closest('button');
    await fireEvent.click(tab3!);

    expect(tab3?.getAttribute('aria-selected')).toBe('false');
  });

  it('should handle keyboard navigation', async () => {
    const { getByText } = render(Tabs, { tabs });

    const tab1 = getByText('Tab 1').closest('button');
    tab1?.focus();

    await fireEvent.keyDown(tab1!, { key: 'ArrowRight' });

    const tab2 = getByText('Tab 2').closest('button');
    expect(document.activeElement).toBe(tab2);
    expect(tab2?.getAttribute('aria-selected')).toBe('true');
  });

  it('should skip disabled tabs in keyboard navigation', async () => {
    const { getByText } = render(Tabs, { tabs });

    const tab2 = getByText('Tab 2').closest('button');
    tab2?.focus();

    await fireEvent.keyDown(tab2!, { key: 'ArrowRight' });

    // Should skip tab 3 (disabled) and wrap to tab 1
    const tab1 = getByText('Tab 1').closest('button');
    expect(document.activeElement).toBe(tab1);
  });
});
```

## Best Practices

1. **Use semantic labels** that clearly describe tab content
2. **Provide keyboard navigation** for accessibility
3. **Keep content concise** in each tab panel
4. **Use consistent tab count** (avoid adding/removing tabs dynamically)
5. **Consider lazy loading** for heavy content
6. **Maintain state** when switching between tabs
7. **Sync with URL** for deep linking when appropriate
8. **Test with screen readers** to ensure proper announcements

## Related Patterns

- [Accordion Demo](./accordion.md) - Alternative progressive disclosure
- [Expandable Cards Demo](./expandable-cards.md) - Grid-based disclosure
- [Accessibility Guide](../guides/accessibility.md) - Full accessibility guide

## Resources

- [ARIA Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- [Inclusive Components: Tabbed Interfaces](https://inclusive-components.design/tabbed-interfaces/)
- [MDN: ARIA tablist role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tablist_role)
