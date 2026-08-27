# 🎨 stylesets

> *Schema-driven CSS variant management for the modern TypeScript developer*

**stylesets** is not just another CSS-in-JS library—it's your secret weapon for building maintainable, type-safe, and scalable design systems. Think of it as the love child of TypeScript's type system and CSS utility frameworks, specifically crafted for Svelte 5 but flexible enough for any TypeScript project.

```yaml
                                                                      {
                                                        ┌               sm: "border-2",
                                                    ┌──┼┼   Variant   =  md: "border-4", 
                                                    │   └               lg: "border-6"
                                                    │                 }
                                                    │
                        ┌                           │
                   ┌───┼┼   Package: "button"    ───┤
                   │    └                           │
                   │                                │
                   │                                │                 {
                   │                                │   ┌               sm: "px-2 py-1",
                   │                                └──┼┼   Variant   =  md: "px-4 py-2",
                   │                                    └               lg: "px-6 py-3"
                   │                                                  }
                   │
StyleSet(..) ──────┤
                   │
                   │                                                  {
                   │                                    ┌               open: "max-h-96",
                   │                                ┌──┼┼   Variant   =  closed: "max-h-0",
                   │                                │   └               default: "closed"
                   │                                │                 }
                   │    ┌                           │
                   └───┼┼  Package: "accordion"  ───┤
                        └                           │
                                                    │
                                                    │                 {
                                                    │   ┌               sm: "gap-2",
                                                    └──┼┼   Variant   =  md: "gap-4",
                                                        └               lg: "gap-6"
                                                                    }
```

## 🚀 Why stylesets?

Ever found yourself wrestling with:
- **Props validation hell** in component libraries?
- **CSS class chaos** across different component variants?
- **Type safety nightmares** when passing props to deeply nested components?
- **Runtime errors** that could have been caught at compile time?

stylesets solves all of this with a delightfully simple yet powerful approach: **schema-driven variant management** with full TypeScript integration.

## ✨ Features

### 🔒 **Bulletproof Type Safety**

- **Compile-time validation** prevents invalid prop combinations.
- **Schema-driven types** that adapt as your design system evolves.
- **Strict mode support** that catches excess properties.
- **IntelliSense heaven** with auto-completion for all variants.

### 🎯 **Smart Search & Resolution**
- **Dot-notation queries** like `"button.size.md"`
- **Wildcard support** with `"button.size.*"` for all variants
- **Default value resolution** when variants aren't specified
- **Hierarchical fallbacks** that just work™

### 🛡️ **Runtime Validation**
- **Detailed error messages** for debugging bliss
- **Development-time warnings** that don't slow production
- **Schema validation** with helpful suggestions
- **Unknown property detection** to catch typos

### 🔧 **Svelte 5 Integration**
- **Native snippet support** for component composition
- **$props() compatibility** with full type inference
- **Reactive updates** that respect Svelte's reactivity
- **Component prop forwarding** that maintains type safety

## 🎯 Quick Start

Install the package:

```bash
npm install @mateothegreat/stylesets
```

Create your first styleset:

```typescript
import { StyleSet } from "@mateothegreat/stylesets";

// Define your design system schema
const styleset = new StyleSet(
  {
    fields: [
      {
        name: "size",
        values: ["sm", "md", "lg"] as const,
        required: true
      },
      {
        name: "variant",
        values: ["primary", "secondary", "ghost"] as const,
        required: false
      }
    ]
  },
  {
    button: {
      size: {
        sm: "px-2 py-1 text-sm",
        md: "px-4 py-2 text-base", 
        lg: "px-6 py-3 text-lg",
        default: "md"  // Smart defaults!
      },
      variant: {
        primary: "bg-blue-500 text-white hover:bg-blue-600",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
        ghost: "bg-transparent hover:bg-gray-100",
        default: "primary"
      }
    }
  }
);

// Use it anywhere
const buttonClasses = styleset.search("button.size.lg", "button.variant.primary");
console.log(buttonClasses.toString()); 
// → "px-6 py-3 text-lg bg-blue-500 text-white hover:bg-blue-600"
```

## 🏛️ Architecture Deep Dive

### The Hierarchy Architecture

```yaml
StyleSet                    # Your entire design system
├── Package: "button"       # Component-specific styles
│   ├── Variant: "size"     #   └── Specific style concerns
│   │   ├── sm: "px-2 py-1" #       └── Actual CSS classes
│   │   ├── md: "px-4 py-2"
│   │   └── lg: "px-6 py-3"
│   └── Variant: "color"
│       ├── primary: "bg-blue-500"
│       └── secondary: "bg-gray-500"
└── Package: "accordion"
    └── Variant: "spacing"
        └── default: "gap-4"
```


