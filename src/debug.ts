/**
 * Debug utilities for stylesets
 */

export function debugStyleSet(
  styleSetInstance: any,
  props: Record<string, any>,
  label = "StyleSet Debug"
) {
  const isServer = typeof window === "undefined";
  const environment = isServer ? "[SERVER]" : "[CLIENT]";

  console.log(`${environment} ${label}:`, {
    props,
    variants: styleSetInstance.variants,
    variantKeys: Object.keys(styleSetInstance.variants || {}),
    timestamp: Date.now()
  });

  const result = styleSetInstance(props);

  console.log(`${environment} ${label} Result:`, {
    result,
    length: result.length,
    containsFocus: result.includes("focus:ring"),
    props
  });

  return result;
}
