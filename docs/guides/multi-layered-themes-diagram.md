# Multi-Layered Theme Architecture - Visual Guide

This document provides visual diagrams and flowcharts to help understand how multi-layered theme composition works in StyleSets.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      THEME LAYER HIERARCHY                      │
└─────────────────────────────────────────────────────────────────┘

Layer 1: FOUNDATION
┌─────────────────────────────────────────────────────────────────┐
│  • Complete design system baseline                              │
│  • All tokens defined (colors, spacing, typography, etc.)      │
│  • Base accessibility configuration                             │
│  • CSS variables foundation                                     │
│                                                                 │
│  Purpose: Universal starting point for all themes              │
│  Coverage: 100% of design system                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    (inherits everything)
                              ↓
Layer 2: BRAND
┌─────────────────────────────────────────────────────────────────┐
│  • Brand identity (colors, fonts, logo)                        │
│  • Selective token overrides (primary, accent, typography)     │
│  • Brand-specific CSS variables                                │
│                                                                 │
│  Purpose: Apply brand identity                                 │
│  Coverage: ~10-20% override + 80-90% inherited                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    (inherits everything)
                              ↓
Layer 3: PRODUCT
┌─────────────────────────────────────────────────────────────────┐
│  • Product-specific customizations                             │
│  • Layout adjustments (grid, spacing, containers)              │
│  • Product-specific color tweaks                               │
│                                                                 │
│  Purpose: Optimize for product context                         │
│  Coverage: ~5-15% override + 85-95% inherited                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    (inherits everything)
                              ↓
Layer 4: ENVIRONMENT
┌─────────────────────────────────────────────────────────────────┐
│  • Environment indicators (dev/staging/prod)                   │
│  • Debug mode toggles                                          │
│  • Environment-specific CSS classes                            │
│                                                                 │
│  Purpose: Visual environment identification                    │
│  Coverage: ~1-5% override + 95-99% inherited                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    (inherits everything)
                              ↓
Layer 5: USER PERSONALIZATION
┌─────────────────────────────────────────────────────────────────┐
│  • User preferences (density, font size, contrast)             │
│  • Custom color selections                                     │
│  • Accessibility overrides                                     │
│                                                                 │
│  Purpose: Individual user customization                        │
│  Coverage: ~5-10% override + 90-95% inherited                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                         FINAL THEME
```

## Token Resolution Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     TOKEN RESOLUTION CHAIN                      │
└─────────────────────────────────────────────────────────────────┘

Example: Resolving "primary" color token

Request: {color.primary}
    │
    ├─→ Check Layer 5 (User)
    │   └─→ Found: "violet-600" ✓
    │       └─→ RETURN "violet-600"
    │
    ├─→ Check Layer 4 (Environment)
    │   └─→ Not defined ✗
    │       └─→ Continue to Layer 3
    │
    ├─→ Check Layer 3 (Product)
    │   └─→ Found: "green-600" (but Layer 5 overrides)
    │       └─→ Skip
    │
    ├─→ Check Layer 2 (Brand)
    │   └─→ Found: "indigo-600" (but Layer 5 overrides)
    │       └─→ Skip
    │
    └─→ Check Layer 1 (Foundation)
        └─→ Found: "blue-600" (but Layer 5 overrides)
            └─→ Skip

RESULT: "violet-600" (from Layer 5 - User)


Example: Resolving "background" color token

Request: {color.background}
    │
    ├─→ Check Layer 5 (User)
    │   └─→ Not defined ✗
    │       └─→ Continue to Layer 4
    │
    ├─→ Check Layer 4 (Environment)
    │   └─→ Not defined ✗
    │       └─→ Continue to Layer 3
    │
    ├─→ Check Layer 3 (Product)
    │   └─→ Not defined ✗
    │       └─→ Continue to Layer 2
    │
    ├─→ Check Layer 2 (Brand)
    │   └─→ Not defined ✗
    │       └─→ Continue to Layer 1
    │
    └─→ Check Layer 1 (Foundation)
        └─→ Found: "white" ✓
            └─→ RETURN "white"

RESULT: "white" (from Layer 1 - Foundation)
```

## Deep Merge Behavior

