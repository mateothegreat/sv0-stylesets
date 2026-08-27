/**
 * Multi-Layered Theme Composition - Practical Example
 *
 * This example demonstrates a complete implementation of multi-layered theme
 * composition for a fictional e-commerce platform with multiple brands and
 * product lines.
 *
 * Theme Hierarchy:
 * 1. Foundation    - Base design system
 * 2. Brand         - Brand-specific identity
 * 3. Product       - Product-specific customization
 * 4. Environment   - Environment overrides (dev/staging/prod)
 * 5. User          - User personalization
 */

import {
  composeTheme,
  createThemeVariant,
  ThemeManager,
  createStyleSet,
  type ThemeConfig,
} from '@sv0/stylesets';

// ============================================================================
// LAYER 1: FOUNDATION - Complete Design System
// ============================================================================

/**
 * Foundation Layer
 *
 * Purpose: Provides comprehensive baseline design system
 * Scope: Used by all themes across all brands and products
 * Overrides: None (this is the base layer)
 *
 * This layer defines:
 * - Complete color palette with semantic mappings
 * - Spacing scale based on 0.25rem unit
 * - Typography system with font families and sizes
 * - Border radius scale
 * - Shadow system
 * - Base accessibility configuration
 */
const foundation: ThemeConfig = {
  id: 'foundation',
  name: 'Foundation',
  darkMode: false,

  tokens: {
    // ========== COLOR SYSTEM ==========
    color: {
      // Neutral palette - grayscale for UI elements
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

      // Surface colors - backgrounds and containers
      background: 'white',
      backgroundAlt: 'gray-50',
      surface: 'white',
      surfaceElevated: 'white',
      surfaceOverlay: 'white',

      // Text colors
      text: 'gray-900',
      textMuted: 'gray-600',
      textSubtle: 'gray-500',
      textDisabled: 'gray-400',
      textInverse: 'white',

      // Semantic colors (to be customized by brand)
      primary: 'blue-600',
      primaryHover: 'blue-700',
      primaryActive: 'blue-800',
      primarySubtle: 'blue-50',
      onPrimary: 'white',

      secondary: 'gray-600',
      secondaryHover: 'gray-700',
      secondaryActive: 'gray-800',
      secondarySubtle: 'gray-50',
      onSecondary: 'white',

      accent: 'indigo-600',
      accentHover: 'indigo-700',
      accentActive: 'indigo-800',
      accentSubtle: 'indigo-50',
      onAccent: 'white',

      // Status colors - consistent across all themes
      success: 'green-600',
      successHover: 'green-700',
      successSubtle: 'green-50',
      onSuccess: 'white',

      warning: 'yellow-600',
      warningHover: 'yellow-700',
      warningSubtle: 'yellow-50',
      onWarning: 'black',

      error: 'red-600',
      errorHover: 'red-700',
      errorSubtle: 'red-50',
      onError: 'white',

      info: 'blue-600',
      infoHover: 'blue-700',
      infoSubtle: 'blue-50',
      onInfo: 'white',

      // Border colors
      border: 'gray-200',
      borderHover: 'gray-300',
      borderFocus: 'blue-500',
      borderError: 'red-500',
      borderDisabled: 'gray-100',
    },

    // ========== SPACING SYSTEM ==========
    spacing: {
      // Base unit for all spacing calculations
      unit: '0.25rem', // 4px

      // Spacing scale (based on 4px unit)
      0: '0',
      px: '1px',
      0.5: '0.125rem', // 2px
      1: '0.25rem', // 4px
      2: '0.5rem', // 8px
      3: '0.75rem', // 12px
      4: '1rem', // 16px
      5: '1.25rem', // 20px
      6: '1.5rem', // 24px
      7: '1.75rem', // 28px
      8: '2rem', // 32px
      9: '2.25rem', // 36px
      10: '2.5rem', // 40px
      11: '2.75rem', // 44px
      12: '3rem', // 48px
      14: '3.5rem', // 56px
      16: '4rem', // 64px
      20: '5rem', // 80px
      24: '6rem', // 96px
      28: '7rem', // 112px
      32: '8rem', // 128px
    },

    // ========== TYPOGRAPHY SYSTEM ==========
    typography: {
      // Font families
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontFamilyMono: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      fontFamilySerif: 'Georgia, Cambria, "Times New Roman", Times, serif',

      // Font weights
      fontWeightThin: '100',
      fontWeightExtraLight: '200',
      fontWeightLight: '300',
      fontWeightNormal: '400',
      fontWeightMedium: '500',
      fontWeightSemibold: '600',
      fontWeightBold: '700',
      fontWeightExtraBold: '800',
      fontWeightBlack: '900',

      // Font sizes
      fontSize: {
        xs: '0.75rem', // 12px
        sm: '0.875rem', // 14px
        base: '1rem', // 16px
        lg: '1.125rem', // 18px
        xl: '1.25rem', // 20px
        '2xl': '1.5rem', // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem', // 36px
        '5xl': '3rem', // 48px
        '6xl': '3.75rem', // 60px
        '7xl': '4.5rem', // 72px
        '8xl': '6rem', // 96px
        '9xl': '8rem', // 128px
      },

      // Line heights
      lineHeight: {
        none: '1',
        tight: '1.25',
        snug: '1.375',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2',
      },

      // Letter spacing
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },
    },

    // ========== BORDER RADIUS SYSTEM ==========
    borderRadius: {
      none: '0',
      sm: '0.125rem', // 2px
      default: '0.25rem', // 4px
      md: '0.375rem', // 6px
      lg: '0.5rem', // 8px
      xl: '0.75rem', // 12px
      '2xl': '1rem', // 16px
      '3xl': '1.5rem', // 24px
      full: '9999px',
    },

    // ========== SHADOW SYSTEM ==========
    shadow: {
      none: 'none',
      xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      default: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      md: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      lg: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      '2xl': '0 35px 60px -15px rgb(0 0 0 / 0.3)',
      inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    },

    // ========== LAYOUT SYSTEM ==========
    layout: {
      // Container widths
      containerMaxWidth: '1280px',
      containerPadding: '1.5rem',

      // Sidebar
      sidebarWidth: '256px',
      sidebarCollapsedWidth: '64px',

      // Header
      headerHeight: '64px',
      headerHeightMobile: '56px',

      // Footer
      footerHeight: '200px',

      // Grid
      gridColumns: '12',
      gridGap: '1rem',
    },

    // ========== Z-INDEX SYSTEM ==========
    zIndex: {
      base: '0',
      dropdown: '1000',
      sticky: '1100',
      fixed: '1200',
      modalBackdrop: '1300',
      modal: '1400',
      popover: '1500',
      tooltip: '1600',
    },
  },

  // ========== ACCESSIBILITY CONFIGURATION ==========
  accessibility: {
    // Focus ring for interactive elements
    focusRing: {
      default: 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
      auto: true, // Automatically apply to interactive elements
    },

    // Respect prefers-reduced-motion
    reducedMotion: {
      replace: {
        'transition-all': 'transition-none',
        'transition-colors': 'transition-none',
        'transition-opacity': 'transition-none',
        'transition-transform': 'transition-none',
        'animate-spin': 'animate-none',
        'animate-ping': 'animate-none',
        'animate-pulse': 'animate-none',
        'animate-bounce': 'animate-none',
      },
      auto: true, // Automatically apply when user prefers reduced motion
    },
  },

  // ========== CSS VARIABLES ==========
  cssVariables: {
    '--font-sans': 'system-ui, -apple-system, sans-serif',
    '--font-mono': 'Monaco, Consolas, monospace',
    '--font-serif': 'Georgia, Cambria, serif',
    '--spacing-unit': '0.25rem',
  },
};

