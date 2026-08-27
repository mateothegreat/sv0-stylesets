/**
 * Example showing proper usage of VariantProps with Svelte 5 components
 *
 * This demonstrates how to properly type and use variant props in components
 * to avoid the boolean type assignment issue.
 */

// Example 1: Basic component with variants
/**
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { createStyleSet, type VariantProps, extractVariantProps } from '@sv0/stylesets';
 *   import { usePropsBuilder, type WithChildren, type WithOptionalClass } from '../utils/props';
 *
 *   const groupStyleSet = createStyleSet({
 *     base: 'flex flex-col',
 *     variants: {
 *       spacing: {
 *         default: 'space-y-2',
 *         none: 'space-y-0',
 *         sm: 'space-y-1',
 *         lg: 'space-y-4'
 *       },
 *       padding: {
 *         none: 'p-0',
 *         sm: 'p-2',
 *         lg: 'p-4'
 *       }
 *     },
 *     defaultVariants: {
 *       spacing: 'default',
 *       padding: 'none'
 *     }
 *   });
 *
 *   type GroupVariants = VariantProps<typeof groupStyleSet>;
 *
 *   // Option 1: Direct approach - separate variant props from other props
 *   type Props = {
 *     label?: string;
 *   } & GroupVariants & WithChildren & WithOptionalClass;
 *
 *   const { label, spacing, padding, class: className, children, ...rest }: Props = $props();
 *
 *   const style = $derived(
 *     groupStyleSet({ spacing, padding, class: className })
 *   );
 * </script>
 *
 * <div class={style} {...rest}>
 *   {@render children?.()}
 * </div>
 * ```
 */

// Example 2: Using extractVariantProps helper
/**
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { createStyleSet, type VariantProps, extractVariantProps } from '@sv0/stylesets';
 *   import { usePropsBuilder, type WithChildren, type WithOptionalClass } from '../utils/props';
 *
 *   const groupStyleSet = createStyleSet({
 *     base: 'flex flex-col',
 *     variants: {
 *       spacing: {
 *         default: 'space-y-2',
 *         none: 'space-y-0',
 *         sm: 'space-y-1',
 *         lg: 'space-y-4'
 *       },
 *       padding: {
 *         none: 'p-0',
 *         sm: 'p-2',
 *         lg: 'p-4'
 *       }
 *     }
 *   });
 *
 *   type Props = {
 *     label?: string;
 *   } & VariantProps<typeof groupStyleSet> & WithChildren & WithOptionalClass;
 *
 *   const { label, children, ...rest }: Props = $props();
 *
 *   // Extract variant props from the rest
 *   const { variantProps, otherProps } = extractVariantProps(rest, ['spacing', 'padding'] as const);
 *
 *   // Use PropsBuilder only for non-variant props
 *   const built = usePropsBuilder(otherProps).withClassMerge('custom-group');
 *
 *   const style = $derived(
 *     groupStyleSet({
 *       ...variantProps,
 *       class: built.class
 *     })
 *   );
 * </script>
 *
 * <div class={style}>
 *   {@render children?.()}
 * </div>
 * ```
 */

// Example 3: Advanced pattern with proper type separation
/**
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { createStyleSet, type VariantProps } from '@sv0/stylesets';
 *   import { usePropsBuilder, type WithChildren, type WithOptionalClass } from '../utils/props';
 *
 *   const buttonStyleSet = createStyleSet({
 *     base: 'px-4 py-2 rounded transition-colors',
 *     variants: {
 *       intent: {
 *         primary: 'bg-blue-500 text-white hover:bg-blue-600',
 *         secondary: 'bg-gray-500 text-white hover:bg-gray-600',
 *         danger: 'bg-red-500 text-white hover:bg-red-600'
 *       },
 *       size: {
 *         sm: 'text-sm',
 *         md: 'text-base',
 *         lg: 'text-lg'
 *       },
 *       fullWidth: 'w-full' // boolean variant
 *     },
 *     defaultVariants: {
 *       intent: 'primary',
 *       size: 'md'
 *     }
 *   });
 *
 *   // Define variant props type
 *   type ButtonVariants = VariantProps<typeof buttonStyleSet>;
 *
 *   // Define component-specific props
 *   interface ButtonOwnProps {
 *     disabled?: boolean;
 *     onclick?: () => void;
 *   }
 *
 *   // Combine all prop types
 *   type Props = ButtonOwnProps & ButtonVariants & WithChildren & WithOptionalClass;
 *
 *   // Destructure props with proper typing
 *   const {
 *     // Component props
 *     disabled = false,
 *     onclick,
 *     // Variant props
 *     intent,
 *     size,
 *     fullWidth,
 *     // Common props
 *     class: className,
 *     children,
 *     ...htmlProps
 *   }: Props = $props();
 *
 *   // Build styles with variants
 *   const buttonClass = $derived(
 *     buttonStyleSet({
 *       intent,
 *       size,
 *       fullWidth,
 *       class: className
 *     })
 *   );
 * </script>
 *
 * <button
 *   class={buttonClass}
 *   {disabled}
 *   {onclick}
 *   {...htmlProps}
 * >
 *   {@render children?.()}
 * </button>
 * ```
 */

// Type-safe variant prop extraction pattern
export interface VariantPropsPattern<TStyleSet> {
  // Extract variant props type from the styleset
  variants: VariantProps<TStyleSet>;

  // Example of how to properly type component props
  componentProps: {
    label?: string;
    // other component-specific props
  };

  // Combined props type
  allProps: VariantProps<TStyleSet> & {
    label?: string;
    class?: string;
  };
}

// Helper to ensure variant props are properly typed
export function ensureVariantProps<T extends Record<string, any>>(
  props: T,
  variantKeys: readonly (keyof T)[]
): Pick<T, typeof variantKeys[number]> {
  const result: any = {};
  for (const key of variantKeys) {
    if (key in props) {
      result[key] = props[key];
    }
  }
  return result;
}