### Core Components

#### 🔸 **StyleSet** - The Design System Container
Your entire design system lives here. It manages packages, handles schema validation, and provides the main search interface.

#### 🔸 **Package** - Component-Specific Styles  
Each package represents a component (like "button", "accordion", "modal") and contains related variants.

#### 🔸 **Variant** - Style Concerns
Individual styling concerns within a package (like "size", "color", "state") with their possible values.

## 📚 Complete API Reference

### StyleSet Class

```typescript
class StyleSet<T extends Record<string, Record<string, Record<string, VariantValue>>>> {
  constructor(schema: TypeSchema, packages: T)
  
  // Search for styles using dot notation
  search(...paths: string[]): VariantResult | null
}
```

**Examples:**
```typescript
// Single variant lookup
styleset.search("button.size.md")

// Multiple variants combined
styleset.search("button.size.lg", "button.variant.primary")

// Wildcard for all variants in a category
styleset.search("button.size.*")

// Package-level defaults
styleset.search("button.size")  // Uses default if specified
```

### Package Class

```typescript
class Package<T extends Record<string, Record<string, VariantValue>>> {
  constructor(variants: T)
  
  // Search within this package
  search(...identifiers: string[]): VariantResult | null
}
```

### Variant Class

```typescript
class Variant {
  constructor(obj: Record<string, VariantValue>)
  
  // Compile a specific variant key
  compile(key?: string): VariantResult
  
  // Get all variants as a string
  toString(): string
}
```

### VariantResult Class

```typescript
class VariantResult {
  constructor(value: VariantValue | VariantValue[])
  
  // Convert to CSS class string
  toString(): string
  
  // Get the number of variant values
  get length(): number
}
```

## 🎭 Type System Magic

### Schema Definition

Define your component's prop schema with full TypeScript support:

```typescript
type ButtonSchema = TypeSchema<[
  {
    name: "size";
    values: readonly ["sm", "md", "lg"];
    required: true;
  },
  {
    name: "variant";
    values: readonly ["primary", "secondary", "ghost"];
    required: false;
  },
  {
    name: "disabled";
    values: "boolean";
    required: false;
  }
]>;
```

### Automatic Type Inference

The library automatically generates TypeScript types from your schema:

```typescript
// Automatically inferred from schema
type ButtonProps = {
  size: "sm" | "md" | "lg";        // Required
  variant?: "primary" | "secondary" | "ghost";  // Optional
  disabled?: boolean;              // Optional boolean
};
```

### Advanced Type Utilities

```typescript
// Extract just the required props
type RequiredProps<S> = { /* magic happens here */ };

// Extract just the optional props  
type OptionalProps<S> = { /* more magic */ };

// Strict props that prevent excess properties
type StrictProps<S> = SchemaProps<S> & Record<Exclude<string, keyof SchemaProps<S>>, never>;

// Flexible props that allow additional properties
type FlexibleProps<S, Extras> = SchemaProps<S> & SvelteStandardProps & Extras;
```

## 🛡️ Validation System

### Runtime Validation

Catch errors before they become bugs:

```typescript
import { validate } from "@mateothegreat/stylesets";

const result = validate(schema, {
  size: "xl",  // Invalid! Not in schema
  variant: "primary",
  unknownProp: "error"  // Invalid! Not in schema
});

if (!result.isValid) {
  console.log(result.errors);
  // [
  //   {
  //     property: "size",
  //     message: "Invalid value for property \"size\"",
  //     expectedType: "sm | md | lg",
  //     actualValue: "xl"
  //   },
  //   {
  //     property: "unknownProp", 
  //     message: "Unknown property \"unknownProp\" is not allowed",
  //     expectedType: "One of: size, variant, disabled",
  //     actualValue: "error"
  //   }
  // ]
}
```

### Development Helpers

```typescript
import { debugSchema } from "@mateothegreat/stylesets";

// Only runs in development
debugSchema(buttonSchema, "Button");
// 🎨 Schema Debug - Button
// 📋 Required Props: size: sm | md | lg
// ⚡ Optional Props: variant?: primary | secondary | ghost, disabled?: boolean
```

## 🌟 Svelte 5 Integration

### Basic Component

