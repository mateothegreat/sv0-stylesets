# Expandable Cards Demo - Progressive Disclosure

This demo showcases expandable card components built with StyleSets, demonstrating progressive disclosure in a grid layout with smooth animations, state management, and accessibility features.

## Overview

Expandable cards present a summary view in a grid or list, allowing users to expand individual cards to reveal more details. This pattern is ideal for product catalogs, team directories, portfolios, and feature showcases.

## Features

- ✅ Type-safe card variants (compact, comfortable, spacious)
- ✅ Smooth expand/collapse animations with reduced motion support
- ✅ Keyboard navigation and focus management
- ✅ ARIA attributes for expanded state
- ✅ Grid and list layout options
- ✅ Multiple cards can expand simultaneously
- ✅ Theme support with design tokens
- ✅ Image lazy loading support

## Style Configuration

```typescript
import { createStyleSet } from '@sv0/stylesets';

// Card grid container
const cardGrid = createStyleSet({
  base: 'grid gap-6',
  variants: {
    columns: {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    },
    layout: {
      grid: '',
      list: 'grid-cols-1',
    },
  },
  defaultVariants: {
    columns: 3,
    layout: 'grid',
  },
});

// Individual card
const card = createStyleSet({
  base: 'rounded-lg border shadow-sm transition-all overflow-hidden',
  variants: {
    expanded: {
      true: 'shadow-lg ring-2',
      false: 'hover:shadow-md',
    },
    variant: {
      compact: 'p-4',
      comfortable: 'p-6',
      spacious: 'p-8',
    },
    theme: {
      light: 'bg-white border-gray-200',
      dark: 'bg-gray-800 border-gray-700',
    },
    interactive: {
      true: 'cursor-pointer',
      false: '',
    },
  },
  compoundVariants: [
    {
      expanded: true,
      theme: 'light',
      class: 'ring-blue-500 border-blue-500',
    },
    {
      expanded: true,
      theme: 'dark',
      class: 'ring-blue-400 border-blue-400',
    },
    {
      expanded: false,
      interactive: true,
      theme: 'light',
      class: 'hover:border-gray-300',
    },
    {
      expanded: false,
      interactive: true,
      theme: 'dark',
      class: 'hover:border-gray-600',
    },
  ],
  defaultVariants: {
    expanded: false,
    variant: 'comfortable',
    theme: 'light',
    interactive: true,
  },
  accessibility: {
    focusRing: {
      default: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
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

// Card header
const cardHeader = createStyleSet({
  base: 'flex items-start justify-between gap-4',
  variants: {
    variant: {
      compact: 'mb-2',
      comfortable: 'mb-4',
      spacious: 'mb-6',
    },
  },
  defaultVariants: {
    variant: 'comfortable',
  },
});

// Card title
const cardTitle = createStyleSet({
  base: 'font-semibold',
  variants: {
    variant: {
      compact: 'text-base',
      comfortable: 'text-lg',
      spacious: 'text-xl',
    },
    theme: {
      light: 'text-gray-900',
      dark: 'text-gray-100',
    },
  },
  defaultVariants: {
    variant: 'comfortable',
    theme: 'light',
  },
});

// Card summary
const cardSummary = createStyleSet({
  base: 'line-clamp-2',
  variants: {
    variant: {
      compact: 'text-sm',
      comfortable: 'text-base',
      spacious: 'text-lg',
    },
    theme: {
      light: 'text-gray-600',
      dark: 'text-gray-400',
    },
    expanded: {
      true: 'line-clamp-none',
      false: 'line-clamp-2',
    },
  },
  defaultVariants: {
    variant: 'comfortable',
    theme: 'light',
    expanded: false,
  },
});

// Card expanded content
const cardExpandedContent = createStyleSet({
  base: 'overflow-hidden transition-all',
  variants: {
    expanded: {
      true: 'max-h-screen opacity-100 mt-4',
      false: 'max-h-0 opacity-0',
    },
    variant: {
      compact: 'mt-2',
      comfortable: 'mt-4',
      spacious: 'mt-6',
    },
    theme: {
      light: 'text-gray-700',
      dark: 'text-gray-300',
    },
  },
  defaultVariants: {
    expanded: false,
    variant: 'comfortable',
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

// Expand/collapse button
const expandButton = createStyleSet({
  base: 'flex items-center justify-center rounded-full p-1 transition-colors',
  variants: {
    theme: {
      light: 'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
      dark: 'text-gray-500 hover:text-gray-300 hover:bg-gray-700',
    },
    expanded: {
      true: 'transform rotate-180',
      false: 'transform rotate-0',
    },
  },
  defaultVariants: {
    theme: 'light',
    expanded: false,
  },
  accessibility: {
    focusRing: {
      default: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      auto: true,
    },
    reducedMotion: {
      replace: {
        'transition-colors': 'transition-none',
        'transform': '',
        'rotate-180': '',
        'rotate-0': '',
      },
      auto: true,
    },
  },
});

// Card image
const cardImage = createStyleSet({
  base: 'w-full object-cover rounded',
  variants: {
    variant: {
      compact: 'h-32 mb-2',
      comfortable: 'h-48 mb-4',
      spacious: 'h-64 mb-6',
    },
    expanded: {
      true: 'h-64',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'comfortable',
    expanded: false,
  },
});
```

