# Multi-Layered Theme Composition

This comprehensive guide demonstrates how to build complex, scalable theme hierarchies using StyleSets' multi-layered theme composition system. You'll learn how to create theme inheritance chains, compose multiple theme layers, and build sophisticated design systems that scale across large applications.

## Table of Contents

- [Introduction](#introduction)
- [Understanding Theme Layers](#understanding-theme-layers)
- [Basic Two-Layer Composition](#basic-two-layer-composition)
- [Multi-Layer Theme Hierarchies](#multi-layer-theme-hierarchies)
- [Real-World Architecture Patterns](#real-world-architecture-patterns)
- [Token Resolution Through Layers](#token-resolution-through-layers)
- [CSS Variables Cascading](#css-variables-cascading)
- [Accessibility Through Layers](#accessibility-through-layers)
- [Advanced Composition Techniques](#advanced-composition-techniques)
- [Best Practices](#best-practices)
- [Complete Examples](#complete-examples)

## Introduction

Multi-layered theme composition allows you to build theme hierarchies where each layer inherits from and extends previous layers. This approach provides:

- **Inheritance**: Child themes automatically inherit all properties from parent themes
- **Selective Overrides**: Override only the specific properties you need to change
- **Deep Merging**: Nested objects (like tokens) are deeply merged, not replaced
- **Scalability**: Build complex design systems without duplication
- **Maintainability**: Changes to base layers propagate automatically
- **Flexibility**: Mix and match layers to create unlimited theme variations

## Understanding Theme Layers

Theme layers work like CSS cascading: later layers override earlier layers, but only for the properties they explicitly define. All other properties are inherited from parent layers.

### Layer Merging Behavior

```typescript
import { composeTheme } from '@sv0/stylesets';

// Layer 1: Foundation
const foundation = {
  id: 'foundation',
  name: 'Foundation',
  tokens: {
    color: {
      primary: 'blue-600',    // Will be inherited
      secondary: 'gray-600',  // Will be inherited
      accent: 'indigo-600'    // Will be overridden
    },
    spacing: {
      sm: '0.5rem',           // Will be inherited
      md: '1rem'              // Will be inherited
    }
  }
};

// Layer 2: Brand
const brand = {
  tokens: {
    color: {
      accent: 'orange-500'    // Overrides foundation.tokens.color.accent
      // primary and secondary are inherited from foundation
    }
    // spacing is fully inherited from foundation
  }
};

// Composed result
const composed = composeTheme(foundation, brand);
console.log(composed.tokens.color.primary);    // 'blue-600' (inherited)
console.log(composed.tokens.color.accent);     // 'orange-500' (overridden)
console.log(composed.tokens.spacing.md);       // '1rem' (inherited)
```

### Key Principles

1. **Deep Merge, Not Replace**: When merging `tokens.color`, only the specified color tokens are overridden. Other color tokens remain from parent layers.

2. **Explicit Undefined**: To remove a parent property, explicitly set it to `undefined` in child layers.

3. **Order Matters**: Layers are applied left-to-right. Later layers override earlier layers.

4. **Identity Preservation**: The composed theme's `id` and `name` come from the first (base) theme unless explicitly overridden.

## Basic Two-Layer Composition

### Foundation + Brand

The most common pattern: a foundational theme defining all baseline properties, extended by a brand theme for customization.

```typescript
import { composeTheme, type ThemeConfig } from '@sv0/stylesets';

// Layer 1: Foundation Theme
// Defines complete baseline design system
const foundationTheme: ThemeConfig = {
  id: 'foundation',
  name: 'Foundation',
  darkMode: false,

  // Comprehensive base tokens
  tokens: {
    color: {
      // Neutral palette
      background: 'white',
      surface: 'gray-50',
      surfaceElevated: 'white',
      text: 'gray-900',
      textMuted: 'gray-600',
      textSubtle: 'gray-500',

      // Semantic colors - to be customized by brand
      primary: 'blue-600',
      primaryHover: 'blue-700',
      primaryActive: 'blue-800',
      onPrimary: 'white',

      secondary: 'gray-600',
      secondaryHover: 'gray-700',
      secondaryActive: 'gray-800',
      onSecondary: 'white',

      accent: 'indigo-600',
      accentHover: 'indigo-700',
      onAccent: 'white',

      // Status colors
      success: 'green-600',
      successBg: 'green-50',
      warning: 'yellow-600',
      warningBg: 'yellow-50',
      error: 'red-600',
      errorBg: 'red-50',
      info: 'blue-600',
      infoBg: 'blue-50',

      // Border colors
      border: 'gray-200',
      borderHover: 'gray-300',
      borderFocus: 'blue-500',
    },

    spacing: {
      '0': '0',
      'px': '1px',
      '0.5': '0.125rem',
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem',
      '4': '1rem',
      '5': '1.25rem',
      '6': '1.5rem',
      '8': '2rem',
      '10': '2.5rem',
      '12': '3rem',
      '16': '4rem',
      '20': '5rem',
      '24': '6rem',
    },

    typography: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontFamilyMono: 'Monaco, Consolas, monospace',
      fontWeightNormal: '400',
      fontWeightMedium: '500',
      fontWeightSemibold: '600',
      fontWeightBold: '700',

      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },

      lineHeight: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.75',
      },
    },

    borderRadius: {
      none: '0',
      sm: '0.125rem',
      default: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      full: '9999px',
    },

    shadow: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      default: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    },
  },

  // Base accessibility configuration
  accessibility: {
    focusRing: {
      default: 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
      auto: true,
    },
    reducedMotion: {
      replace: {
        'transition-all': 'transition-none',
        'animate-spin': 'animate-none',
        'animate-bounce': 'animate-none',
      },
      auto: true,
    },
  },

  // Base CSS variables
  cssVariables: {
    '--font-sans': 'system-ui, -apple-system, sans-serif',
    '--font-mono': 'Monaco, Consolas, monospace',
  },
};

// Layer 2: Brand Theme
// Customizes foundation with brand-specific colors and identity
const brandTheme = {
  // Override name but keep foundation as base
  name: 'Acme Corp Brand',

  tokens: {
    color: {
      // Brand color palette - overrides foundation's primary/accent
      primary: 'indigo-600',
      primaryHover: 'indigo-700',
      primaryActive: 'indigo-800',
      // onPrimary: 'white' is inherited from foundation

      accent: 'pink-600',
      accentHover: 'pink-700',
      // onAccent: 'white' is inherited from foundation

      // All other colors (secondary, status, borders, etc.)
      // are inherited from foundation
    },

    typography: {
      // Override font family with brand fonts
      fontFamily: '"Inter", system-ui, sans-serif',
      fontFamilyMono: '"JetBrains Mono", monospace',
      // All other typography tokens inherited from foundation
    },

    borderRadius: {
      // Brand uses more rounded corners
      default: '0.5rem',
      md: '0.75rem',
      lg: '1rem',
      // Other radius values inherited from foundation
    },
  },

  // Brand-specific CSS variables
  cssVariables: {
    '--font-sans': '"Inter", system-ui, sans-serif',
    '--font-mono': '"JetBrains Mono", monospace',
    '--brand-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },

  // Accessibility settings inherited from foundation, can add more here
};

// Compose the two layers
const acmeTheme = composeTheme(foundationTheme, brandTheme);

console.log(acmeTheme.name);                           // 'Acme Corp Brand'
console.log(acmeTheme.tokens.color.primary);           // 'indigo-600' (overridden)
console.log(acmeTheme.tokens.color.secondary);         // 'gray-600' (inherited)
console.log(acmeTheme.tokens.color.background);        // 'white' (inherited)
console.log(acmeTheme.tokens.spacing['4']);            // '1rem' (inherited)
console.log(acmeTheme.tokens.typography.fontFamily);   // '"Inter", system-ui, sans-serif' (overridden)
console.log(acmeTheme.tokens.typography.fontSize.base); // '1rem' (inherited)
```

### Using createThemeVariant for Simple Extensions

For simpler two-layer compositions, `createThemeVariant` provides a convenient API:

```typescript
import { createThemeVariant } from '@sv0/stylesets';

// Same result as above, but with automatic ID and name generation
const acmeTheme = createThemeVariant(foundationTheme, 'acme', {
  tokens: {
    color: {
      primary: 'indigo-600',
      primaryHover: 'indigo-700',
      primaryActive: 'indigo-800',
      accent: 'pink-600',
      accentHover: 'pink-700',
    },
    typography: {
      fontFamily: '"Inter", system-ui, sans-serif',
    },
  },
});

console.log(acmeTheme.id);    // 'foundation-acme'
console.log(acmeTheme.name);  // 'Foundation (acme)'
```

## Multi-Layer Theme Hierarchies

Build sophisticated theme systems with three or more layers for maximum flexibility and reusability.

### Three-Layer Architecture

A common enterprise pattern: **Foundation → Brand → Product**

```typescript
import { composeTheme, type ThemeConfig } from '@sv0/stylesets';

// ========================================================================
// LAYER 1: FOUNDATION
// ========================================================================
// Universal design system used across all brands and products
const foundation: ThemeConfig = {
  id: 'foundation',
  name: 'Foundation',
  darkMode: false,

  tokens: {
    color: {
      // Neutral palette
      white: 'white',
      black: 'black',

      gray: {
        50: 'gray-50',
        100: 'gray-100',
        200: 'gray-200',
        300: 'gray-300',
        400: 'gray-400',
        500: 'gray-500',
        600: 'gray-600',
        700: 'gray-700',
        800: 'gray-800',
        900: 'gray-900',
      },

      // Semantic mappings (to be overridden by brand)
      background: 'white',
      text: 'gray-900',
      primary: 'blue-600',
      secondary: 'gray-600',
    },

    spacing: {
      unit: '0.25rem', // Base unit for all spacing
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '3rem',
    },

    layout: {
      containerMaxWidth: '1280px',
      sidebarWidth: '256px',
      headerHeight: '64px',
    },
  },

  accessibility: {
    focusRing: {
      default: 'focus:outline-none focus:ring-2 focus:ring-offset-2',
      auto: true,
    },
  },
};

// ========================================================================
// LAYER 2: BRAND
// ========================================================================
// Brand identity layer - customizes foundation with brand colors/fonts
const brandLayer = {
  tokens: {
    color: {
      // Brand color palette
      primary: 'indigo-600',
      primaryHover: 'indigo-700',
      primarySubtle: 'indigo-50',

      secondary: 'purple-600',
      secondaryHover: 'purple-700',
      secondarySubtle: 'purple-50',

      accent: 'amber-500',
      accentHover: 'amber-600',

      // Inherits: background, text, gray palette, white, black
    },

    typography: {
      fontFamily: '"Archivo", sans-serif',
      fontFamilyDisplay: '"Playfair Display", serif',
    },

    // Inherits: all spacing and layout tokens
  },

  accessibility: {
    focusRing: {
      default: 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
      // auto: true inherited
    },
  },

  cssVariables: {
    '--brand-primary': '#4f46e5',
    '--brand-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
};

// Compose: Foundation + Brand
const brandTheme = composeTheme(foundation, brandLayer);

// ========================================================================
// LAYER 3: PRODUCT - Marketing Site
// ========================================================================
// Product-specific customizations for marketing site
const marketingLayer = {
  tokens: {
    color: {
      // Marketing uses brighter, more vibrant colors
      primary: 'indigo-500',      // Lighter than brand default
      accent: 'yellow-400',       // More vibrant

      // Marketing-specific colors
      hero: 'indigo-600',
      heroGradientStart: 'indigo-600',
      heroGradientEnd: 'purple-600',

      // Inherits: secondary, all grays, background, text, etc.
    },

    spacing: {
      // Marketing uses more generous spacing
      xs: '1rem',          // Overrides brand's 0.5rem
      sm: '1.5rem',        // Overrides brand's 1rem
      md: '2.5rem',        // Overrides brand's 1.5rem
      lg: '4rem',          // Overrides brand's 2rem
      xl: '6rem',          // Overrides brand's 3rem
      // unit inherited: '0.25rem'
    },

    typography: {
      // Marketing uses larger, bolder typography
      fontSize: {
        hero: '4rem',
        displayLg: '3rem',
        displayMd: '2.25rem',
      },
      // fontFamily inherited from brand
    },

    layout: {
      containerMaxWidth: '1440px',  // Wider for marketing
      // Other layout tokens inherited
    },
  },

  cssVariables: {
    '--hero-gradient': 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    // --brand-primary and --brand-gradient inherited
  },
};

// Compose: Foundation + Brand + Marketing
const marketingTheme = composeTheme(foundation, brandLayer, marketingLayer);

console.log(marketingTheme.tokens.color.primary);        // 'indigo-500' (from marketing)
console.log(marketingTheme.tokens.color.secondary);      // 'purple-600' (from brand)
console.log(marketingTheme.tokens.color.background);     // 'white' (from foundation)
console.log(marketingTheme.tokens.spacing.xs);           // '1rem' (from marketing)
console.log(marketingTheme.tokens.spacing.unit);         // '0.25rem' (from foundation)
console.log(marketingTheme.tokens.layout.containerMaxWidth); // '1440px' (from marketing)

// ========================================================================
// LAYER 3: PRODUCT - Dashboard (Alternative)
// ========================================================================
// Different product-specific customizations for dashboard
const dashboardLayer = {
  tokens: {
    color: {
      // Dashboard uses more muted, professional colors
      primary: 'indigo-600',      // Uses brand default
      accent: 'teal-500',         // Different accent

      // Dashboard-specific colors
      dataVisualization: {
        blue: 'blue-500',
        green: 'green-500',
        yellow: 'yellow-500',
        red: 'red-500',
        purple: 'purple-500',
      },

      sidebar: 'gray-900',
      sidebarHover: 'gray-800',
    },

    spacing: {
      // Dashboard uses compact spacing
      xs: '0.25rem',       // More compact than brand
      sm: '0.5rem',        // More compact than brand
      md: '1rem',          // More compact than brand
      // Other spacing inherited from brand
    },

    layout: {
      sidebarWidth: '280px',    // Wider sidebar
      headerHeight: '56px',     // Shorter header
      // containerMaxWidth inherited from foundation
    },
  },
};

// Compose: Foundation + Brand + Dashboard
const dashboardTheme = composeTheme(foundation, brandLayer, dashboardLayer);

console.log(dashboardTheme.tokens.color.primary);        // 'indigo-600' (from dashboard/brand)
console.log(dashboardTheme.tokens.color.accent);         // 'teal-500' (from dashboard)
console.log(dashboardTheme.tokens.spacing.xs);           // '0.25rem' (from dashboard)
console.log(dashboardTheme.tokens.layout.sidebarWidth);  // '280px' (from dashboard)
```

### Four-Layer Architecture

For maximum flexibility: **Foundation → Brand → Product → Environment**

```typescript
// ========================================================================
// LAYER 1: FOUNDATION (from previous example)
// ========================================================================
const foundation: ThemeConfig = {
  id: 'foundation',
  name: 'Foundation',
  // ... (same as before)
};

// ========================================================================
// LAYER 2: BRAND (from previous example)
// ========================================================================
const brandLayer = {
  // ... (same as before)
};

// ========================================================================
// LAYER 3: PRODUCT - Dashboard (from previous example)
// ========================================================================
const dashboardLayer = {
  // ... (same as before)
};

// ========================================================================
// LAYER 4: ENVIRONMENT - Development
// ========================================================================
// Environment-specific overrides for development
const developmentLayer = {
  tokens: {
    color: {
      // Visual indicators for development mode
      primary: 'orange-600',     // Bright indicator

      // Development-specific helpers
      debugBorder: 'red-500',
      debugBg: 'red-50',
    },
  },

  cssVariables: {
    '--env-indicator': '#ea580c',
    '--debug-mode': '1',
  },

  base: 'debug-mode', // CSS class applied to root
};

// ========================================================================
// LAYER 4: ENVIRONMENT - Production (Alternative)
// ========================================================================
// Environment-specific overrides for production
const productionLayer = {
  tokens: {
    // Production uses standard brand colors (no overrides needed)
    // This layer exists for symmetry and future extensibility
  },

  cssVariables: {
    '--env-indicator': 'transparent',
    '--debug-mode': '0',
  },
};

// ========================================================================
// LAYER 4: ENVIRONMENT - Staging (Alternative)
// ========================================================================
const stagingLayer = {
  tokens: {
    color: {
      primary: 'yellow-600',     // Yellow indicator for staging
    },
  },

  cssVariables: {
    '--env-indicator': '#ca8a04',
    '--debug-mode': '0',
  },

  base: 'staging-mode',
};

// Compose: Foundation + Brand + Dashboard + Environment
const dashboardDevTheme = composeTheme(
  foundation,
  brandLayer,
  dashboardLayer,
  developmentLayer
);

const dashboardProdTheme = composeTheme(
  foundation,
  brandLayer,
  dashboardLayer,
  productionLayer
);

const dashboardStagingTheme = composeTheme(
  foundation,
  brandLayer,
  dashboardLayer,
  stagingLayer
);

console.log(dashboardDevTheme.tokens.color.primary);     // 'orange-600' (from dev)
console.log(dashboardProdTheme.tokens.color.primary);    // 'indigo-600' (from dashboard/brand)
console.log(dashboardStagingTheme.tokens.color.primary); // 'yellow-600' (from staging)
```

### Five-Layer Architecture

Enterprise-scale: **Foundation → Brand → Product → Environment → User Customization**

```typescript
// ========================================================================
// LAYERS 1-4: (from previous examples)
// ========================================================================

// ========================================================================
// LAYER 5: USER CUSTOMIZATION
// ========================================================================
// User-specific preferences and customizations
interface UserPreferences {
  density: 'compact' | 'comfortable' | 'spacious';
  fontSize: 'small' | 'medium' | 'large';
  contrastMode: 'normal' | 'high';
  primaryColor?: string;
}

function createUserLayer(preferences: UserPreferences) {
  const spacingMultipliers = {
    compact: 0.75,
    comfortable: 1,
    spacious: 1.5,
  };

  const fontSizeMultipliers = {
    small: 0.875,
    medium: 1,
    large: 1.125,
  };

  const spacingMultiplier = spacingMultipliers[preferences.density];
  const fontMultiplier = fontSizeMultipliers[preferences.fontSize];

  return {
    tokens: {
      // Apply density preference to spacing
      spacing: {
        xs: `${0.5 * spacingMultiplier}rem`,
        sm: `${1 * spacingMultiplier}rem`,
        md: `${1.5 * spacingMultiplier}rem`,
        lg: `${2 * spacingMultiplier}rem`,
        xl: `${3 * spacingMultiplier}rem`,
      },

      // Apply font size preference
      typography: {
        fontSize: {
          xs: `${0.75 * fontMultiplier}rem`,
          sm: `${0.875 * fontMultiplier}rem`,
          base: `${1 * fontMultiplier}rem`,
          lg: `${1.125 * fontMultiplier}rem`,
          xl: `${1.25 * fontMultiplier}rem`,
        },
      },

      // Apply custom primary color if provided
      ...(preferences.primaryColor && {
        color: {
          primary: preferences.primaryColor,
        },
      }),
    },

    // Apply high contrast if requested
    ...(preferences.contrastMode === 'high' && {
      accessibility: {
        highContrast: {
          colorMap: {
            'text-gray-600': 'text-gray-900',
            'text-gray-500': 'text-gray-800',
            'bg-gray-50': 'bg-white',
          },
          auto: true,
        },
      },
    }),

    cssVariables: {
      '--user-density': String(spacingMultiplier),
      '--user-font-scale': String(fontMultiplier),
    },
  };
}

// Create user-specific theme
const userPreferences: UserPreferences = {
  density: 'compact',
  fontSize: 'large',
  contrastMode: 'high',
  primaryColor: 'violet-600',
};

const userLayer = createUserLayer(userPreferences);

// Compose all five layers
const personalizedTheme = composeTheme(
  foundation,
  brandLayer,
  dashboardLayer,
  productionLayer,
  userLayer
);

console.log(personalizedTheme.tokens.spacing.md);           // '1.125rem' (compact: 1.5 * 0.75)
console.log(personalizedTheme.tokens.typography.fontSize.base); // '1.125rem' (large: 1 * 1.125)
console.log(personalizedTheme.tokens.color.primary);        // 'violet-600' (user override)
```

## Real-World Architecture Patterns

### Pattern 1: Multi-Tenant SaaS

Structure themes for a multi-tenant SaaS application where each tenant has their own branding.

```typescript
import { composeTheme, ThemeManager, type ThemeConfig } from '@sv0/stylesets';

// ========================================================================
// BASE LAYER: SaaS Platform Foundation
// ========================================================================
const saasFoundation: ThemeConfig = {
  id: 'saas-foundation',
  name: 'SaaS Foundation',

  tokens: {
    color: {
      // Platform-level colors (not customizable by tenants)
      systemError: 'red-600',
      systemWarning: 'yellow-600',
      systemSuccess: 'green-600',
      systemInfo: 'blue-600',

      // Tenant-customizable colors (defaults)
      primary: 'blue-600',
      secondary: 'gray-600',
      accent: 'indigo-600',

      // Standard UI colors
      background: 'white',
      text: 'gray-900',
      border: 'gray-200',
    },

    spacing: {
      unit: '0.25rem',
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '3rem',
    },

    layout: {
      maxWidth: '1280px',
      sidebarWidth: '256px',
      topbarHeight: '64px',
    },
  },

  accessibility: {
    focusRing: {
      default: 'focus:ring-2 focus:ring-offset-2',
      auto: true,
    },
  },
};

// ========================================================================
// TENANT LAYER: Factory Function
// ========================================================================
interface TenantBranding {
  tenantId: string;
  name: string;
  primaryColor: string;
  accentColor?: string;
  logo?: string;
  fontFamily?: string;
}

function createTenantTheme(branding: TenantBranding): ThemeConfig {
  const tenantLayer = {
    tokens: {
      color: {
        primary: branding.primaryColor,
        accent: branding.accentColor || branding.primaryColor,
      },

      ...(branding.fontFamily && {
        typography: {
          fontFamily: branding.fontFamily,
        },
      }),
    },

    cssVariables: {
      '--tenant-primary': branding.primaryColor,
      ...(branding.logo && {
        '--tenant-logo': `url(${branding.logo})`,
      }),
    },
  };

  return composeTheme(saasFoundation, tenantLayer);
}

// ========================================================================
// USAGE: Create themes for different tenants
// ========================================================================
const acmeCorp = createTenantTheme({
  tenantId: 'acme',
  name: 'Acme Corp',
  primaryColor: 'indigo-600',
  accentColor: 'pink-600',
  fontFamily: '"Inter", sans-serif',
});

const techStartup = createTenantTheme({
  tenantId: 'tech-startup',
  name: 'Tech Startup',
  primaryColor: 'emerald-600',
  fontFamily: '"Space Grotesk", sans-serif',
});

const enterprise = createTenantTheme({
  tenantId: 'enterprise',
  name: 'Enterprise Co',
  primaryColor: 'slate-700',
  accentColor: 'blue-600',
  fontFamily: '"IBM Plex Sans", sans-serif',
});

// ========================================================================
// THEME MANAGER: Register and switch between tenant themes
// ========================================================================
const themeManager = new ThemeManager([
  acmeCorp,
  techStartup,
  enterprise,
]);

// Switch theme based on current tenant
function setTenantTheme(tenantId: string) {
  themeManager.setActiveTheme(tenantId);
}

// In your app
setTenantTheme('acme'); // Loads Acme Corp branding
```

### Pattern 2: White-Label Application

Build a white-label product with completely different themes for different clients.

```typescript
// ========================================================================
// BASE LAYER: Product Foundation
// ========================================================================
const productFoundation: ThemeConfig = {
  id: 'product',
  name: 'Product Foundation',

  tokens: {
    // Complete design system tokens
    color: {
      background: 'white',
      text: 'gray-900',
      primary: 'blue-600',
      secondary: 'gray-600',
      // ... (comprehensive token set)
    },
    spacing: { /* ... */ },
    typography: { /* ... */ },
  },
};

// ========================================================================
// CLIENT LAYERS: Complete brand overrides
// ========================================================================

// Client A: Professional/Corporate
const clientABrand = {
  tokens: {
    color: {
      primary: 'navy-900',
      secondary: 'gray-700',
      accent: 'gold-500',
      background: 'gray-50',
    },
    typography: {
      fontFamily: '"Georgia", serif',
    },
    borderRadius: {
      default: '0',      // Sharp corners
      md: '0',
      lg: '0',
    },
  },
};

// Client B: Modern/Playful
const clientBBrand = {
  tokens: {
    color: {
      primary: 'purple-500',
      secondary: 'pink-500',
      accent: 'yellow-400',
      background: 'white',
    },
    typography: {
      fontFamily: '"Comic Neue", cursive',
    },
    borderRadius: {
      default: '1rem',   // Very rounded
      md: '1.5rem',
      lg: '2rem',
    },
  },
};

// Client C: Minimal/Tech
const clientCBrand = {
  tokens: {
    color: {
      primary: 'black',
      secondary: 'gray-400',
      accent: 'lime-500',
      background: 'white',
    },
    typography: {
      fontFamily: '"JetBrains Mono", monospace',
    },
    borderRadius: {
      default: '0.125rem',  // Subtle rounding
      md: '0.25rem',
      lg: '0.375rem',
    },
  },
};

// Compose client themes
const clientATheme = composeTheme(productFoundation, clientABrand);
const clientBTheme = composeTheme(productFoundation, clientBBrand);
const clientCTheme = composeTheme(productFoundation, clientCBrand);
```

### Pattern 3: Department/Division Themes

Large organization with different departments having distinct visual identities.

```typescript
// ========================================================================
// LAYER 1: Corporate Foundation
// ========================================================================
const corporateFoundation: ThemeConfig = {
  id: 'corporate',
  name: 'Corporate Foundation',

  tokens: {
    color: {
      // Corporate brand colors
      corporatePrimary: 'blue-900',
      corporateSecondary: 'gray-600',

      // To be customized by departments
      primary: 'blue-600',
      secondary: 'gray-600',
      accent: 'blue-500',

      // Shared colors
      background: 'white',
      text: 'gray-900',
    },
    // ... other tokens
  },
};

// ========================================================================
// LAYER 2: Department Themes
// ========================================================================

// Sales Department: Energetic, action-oriented
const salesDepartment = {
  tokens: {
    color: {
      primary: 'orange-600',
      accent: 'red-500',
      // Uses corporate secondary and other shared colors
    },
  },
  cssVariables: {
    '--dept-color': '#ea580c',
  },
};

// Engineering Department: Technical, precise
const engineeringDepartment = {
  tokens: {
    color: {
      primary: 'teal-600',
      accent: 'cyan-500',
    },
    typography: {
      fontFamily: '"Roboto Mono", monospace',
    },
  },
  cssVariables: {
    '--dept-color': '#0d9488',
  },
};

// Marketing Department: Creative, vibrant
const marketingDepartment = {
  tokens: {
    color: {
      primary: 'purple-600',
      accent: 'pink-500',
    },
    spacing: {
      // Marketing uses more generous spacing
      md: '2rem',
      lg: '3rem',
      xl: '4rem',
    },
  },
  cssVariables: {
    '--dept-color': '#9333ea',
  },
};

// HR Department: Warm, approachable
const hrDepartment = {
  tokens: {
    color: {
      primary: 'amber-600',
      accent: 'yellow-500',
    },
    borderRadius: {
      // HR uses softer, more rounded corners
      default: '0.75rem',
      lg: '1.5rem',
    },
  },
  cssVariables: {
    '--dept-color': '#d97706',
  },
};

// Compose department themes
const salesTheme = composeTheme(corporateFoundation, salesDepartment);
const engineeringTheme = composeTheme(corporateFoundation, engineeringDepartment);
const marketingTheme = composeTheme(corporateFoundation, marketingDepartment);
const hrTheme = composeTheme(corporateFoundation, hrDepartment);

// ========================================================================
// LAYER 3: Project-Specific Overrides
// ========================================================================

// Marketing Campaign: Extra vibrant for specific campaign
const campaignLayer = {
  tokens: {
    color: {
      primary: 'fuchsia-600',
      accent: 'yellow-400',
    },
  },
};

const campaignTheme = composeTheme(
  corporateFoundation,
  marketingDepartment,
  campaignLayer
);

console.log(campaignTheme.tokens.color.primary);          // 'fuchsia-600' (campaign)
console.log(campaignTheme.tokens.spacing.md);             // '2rem' (marketing)
console.log(campaignTheme.tokens.color.background);       // 'white' (corporate)
```

## Token Resolution Through Layers

Understanding how tokens are resolved through multiple layers is crucial for building maintainable theme hierarchies.

### Token Merging Algorithm

```typescript
// Token resolution follows these rules:
// 1. Deep merge nested objects
// 2. Later layers override earlier layers
// 3. Only explicitly defined properties are overridden
// 4. Arrays are replaced, not merged

const layer1 = {
  tokens: {
    color: {
      primary: 'blue-600',
      secondary: 'gray-600',
      accent: 'indigo-600',
      nested: {
        light: 'blue-100',
        dark: 'blue-900',
      }
    },
    spacing: {
      sm: '0.5rem',
      md: '1rem',
    }
  }
};

const layer2 = {
  tokens: {
    color: {
      primary: 'red-600',        // Overrides layer1
      // secondary inherited from layer1
      nested: {
        light: 'red-100',        // Overrides layer1.nested.light
        // dark inherited from layer1.nested.dark
        medium: 'red-500',       // New property
      }
    },
    // spacing fully inherited from layer1
  }
};

const composed = composeTheme(layer1, layer2);
/*
Result:
{
  tokens: {
    color: {
      primary: 'red-600',        // from layer2
      secondary: 'gray-600',     // from layer1
      accent: 'indigo-600',      // from layer1
      nested: {
        light: 'red-100',        // from layer2
        dark: 'blue-900',        // from layer1
        medium: 'red-500',       // from layer2
      }
    },
    spacing: {
      sm: '0.5rem',              // from layer1
      md: '1rem',                // from layer1
    }
  }
}
*/
```

### Token Reference Resolution

Tokens can reference other tokens using the `{category.token}` syntax:

```typescript
const foundation: ThemeConfig = {
  id: 'foundation',
  name: 'Foundation',

  tokens: {
    color: {
      primary: 'blue-600',
      primaryHover: 'blue-700',
    },
  },
};

const component = createStyleSet({
  base: 'px-4 py-2',
  variants: {
    intent: {
      primary: 'bg-{color.primary} hover:bg-{color.primaryHover}',
    },
  },
  themes: {
    foundation: foundation,
  },
});

// Token references are resolved when the StyleSet is applied
const className = component({ intent: 'primary', theme: 'foundation' });
// Result: 'px-4 py-2 bg-blue-600 hover:bg-blue-700'
```

### Cross-Layer Token References

Layers can reference tokens defined in previous layers:

```typescript
const foundation: ThemeConfig = {
  id: 'foundation',
  name: 'Foundation',

  tokens: {
    color: {
      blue: {
        500: 'blue-500',
        600: 'blue-600',
        700: 'blue-700',
      },
    },
  },
};

const brandLayer = {
  tokens: {
    color: {
      primary: '{color.blue.600}',           // References foundation token
      primaryHover: '{color.blue.700}',      // References foundation token
      primarySubtle: '{color.blue.500}',     // References foundation token
    },
  },
};

const brandTheme = composeTheme(foundation, brandLayer);

// When used in a StyleSet, token references are resolved:
const button = createStyleSet({
  variants: {
    intent: {
      primary: 'bg-{color.primary} hover:bg-{color.primaryHover}',
    },
  },
  themes: {
    brand: brandTheme,
  },
});

const className = button({ intent: 'primary', theme: 'brand' });
// Token resolution chain:
// {color.primary} → '{color.blue.600}' → 'blue-600'
// Result: 'bg-blue-600 hover:bg-blue-700'
```

### Dynamic Token Overrides

Override tokens at runtime for specific use cases:

```typescript
const foundation: ThemeConfig = {
  id: 'foundation',
  name: 'Foundation',
  tokens: {
    color: {
      primary: 'blue-600',
    },
  },
};

const brandLayer = {
  tokens: {
    color: {
      primary: 'indigo-600',     // Overrides foundation
    },
  },
};

const userLayer = {
  tokens: {
    color: {
      primary: 'var(--user-primary, indigo-600)', // Runtime override via CSS variable
    },
  },
};

const userTheme = composeTheme(foundation, brandLayer, userLayer);

// Set CSS variable at runtime
if (typeof document !== 'undefined') {
  document.documentElement.style.setProperty('--user-primary', '#7c3aed');
}

// Now primary color resolves to user's custom color
```

## CSS Variables Cascading

CSS variables cascade through layers, allowing for dynamic theming and runtime customization.

### Layer-by-Layer Variable Definition

```typescript
const foundation: ThemeConfig = {
  id: 'foundation',
  name: 'Foundation',

  cssVariables: {
    // Base CSS variables
    '--spacing-unit': '0.25rem',
    '--font-sans': 'system-ui, sans-serif',
    '--color-background': '#ffffff',
    '--color-text': '#111827',
    '--radius-default': '0.25rem',
  },

  tokens: {
    color: {
      background: 'var(--color-background)',
      text: 'var(--color-text)',
    },
    spacing: {
      unit: 'var(--spacing-unit)',
    },
    borderRadius: {
      default: 'var(--radius-default)',
    },
  },
};

const brandLayer = {
  cssVariables: {
    // Override specific variables
    '--color-primary': '#4f46e5',
    '--color-accent': '#ec4899',
    // Other variables inherited
  },

  tokens: {
    color: {
      primary: 'var(--color-primary)',
      accent: 'var(--color-accent)',
    },
  },
};

const userLayer = {
  cssVariables: {
    // User customization
    '--spacing-unit': '0.375rem',      // Larger spacing preference
    '--color-primary': 'var(--user-primary, #4f46e5)', // Allow runtime override
  },
};

const personalizedTheme = composeTheme(foundation, brandLayer, userLayer);

// Apply theme (sets all CSS variables on document.documentElement)
const themeManager = new ThemeManager([personalizedTheme]);
themeManager.setActiveTheme('foundation');

// CSS variables cascade:
// --spacing-unit: '0.375rem'                    (from userLayer)
// --font-sans: 'system-ui, sans-serif'          (from foundation)
// --color-background: '#ffffff'                 (from foundation)
// --color-text: '#111827'                       (from foundation)
// --color-primary: 'var(--user-primary, #4f46e5)' (from userLayer)
// --color-accent: '#ec4899'                     (from brandLayer)
// --radius-default: '0.25rem'                   (from foundation)
```

### Runtime CSS Variable Updates

```typescript
// Update CSS variables at runtime without rebuilding theme
function updateUserPrimaryColor(color: string) {
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty('--user-primary', color);
  }
}

// All components using {color.primary} will automatically update
updateUserPrimaryColor('#7c3aed'); // Purple
updateUserPrimaryColor('#10b981'); // Green
updateUserPrimaryColor('#f59e0b'); // Amber
```

### Scoped CSS Variables

Apply different themes to different sections of your app:

```typescript
// Parent theme
const parentTheme: ThemeConfig = {
  id: 'parent',
  name: 'Parent',
  cssVariables: {
    '--section-bg': '#ffffff',
    '--section-text': '#111827',
  },
};

// Child theme for specific section
const childTheme: ThemeConfig = {
  id: 'child',
  name: 'Child',
  cssVariables: {
    '--section-bg': '#f3f4f6',
    '--section-text': '#1f2937',
  },
};

// In your Svelte component:
```

```svelte
<script lang="ts">
  import { onMount } from 'svelte';

  let sectionRef: HTMLElement;

  onMount(() => {
    // Apply child theme to specific section
    if (childTheme.cssVariables) {
      Object.entries(childTheme.cssVariables).forEach(([prop, value]) => {
        sectionRef.style.setProperty(prop, value);
      });
    }
  });
</script>

<main style="background: var(--section-bg); color: var(--section-text);">
  Main content with parent theme
</main>

<section bind:this={sectionRef} style="background: var(--section-bg); color: var(--section-text);">
  Section with child theme
</section>
```

## Accessibility Through Layers

Accessibility settings compose and enhance through theme layers.

### Cumulative Accessibility Features

```typescript
const foundation: ThemeConfig = {
  id: 'foundation',
  name: 'Foundation',

  accessibility: {
    // Base focus ring for all interactive elements
    focusRing: {
      default: 'focus:outline-none focus:ring-2 focus:ring-offset-2',
      auto: true,
    },

    // Respect reduced motion preference
    reducedMotion: {
      replace: {
        'transition-all': 'transition-none',
        'animate-spin': 'animate-none',
      },
      auto: true,
    },
  },
};

const brandLayer = {
  accessibility: {
    // Brand-specific focus ring color
    focusRing: {
      default: 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
      // auto: true inherited
    },

    // Reduced motion inherited from foundation
    // Add additional motion replacements
    reducedMotion: {
      replace: {
        'transition-all': 'transition-none',       // inherited
        'animate-spin': 'animate-none',            // inherited
        'animate-pulse': 'animate-none',           // added
        'transition-transform': 'transition-none', // added
      },
      auto: true,
    },
  },
};

const accessibilityLayer = {
  accessibility: {
    // High contrast mode for users who need it
    highContrast: {
      colorMap: {
        'text-gray-600': 'text-gray-900',
        'text-gray-500': 'text-gray-900',
        'bg-gray-50': 'bg-white',
        'bg-gray-100': 'bg-white',
        'border-gray-200': 'border-gray-900',
      },
      auto: false, // Only apply when explicitly enabled
    },

    // Screen reader enhancements
    screenReader: {
      includeHiddenText: true,
      verboseLabels: true,
    },
  },
};

const accessibleTheme = composeTheme(foundation, brandLayer, accessibilityLayer);

// Accessibility features from all layers are merged:
// - Focus ring: brand-specific color (brandLayer)
// - Reduced motion: 4 animation replacements (foundation + brandLayer)
// - High contrast: available but not auto-applied (accessibilityLayer)
// - Screen reader: enhanced verbosity (accessibilityLayer)
```

### Conditional Accessibility Layers

Apply accessibility layers based on user preferences:

```typescript
interface UserA11yPreferences {
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  screenReader: boolean;
}

function createAccessibilityLayer(preferences: UserA11yPreferences) {
  return {
    accessibility: {
      ...(preferences.highContrast && {
        highContrast: {
          colorMap: {
            'text-gray-600': 'text-black',
            'bg-gray-50': 'bg-white',
            'border-gray-200': 'border-black',
          },
          auto: true,
        },
      }),

      ...(preferences.reducedMotion && {
        reducedMotion: {
          replace: {
            'transition': 'transition-none',
            'animate': 'animate-none',
          },
          auto: true,
        },
      }),

      ...(preferences.screenReader && {
        screenReader: {
          includeHiddenText: true,
          verboseLabels: true,
        },
      }),
    },

    ...(preferences.largeText && {
      tokens: {
        typography: {
          fontSize: {
            xs: '1rem',
            sm: '1.125rem',
            base: '1.25rem',
            lg: '1.5rem',
            xl: '1.75rem',
          },
        },
      },
    }),
  };
}

// Create theme with user's accessibility preferences
const userPreferences: UserA11yPreferences = {
  highContrast: true,
  reducedMotion: false,
  largeText: true,
  screenReader: false,
};

const a11yLayer = createAccessibilityLayer(userPreferences);
const accessibleUserTheme = composeTheme(foundation, brandLayer, a11yLayer);
```

## Advanced Composition Techniques

### Theme Composition with Conditional Logic

```typescript
interface ThemeOptions {
  darkMode: boolean;
  compactMode: boolean;
  colorScheme: 'blue' | 'purple' | 'green';
}

function createAdaptiveTheme(options: ThemeOptions): ThemeConfig {
  const layers: (ThemeConfig | Partial<ThemeConfig>)[] = [
    foundation, // Always start with foundation
  ];

  // Add dark mode layer if requested
  if (options.darkMode) {
    layers.push({
      darkMode: true,
      tokens: {
        color: {
          background: 'gray-900',
          text: 'gray-100',
          surface: 'gray-800',
        },
      },
      cssVariables: {
        '--color-background': '#111827',
        '--color-text': '#f9fafb',
      },
    });
  }

  // Add compact mode layer if requested
  if (options.compactMode) {
    layers.push({
      tokens: {
        spacing: {
          xs: '0.25rem',
          sm: '0.5rem',
          md: '0.75rem',
          lg: '1rem',
        },
      },
    });
  }

  // Add color scheme layer
  const colorSchemes = {
    blue: {
      tokens: {
        color: {
          primary: options.darkMode ? 'blue-400' : 'blue-600',
          accent: options.darkMode ? 'blue-300' : 'blue-500',
        },
      },
    },
    purple: {
      tokens: {
        color: {
          primary: options.darkMode ? 'purple-400' : 'purple-600',
          accent: options.darkMode ? 'purple-300' : 'purple-500',
        },
      },
    },
    green: {
      tokens: {
        color: {
          primary: options.darkMode ? 'green-400' : 'green-600',
          accent: options.darkMode ? 'green-300' : 'green-500',
        },
      },
    },
  };

  layers.push(colorSchemes[options.colorScheme]);

  return composeTheme(...layers);
}

// Usage
const lightCompactBlue = createAdaptiveTheme({
  darkMode: false,
  compactMode: true,
  colorScheme: 'blue',
});

const darkNormalPurple = createAdaptiveTheme({
  darkMode: true,
  compactMode: false,
  colorScheme: 'purple',
});
```

### Dynamic Layer Injection

Inject layers at runtime based on context:

```typescript
class DynamicThemeBuilder {
  private layers: (ThemeConfig | Partial<ThemeConfig>)[] = [];

  constructor(baseTheme: ThemeConfig) {
    this.layers.push(baseTheme);
  }

  addLayer(layer: Partial<ThemeConfig>): this {
    this.layers.push(layer);
    return this;
  }

  addConditional(
    condition: boolean,
    layer: Partial<ThemeConfig>
  ): this {
    if (condition) {
      this.layers.push(layer);
    }
    return this;
  }

  addFeatureFlag(
    flags: Record<string, boolean>,
    flagName: string,
    layer: Partial<ThemeConfig>
  ): this {
    if (flags[flagName]) {
      this.layers.push(layer);
    }
    return this;
  }

  build(): ThemeConfig {
    return composeTheme(...this.layers);
  }
}

// Usage
const featureFlags = {
  newDesign: true,
  betaFeatures: false,
  experimentalColors: true,
};

const theme = new DynamicThemeBuilder(foundation)
  .addLayer(brandLayer)
  .addConditional(isProduction, productionLayer)
  .addConditional(!isProduction, developmentLayer)
  .addFeatureFlag(featureFlags, 'newDesign', newDesignLayer)
  .addFeatureFlag(featureFlags, 'experimentalColors', experimentalColorsLayer)
  .build();
```

### Theme Layer Registry

Manage and compose themes from a central registry:

```typescript
class ThemeLayerRegistry {
  private layers = new Map<string, Partial<ThemeConfig>>();

  register(id: string, layer: Partial<ThemeConfig>): void {
    this.layers.set(id, layer);
  }

  get(id: string): Partial<ThemeConfig> | undefined {
    return this.layers.get(id);
  }

  compose(baseTheme: ThemeConfig, ...layerIds: string[]): ThemeConfig {
    const layers = layerIds
      .map(id => this.layers.get(id))
      .filter((layer): layer is Partial<ThemeConfig> => layer !== undefined);

    return composeTheme(baseTheme, ...layers);
  }

  composeWithConditions(
    baseTheme: ThemeConfig,
    conditions: Record<string, boolean>
  ): ThemeConfig {
    const layers = Object.entries(conditions)
      .filter(([_, enabled]) => enabled)
      .map(([id]) => this.layers.get(id))
      .filter((layer): layer is Partial<ThemeConfig> => layer !== undefined);

    return composeTheme(baseTheme, ...layers);
  }
}

// Setup registry
const registry = new ThemeLayerRegistry();
registry.register('brand', brandLayer);
registry.register('dark', darkModeLayer);
registry.register('compact', compactLayer);
registry.register('accessible', accessibilityLayer);

// Compose themes from registry
const theme1 = registry.compose(foundation, 'brand', 'dark');
const theme2 = registry.compose(foundation, 'brand', 'compact', 'accessible');

// Compose with conditions
const theme3 = registry.composeWithConditions(foundation, {
  'brand': true,
  'dark': isDarkMode,
  'compact': userPreferences.compact,
  'accessible': userPreferences.a11y,
});
```

## Best Practices

### 1. Establish a Clear Layer Hierarchy

Define a consistent layering strategy for your application:

```
Foundation → Brand → Product → Environment → User
```

### 2. Keep Layers Focused

Each layer should have a single, clear purpose:

- **Foundation**: Complete design system baseline
- **Brand**: Brand identity (colors, fonts, logo)
- **Product**: Product-specific customizations
- **Environment**: Environment-specific overrides
- **User**: User preferences and personalization

### 3. Minimize Deep Overrides

Avoid overriding the same property in too many layers:

```typescript
// ❌ Bad: Same property overridden in every layer
foundation.tokens.color.primary = 'blue-600';
brand.tokens.color.primary = 'indigo-600';
product.tokens.color.primary = 'purple-600';
user.tokens.color.primary = 'pink-600';

// ✅ Good: Override only when necessary
foundation.tokens.color.primary = 'blue-600';
brand.tokens.color.primary = 'indigo-600';
// product and user layers don't override primary
```

### 4. Use Semantic Token Names

Token names should describe purpose, not appearance:

```typescript
// ❌ Bad
tokens: {
  color: {
    blue600: 'blue-600',
    indigo500: 'indigo-500',
  }
}

// ✅ Good
tokens: {
  color: {
    primary: 'blue-600',
    accent: 'indigo-500',
  }
}
```

### 5. Document Layer Purposes

Add comments explaining each layer's purpose:

```typescript
/**
 * Foundation Layer
 *
 * Purpose: Provides baseline design system for all themes
 * Overrides: None (base layer)
 * Used by: All themes
 */
const foundation: ThemeConfig = { /* ... */ };

/**
 * Brand Layer
 *
 * Purpose: Applies Acme Corp brand identity
 * Overrides: color.primary, color.accent, typography.fontFamily
 * Used by: All Acme Corp products
 */
const brandLayer = { /* ... */ };
```

### 6. Test Theme Composition

Write tests for your theme hierarchies:

```typescript
import { describe, it, expect } from 'vitest';
import { composeTheme } from '@sv0/stylesets';

describe('Theme Composition', () => {
  it('should merge tokens from multiple layers', () => {
    const composed = composeTheme(foundation, brandLayer, productLayer);

    expect(composed.tokens.color.primary).toBe('indigo-600'); // from brandLayer
    expect(composed.tokens.color.background).toBe('white'); // from foundation
    expect(composed.tokens.spacing.md).toBe('2rem'); // from productLayer
  });

  it('should preserve layer order', () => {
    const theme1 = composeTheme(foundation, layer1, layer2);
    const theme2 = composeTheme(foundation, layer2, layer1);

    // Later layers override earlier ones
    expect(theme1.tokens.color.primary).not.toBe(theme2.tokens.color.primary);
  });

  it('should handle nested token overrides', () => {
    const composed = composeTheme(foundation, brandLayer);

    expect(composed.tokens.color.nested.light).toBe('indigo-100');
    expect(composed.tokens.color.nested.dark).toBe('blue-900'); // inherited
  });
});
```

### 7. Use Type Safety

Leverage TypeScript for type-safe theme composition:

```typescript
import type { ThemeConfig } from '@sv0/stylesets';

// Define a strict theme structure
interface MyThemeTokens {
  color: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// Create type-safe theme
const typedFoundation: ThemeConfig = {
  id: 'foundation',
  name: 'Foundation',
  tokens: {
    color: {
      primary: 'blue-600',
      secondary: 'gray-600',
      accent: 'indigo-600',
      background: 'white',
      text: 'gray-900',
    },
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '3rem',
    },
  } satisfies MyThemeTokens,
};

// TypeScript will enforce token structure
```

### 8. Avoid Circular References

Don't create circular token references:

```typescript
// ❌ Bad: Circular reference
const badTheme: ThemeConfig = {
  id: 'bad',
  name: 'Bad',
  tokens: {
    color: {
      primary: '{color.secondary}',
      secondary: '{color.primary}', // ❌ Circular!
    },
  },
};

// ✅ Good: Linear references
const goodTheme: ThemeConfig = {
  id: 'good',
  name: 'Good',
  tokens: {
    color: {
      base: 'blue-600',
      primary: '{color.base}',
      primaryHover: '{color.base}', // References same base token
    },
  },
};
```

## Complete Examples

### Example 1: E-Commerce Platform

Complete theme hierarchy for a multi-brand e-commerce platform.

```typescript
// foundation.ts
export const foundation: ThemeConfig = {
  id: 'ecommerce-foundation',
  name: 'E-Commerce Foundation',

  tokens: {
    color: {
      // Product colors
      background: 'white',
      text: 'gray-900',

      // UI colors
      primary: 'blue-600',
      secondary: 'gray-600',

      // Status colors
      success: 'green-600',
      error: 'red-600',
      warning: 'yellow-600',

      // E-commerce specific
      price: 'gray-900',
      salePrice: 'red-600',
      discount: 'red-600',
      inStock: 'green-600',
      outOfStock: 'red-600',
    },

    spacing: {
      productGap: '1rem',
      sectionGap: '2rem',
      containerPadding: '1.5rem',
    },

    layout: {
      maxWidth: '1280px',
      gridColumns: '4',
      gridGap: '1rem',
    },
  },
};

// brand-fashion.ts
export const fashionBrand = {
  tokens: {
    color: {
      primary: 'rose-600',
      secondary: 'pink-600',
      accent: 'amber-500',
    },

    typography: {
      fontFamily: '"Playfair Display", serif',
      fontFamilyBody: '"Inter", sans-serif',
    },

    layout: {
      gridColumns: '3', // Fashion uses larger product cards
    },
  },

  cssVariables: {
    '--brand-name': '"Fashion House"',
  },
};

// brand-tech.ts
export const techBrand = {
  tokens: {
    color: {
      primary: 'blue-600',
      secondary: 'cyan-600',
      accent: 'indigo-500',
    },

    typography: {
      fontFamily: '"Inter", sans-serif',
      fontFamilyMono: '"JetBrains Mono", monospace',
    },

    layout: {
      gridColumns: '5', // Tech uses more compact layout
    },
  },

  cssVariables: {
    '--brand-name': '"Tech Store"',
  },
};

// product-checkout.ts
export const checkoutProduct = {
  tokens: {
    color: {
      primary: 'green-600', // Trust-building color for checkout
    },

    spacing: {
      sectionGap: '3rem', // More space for clarity
    },
  },
};

// Compose themes
export const fashionStoreTheme = composeTheme(foundation, fashionBrand);
export const fashionCheckoutTheme = composeTheme(foundation, fashionBrand, checkoutProduct);
export const techStoreTheme = composeTheme(foundation, techBrand);
export const techCheckoutTheme = composeTheme(foundation, techBrand, checkoutProduct);
```

### Example 2: Healthcare Application

Multi-layer theme system for a healthcare application with accessibility requirements.

```typescript
// healthcare-foundation.ts
export const healthcareFoundation: ThemeConfig = {
  id: 'healthcare',
  name: 'Healthcare Foundation',

  tokens: {
    color: {
      // Healthcare color palette
      primary: 'blue-600',        // Trust and calm
      secondary: 'teal-600',      // Health and wellness

      // Status colors matching medical context
      normal: 'green-600',
      caution: 'yellow-600',
      urgent: 'orange-600',
      critical: 'red-600',

      // Patient data colors
      patientInfo: 'blue-50',
      medicationInfo: 'purple-50',
      allergyWarning: 'red-50',
    },

    typography: {
      fontFamily: '"Open Sans", sans-serif', // Highly legible
      fontSize: {
        base: '1.125rem', // Larger default for medical professionals
      },
    },

    spacing: {
      // Generous spacing for touch targets (WCAG AAA)
      touchTarget: '44px',
      sectionGap: '2rem',
    },
  },

  accessibility: {
    focusRing: {
      default: 'focus:ring-4 focus:ring-blue-600 focus:ring-offset-4', // Extra visible
      auto: true,
    },

    highContrast: {
      colorMap: {
        'text-gray-600': 'text-black',
        'bg-gray-50': 'bg-white',
      },
      auto: true, // Always apply for medical context
    },
  },
};

// department-emergency.ts
export const emergencyDepartment = {
  tokens: {
    color: {
      primary: 'red-600',         // Urgency
      secondary: 'orange-600',    // High priority
    },

    spacing: {
      // Compact for emergency situations
      sectionGap: '1rem',
    },
  },
};

// department-pediatrics.ts
export const pediatricsDepartment = {
  tokens: {
    color: {
      primary: 'blue-400',        // Softer, child-friendly
      secondary: 'green-400',     // Calming
      accent: 'yellow-400',       // Playful

      background: 'blue-50',      // Gentle background
    },

    borderRadius: {
      default: '1rem',            // Softer, friendlier shapes
      lg: '2rem',
    },
  },

  cssVariables: {
    '--dept-mascot': 'url(/images/friendly-bear.svg)',
  },
};

// accessibility-low-vision.ts
export const lowVisionLayer = {
  tokens: {
    typography: {
      fontSize: {
        xs: '1.25rem',
        sm: '1.5rem',
        base: '1.75rem',
        lg: '2rem',
        xl: '2.5rem',
      },
    },
  },

  accessibility: {
    highContrast: {
      colorMap: {
        'text-gray-600': 'text-black',
        'text-gray-700': 'text-black',
        'text-gray-800': 'text-black',
        'bg-gray-50': 'bg-white',
        'bg-gray-100': 'bg-white',
        'border-gray-200': 'border-black',
        'border-gray-300': 'border-black',
      },
      auto: true,
    },
  },
};

// Compose themes
export const generalTheme = composeTheme(healthcareFoundation);
export const emergencyTheme = composeTheme(healthcareFoundation, emergencyDepartment);
export const pediatricsTheme = composeTheme(healthcareFoundation, pediatricsDepartment);
export const lowVisionEmergencyTheme = composeTheme(
  healthcareFoundation,
  emergencyDepartment,
  lowVisionLayer
);
```

### Example 3: Developer Tools

Theme system for a developer tools platform with environment-specific themes.

```typescript
// devtools-foundation.ts
export const devtoolsFoundation: ThemeConfig = {
  id: 'devtools',
  name: 'Dev Tools Foundation',

  tokens: {
    color: {
      // Code editor colors
      background: 'gray-900',
      text: 'gray-100',

      // Syntax highlighting
      syntax: {
        keyword: 'blue-400',
        string: 'green-400',
        number: 'orange-400',
        comment: 'gray-500',
        function: 'purple-400',
        variable: 'cyan-400',
      },

      // Status colors
      success: 'green-500',
      error: 'red-500',
      warning: 'yellow-500',
      info: 'blue-500',
    },

    typography: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: {
        code: '0.875rem',
      },
    },
  },
};

// product-editor.ts
export const editorProduct = {
  tokens: {
    layout: {
      sidebarWidth: '300px',
      panelHeight: '200px',
    },
  },
};

// product-terminal.ts
export const terminalProduct = {
  tokens: {
    color: {
      background: 'black',
      text: 'green-400',      // Classic terminal green
    },

    typography: {
      fontFamily: '"Courier New", monospace',
    },
  },
};

// env-development.ts
export const developmentEnv = {
  tokens: {
    color: {
      envIndicator: 'orange-500',
    },
  },

  base: 'dev-mode',

  cssVariables: {
    '--env': '"development"',
    '--env-color': '#f97316',
  },
};

// env-staging.ts
export const stagingEnv = {
  tokens: {
    color: {
      envIndicator: 'yellow-500',
    },
  },

  base: 'staging-mode',

  cssVariables: {
    '--env': '"staging"',
    '--env-color': '#eab308',
  },
};

// env-production.ts
export const productionEnv = {
  tokens: {
    color: {
      envIndicator: 'green-500',
    },
  },

  cssVariables: {
    '--env': '"production"',
    '--env-color': '#22c55e',
  },
};

// Compose themes
export const editorDevTheme = composeTheme(
  devtoolsFoundation,
  editorProduct,
  developmentEnv
);

export const editorProdTheme = composeTheme(
  devtoolsFoundation,
  editorProduct,
  productionEnv
);

export const terminalDevTheme = composeTheme(
  devtoolsFoundation,
  terminalProduct,
  developmentEnv
);

// Dynamic theme selection
export function getDevToolsTheme(
  product: 'editor' | 'terminal',
  environment: 'development' | 'staging' | 'production'
): ThemeConfig {
  const productLayer = product === 'editor' ? editorProduct : terminalProduct;
  const envLayer = {
    development: developmentEnv,
    staging: stagingEnv,
    production: productionEnv,
  }[environment];

  return composeTheme(devtoolsFoundation, productLayer, envLayer);
}
```

## Conclusion

Multi-layered theme composition is a powerful pattern for building scalable, maintainable design systems. By structuring themes into logical layers, you can:

- **Reduce duplication**: Common styles defined once in foundation
- **Enable flexibility**: Mix and match layers for different scenarios
- **Maintain consistency**: Changes to base layers propagate automatically
- **Support customization**: Users can override specific tokens
- **Scale effortlessly**: Add new layers without touching existing code

Start with a solid foundation, build focused layers, and compose them thoughtfully to create sophisticated theme hierarchies that scale with your application.

## Next Steps

- Read the [Theming Guide](./theming.md) for basics
- Explore [Token System](./tokens.md) for advanced token usage
- Check [Accessibility Guide](./accessibility.md) for accessible theming
- Review [API Reference](../api/themes.md) for complete theme API