```svelte
<script lang="ts">
  import type { SvelteComponentProps } from "@mateothegreat/stylesets";
  import { styleset } from "./button.styles";
  
  type Props = SvelteComponentProps<typeof styleset.schema>;
  
  let { 
    size = "md",
    variant = "primary", 
    disabled = false,
    children,
    class: className,
    ...rest 
  }: Props = $props();
  
  // Get the computed styles
  $derived classes = [
    styleset.search(`button.size.${size}`).toString(),
    styleset.search(`button.variant.${variant}`).toString(),
    disabled && "opacity-50 cursor-not-allowed",
    className
  ].filter(Boolean).join(" ");
</script>

<button 
  class={classes}
  {disabled}
  {...rest}
>
  {#if children}
    {@render children()}
  {/if}
</button>
```

### Advanced Component with Prop Forwarding

```svelte
<script lang="ts">
  import type { ComponentProps } from "@mateothegreat/stylesets";
  import { Button as ButtonPrimitive } from "some-ui-library";
  import { styleset } from "./button.styles";
  
  // Combine your schema props with the underlying component's props
  type Props = ComponentProps<
    typeof styleset.schema, 
    [ButtonPrimitive.Props]
  >;
  
  let { 
    size,
    variant,
    children,
    ...primitiveProps 
  }: Props = $props();
</script>

<ButtonPrimitive 
  class={styleset.search(`button.size.${size}`, `button.variant.${variant}`).toString()}
  {...primitiveProps}
>
  {@render children?.()}
</ButtonPrimitive>
```

### Schema-Driven Props Factory

```typescript
import { createSvelteProps } from "@mateothegreat/stylesets";

const buttonProps = createSvelteProps(buttonSchema, "Button");

// Validate props at runtime
const result = buttonProps.validate({
  size: "lg",
  variant: "primary"
});

if (result.isValid) {
  // result.props is fully typed!
  console.log(result.props.size);  // TypeScript knows this is "sm" | "md" | "lg"
}
```

## 🎨 Advanced Patterns

### Complex Variants with Arrays

```typescript
const styleset = new StyleSet(schema, {
  card: {
    elevated: {
      light: [
        "bg-white",
        "shadow-lg", 
        "border",
        "border-gray-200"
      ],
      dark: [
        "bg-gray-800",
        "shadow-xl",
        "border",
        "border-gray-700"
      ],
      default: "light"
    }
  }
});
```

### Conditional Styling

```typescript
// Get styles based on conditions
const getCardStyles = (elevated: boolean, theme: "light" | "dark") => {
  const baseStyles = styleset.search("card.base").toString();
  const elevationStyles = elevated 
    ? styleset.search(`card.elevated.${theme}`).toString()
    : "";
    
  return [baseStyles, elevationStyles].filter(Boolean).join(" ");
};
```

### Dynamic Variant Resolution

```typescript
// Search with dynamic paths
const searchVariant = (component: string, property: string, value: string) => {
  return styleset.search(`${component}.${property}.${value}`);
};

// Use with computed values
$derived buttonClasses = searchVariant("button", "size", currentSize).toString();
```

### Default Value Strategies

```typescript
const styleset = new StyleSet(schema, {
  button: {
    size: {
      sm: "px-2 py-1",
      md: "px-4 py-2", 
      lg: "px-6 py-3",
      default: "md"  // 1. Direct default
    },
    variant: {
      primary: "bg-blue-500",
      secondary: "bg-gray-500",
      default: "primary"  // 2. Reference to another variant
    },
    state: {
      hover: "hover:scale-105",
      focus: "focus:ring-2",
      // 3. No default - returns empty when not specified
    }
  }
});

// All of these work:
styleset.search("button.size");           // → "px-4 py-2" (uses default: "md")
styleset.search("button.variant");       // → "bg-blue-500" (uses default: "primary") 
styleset.search("button.state");         // → "" (no default specified)
```

## 🚀 Real-World Examples

### Design System Foundation