## Svelte 5 Implementation

```svelte
<script lang="ts">
  import {
    cardGrid,
    card,
    cardHeader,
    cardTitle,
    cardSummary,
    cardExpandedContent,
    expandButton,
    cardImage,
  } from './card-styles';

  interface CardItem {
    id: string;
    title: string;
    summary: string;
    content: string;
    image?: string;
    imageAlt?: string;
  }

  interface Props {
    cards: CardItem[];
    columns?: 1 | 2 | 3 | 4;
    layout?: 'grid' | 'list';
    variant?: 'compact' | 'comfortable' | 'spacious';
    theme?: 'light' | 'dark';
    allowMultiple?: boolean;
  }

  let {
    cards,
    columns = 3,
    layout = 'grid',
    variant = 'comfortable',
    theme = 'light',
    allowMultiple = true,
  }: Props = $props();

  // Track expanded cards
  let expandedIds = $state<Set<string>>(new Set());

  function toggleCard(id: string) {
    if (expandedIds.has(id)) {
      expandedIds.delete(id);
    } else {
      if (!allowMultiple) {
        expandedIds.clear();
      }
      expandedIds.add(id);
    }
    expandedIds = new Set(expandedIds);
  }

  function isExpanded(id: string): boolean {
    return expandedIds.has(id);
  }

  function handleKeyDown(event: KeyboardEvent, id: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleCard(id);
    }
  }

  function handleExpandButtonClick(event: Event, id: string) {
    event.stopPropagation();
    toggleCard(id);
  }
</script>

<div class={cardGrid({ columns, layout })}>
  {#each cards as cardItem (cardItem.id)}
    <article
      class={card({ expanded: isExpanded(cardItem.id), variant, theme, interactive: true })}
      tabindex={0}
      role="button"
      aria-expanded={isExpanded(cardItem.id)}
      onclick={() => toggleCard(cardItem.id)}
      onkeydown={(e) => handleKeyDown(e, cardItem.id)}
    >
      {#if cardItem.image}
        <img
          src={cardItem.image}
          alt={cardItem.imageAlt || ''}
          loading="lazy"
          class={cardImage({ variant, expanded: isExpanded(cardItem.id) })}
        />
      {/if}

      <div class={cardHeader({ variant })}>
        <h3 class={cardTitle({ variant, theme })}>
          {cardItem.title}
        </h3>

        <button
          type="button"
          aria-label={isExpanded(cardItem.id) ? 'Collapse card' : 'Expand card'}
          class={expandButton({ theme, expanded: isExpanded(cardItem.id) })}
          onclick={(e) => handleExpandButtonClick(e, cardItem.id)}
        >
          <svg
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
      </div>

      <p class={cardSummary({ variant, theme, expanded: isExpanded(cardItem.id) })}>
        {cardItem.summary}
      </p>

      <div class={cardExpandedContent({ expanded: isExpanded(cardItem.id), variant, theme })}>
        {@html cardItem.content}
      </div>
    </article>
  {/each}
</div>
```