// ============================================================================
// LAYER 2: BRAND - Brand Identity Customization
// ============================================================================

/**
 * Luxury Fashion Brand
 *
 * Purpose: Apply luxury fashion brand identity
 * Inherits: All foundation tokens
 * Overrides: Brand colors, typography, border radius
 *
 * Brand characteristics:
 * - Elegant serif typography
 * - Rose gold and black color scheme
 * - Generous spacing
 * - Soft, rounded corners
 */
const luxuryFashionBrand = {
  name: 'Luxury Fashion',

  tokens: {
    color: {
      // Brand color palette
      primary: 'rose-600', // Rose gold
      primaryHover: 'rose-700',
      primaryActive: 'rose-800',
      primarySubtle: 'rose-50',
      // onPrimary: 'white' inherited

      secondary: 'gray-900', // Deep black
      secondaryHover: 'gray-800',
      secondaryActive: 'gray-700',
      secondarySubtle: 'gray-100',

      accent: 'amber-600', // Gold accent
      accentHover: 'amber-700',
      accentSubtle: 'amber-50',

      // All other colors inherited from foundation
    },

    typography: {
      // Elegant serif for headings
      fontFamily: '"Playfair Display", Georgia, serif',
      fontFamilyBody: '"Inter", system-ui, sans-serif',

      // Refined letter spacing
      letterSpacing: {
        normal: '0.025em', // Slightly wider
        wide: '0.05em',
        wider: '0.1em',
      },

      // All other typography tokens inherited
    },

    spacing: {
      // More generous spacing for luxury feel
      4: '1.25rem', // Was 1rem
      6: '2rem', // Was 1.5rem
      8: '2.5rem', // Was 2rem
      // Other spacing values inherited
    },

    borderRadius: {
      // Softer, more rounded corners
      default: '0.5rem', // Was 0.25rem
      md: '0.75rem', // Was 0.375rem
      lg: '1rem', // Was 0.5rem
      xl: '1.5rem', // Was 0.75rem
      // Other radius values inherited
    },
  },

  cssVariables: {
    '--brand-name': '"Maison Élégance"',
    '--brand-primary': '#e11d48',
    '--brand-gradient': 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
  },
};