```typescript
// design-system.ts
export const designSystem = new StyleSet(
  {
    fields: [
      { name: "size", values: ["xs", "sm", "md", "lg", "xl"] as const, required: true },
      { name: "color", values: ["primary", "secondary", "success", "warning", "error"] as const },
      { name: "variant", values: ["solid", "outline", "ghost"] as const },
      { name: "rounded", values: ["none", "sm", "md", "lg", "full"] as const }
    ]
  },
  {
    // Base spacing system
    spacing: {
      size: {
        xs: "gap-1",
        sm: "gap-2", 
        md: "gap-4",
        lg: "gap-6",
        xl: "gap-8",
        default: "md"
      }
    },
    
    // Typography system
    typography: {
      size: {
        xs: "text-xs leading-4",
        sm: "text-sm leading-5",
        md: "text-base leading-6", 
        lg: "text-lg leading-7",
        xl: "text-xl leading-8",
        default: "md"
      }
    },
    
    // Button system
    button: {
      size: {
        xs: "px-2 py-1 text-xs",
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg", 
        xl: "px-8 py-4 text-xl",
        default: "md"
      },
      color: {
        primary: "bg-blue-500 text-white hover:bg-blue-600",
        secondary: "bg-gray-500 text-white hover:bg-gray-600",
        success: "bg-green-500 text-white hover:bg-green-600",
        warning: "bg-yellow-500 text-white hover:bg-yellow-600",
        error: "bg-red-500 text-white hover:bg-red-600",
        default: "primary"
      },
      variant: {
        solid: "",  // Base styling handled by color
        outline: "bg-transparent border-2 border-current",
        ghost: "bg-transparent hover:bg-opacity-10",
        default: "solid"
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg", 
        full: "rounded-full",
        default: "md"
      }
    }
  }
);
```

### Accordion Component

```svelte
<!-- Accordion.svelte -->
<script lang="ts">
  import type { SvelteComponentProps } from "@mateothegreat/stylesets";
  import { Accordion as AccordionPrimitive } from "bits-ui";
  import type { Snippet } from "svelte";
  import { styleset } from "./accordion.styles";

  type Props = SvelteComponentProps<
    typeof styleset.schema,
    [
      AccordionPrimitive.RootProps,
      {
        children?: Snippet;
        type?: "single" | "multiple";
        size?: "sm" | "md" | "lg";
        class?: string;
      }
    ]
  >;

  let {
    size = "md",
    class: className,
    type: accordionType = "single",
    children,
    ref = $bindable(),
    value = $bindable(),
    ...rest
  }: Props = $props();

  // Compute classes reactively
  $derived rootClasses = [
    styleset.search(`root.${size}.spacing`).toString(),
    styleset.search(`root.${size}.outline`).toString(),
    className
  ].filter(Boolean).join(" ");
</script>

<AccordionPrimitive.Root
  bind:ref
  bind:value
  type={accordionType}
  class={rootClasses}
  data-size={size}
  {...rest}
>
  {#if children}
    {@render children()}
  {/if}
</AccordionPrimitive.Root>
```

### Form Component with Validation

```svelte
<!-- FormField.svelte -->
<script lang="ts">
  import type { SvelteComponentProps } from "@mateothegreat/stylesets";
  import { validate } from "@mateothegreat/stylesets";
  import { styleset } from "./form.styles";

  type Props = SvelteComponentProps<typeof styleset.schema>;

  let {
    size = "md",
    variant = "default",
    error = false,
    required = false,
    label,
    help,
    ...rest
  }: Props = $props();

  // Validate props in development
  $effect(() => {
    if (import.meta.env.DEV) {
      const result = validate(styleset.schema, { size, variant, error, required });
      if (!result.isValid) {
        console.warn("FormField validation errors:", result.errors);
      }
    }
  });

  $derived fieldClasses = [
    styleset.search(`field.${size}.base`).toString(),
    styleset.search(`field.variant.${variant}`).toString(),
    error && styleset.search("field.state.error").toString(),
    required && styleset.search("field.state.required").toString()
  ].filter(Boolean).join(" ");
</script>

<div class={fieldClasses}>
  {#if label}
    <label>{label}</label>
  {/if}
  
  <input {...rest} />
  
  {#if help}
    <span class="help-text">{help}</span>
  {/if}
  
  {#if error}
    <span class="error-text">{error}</span>
  {/if}
</div>
```

## 🔧 Utilities & Helpers

### Path Parsing

```typescript
import { identify } from "@mateothegreat/stylesets";

const path = identify("button.size.lg");
console.log(path.package);   // null (no package specified)
console.log(path.variant);   // "button" 
console.log(path.variation); // "size.lg"

const fullPath = identify("accordion.spacing.md");
console.log(fullPath.package);   // "accordion"
console.log(fullPath.variant);   // "spacing"
console.log(fullPath.variation); // "md"
```

### Validation Helpers

