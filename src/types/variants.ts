import type { ClassValue } from "clsx";

/**
 * Variant definition - can be either an object with named options or a single string value
 */
export type VariantDefinition = Record<string | number, ClassValue> | ClassValue;

/**
 * Recursive nested variant definition
 * A variant can be:
 * - A leaf variant: Record<string, ClassValue> or ClassValue
 * - A nested variant: Record<string, NestedVariantDefinition>
 */
export type NestedVariantDefinition =
  | ClassValue
  | Record<string | number, ClassValue>
  | Record<string, NestedVariantDefinition>;

/**
 * Variant selection type helper. Supports both object-style variants (with named options) and
 * string-style variants (truthy flags), as well as nested variants.
 */
export type VariantSelection<V> =
  V extends Record<string, any>
    ? {
        [K in keyof V]?: V[K] extends any[]
          ? boolean | null
          : V[K] extends Record<string, any>
            ? IsNestedVariant<V[K]> extends true
              ? VariantSelection<V[K]>
              : V[K] extends Record<string | number, ClassValue>
                ? NormalizeBoolean<keyof V[K]> | null
                : never
            : V[K] extends ClassValue
              ? boolean | null
              : never;
      }
    : never;

/**
 * Extract variant props from styler config or instance
 *
 * @example
 *
 * ```typescript
 * const button = createStyleSet({
 *   variants: {
 *     intent: { primary: '...', secondary: '...' },
 *     size: { sm: '...', md: '...', lg: '...' },
 *     focus: 'ring-2 ring-blue-500' // String variant (truthy flag)
 *   }
 * });
 *
 * // Extract from config
 * type ButtonConfig = typeof button;
 * type ButtonVariants = VariantProps<ButtonConfig>;
 * // Result: {
 * //   intent?: 'primary' | 'secondary' | null;
 * //   size?: 'sm' | 'md' | 'lg' | null;
 * //   focus?: boolean | null;
 * // }
 *
 * // Or extract directly from instance
 * type ButtonVariants = VariantProps<typeof button>;
 * ```
 */
type NormalizeBoolean<T> = T extends "true" | "false" ? boolean : T;

// type VariantValue<V> = V extends string
//   ? boolean | null
//   : V extends any[]
//     ? boolean | null
//     : V extends Record<string | number, any>
//       ? keyof V | null
//       : never;

// export type VariantProps<T> = T extends { variants?: infer V }
//   ? V extends Record<string, any>
//     ? {
//         [K in keyof V]?: VariantValue<V[K]>;
//       }
//     : {}
//   : T extends (props?: infer P) => string
//     ? Omit<P, "class" | "className" | "theme" | "accessibility">
//     : never;
// Fixed VariantValue to handle all variant types properly, including nested
type VariantValue<V> = V extends string
  ? boolean | null | undefined
  : V extends any[]
    ? boolean | null | undefined
    : V extends Record<string, any>
      ? IsNestedVariant<V> extends true
        ? { [K in keyof V]?: VariantValue<V[K]> }
        : V extends Record<string | number, ClassValue>
          ? keyof V | null | undefined
          : never
      : never;

/**
 * Check if a type is a primitive ClassValue (string, number, boolean, array, null, undefined)
 * but NOT a Record (object)
 */
type IsPrimitiveClassValue<T> =
  T extends string ? true
  : T extends number ? true
  : T extends boolean ? true
  : T extends any[] ? true
  : T extends null ? true
  : T extends undefined ? true
  : false;

/**
 * Helper type to detect if a variant definition is nested (contains other variant groups)
 * A nested variant has all values as objects (not ClassValue primitives)
 *
 * Returns true if ALL values are Records (objects), false if ANY value is a primitive
 */
type IsNestedVariant<T> = T extends Record<string, any>
  ? {
      [K in keyof T]: IsPrimitiveClassValue<T[K]> extends true
        ? false
        : T[K] extends Record<string, any>
          ? true
          : false;
    }[keyof T] extends infer U
    ? false extends U
      ? false  // At least one value is a primitive, so not fully nested
      : true   // All values are Records, so it's nested
    : false
  : false;

export type VariantProps<T> = T extends (props?: infer P, ...rest: any[]) => string
  ? Omit<P, "class" | "className" | "theme" | "accessibility">
  : T extends { variants?: infer V }
    ? V extends Record<string, any>
      ? {
          [K in keyof V]?: VariantValue<V[K]>;
        }
      : {}
    : never;
/**
 * Infer variant keys from a StyleSet config
 *
 * @example
 *
 * ```typescript
 * const button = createStyleSet({
 *   variants: {
 *     intent: { primary: '...', secondary: '...' },
 *     size: { sm: '...', md: '...', lg: '...' },
 *   }
 * });
 *
 * type IntentVariant = InferVariantKeys<typeof button, 'intent'>;
 * // Result: 'primary' | 'secondary'
 * ```
 */
export type InferVariantKeys<T, K extends string> = T extends { variants?: infer V }
  ? V extends Record<string, Record<string, ClassValue>>
    ? K extends keyof V
      ? keyof V[K]
      : never
    : never
  : never;

