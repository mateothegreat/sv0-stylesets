import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AccessibilityManager } from "./accessibility";
import { ThemeManager } from "./themes";
import { TokenResolver } from "./tokens";
import type {
  EnhancedStylerConfig as StylerConfig,
  TokenResolutionContext,
  VariantProps,
  VariantSelectors
} from "./types";

/**
 * Helper function to detect if a value is a plain object
 */
function isPlainObject(value: any): value is Record<string, any> {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

/**
 * Helper function to detect if a variant definition is nested
 * A nested variant has all values as objects (not ClassValue primitives)
 */
function isNestedVariant(variantDef: any): boolean {
  if (!isPlainObject(variantDef)) {
    return false;
  }

  const values = Object.values(variantDef);
  if (values.length === 0) {
    return false;
  }

  // Check if all values are plain objects (indicating nested structure)
  // and none are ClassValue primitives (strings, arrays, numbers, booleans)
  return values.every((value) => {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      return false;
    }
    if (Array.isArray(value)) {
      return false;
    }
    return isPlainObject(value);
  });
}

/**
 * Flatten nested variant props into a flat structure for class calculation
 * Example: { heading: { colors: "muted", spacing: "sm" } } => { "heading.colors": "muted", "heading.spacing": "sm" }
 */
function flattenVariantProps(props: any, prefix = ""): Record<string, any> {
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(props)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (isPlainObject(value)) {
      // Recursively flatten nested objects
      Object.assign(result, flattenVariantProps(value, fullKey));
    } else {
      result[fullKey] = value;
    }
  }

  return result;
}

/**
 * Flatten nested variant definitions into a flat structure
 * Example: { heading: { colors: { muted: "..." } } } => { "heading.colors": { muted: "..." } }
 */
function flattenVariantDefinitions(variants: any, prefix = ""): Record<string, any> {
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(variants)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (isNestedVariant(value)) {
      // Recursively flatten nested variant groups
      Object.assign(result, flattenVariantDefinitions(value, fullKey));
    } else {
      // This is a leaf variant - store it
      result[fullKey] = value;
    }
  }

  return result;
}

/**
 * Create variant selectors recursively for nested variants
 */
function createVariantSelectors(variants: any): any {
  const selectors: any = {};

  for (const [key, value] of Object.entries(variants)) {
    if (isNestedVariant(value)) {
      // Recursively create selectors for nested variants
      selectors[key] = createVariantSelectors(value);
    } else {
      // Create selector function for leaf variant
      selectors[key] = (val: any) => {
        // For string/array variants (truthy flags)
        if (typeof value === "string" || Array.isArray(value)) {
          return val ? clsx(value) : "";
        }

        // For object-style variants
        if (value && typeof value === "object") {
          const classes = value[String(val)];
          return classes ? clsx(classes) : "";
        }

        return "";
      };
    }
  }

  return selectors;
}

/**
 * Resolve default value for a variant path
 * Priority: defaultVariants > 'default' key > undefined
 */
function resolveVariantDefault(
  variantPath: string,
  flatVariants: Record<string, any>,
  flatDefaultVariants: Record<string, any> | undefined
): string | undefined {
  const variantDefinition = flatVariants[variantPath];

  if (!variantDefinition) {
    return undefined;
  }

  // Priority 1: Check defaultVariants
  const defaultValue = flatDefaultVariants?.[variantPath];
  if (defaultValue !== undefined && defaultValue !== null) {
    if (typeof variantDefinition === "string" || Array.isArray(variantDefinition)) {
      return defaultValue ? variantDefinition : undefined;
    } else if (typeof variantDefinition === "object") {
      return variantDefinition[String(defaultValue)];
    }
  }

  // Priority 2: Check for 'default' key in variant definition
  if (typeof variantDefinition === "object" && "default" in variantDefinition) {
    return variantDefinition.default;
  }

  return undefined;
}

class RecipeSelector {
  #classValue: ClassValue;
  #tokenResolver?: TokenResolver | undefined;
  #accessibilityManager?: AccessibilityManager | undefined;
  #context?: TokenResolutionContext | undefined;