```typescript
import { format, evaluate } from "@mateothegreat/stylesets";

// Format values for display
console.log(format(["sm", "md", "lg"]));  // "sm | md | lg"
console.log(format("boolean"));           // "boolean"

// Evaluate if a value matches constraints
console.log(evaluate("md", ["sm", "md", "lg"]));  // true
console.log(evaluate("xl", ["sm", "md", "lg"]));  // false
console.log(evaluate(true, "boolean"));           // true
```

## 🎯 Best Practices

### 1. **Schema-First Design**
Always start with your schema definition. This drives everything else:

```typescript
// ✅ Good: Schema drives the implementation
const schema = {
  fields: [
    { name: "size", values: ["sm", "md", "lg"] as const, required: true }
  ]
} as const;

const styleset = new StyleSet(schema, { /* styles */ });

// ❌ Bad: Styles without schema validation
const styles = { button: { sm: "...", md: "...", lg: "..." } };
```

### 2. **Hierarchical Organization**
Organize your variants by component and concern:

```typescript
// ✅ Good: Clear hierarchy
{
  button: {
    size: { sm: "...", md: "...", lg: "..." },
    variant: { primary: "...", secondary: "..." }
  },
  input: {
    size: { sm: "...", md: "...", lg: "..." },
    state: { default: "...", error: "...", success: "..." }
  }
}

// ❌ Bad: Flat structure
{
  buttonSm: "...",
  buttonMd: "...", 
  inputSm: "...",
  inputError: "..."
}
```

### 3. **Meaningful Defaults**
Always provide sensible defaults:

```typescript
// ✅ Good: Clear defaults
{
  button: {
    size: {
      sm: "px-2 py-1",
      md: "px-4 py-2",
      lg: "px-6 py-3", 
      default: "md"  // Most common size
    }
  }
}
```

### 4. **Descriptive Schema Fields**
Use the description field for documentation:

```typescript
const schema = {
  fields: [
    {
      name: "size",
      values: ["sm", "md", "lg"] as const,
      required: true,
      description: "Controls the overall size and spacing of the component"
    }
  ]
} as const;
```

### 5. **Type-Safe Prop Forwarding**
Always use the provided type utilities:

```svelte
<script lang="ts">
  import type { ComponentProps } from "@mateothegreat/stylesets";
  
  // ✅ Good: Type-safe forwarding
  type Props = ComponentProps<typeof schema, [UnderlyingComponent.Props]>;
  
  // ❌ Bad: Manual prop typing (error-prone)
  type Props = { size: "sm" | "md" | "lg" } & UnderlyingComponent.Props;
</script>
```

## 🔍 Troubleshooting

### Common Issues

**Q: Why isn't my variant showing up?**
```typescript
// Check your search path
styleset.search("button.size.xl");  // ❌ "xl" doesn't exist

// Use the correct path
styleset.search("button.size.lg");  // ✅ This exists
```

**Q: How do I debug what variants are available?**
```typescript
// Inspect the variant map
console.log(styleset.container.getChild("button")?.value.variants);

// Or use wildcard search
console.log(styleset.search("button.size.*").toString());
```

**Q: Why are my types not working in Svelte?**
```svelte
<!-- ❌ Missing const assertion -->
<script lang="ts">
  const schema = { fields: [{ name: "size", values: ["sm", "md"] }] };
</script>

<!-- ✅ Proper const assertion -->
<script lang="ts">
  const schema = { fields: [{ name: "size", values: ["sm", "md"] as const }] } as const;
</script>
```

## 🤝 Contributing

We love contributions! Whether you're:
- 🐛 **Reporting bugs** - Help us squash those pesky issues
- 💡 **Suggesting features** - Share your brilliant ideas
- 📖 **Improving docs** - Make this guide even better
- 🔧 **Submitting PRs** - Code contributions are always welcome

Check out our [contribution guidelines](../CONTRIBUTING.md) to get started!

## 📄 License

MIT © [Matthew Davi](https://github.com/mateothegreat)

## 🎉 What's Next?

Ready to revolutionize your component styling? Here's what to explore:

1. **🚀 Quick Start**: Jump into the [Quick Start](#-quick-start) section
2. **🏗️ Architecture**: Understand the [Architecture Deep Dive](#-architecture-deep-dive)
3. **🎭 Advanced Types**: Master the [Type System Magic](#-type-system-magic)
4. **🌟 Svelte Integration**: Perfect your [Svelte 5 Integration](#-svelte-5-integration)
5. **🎨 Real Examples**: Study the [Real-World Examples](#-real-world-examples)

*Happy styling!* 🎨✨

---

*Made with ❤️ for developers who care about type safety, maintainability, and delightful developer experiences.*