/**
 * Infer all variant names from a StyleSet config
 *
 * @example
 *
 * ```typescript
 * const button = createStyleSet({
 *   variants: {
 *     intent: { primary: '...', secondary: '...' },
 *     size: { sm: '...', md: '...', lg: '...' },
 *   }
 * });
 *
 * type VariantNames = InferVariantNames<typeof button>;
 * // Result: 'intent' | 'size'
 * ```
 */
export type InferVariantNames<T> = T extends { variants?: infer V }
  ? V extends Record<string, Record<string, ClassValue>>
    ? keyof V
    : never
  : never;

/**
 * Infer recipe names from a StyleSet config
 *
 * @example
 *
 * ```typescript
 * const layout = createStyleSet({
 *   recipes: {
 *     container: '...',
 *     card: '...',
 *     title: '...',
 *   }
 * });
 *
 * type RecipeNames = InferRecipeNames<typeof layout>;
 * // Result: 'container' | 'card' | 'title'
 * ```
 */
export type InferRecipeNames<T> = T extends { __recipes?: infer R }
  ? R extends Record<string, ClassValue>
    ? keyof R
    : never
  : never;

/**
 * Helper type to extract only the variant props from a full props type
 *
 * @example
 *
 * ```typescript
 * type Props = { label?: string; spacing?: "sm" | "lg"; class?: string };
 * type OnlyVariants = ExtractVariantProps<Props, typeof groupStyleSet>;
 * // Result: { spacing?: "sm" | "lg" | null }
 * ```
 */
export type ExtractVariantProps<TProps, TStyleSet> = Pick<
  TProps,
  Extract<keyof TProps, keyof VariantProps<TStyleSet>>
>;

/**
 * Helper type to extract non-variant props from a full props type
 *
 * @example
 *
 * ```typescript
 * type Props = { label?: string; spacing?: "sm" | "lg"; class?: string };
 * type NonVariants = ExtractNonVariantProps<Props, typeof groupStyleSet>;
 * // Result: { label?: string; class?: string }
 * ```
 */
export type ExtractNonVariantProps<TProps, TStyleSet> = Omit<TProps, keyof VariantProps<TStyleSet>>;

/**
 * Convert a variant definition to a selector function signature
 *
 * For object-style variants (with named options): { primary: '...', secondary: '...' } => (value:
 * 'primary' | 'secondary') => string
 *
 * For string-style variants (truthy flags): 'ring-2 ring-blue-500' => (value?: boolean) => string
 *
 * For nested variants: { colors: {...}, spacing: {...} } => { colors: VariantSelector<...>, spacing: VariantSelector<...> }
 */
export type VariantSelector<T> = T extends Record<string, any>
  ? IsNestedVariant<T> extends true
    ? { [K in keyof T]: VariantSelector<T[K]> }
    : T extends Record<string | number, ClassValue>
      ? (value: NormalizeBoolean<keyof T>) => string
      : never
  : T extends ClassValue
    ? (value?: boolean) => string
    : never;

/**
 * Helper type to create variant selection objects that allow selecting specific values
 *
 * @example
 * ```typescript
 * // For nested variants:
 * const obj: VariantSelectionObject<{ heading: { colors: {...}, spacing: {...} } }> = {
 *   heading: { colors: "muted" }
 * }
 * ```
 */
export type VariantSelectionObject<V> = V extends Record<string, any>
  ? {
      [K in keyof V]?: V[K] extends Record<string | number, any>
        ? IsNestedVariant<V[K]> extends true
          ? VariantSelectionObject<V[K]>
          : V[K] extends Record<string | number, ClassValue>
            ? NormalizeBoolean<keyof V[K]>
            : never
        : V[K] extends ClassValue
          ? boolean
          : never;
    }
  : never;

/**
 * Map all variants to selector functions
 *
 * @example
 *
 * ```typescript
 * const button = createStyleSet({
 *   variants: {
 *     intent: { primary: '...', secondary: '...' },
 *     size: { sm: '...', md: '...', lg: '...' },
 *     focus: 'ring-2 ring-blue-500'
 *   }
 * });
 *
 * // button.variants.intent('primary') => '...'
 * // button.variants.size('md') => '...'
 * // button.variants.focus(true) => 'ring-2 ring-blue-500'
 * // button.variants.focus(false) => ''
 *
 * // String selectors:
 * // button.variants.select('intent.primary', 'size.md', 'focus') => combined classes
 *
 * // Object selectors:
 * // button.variants.select({ intent: 'primary', size: 'md' }) => combined classes
 *
 * // Mixed selectors:
 * // button.variants.select({ intent: 'primary' }, 'size.md', 'focus') => combined classes
 * ```
 */
export type VariantSelectors<V> =
  V extends Record<string, any>
    ? {
        [K in keyof V]: VariantSelector<V[K]>;
      } & {
        select: (...selectors: (string | VariantSelectionObject<V>)[]) => string;
      }
    : {};