## Usage Example

```svelte
<script lang="ts">
  import ExpandableCards from './ExpandableCards.svelte';

  const teamMembers = [
    {
      id: 'member-1',
      title: 'Sarah Johnson',
      summary: 'Senior Software Engineer with 10+ years of experience in full-stack development.',
      content: `
        <p><strong>Specialties:</strong> React, TypeScript, Node.js, GraphQL</p>
        <p><strong>Education:</strong> BS Computer Science, MIT</p>
        <p><strong>Contact:</strong> sarah.johnson@example.com</p>
      `,
      image: '/images/team/sarah.jpg',
      imageAlt: 'Photo of Sarah Johnson',
    },
    {
      id: 'member-2',
      title: 'Marcus Chen',
      summary: 'Product Designer focused on creating intuitive and accessible user experiences.',
      content: `
        <p><strong>Specialties:</strong> UI/UX Design, Accessibility, Design Systems</p>
        <p><strong>Education:</strong> MFA Design, Rhode Island School of Design</p>
        <p><strong>Contact:</strong> marcus.chen@example.com</p>
      `,
      image: '/images/team/marcus.jpg',
      imageAlt: 'Photo of Marcus Chen',
    },
    {
      id: 'member-3',
      title: 'Emily Rodriguez',
      summary: 'DevOps Engineer specializing in cloud infrastructure and automation.',
      content: `
        <p><strong>Specialties:</strong> AWS, Kubernetes, CI/CD, Infrastructure as Code</p>
        <p><strong>Education:</strong> BS Systems Engineering, Stanford</p>
        <p><strong>Contact:</strong> emily.rodriguez@example.com</p>
      `,
      image: '/images/team/emily.jpg',
      imageAlt: 'Photo of Emily Rodriguez',
    },
  ];
</script>

<ExpandableCards
  cards={teamMembers}
  columns={3}
  variant="comfortable"
  theme="light"
  allowMultiple={true}
/>
```

## Accessibility Features

### ARIA Attributes

- `aria-expanded`: Indicates whether card is expanded
- `role="button"`: Identifies card as interactive
- `aria-label`: Provides accessible name for expand button
- `tabindex`: Makes cards keyboard accessible

### Keyboard Navigation

- **Enter/Space**: Toggle card expansion
- **Tab**: Navigate between cards
- **Shift+Tab**: Navigate backwards

### Focus Management

- Automatic focus ring application
- Visual focus indicators
- Focus preserved when toggling

### Motion Preferences

- Respects `prefers-reduced-motion`
- Removes transitions when user prefers reduced motion
- Instant expand/collapse for accessibility

## Advanced Features

### With Design Tokens

```typescript
const card = createStyleSet({
  base: 'rounded-lg border shadow-sm',
  variants: {
    expanded: {
      true: 'shadow-{shadow.lg} ring-2 ring-{color.primary}',
      false: 'hover:shadow-{shadow.md}',
    },
  },
  tokens: {
    color: {
      primary: 'blue-500',
      background: 'white',
      border: 'gray-200',
    },
    shadow: {
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
    },
  },
  themes: {
    dark: {
      tokens: {
        color: {
          primary: 'blue-400',
          background: 'gray-800',
          border: 'gray-700',
        },
      },
    },
  },
});
```

### Animated Grid Layout

When a card expands, you can animate the grid to accommodate the larger content:

```typescript
const cardGrid = createStyleSet({
  base: 'grid gap-6 transition-all',
  variants: {
    columns: {
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    },
    hasExpanded: {
      true: 'grid-cols-1', // Full width when any card is expanded
      false: '',
    },
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
```

### With Filters and Search