/**
 * Tech Brand
 *
 * Purpose: Apply modern tech brand identity
 * Inherits: All foundation tokens
 * Overrides: Brand colors, typography, sharp corners
 *
 * Brand characteristics:
 * - Modern sans-serif and monospace fonts
 * - Blue and cyan color scheme
 * - Sharp, minimal corners
 * - Compact spacing
 */
const techBrand = {
  name: 'Tech Store',

  tokens: {
    color: {
      // Tech brand colors
      primary: 'blue-600',
      primaryHover: 'blue-700',
      primarySubtle: 'blue-50',

      secondary: 'gray-700',
      secondaryHover: 'gray-800',

      accent: 'cyan-500',
      accentHover: 'cyan-600',
      accentSubtle: 'cyan-50',
    },

    typography: {
      fontFamily: '"Inter", system-ui, sans-serif',
      fontFamilyMono: '"JetBrains Mono", Monaco, monospace',

      // Tighter letter spacing for tech aesthetic
      letterSpacing: {
        normal: '-0.01em',
        wide: '0em',
      },
    },

    borderRadius: {
      // Sharp, minimal corners
      default: '0.125rem',
      md: '0.25rem',
      lg: '0.375rem',
      xl: '0.5rem',
    },
  },

  cssVariables: {
    '--brand-name': '"TechHub"',
    '--brand-primary': '#2563eb',
    '--brand-gradient': 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  },
};

/**
 * Organic/Eco Brand
 *
 * Purpose: Apply eco-friendly brand identity
 * Inherits: All foundation tokens
 * Overrides: Green color palette, natural typography
 *
 * Brand characteristics:
 * - Earthy green color palette
 * - Natural, organic shapes (rounded)
 * - Calm, relaxed spacing
 */