```
┌─────────────────────────────────────────────────────────────────┐
│                      DEEP MERGE ALGORITHM                       │
└─────────────────────────────────────────────────────────────────┘

Foundation Layer:
{
  tokens: {
    color: {
      primary: "blue-600",
      secondary: "gray-600",
      nested: {
        light: "blue-100",
        dark: "blue-900"
      }
    },
    spacing: {
      sm: "0.5rem",
      md: "1rem"
    }
  }
}

                    ↓ MERGE WITH ↓

Brand Layer:
{
  tokens: {
    color: {
      primary: "indigo-600",        ← Overrides foundation.color.primary
      nested: {
        light: "indigo-100",        ← Overrides foundation.color.nested.light
        medium: "indigo-500"        ← New property (doesn't exist in foundation)
      }
    }
  }
}

                    ↓ RESULT ↓

Composed Theme:
{
  tokens: {
    color: {
      primary: "indigo-600",        ← From Brand Layer
      secondary: "gray-600",        ← From Foundation Layer (inherited)
      nested: {
        light: "indigo-100",        ← From Brand Layer
        dark: "blue-900",           ← From Foundation Layer (inherited)
        medium: "indigo-500"        ← From Brand Layer (new)
      }
    },
    spacing: {
      sm: "0.5rem",                 ← From Foundation Layer (inherited)
      md: "1rem"                    ← From Foundation Layer (inherited)
    }
  }
}

KEY INSIGHT: Nested objects are deeply merged, not replaced entirely.
             Only explicitly defined properties are overridden.
```

## Real-World Example: E-Commerce Platform

```
┌─────────────────────────────────────────────────────────────────┐
│           E-COMMERCE MULTI-TENANT THEME ARCHITECTURE            │
└─────────────────────────────────────────────────────────────────┘

                        FOUNDATION
                    (Universal Base)
                    ┌─────────────┐
                    │ Colors      │
                    │ Spacing     │
                    │ Typography  │
                    │ Layout      │
                    │ A11y        │
                    └──────┬──────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ↓              ↓              ↓
      BRAND: Fashion  BRAND: Tech   BRAND: Organic
      ┌────────────┐  ┌────────────┐  ┌────────────┐
      │ Rose/Gold  │  │ Blue/Cyan  │  │ Green/Amber│
      │ Serif      │  │ Sans-serif │  │ Rounded    │
      └─────┬──────┘  └─────┬──────┘  └─────┬──────┘
            │               │               │
      ┌─────┼─────┐   ┌─────┼─────┐   ┌─────┼─────┐
      ↓     ↓     ↓   ↓     ↓     ↓   ↓     ↓     ↓
   Catalog Check Dash Cat Check Dash Cat Check Dash
   ┌─────┐┌─────┐┌──┐┌──┐┌─────┐┌──┐┌──┐┌─────┐┌──┐
   │Grid ││Trust││UI││Gr││Trust││UI││Gr││Trust││UI│
   └──┬──┘└──┬──┘└┬─┘└┬─┘└──┬──┘└┬─┘└┬─┘└──┬──┘└┬─┘
      │      │    │   │     │    │   │     │    │
   ┌──┴──┬───┴────┴───┴─────┴────┴───┴─────┴────┴──┐
   │           ENVIRONMENT LAYER                     │
   │  Dev (Orange) │ Staging (Yellow) │ Prod (None) │
   └──────────────┬──────────────────────────────────┘
                  │
   ┌──────────────┴──────────────────────────────────┐
   │          USER PERSONALIZATION LAYER             │
   │  Density │ Font Size │ Contrast │ Custom Colors │
   └─────────────────────────────────────────────────┘

Total Possible Combinations: 3 brands × 3 products × 3 envs = 27 base themes
With user personalization: Effectively unlimited variations
```

## CSS Variables Cascade

```
┌─────────────────────────────────────────────────────────────────┐
│                   CSS VARIABLES CASCADE                         │
└─────────────────────────────────────────────────────────────────┘

Foundation Layer:
:root {
  --spacing-unit: 0.25rem;
  --font-sans: system-ui, sans-serif;
  --color-background: #ffffff;
  --color-text: #111827;
  --radius-default: 0.25rem;
}

                    ↓ APPLY BRAND ↓

Brand Layer (adds/overwrites):
:root {
  --spacing-unit: 0.25rem;              ← Unchanged (inherited)
  --font-sans: "Inter", sans-serif;     ← Overridden
  --color-background: #ffffff;          ← Unchanged (inherited)
  --color-text: #111827;                ← Unchanged (inherited)
  --radius-default: 0.25rem;            ← Unchanged (inherited)
  --color-primary: #4f46e5;             ← NEW (brand)
  --brand-gradient: linear-gradient(...); ← NEW (brand)
}

                    ↓ APPLY USER ↓

User Layer (adds/overwrites):
:root {
  --spacing-unit: 0.375rem;             ← Overridden (spacious)
  --font-sans: "Inter", sans-serif;     ← Unchanged (inherited)
  --color-background: #ffffff;          ← Unchanged (inherited)
  --color-text: #111827;                ← Unchanged (inherited)
  --radius-default: 0.25rem;            ← Unchanged (inherited)
  --color-primary: #7c3aed;             ← Overridden (custom)
  --brand-gradient: linear-gradient(...); ← Unchanged (inherited)
  --user-density: 1.5;                  ← NEW (user)
  --user-font-scale: 1.125;             ← NEW (user)
}

FINAL STATE: All layers' variables available on :root
```