  constructor(
    classValue: ClassValue,
    tokenResolver?: TokenResolver,
    accessibilityManager?: AccessibilityManager,
    context?: TokenResolutionContext
  ) {
    this.#classValue = classValue;
    this.#tokenResolver = tokenResolver;
    this.#accessibilityManager = accessibilityManager;
    this.#context = context;
  }

  with(...overrides: ClassValue[]): string {
    const combined = clsx(this.#classValue, overrides);
    return this.#processClasses(combined);
  }

  toString(): string {
    return this.#processClasses(clsx(this.#classValue));
  }

  #processClasses(classes: string): string {
    let result = classes;

    if (this.#tokenResolver && this.#context) {
      if (this.#context.theme?.tokens) {
        for (const [category, tokens] of Object.entries(this.#context.theme.tokens)) {
          if (tokens) {
            this.#tokenResolver.register(category, tokens);
          }
        }
      }
      const tokenResult = this.#tokenResolver.replaceTokens(result, this.#context);
      result = tokenResult.value;
    }

    if (this.#accessibilityManager) {
      result = this.#accessibilityManager.enhance(result);
    }

    return twMerge(result);
  }
}

export type StyleSet<
  V,
  R extends Record<string, ClassValue> | undefined,
  ThemeIds extends string = string
> = {
  (
    props?: VariantProps<StylerConfig<V, R>> & {
      class?: ClassValue;
      className?: ClassValue;
      theme?: ThemeIds;
      accessibility?: boolean;
    },
    ...rest: ClassValue[]
  ): string;

  variants: VariantSelectors<V>;
  select: (...keys: (keyof NonNullable<R> | ClassValue)[]) => string;
  tokens: TokenResolver;
  accessibility: AccessibilityManager;
  themes: ThemeManager;
  withTheme: (themeId: ThemeIds) => StyleSet<V, R, ThemeIds>;
  withAccessibility: (enabled: boolean) => StyleSet<V, R, ThemeIds>;
} & (R extends Record<string, ClassValue>
  ? { [K in keyof R]: RecipeSelector } & { __recipes?: R }
  : {});

/**
 * Create an enhanced StyleSet with token resolution, accessibility, and theming support
 */
export function createStyleSet<
  V extends Record<string, any>,
  R extends Record<string, ClassValue>,
  T extends Record<string, any> = Record<string, any>
>(config: StylerConfig<V, R> & { themes?: T }): StyleSet<V, R, keyof T & string> {
  const {
    base,
    variants,
    compoundVariants,
    defaultVariants,
    recipes,
    tokens,
    accessibility,
    themes,
    themeManager: externalThemeManager
  } = config;

  // Flatten nested variants and defaultVariants for easier processing
  const flatVariants = variants ? flattenVariantDefinitions(variants) : undefined;
  const flatDefaultVariants = defaultVariants ? flattenVariantProps(defaultVariants) : undefined;

  const tokenResolver = new TokenResolver(tokens);
  const accessibilityManager = new AccessibilityManager(accessibility, tokenResolver);
  const themeManager = externalThemeManager || new ThemeManager();

  // Register themes if provided.
  if (themes) {
    Object.entries(themes).forEach(([themeId, themeConfig]) => {
      // Create full theme config by merging with base config.
      const fullThemeConfig = {
        id: themeId,
        name: themeId,
        tokens: { ...tokens, ...themeConfig.tokens },
        accessibility: { ...accessibility, ...themeConfig.accessibility },
        base: themeConfig.base || base
      };
      themeManager.registerTheme(fullThemeConfig);
    });
  }

  let currentTheme: string | undefined;
  let accessibilityEnabled = true;

  const instance = ((
    props?: VariantProps<StylerConfig<V, R>> & {
      class?: ClassValue;
      className?: ClassValue;
      theme?: string;
      accessibility?: boolean;
    },
    ...rest: ClassValue[]
  ): string => {
    // Filter out non-variant props.
    const {
      class: classProp,
      className,
      theme,
      accessibility: a11yProp,
      ...variantProps
    } = props || {};

    /**
     * Set theme if provided, or reset to default if undefined.
     */
    if (theme !== currentTheme) {
      if (theme) {
        themeManager.setActiveTheme(theme);
        currentTheme = theme;

        // Update token resolver with theme-specific tokens.
        const activeTheme = themeManager.getActiveTheme();
        if (activeTheme && activeTheme.tokens) {
          // Clear cache and restore base tokens + theme tokens.
          tokenResolver.clearCache();

          // First register base tokens.
          Object.entries(tokens ?? {}).forEach(([category, categoryTokens]) => {
            if (categoryTokens) {
              tokenResolver.register(category, categoryTokens);
            }
          });

          // Then register theme-specific tokens (overwrites base tokens).
          Object.entries(activeTheme.tokens).forEach(([category, themeTokens]) => {
            if (themeTokens) {
              tokenResolver.register(category, themeTokens);
            }
          });
        }
      } else {
        // Reset to default theme (no theme).
        themeManager.setActiveTheme(undefined);
        currentTheme = undefined;

        // Clear cache and restore only base tokens.
        tokenResolver.clearCache();
        Object.entries(tokens || {}).forEach(([category, categoryTokens]) => {
          if (categoryTokens) {
            tokenResolver.register(category, categoryTokens);
          }
        });
      }
    }

    /**
     * Update accessibility preference.
     */
    const shouldApplyA11y = a11yProp ?? accessibilityEnabled;

    /**
     * Create resolution context.
     */
    const context: TokenResolutionContext = {
      theme: themeManager.getActiveTheme(),
      preferences: accessibilityManager.getPreferences()
    };

    /**
     * Set context on accessibility manager for token resolution.
     */
    accessibilityManager.setContext(context);

    /**
     * Filter and merge variant props with defaults.
     *
     * @remarks
     * Note: null values explicitly override defaults, undefined values use defaults.
     */
    // Flatten nested variant props for easier processing
    const flatVariantProps = flattenVariantProps(variantProps);

    const filteredProps = Object.fromEntries(
      Object.entries(flatVariantProps).filter(([_, value]) => value !== undefined)
    );
    const finalProps = { ...flatDefaultVariants, ...filteredProps };

    /**
     * Calculate variant classes.
     */
    const variantClasses = flatVariants
      ? Object.keys(flatVariants).map((variantKey) => {
          const variantValue = finalProps[variantKey as keyof typeof finalProps];
          if (variantValue === null || variantValue === undefined) return null;

          const variantDefinition = (flatVariants as any)[variantKey];

          // Check if this is a string-style variant (truthy flag).
          if (typeof variantDefinition === "string" || Array.isArray(variantDefinition)) {
            // For string/array variants, apply the value if the prop is truthy.
            return variantValue ? variantDefinition : null;
          }

          // Otherwise, it's an object-style variant (named options).
          return variantDefinition[String(variantValue)];
        })
      : [];

    /**
     * Calculate compound variant classes.
     */
    const compoundClasses = compoundVariants
      ? compoundVariants.map((compound) => {
          const { class: compoundClass, ...conditions } = compound;
          // Flatten compound variant conditions for matching
          const flatConditions = flattenVariantProps(conditions);
          const isMatch = Object.entries(flatConditions).every(([key, value]) => {
            const propValue = finalProps[key as keyof typeof finalProps];
            const variantDefinition = flatVariants ? (flatVariants as any)[key] : undefined;

            // For string/array variants (truthy flags), check if both are truthy/falsy.
            if (
              variantDefinition &&
              (typeof variantDefinition === "string" || Array.isArray(variantDefinition))
            ) {
              // Both should be truthy or both should be falsy.
              return Boolean(propValue) === Boolean(value);
            }

            // For object-style variants, use strict equality.
            return propValue === value;
          });
          return isMatch ? compoundClass : null;
        })
      : [];

    // Combine all classes.
    const combinedClasses = clsx(
      base,
      variantClasses,
      compoundClasses,
      classProp,
      className,
      ...rest
    );

    // Process through token resolver.
    let result = combinedClasses;
    const tokenResult = tokenResolver.replaceTokens(result, context);
    result = tokenResult.value;

    // Apply accessibility enhancements if enabled.
    if (shouldApplyA11y) {
      result = accessibilityManager.enhance(result);
    }

    return twMerge(result);
  }) as StyleSet<V, R, keyof T & string>;

  instance.select = (...keys: (keyof R | ClassValue)[]): string => {
    // Ensure tokens are updated if theme has changed.
    const activeTheme = themeManager.getActiveTheme();
    if (activeTheme && activeTheme.tokens) {
      Object.entries(activeTheme.tokens).forEach(([category, tokens]) => {
        if (tokens) {
          tokenResolver.register(category, tokens);
        }
      });
    }

    const context: TokenResolutionContext = {
      theme: themeManager.getActiveTheme(),
      preferences: accessibilityManager.getPreferences()
    };

    const classValues = keys.map((key) =>
      recipes && typeof key === "string" && key in recipes ? recipes[key] : key
    );

    let combined = clsx(classValues);

    // Process through token resolver.
    const tokenResult = tokenResolver.replaceTokens(combined, context);
    combined = tokenResult.value;

    // Apply accessibility enhancements.
    if (accessibilityEnabled) {
      combined = accessibilityManager.enhance(combined);
    }

    return twMerge(combined);
  };

  // Create variant selector functions recursively.
  instance.variants = variants ? (createVariantSelectors(variants) as VariantSelectors<V>) : ({} as any);

  // Add select method to variants object
  if (instance.variants && flatVariants) {
    (instance.variants as any).select = (...selectors: (string | Record<string, any>)[]): string => {
      const classValues: ClassValue[] = [];

      // Process each selector (can be string or object)
      for (const selector of selectors) {
        // If selector is an object, flatten it and convert to string selectors
        if (isPlainObject(selector)) {
          const flattened = flattenVariantProps(selector);

          // Track which parent paths we've seen to apply defaults for siblings
          const parentPaths = new Set<string>();

          // First, collect all classes for explicitly provided values
          for (const [path, value] of Object.entries(flattened)) {
            if (value === null || value === undefined) continue;

            if (path in flatVariants) {
              const variantDefinition = flatVariants[path];

              // Track parent path for nested variant defaults
              const lastDotIndex = path.lastIndexOf('.');
              if (lastDotIndex > 0) {
                parentPaths.add(path.substring(0, lastDotIndex));
              }

              // Handle truthy variants (string/array)
              if (typeof variantDefinition === "string" || Array.isArray(variantDefinition)) {
                if (value) {
                  classValues.push(variantDefinition);
                }
              }
              // Handle object-style variants
              else if (typeof variantDefinition === "object" && String(value) in variantDefinition) {
                classValues.push(variantDefinition[String(value)]);
              }
            }
          }

          // Then, apply defaults for sibling variants that weren't explicitly set
          for (const parentPath of parentPaths) {
            const prefix = parentPath + ".";
            const siblingVariants = Object.keys(flatVariants).filter(key =>
              key.startsWith(prefix) && !flattened.hasOwnProperty(key)
            );

            for (const siblingPath of siblingVariants) {
              const defaultClass = resolveVariantDefault(siblingPath, flatVariants, flatDefaultVariants);
              if (defaultClass) {
                classValues.push(defaultClass);
              }
            }
          }

          continue;
        }

        // Process string selector (existing logic)
        // First, check if this is a parent path (has children in flatVariants)
        const prefix = selector + ".";
        const childVariants = Object.keys(flatVariants).filter(key => key.startsWith(prefix));

        if (childVariants.length > 0) {
          // This is a parent variant - collect all child defaults
          for (const childPath of childVariants) {
            const defaultClass = resolveVariantDefault(childPath, flatVariants, flatDefaultVariants);
            if (defaultClass) {
              classValues.push(defaultClass);
            }
          }
        } else if (selector.includes('.')) {
          // Not a parent, check if it's an exact path or path.value format
          if (selector in flatVariants) {
            // This is an exact variant path
            const variantDefinition = flatVariants[selector];

            // Check if the last part is actually a value (not a variant path)
            const parts = selector.split('.');
            const lastPart = parts[parts.length - 1];
            const parentPath = parts.slice(0, -1).join('.');

            // If parent path exists and last part is a key in it, treat as explicit value
            if (parentPath in flatVariants) {
              const parentDef = flatVariants[parentPath];
              if (typeof parentDef === "object" && lastPart in parentDef) {
                // This is "path.value" format - use explicit value
                classValues.push(parentDef[lastPart]);
                continue;
              }
            }

            // Otherwise, treat as a variant path and resolve its default
            const defaultClass = resolveVariantDefault(selector, flatVariants, flatDefaultVariants);
            if (defaultClass) {
              classValues.push(defaultClass);
            }
          } else {
            // Try parsing as "path.value" format
            const parts = selector.split('.');
            const value = parts.pop(); // Last part is the value
            const path = parts.join('.'); // Rest is the path

            if (path in flatVariants) {
              const variantDefinition = flatVariants[path];
              if (typeof variantDefinition === "string" || Array.isArray(variantDefinition)) {
                if (value === "true") {
                  classValues.push(variantDefinition);
                }
              } else if (value && typeof variantDefinition === "object" && value in variantDefinition) {
                classValues.push(variantDefinition[value]);
              }
            }
          }
        } else {
          // No dots and no children - this is a top-level leaf variant
          if (selector in flatVariants) {
            const defaultClass = resolveVariantDefault(selector, flatVariants, flatDefaultVariants);
            if (defaultClass) {
              classValues.push(defaultClass);
            }
          }
        }
      }

      // Combine and merge all classes
      const combined = clsx(classValues);

      // Process through token resolver if available
      let result = combined;
      if (tokenResolver) {
        const context: TokenResolutionContext = {
          theme: themeManager.getActiveTheme(),
          preferences: accessibilityManager.getPreferences()
        };
        const tokenResult = tokenResolver.replaceTokens(result, context);
        result = tokenResult.value;
      }

      // Apply accessibility enhancements if enabled
      if (accessibilityEnabled && accessibilityManager) {
        result = accessibilityManager.enhance(result);
      }

      return twMerge(result);
    };
  }

  // Expose managers.
  instance.tokens = tokenResolver;
  instance.accessibility = accessibilityManager;
  instance.themes = themeManager;

  // Theme switching utility.
  instance.withTheme = (themeId: keyof T & string): StyleSet<V, R, keyof T & string> => {
    return createStyleSet({
      ...config,
      themes: { ...themes, [themeId]: themes?.[themeId] || {} }
    });
  };

  // Accessibility toggle utility.
  instance.withAccessibility = (enabled: boolean): StyleSet<V, R, keyof T & string> => {
    accessibilityEnabled = enabled;
    return instance;
  };

  // Add recipe properties with enhanced functionality.
  if (recipes) {
    for (const recipeName in recipes) {
      if (Object.prototype.hasOwnProperty.call(recipes, recipeName)) {
        Object.defineProperty(instance, recipeName, {
          get: () => {
            const context: TokenResolutionContext = {
              theme: themeManager.getActiveTheme(),
              preferences: accessibilityManager.getPreferences()
            };

            return new RecipeSelector(
              recipes[recipeName],
              tokenResolver,
              accessibilityEnabled ? accessibilityManager : undefined,
              context
            );
          },
          enumerable: true
        });
      }
    }
  }

  return instance;
}

/**
 * A helper type to extract the variant props from an enhanced styler instance.
 */
export type StylerProps<T> = T extends (props?: infer P) => string
  ? Omit<P, "class" | "className" | "theme" | "accessibility">
  : never;

/**
 * Helper function to extract variant props from a props object
 *
 * @example
 *
 * ```typescript
 * const groupStyleSet = createStyleSet({
 *   variants: {
 *     spacing: { default: '...', sm: '...', lg: '...' },
 *     padding: { none: '...', sm: '...', lg: '...' }
 *   }
 * });
 *
 * // In your component
 * const { label, ...rest } = $props();
 * const { variantProps, otherProps } = extractVariantProps(rest, ['spacing', 'padding']);
 *
 * // variantProps will have { spacing?: "default" | "sm" | "lg", padding?: "none" | "sm" | "lg" }
 * // otherProps will have everything else
 * ```
 */
export function extractVariantProps<T extends Record<string, any>, K extends keyof T>(
  props: T,
  variantKeys: readonly K[]
): {
  variantProps: Pick<T, K>;
  otherProps: Omit<T, K>;
} {
  const variantProps: Partial<Pick<T, K>> = {};
  const otherProps: Partial<T> = {};

  for (const key in props) {
    if (variantKeys.includes(key as unknown as K)) {
      variantProps[key as unknown as K] = props[key as unknown as K];
    } else {
      otherProps[key as unknown as K] = props[key as unknown as K];
    }
  }

  return {
    variantProps: variantProps as Pick<T, K>,
    otherProps: otherProps as Omit<T, K>
  };
}