```svelte
<script lang="ts">
  let searchQuery = $state('');
  let selectedCategory = $state<string | null>(null);

  const filteredCards = $derived(
    cards.filter((card) => {
      const matchesSearch = card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           card.summary.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || card.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
  );
</script>

<div class="mb-6 flex gap-4">
  <input
    type="search"
    placeholder="Search cards..."
    bind:value={searchQuery}
    class="flex-1 px-4 py-2 border rounded-lg"
  />

  <select bind:value={selectedCategory} class="px-4 py-2 border rounded-lg">
    <option value={null}>All Categories</option>
    <option value="engineering">Engineering</option>
    <option value="design">Design</option>
    <option value="product">Product</option>
  </select>
</div>

<ExpandableCards cards={filteredCards} columns={3} />
```

### Masonry Layout

For cards with varying heights, use a masonry layout:

```typescript
const cardGrid = createStyleSet({
  base: 'columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6',
  variants: {
    columnWidth: {
      narrow: 'columns-xs',
      normal: 'columns-sm',
      wide: 'columns-md',
    },
  },
});

const card = createStyleSet({
  base: 'break-inside-avoid mb-6',
  // ... rest of card styles
});
```

## Testing

```typescript
import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import ExpandableCards from './ExpandableCards.svelte';

describe('ExpandableCards', () => {
  const cards = [
    { id: '1', title: 'Card 1', summary: 'Summary 1', content: 'Content 1' },
    { id: '2', title: 'Card 2', summary: 'Summary 2', content: 'Content 2' },
  ];

  it('should render all cards', () => {
    const { getByText } = render(ExpandableCards, { cards });
    expect(getByText('Card 1')).toBeInTheDocument();
    expect(getByText('Card 2')).toBeInTheDocument();
  });

  it('should expand card when clicked', async () => {
    const { getByText } = render(ExpandableCards, { cards });

    const card1 = getByText('Card 1').closest('article');
    await fireEvent.click(card1!);

    expect(card1?.getAttribute('aria-expanded')).toBe('true');
    expect(getByText('Content 1')).toBeVisible();
  });

  it('should collapse other cards when allowMultiple is false', async () => {
    const { getByText } = render(ExpandableCards, { cards, allowMultiple: false });

    const card1 = getByText('Card 1').closest('article');
    const card2 = getByText('Card 2').closest('article');

    await fireEvent.click(card1!);
    await fireEvent.click(card2!);

    expect(card1?.getAttribute('aria-expanded')).toBe('false');
    expect(card2?.getAttribute('aria-expanded')).toBe('true');
  });

  it('should handle keyboard interaction', async () => {
    const { getByText } = render(ExpandableCards, { cards });

    const card1 = getByText('Card 1').closest('article');
    card1?.focus();

    await fireEvent.keyDown(card1!, { key: 'Enter' });
    expect(card1?.getAttribute('aria-expanded')).toBe('true');

    await fireEvent.keyDown(card1!, { key: ' ' });
    expect(card1?.getAttribute('aria-expanded')).toBe('false');
  });

  it('should lazy load images', () => {
    const cardsWithImages = [
      { ...cards[0], image: '/test.jpg', imageAlt: 'Test image' },
    ];
    const { getByAltText } = render(ExpandableCards, { cards: cardsWithImages });

    const img = getByAltText('Test image') as HTMLImageElement;
    expect(img.loading).toBe('lazy');
  });
});
```

## Best Practices

1. **Provide clear card titles** that describe the content
2. **Keep summaries concise** (1-2 sentences)
3. **Use lazy loading** for images to improve performance
4. **Test expansion behavior** with different content lengths
5. **Consider mobile layouts** (single column on small screens)
6. **Provide visual feedback** for interactive states
7. **Test with keyboard only** to ensure accessibility
8. **Add loading states** if content is fetched asynchronously

## Performance Tips

1. **Virtualize large lists** using `svelte-virtual` or similar
2. **Lazy load images** with `loading="lazy"`
3. **Debounce search input** when filtering cards
4. **Use CSS transitions** instead of JavaScript animations
5. **Implement pagination** for very large datasets

## Related Patterns

- [Accordion Demo](./accordion.md) - Vertical stacked disclosure
- [Tabs Demo](./tabs.md) - Tabbed interface disclosure
- [Accessibility Guide](../guides/accessibility.md) - Full accessibility guide

## Resources

- [ARIA Disclosure Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)
- [Cards - Inclusive Components](https://inclusive-components.design/cards/)
- [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