const organicBrand = {
  name: 'Organic Store',

  tokens: {
    color: {
      primary: 'green-600',
      primaryHover: 'green-700',
      primarySubtle: 'green-50',

      secondary: 'amber-700',
      secondaryHover: 'amber-800',
      secondarySubtle: 'amber-50',

      accent: 'lime-600',
      accentHover: 'lime-700',
      accentSubtle: 'lime-50',

      // Warm, natural background
      background: 'amber-50',
      backgroundAlt: 'green-50',
    },

    typography: {
      fontFamily: '"Nunito", system-ui, sans-serif',
    },

    borderRadius: {
      // Organic, rounded shapes
      default: '0.75rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
  },

  cssVariables: {
    '--brand-name': '"Earth & Co"',
    '--brand-primary': '#16a34a',
    '--brand-gradient': 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
  },
};

// ============================================================================
// LAYER 3: PRODUCT - Product-Specific Customization
// ============================================================================

/**
 * Product Page Layout
 *
 * Purpose: Customize layout for product browsing pages
 * Inherits: Foundation + Brand layers
 * Overrides: Layout tokens, grid configuration
 */
const productPageLayer = {
  tokens: {
    layout: {
      // Product-specific layout
      gridColumns: '4', // 4 columns for product grid
      gridGap: '1.5rem', // More space between products
      containerMaxWidth: '1440px', // Wider for product showcase
    },

    spacing: {
      // Product card spacing
      productCardPadding: '1rem',
      productImageGap: '0.75rem',
    },
  },
};

/**
 * Checkout Flow
 *
 * Purpose: Optimize layout for checkout process
 * Inherits: Foundation + Brand layers
 * Overrides: Colors (trust-building), layout (focused)
 *
 * Checkout characteristics:
 * - Trust-building green primary color
 * - Focused, single-column layout
 * - Generous spacing for clarity
 * - Enhanced security indicators
 */
const checkoutFlowLayer = {
  tokens: {
    color: {
      // Trust-building green for checkout
      primary: 'green-600',
      primaryHover: 'green-700',
      primarySubtle: 'green-50',

      // Highlighted security elements
      secure: 'green-600',
      secureSubtle: 'green-50',
    },

    layout: {
      containerMaxWidth: '960px', // Narrower, focused layout
      gridColumns: '1', // Single column for checkout
    },

    spacing: {
      // Extra spacing for clarity and easy touch targets
      6: '2rem', // Was 1.5rem
      8: '3rem', // Was 2rem
      12: '4rem', // Was 3rem
    },
  },

  accessibility: {
    focusRing: {
      // Extra visible focus for form fields
      default: 'focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-offset-4',
    },
  },

  cssVariables: {
    '--checkout-step-indicator': '#22c55e',
  },
};

/**
 * Dashboard/Admin Interface
 *
 * Purpose: Optimize for data-dense admin interface
 * Inherits: Foundation + Brand layers
 * Overrides: Compact spacing, data visualization colors
 */
const dashboardLayer = {
  tokens: {
    color: {
      // Data visualization colors
      dataViz: {
        blue: 'blue-500',
        green: 'green-500',
        yellow: 'yellow-500',
        red: 'red-500',
        purple: 'purple-500',
        orange: 'orange-500',
        teal: 'teal-500',
        pink: 'pink-500',
      },

      // Sidebar specific
      sidebar: 'gray-900',
      sidebarHover: 'gray-800',
      sidebarActive: 'gray-700',
    },

    spacing: {
      // Compact spacing for data density
      2: '0.375rem', // Was 0.5rem
      3: '0.625rem', // Was 0.75rem
      4: '0.875rem', // Was 1rem
      6: '1.25rem', // Was 1.5rem
    },

    layout: {
      sidebarWidth: '280px', // Wider sidebar for navigation
      headerHeight: '56px', // Shorter header to maximize content
      containerMaxWidth: '100%', // Full width for data tables
    },
  },
};

// ============================================================================
// LAYER 4: ENVIRONMENT - Environment-Specific Overrides
// ============================================================================

/**
 * Development Environment
 *
 * Purpose: Visual indicators for development mode
 * Inherits: All previous layers
 * Overrides: Adds orange env indicator
 */
const developmentEnv = {
  tokens: {
    color: {
      envIndicator: 'orange-500',
      envBg: 'orange-50',
    },
  },

  base: 'dev-mode', // CSS class applied to root

  cssVariables: {
    '--env': '"development"',
    '--env-color': '#f97316',
    '--debug-mode': '1',
  },
};

/**
 * Staging Environment
 *
 * Purpose: Visual indicators for staging mode
 * Inherits: All previous layers
 * Overrides: Adds yellow env indicator
 */
const stagingEnv = {
  tokens: {
    color: {
      envIndicator: 'yellow-500',
      envBg: 'yellow-50',
    },
  },

  base: 'staging-mode',

  cssVariables: {
    '--env': '"staging"',
    '--env-color': '#eab308',
    '--debug-mode': '0',
  },
};

/**
 * Production Environment
 *
 * Purpose: Clean production mode (no indicators)
 * Inherits: All previous layers
 * Overrides: None (uses defaults)
 */
const productionEnv = {
  cssVariables: {
    '--env': '"production"',
    '--env-color': 'transparent',
    '--debug-mode': '0',
  },
};

// ============================================================================
// LAYER 5: USER - User Personalization
// ============================================================================

/**
 * User Preferences Interface
 */
interface UserPreferences {
  // Display density
  density: 'compact' | 'comfortable' | 'spacious';

  // Font size preference
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';

  // Contrast mode
  contrastMode: 'normal' | 'high';

  // Motion preference (auto-detected or manual)
  reduceMotion?: boolean;

  // Custom primary color (optional)
  customPrimaryColor?: string;

  // Custom accent color (optional)
  customAccentColor?: string;
}

/**
 * Create User Personalization Layer
 *
 * Purpose: Apply user-specific preferences
 * Inherits: All previous layers
 * Overrides: Spacing, typography, colors based on preferences
 *
 * @param preferences User's preferences object
 * @returns Theme layer with user customizations
 */
function createUserPersonalizationLayer(preferences: UserPreferences) {
  // Density multipliers
  const densityConfig = {
    compact: {
      spacingMultiplier: 0.75,
      paddingMultiplier: 0.8,
    },
    comfortable: {
      spacingMultiplier: 1,
      paddingMultiplier: 1,
    },
    spacious: {
      spacingMultiplier: 1.5,
      paddingMultiplier: 1.25,
    },
  };

  // Font size multipliers
  const fontSizeConfig = {
    small: 0.875,
    medium: 1,
    large: 1.125,
    'extra-large': 1.25,
  };

  const { spacingMultiplier, paddingMultiplier } = densityConfig[preferences.density];
  const fontMultiplier = fontSizeConfig[preferences.fontSize];

  return {
    tokens: {
      // Apply spacing density
      spacing: {
        1: `${0.25 * spacingMultiplier}rem`,
        2: `${0.5 * spacingMultiplier}rem`,
        3: `${0.75 * spacingMultiplier}rem`,
        4: `${1 * spacingMultiplier}rem`,
        5: `${1.25 * spacingMultiplier}rem`,
        6: `${1.5 * spacingMultiplier}rem`,
        8: `${2 * spacingMultiplier}rem`,
        10: `${2.5 * spacingMultiplier}rem`,
        12: `${3 * spacingMultiplier}rem`,
      },

      // Apply font size preference
      typography: {
        fontSize: {
          xs: `${0.75 * fontMultiplier}rem`,
          sm: `${0.875 * fontMultiplier}rem`,
          base: `${1 * fontMultiplier}rem`,
          lg: `${1.125 * fontMultiplier}rem`,
          xl: `${1.25 * fontMultiplier}rem`,
          '2xl': `${1.5 * fontMultiplier}rem`,
          '3xl': `${1.875 * fontMultiplier}rem`,
          '4xl': `${2.25 * fontMultiplier}rem`,
        },
      },

      // Apply custom colors if provided
      ...(preferences.customPrimaryColor && {
        color: {
          primary: preferences.customPrimaryColor,
          primaryHover: preferences.customPrimaryColor,
        },
      }),

      ...(preferences.customAccentColor && {
        color: {
          accent: preferences.customAccentColor,
          accentHover: preferences.customAccentColor,
        },
      }),
    },

    // Apply high contrast if requested
    ...(preferences.contrastMode === 'high' && {
      accessibility: {
        highContrast: {
          colorMap: {
            'text-gray-600': 'text-black',
            'text-gray-500': 'text-black',
            'text-gray-400': 'text-gray-900',
            'bg-gray-50': 'bg-white',
            'bg-gray-100': 'bg-white',
            'bg-gray-200': 'bg-gray-50',
            'border-gray-200': 'border-black',
            'border-gray-300': 'border-black',
          },
          auto: true,
        },
      },
    }),

    // Apply reduced motion if specified
    ...(preferences.reduceMotion && {
      accessibility: {
        reducedMotion: {
          replace: {
            transition: 'transition-none',
            animate: 'animate-none',
          },
          auto: true,
        },
      },
    }),

    cssVariables: {
      '--user-density': String(spacingMultiplier),
      '--user-font-scale': String(fontMultiplier),
      '--user-padding-scale': String(paddingMultiplier),
    },
  };
}

// ============================================================================
// THEME COMPOSITION EXAMPLES
// ============================================================================

/**
 * Example 1: Luxury Fashion Brand - Product Page (Development)
 *
 * Composition: Foundation → Luxury Brand → Product Page → Development
 */
const luxuryFashionProductDevTheme = composeTheme(
  foundation,
  luxuryFashionBrand,
  productPageLayer,
  developmentEnv
);

/**
 * Example 2: Tech Brand - Checkout Flow (Production)
 *
 * Composition: Foundation → Tech Brand → Checkout Flow → Production
 */
const techCheckoutProdTheme = composeTheme(
  foundation,
  techBrand,
  checkoutFlowLayer,
  productionEnv
);

/**
 * Example 3: Organic Brand - Dashboard (Staging)
 *
 * Composition: Foundation → Organic Brand → Dashboard → Staging
 */
const organicDashboardStagingTheme = composeTheme(
  foundation,
  organicBrand,
  dashboardLayer,
  stagingEnv
);

/**
 * Example 4: Tech Brand - Product Page with User Personalization
 *
 * Composition: Foundation → Tech Brand → Product Page → Production → User
 */
const userPreferences: UserPreferences = {
  density: 'compact',
  fontSize: 'large',
  contrastMode: 'high',
  reduceMotion: false,
  customPrimaryColor: 'violet-600',
};

const userPersonalizationLayer = createUserPersonalizationLayer(userPreferences);

const techProductPersonalizedTheme = composeTheme(
  foundation,
  techBrand,
  productPageLayer,
  productionEnv,
  userPersonalizationLayer
);

// ============================================================================
// THEME MANAGER SETUP
// ============================================================================

/**
 * Initialize Theme Manager with all composed themes
 */
const themeManager = new ThemeManager([
  luxuryFashionProductDevTheme,
  techCheckoutProdTheme,
  organicDashboardStagingTheme,
  techProductPersonalizedTheme,
]);

// Set initial theme
themeManager.setActiveTheme('foundation');

/**
 * Dynamic Theme Selection Function
 *
 * Composes theme dynamically based on runtime parameters
 */
interface ThemeSelectionParams {
  brand: 'luxury' | 'tech' | 'organic';
  product: 'catalog' | 'checkout' | 'dashboard';
  environment: 'development' | 'staging' | 'production';
  userPreferences?: UserPreferences;
}

function getTheme(params: ThemeSelectionParams): ThemeConfig {
  const layers: (ThemeConfig | Partial<ThemeConfig>)[] = [foundation];

  // Add brand layer
  const brandLayers = {
    luxury: luxuryFashionBrand,
    tech: techBrand,
    organic: organicBrand,
  };
  layers.push(brandLayers[params.brand]);

  // Add product layer
  const productLayers = {
    catalog: productPageLayer,
    checkout: checkoutFlowLayer,
    dashboard: dashboardLayer,
  };
  layers.push(productLayers[params.product]);

  // Add environment layer
  const envLayers = {
    development: developmentEnv,
    staging: stagingEnv,
    production: productionEnv,
  };
  layers.push(envLayers[params.environment]);

  // Add user personalization if provided
  if (params.userPreferences) {
    layers.push(createUserPersonalizationLayer(params.userPreferences));
  }

  return composeTheme(...layers);
}

// ============================================================================
// USAGE EXAMPLES WITH STYLESETS
// ============================================================================

/**
 * Example: Button Component with Multi-Layered Themes
 */
const button = createStyleSet({
  base: 'inline-flex items-center justify-center font-medium transition-colors',

  variants: {
    intent: {
      primary: 'bg-{color.primary} text-{color.onPrimary} hover:bg-{color.primaryHover}',
      secondary: 'bg-{color.secondary} text-{color.onSecondary} hover:bg-{color.secondaryHover}',
      accent: 'bg-{color.accent} text-{color.onAccent} hover:bg-{color.accentHover}',
    },

    size: {
      sm: 'px-{spacing.3} py-{spacing.2} text-{typography.fontSize.sm} rounded-{borderRadius.default}',
      md: 'px-{spacing.4} py-{spacing.3} text-{typography.fontSize.base} rounded-{borderRadius.md}',
      lg: 'px-{spacing.6} py-{spacing.4} text-{typography.fontSize.lg} rounded-{borderRadius.lg}',
    },
  },

  defaultVariants: {
    intent: 'primary',
    size: 'md',
  },

  themes: {
    luxuryFashion: luxuryFashionProductDevTheme,
    techCheckout: techCheckoutProdTheme,
    organicDashboard: organicDashboardStagingTheme,
  },
});

// Use button with different themes
const luxuryButton = button({ intent: 'primary', size: 'lg', theme: 'luxuryFashion' });
const techButton = button({ intent: 'accent', size: 'md', theme: 'techCheckout' });
const organicButton = button({ intent: 'secondary', size: 'sm', theme: 'organicDashboard' });

/**
 * Example: Card Component
 */
const card = createStyleSet({
  base: 'bg-{color.surface} rounded-{borderRadius.lg} shadow-{shadow.default}',

  recipes: {
    container: 'p-{spacing.6}',
    header: 'border-b border-{color.border} pb-{spacing.4} mb-{spacing.4}',
    body: 'text-{color.text}',
    footer: 'border-t border-{color.border} pt-{spacing.4} mt-{spacing.4}',
  },

  themes: {
    luxury: luxuryFashionProductDevTheme,
    tech: techCheckoutProdTheme,
    organic: organicDashboardStagingTheme,
  },
});

// ============================================================================
// VERIFICATION AND TESTING
// ============================================================================

/**
 * Verify Theme Composition
 *
 * This function demonstrates how token resolution works through layers
 */
function verifyThemeComposition() {
  console.log('=== Theme Composition Verification ===\n');

  // Example 1: Luxury Fashion Product Theme
  console.log('1. Luxury Fashion Product (Dev):');
  console.log('   Primary Color:', luxuryFashionProductDevTheme.tokens.color.primary);
  // Expected: 'rose-600' (from luxury brand layer)

  console.log('   Background:', luxuryFashionProductDevTheme.tokens.color.background);
  // Expected: 'white' (from foundation layer)

  console.log('   Grid Columns:', luxuryFashionProductDevTheme.tokens.layout.gridColumns);
  // Expected: '4' (from product page layer)

  console.log('   Env Indicator:', luxuryFashionProductDevTheme.tokens.color.envIndicator);
  // Expected: 'orange-500' (from development env layer)

  console.log('\n2. Tech Checkout (Production):');
  console.log('   Primary Color:', techCheckoutProdTheme.tokens.color.primary);
  // Expected: 'green-600' (from checkout layer, overrides tech brand)

  console.log('   Accent Color:', techCheckoutProdTheme.tokens.color.accent);
  // Expected: 'cyan-500' (from tech brand layer)

  console.log('   Container Width:', techCheckoutProdTheme.tokens.layout.containerMaxWidth);
  // Expected: '960px' (from checkout layer, overrides foundation)

  console.log('\n3. Personalized Theme:');
  console.log('   Primary Color:', techProductPersonalizedTheme.tokens.color.primary);
  // Expected: 'violet-600' (from user personalization layer)

  console.log('   Spacing Scale:', techProductPersonalizedTheme.tokens.spacing['4']);
  // Expected: '0.75rem' (from user layer - compact density)

  console.log('   Font Size Base:', techProductPersonalizedTheme.tokens.typography.fontSize.base);
  // Expected: '1.125rem' (from user layer - large font size)
}

// Run verification
verifyThemeComposition();

// ============================================================================
// EXPORT ALL THEMES AND UTILITIES
// ============================================================================

export {
  // Base layers
  foundation,
  luxuryFashionBrand,
  techBrand,
  organicBrand,

  // Product layers
  productPageLayer,
  checkoutFlowLayer,
  dashboardLayer,

  // Environment layers
  developmentEnv,
  stagingEnv,
  productionEnv,

  // User personalization
  createUserPersonalizationLayer,
  type UserPreferences,

  // Composed themes
  luxuryFashionProductDevTheme,
  techCheckoutProdTheme,
  organicDashboardStagingTheme,
  techProductPersonalizedTheme,

  // Utilities
  themeManager,
  getTheme,
  type ThemeSelectionParams,

  // Components
  button,
  card,
};