## Composition Strategies Comparison

```
┌─────────────────────────────────────────────────────────────────┐
│              COMPOSITION STRATEGY COMPARISON                    │
└─────────────────────────────────────────────────────────────────┘

Strategy 1: LINEAR CHAIN (Recommended for most use cases)
──────────────────────────────────────────────────────────────────
Foundation → Brand → Product → Environment → User

Pros:
  ✓ Clear inheritance chain
  ✓ Easy to understand and debug
  ✓ Predictable token resolution
  ✓ Good for 80% of use cases

Cons:
  ✗ Limited flexibility for complex scenarios
  ✗ Can't easily mix product contexts

Example:
  const theme = composeTheme(
    foundation,
    brandLayer,
    productLayer,
    envLayer,
    userLayer
  );


Strategy 2: CONDITIONAL BRANCHES
──────────────────────────────────────────────────────────────────
                    Foundation
                        │
                    ┌───┴───┐
                Brand A   Brand B
                    │       │
              ┌─────┼───┐   └───┐
           Prod 1  Prod 2    Prod 3

Pros:
  ✓ Maximum flexibility
  ✓ Different products per brand
  ✓ Runtime composition

Cons:
  ✗ More complex to manage
  ✗ Harder to predict token values

Example:
  function getTheme(brand, product) {
    const brandLayer = brands[brand];
    const productLayer = products[brand][product];
    return composeTheme(foundation, brandLayer, productLayer);
  }


Strategy 3: FEATURE FLAGS
──────────────────────────────────────────────────────────────────
Foundation → Brand → Product → [Feature Layers...]

Pros:
  ✓ Dynamic feature toggling
  ✓ A/B testing friendly
  ✓ Progressive rollout

Cons:
  ✗ Potential for inconsistency
  ✗ Requires careful testing

Example:
  const layers = [foundation, brand, product];
  if (features.newDesign) layers.push(newDesignLayer);
  if (features.darkMode) layers.push(darkModeLayer);
  const theme = composeTheme(...layers);


Strategy 4: MATRIX COMPOSITION
──────────────────────────────────────────────────────────────────
                Foundation
                     │
        ┌────────────┼────────────┐
     Brand 1      Brand 2      Brand 3
        │            │            │
    ┌───┼───┐    ┌───┼───┐    ┌───┼───┐
  Prod Product  Prod Product  Prod Product
    1   2   3    1   2   3    1   2   3

Pros:
  ✓ Systematic coverage
  ✓ Consistent structure
  ✓ Easy to scale

Cons:
  ✗ Can create unnecessary combinations
  ✗ Maintenance overhead

Example:
  const themes = brands.flatMap(brand =>
    products.map(product =>
      composeTheme(foundation, brand, product)
    )
  );
```

## Performance Considerations

```
┌─────────────────────────────────────────────────────────────────┐
│                 PERFORMANCE CHARACTERISTICS                     │
└─────────────────────────────────────────────────────────────────┘

Layer Count vs. Composition Time:
───────────────────────────────────────────────────────────────────
1 layer:  <1ms   ████
2 layers: <1ms   ████▓
3 layers: ~1ms   ████▓▓
4 layers: ~1ms   ████▓▓▓
5 layers: ~2ms   ████▓▓▓▓
6+ layers: ~3ms  ████▓▓▓▓▓  (⚠ consider optimization)

Token Count vs. Resolution Time:
───────────────────────────────────────────────────────────────────
50 tokens:   <1ms   ████
100 tokens:  <1ms   ████▓
500 tokens:  ~2ms   ████▓▓
1000 tokens: ~5ms   ████▓▓▓  (⚠ large design system)
5000 tokens: ~20ms  ████▓▓▓▓▓▓  (⚠ reconsider structure)

Best Practices:
───────────────────────────────────────────────────────────────────
✓ Keep layer count under 5 for most applications
✓ Cache composed themes (don't recompose on every render)
✓ Use ThemeManager for centralized theme handling
✓ Lazy-load layers that aren't always needed
✓ Profile with realistic token counts

Optimization Strategies:
───────────────────────────────────────────────────────────────────
1. Pre-compose themes at build time
2. Use CSS variables for runtime changes instead of recomposition
3. Implement theme memoization
4. Split large design systems into smaller, focused sets
5. Use theme variants for small changes instead of full recomposition
```

