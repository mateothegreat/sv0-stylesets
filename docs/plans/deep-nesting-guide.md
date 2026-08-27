# Deep Nesting Guide

The StyleSets variant system now supports unlimited nesting levels, allowing you
to create complex, hierarchical styling structures for sophisticated component
theming.

## Core Concepts

### Simple Variants (Backward Compatible)

Traditional string-based variants continue to work exactly as before:

```typescript
import { defineVariants } from "@mateothegreat/stylesets";

const button = defineVariants({
  base: "font-semibold border rounded transition-colors",
  variants: {
    size: {
      sm: "px-2 py-1 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg"
    },
    variant: {
      primary: "bg-blue-500 text-white hover:bg-blue-600",
      secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300"
    }
  },
  defaultVariants: {
    size: "md",
    variant: "primary"
  }
});

// Usage remains the same
const classes = button({ size: "lg", variant: "secondary" });
console.log(classes.toString());
// "font-semibold border rounded transition-colors px-6 py-3 text-lg bg-gray-200 text-gray-900 hover:bg-gray-300"
```

### Deep Nested Variants

Create complex nested structures for component parts:

```typescript
const dialogTheme = defineVariants({
  variants: {
    size: {
      sm: {
        container: {
          width: "max-w-sm",
          padding: "p-4"
        },
        content: {
          spacing: "space-y-2"
        }
      },
      lg: {
        container: {
          width: "max-w-4xl",
          padding: "p-8"
        },
        content: {
          spacing: "space-y-6"
        }
      }
    },
    variant: {
      default: {
        container: {
          background: "bg-white",
          border: "border border-gray-200"
        }
      },
      destructive: {
        container: {
          background: "bg-red-50",
          border: "border border-red-200"
        }
      }
    }
  },
  defaultVariants: {
    size: "sm",
    variant: "default"
  }
});

// Access nested structure
const styles = dialogTheme({ size: "lg", variant: "destructive" });
console.log(styles.size.container.width.toString()); // "max-w-4xl"
console.log(styles.variant.container.background.toString()); // "bg-red-50"
```

### Mixed Simple and Nested Variants

You can combine both simple and nested variants in the same configuration:

```typescript
const mixedVariants = defineVariants({
  variants: {
    // Nested variant for complex theming
    theme: {
      light: {
        header: "bg-white text-black",
        content: "bg-gray-50",
        sidebar: "bg-gray-100"
      },
      dark: {
        header: "bg-black text-white",
        content: "bg-gray-900",
        sidebar: "bg-gray-800"
      }
    },
    // Simple variant for basic styling
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg"
    }
  }
});

const result = mixedVariants({ theme: "dark", size: "lg" });
console.log(result.theme.header.toString()); // "bg-black text-white"
console.log(result.size.toString()); // "text-lg"
```

## Base Classes with Deep Nesting

Base classes can also be deeply nested to provide foundational styles:

```typescript
const componentTheme = defineVariants({
  base: {
    layout: {
      container: "relative overflow-hidden",
      header: "flex items-center justify-between",
      content: "flex-1"
    },
    typography: {
      heading: "font-bold",
      body: "text-sm"
    }
  },
  variants: {
    size: {
      compact: {
        layout: {
          container: "p-2",
          header: "h-8"
        },
        typography: {
          heading: "text-sm",
          body: "text-xs"
        }
      },
      comfortable: {
        layout: {
          container: "p-6",
          header: "h-12"
        },
        typography: {
          heading: "text-lg",
          body: "text-base"
        }
      }
    }
  }
});

const styles = componentTheme({ size: "comfortable" });
// Base and variant classes are automatically merged
console.log(styles.layout.container.toString());
// "relative overflow-hidden p-6"
```

## Real-World Use Cases

### 1. Dialog/Modal Component

```typescript
export const dialogVariants = defineVariants({
  base: {
    overlay: "fixed inset-0 z-50 bg-black/50",
    container: "fixed inset-0 z-50 flex items-center justify-center p-4",
    content: "relative bg-white rounded-lg shadow-lg"
  },
  variants: {
    size: {
      sm: {
        content: "max-w-sm w-full p-4"
      },
      md: {
        content: "max-w-md w-full p-6"
      },
      lg: {
        content: "max-w-2xl w-full p-8"
      },
      xl: {
        content: "max-w-4xl w-full p-8"
      }
    },
    variant: {
      default: {
        content: "border border-gray-200"
      },
      destructive: {
        content: "border border-red-200 bg-red-50"
      },
      success: {
        content: "border border-green-200 bg-green-50"
      }
    }
  },
  defaultVariants: {
    size: "md",
    variant: "default"
  }
});

// Usage in component
function Dialog({ size, variant, children }) {
  const styles = dialogVariants({ size, variant });

  return (
    <>
      <div className={styles.overlay.toString()} />
      <div className={styles.container.toString()}>
        <div className={styles.content.toString()}>
          {children}
        </div>
      </div>
    </>
  );
}
```

### 2. Card Component with Complex Layout

```typescript
export const cardVariants = defineVariants({
  base: {
    container: "overflow-hidden rounded-lg",
    header: "border-b",
    content: "flex-1",
    footer: "border-t bg-gray-50"
  },
  variants: {
    variant: {
      default: {
        container: "bg-white border border-gray-200",
        header: "bg-gray-50 border-gray-200 px-6 py-4",
        content: "px-6 py-4",
        footer: "border-gray-200 px-6 py-4"
      },
      elevated: {
        container: "bg-white shadow-lg",
        header: "bg-white px-6 py-4",
        content: "px-6 py-4",
        footer: "bg-white px-6 py-4"
      },
      outlined: {
        container: "bg-transparent border-2 border-gray-300",
        header: "bg-transparent border-gray-300 px-6 py-4",
        content: "px-6 py-4",
        footer: "bg-transparent border-gray-300 px-6 py-4"
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
```