## Decision Tree: How Many Layers?

```
┌─────────────────────────────────────────────────────────────────┐
│           LAYER COUNT DECISION TREE                             │
└─────────────────────────────────────────────────────────────────┘

START: How many brands/clients?
    │
    ├─→ 1 brand
    │   │
    │   └─→ How many product lines?
    │       │
    │       ├─→ 1 product → USE 2 LAYERS
    │       │              (Foundation + Brand)
    │       │
    │       ├─→ 2-5 products → USE 3 LAYERS
    │       │                  (Foundation + Brand + Product)
    │       │
    │       └─→ 6+ products → USE 3-4 LAYERS
    │                         (Foundation + Brand + Product + Environment)
    │
    └─→ 2+ brands
        │
        └─→ How many products per brand?
            │
            ├─→ Same products across brands → USE 3 LAYERS
            │                                  (Foundation + Brand + Product)
            │
            ├─→ Different products per brand → USE 3-4 LAYERS
            │                                   (Foundation + Brand + Product + Custom)
            │
            └─→ User customization needed? → USE 4-5 LAYERS
                                             (Foundation + Brand + Product + Env + User)

Additional Considerations:
───────────────────────────────────────────────────────────────────
• Add Environment layer if dev/staging/prod need visual distinction
• Add User layer if personalization is a core feature
• Consider conditional layers for feature flags
• Keep total layers ≤ 5 for maintainability
```

## Common Patterns Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMMON PATTERNS                              │
└─────────────────────────────────────────────────────────────────┘

Pattern: SIMPLE BRANDING
───────────────────────────────────────────────────────────────────
Layers: Foundation → Brand (2 layers)
Use case: Single product, single brand, basic theming
Example: Portfolio website, small business site
Complexity: ★☆☆☆☆


Pattern: PRODUCT LINE
───────────────────────────────────────────────────────────────────
Layers: Foundation → Brand → Product (3 layers)
Use case: Multiple products under one brand
Example: SaaS with dashboard + marketing site
Complexity: ★★☆☆☆


Pattern: MULTI-TENANT SAAS
───────────────────────────────────────────────────────────────────
Layers: Foundation → Tenant → Product (3 layers)
Use case: Different customers, same product structure
Example: White-label B2B SaaS platform
Complexity: ★★★☆☆


Pattern: ENTERPRISE APPLICATION
───────────────────────────────────────────────────────────────────
Layers: Foundation → Brand → Product → Environment (4 layers)
Use case: Large app with multiple environments
Example: Enterprise software with dev/staging/prod
Complexity: ★★★★☆


Pattern: PERSONALIZED PLATFORM
───────────────────────────────────────────────────────────────────
Layers: Foundation → Brand → Product → Environment → User (5 layers)
Use case: User customization is core feature
Example: Design tool, accessibility-focused app
Complexity: ★★★★★


Pattern: DEPARTMENT/DIVISION
───────────────────────────────────────────────────────────────────
Layers: Corporate → Department → Project (3 layers)
Use case: Large organization with distinct divisions
Example: Corporate intranet with department branding
Complexity: ★★★☆☆
```

## Conclusion

Multi-layered theme composition provides a powerful, flexible system for managing design systems at scale. The key principles are:

1. **Foundation First**: Start with a complete, comprehensive base layer
2. **Selective Overrides**: Each layer overrides only what it needs to
3. **Deep Merging**: Nested objects merge intelligently, not replace entirely
4. **Clear Hierarchy**: Maintain a logical, predictable layer order
5. **Performance Aware**: Keep layer count reasonable (typically ≤5)

Choose the pattern that best fits your use case, and don't over-engineer with unnecessary layers.