### 3. Navigation Component

```typescript
export const navigationVariants = defineVariants({
  base: {
    container: "flex",
    nav: "flex-1",
    brand: "font-bold",
    links: "flex items-center space-x-4",
    link: "transition-colors",
    mobile: "block md:hidden"
  },
  variants: {
    orientation: {
      horizontal: {
        container: "flex-row items-center justify-between px-6 py-4",
        nav: "flex flex-row",
        links: "flex-row space-x-4 space-y-0"
      },
      vertical: {
        container: "flex-col space-y-6 px-6 py-8",
        nav: "flex flex-col",
        links: "flex-col space-x-0 space-y-2"
      }
    },
    theme: {
      light: {
        container: "bg-white border-b border-gray-200",
        brand: "text-gray-900",
        link: "text-gray-600 hover:text-gray-900"
      },
      dark: {
        container: "bg-gray-900 border-b border-gray-700",
        brand: "text-white",
        link: "text-gray-300 hover:text-white"
      },
      transparent: {
        container: "bg-transparent",
        brand: "text-current",
        link: "text-current/70 hover:text-current"
      }
    }
  },
  defaultVariants: {
    orientation: "horizontal",
    theme: "light"
  }
});
```

## Advanced Features

### Component Variants with Deep Nesting

The `createComponentVariant` function also supports deep nesting:

```typescript
import { createComponentVariant } from "@mateothegreat/stylesets";

// Create a component-specific variant with additional base styles
const dialogComponent = createComponentVariant(dialogVariants, {
  overlay: "animate-in fade-in duration-200",
  container: "animate-in fade-in zoom-in-95 duration-200",
  content: "animate-in fade-in slide-in-from-bottom-4 duration-300"
});

// Usage with enhanced animations
const enhancedStyles = dialogComponent({ size: "lg", variant: "destructive" });
console.log(enhancedStyles.overlay.toString());
// "fixed inset-0 z-50 bg-black/50 animate-in fade-in duration-200"
```

### Combining Deep Variant Results

```typescript
import { combineVariants } from "@mateothegreat/stylesets";

const layoutStyles = layoutVariants({ layout: "centered" });
const themeStyles = themeVariants({ theme: "dark" });

const combined = combineVariants([
  layoutStyles,
  themeStyles,
  {
    container: new VariantResult("min-h-screen"),
    content: new VariantResult("max-w-prose")
  }
]);

// Results in merged nested structure
console.log(combined.container.toString()); // All container styles merged
console.log(combined.content.toString()); // All content styles merged
```

### Conditional Deep Variants

```typescript
import { conditionalVariant } from "@mateothegreat/stylesets";

const isError = true;
const isLoading = false;

const styles = combineVariants([
  dialogVariants({ size: "md" }),
  conditionalVariant(isError, {
    content: new VariantResult("border-red-500 bg-red-50"),
    header: new VariantResult("text-red-900")
  }),
  conditionalVariant(isLoading, {
    content: new VariantResult("animate-pulse opacity-50")
  })
]);
```

## Type Safety

The deep nesting system maintains full TypeScript type safety:

```typescript
// TypeScript will infer the correct prop types
type DialogProps = Parameters<typeof dialogVariants>[0];
// { size?: "sm" | "md" | "lg" | "xl"; variant?: "default" | "destructive" | "success" }

// Access is type-safe throughout the nested structure
const styles = dialogVariants({ size: "lg", variant: "destructive" });
// styles.overlay is VariantResult
// styles.content is VariantResult
// styles.invalidProperty would be a TypeScript error
```

## Migration from Simple Variants

Existing simple variants continue to work without changes:

```typescript
// This still works exactly as before
const oldButton = defineVariants({
  base: "btn",
  variants: {
    size: { sm: "btn-sm", lg: "btn-lg" }
  }
});

// Returns VariantResult for backward compatibility
const classes = oldButton({ size: "sm" }); // VariantResult
console.log(classes.toString()); // "btn btn-sm"
```

When you need deep nesting, simply change your variant values to objects:

```typescript
// Upgrade to nested structure
const newButton = defineVariants({
  base: {
    root: "btn",
    icon: "btn-icon",
    text: "btn-text"
  },
  variants: {
    size: {
      sm: {
        root: "btn-sm",
        icon: "w-4 h-4",
        text: "text-sm"
      }
    }
  }
});

// Now returns nested object structure
const styles = newButton({ size: "sm" });
console.log(styles.root.toString()); // "btn btn-sm"
console.log(styles.icon.toString()); // "btn-icon w-4 h-4"
```

## Best Practices

1. **Start Simple**: Begin with simple variants and add nesting when needed
2. **Consistent Structure**: Keep the same structure across variant values
3. **Meaningful Names**: Use descriptive names for nested keys (container,
   content, header, etc.)
4. **Base Classes**: Use nested base classes for styles that should always be
   present
5. **Type Safety**: Let TypeScript guide you - if the types are complex,
   consider simplifying the structure

## Performance

The deep nesting system uses recursive processing but is optimized for
performance:

- **Lazy Processing**: Only processes selected variant values
- **Efficient Merging**: Base classes are merged recursively only when needed
- **Minimal Overhead**: Simple variants have almost no overhead compared to the
  original system
- **Tree Shaking**: Unused variant values are eliminated during bundling
