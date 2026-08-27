import type { DesignToken, ResolvedToken, TokenRegistry, TokenResolutionContext } from "./types";

/**
 * Token resolver with caching and runtime resolution support
 */
export class TokenResolver {
  private cache = new Map<string, ResolvedToken>();
  private registry: TokenRegistry = {};

  constructor(initialTokens?: TokenRegistry) {
    if (initialTokens) {
      this.registry = { ...initialTokens };
    }
  }

  /**
   * Register additional tokens
   */
  register(category: string, tokens: Record<string, DesignToken>): void {
    this.registry[category] = { ...this.registry[category], ...tokens };
    // Clear cache for this category
    this.clearCacheForCategory(category);
  }

  /**
   * Resolve a token reference to its final value
   */
  resolve(reference: string, context: TokenResolutionContext = {}): ResolvedToken {
    const cacheKey = this.getCacheKey(reference, context);
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const result = this.doResolve(reference, context);
    this.cache.set(cacheKey, result);

    return result;
  }

  /**
   * Resolve multiple token references
   */
  resolveMultiple(references: string[], context: TokenResolutionContext = {}): ResolvedToken[] {
    return references.map((ref) => this.resolve(ref, context));
  }

  /**
   * Check if a string contains token references
   */
  hasTokenReferences(value: string): boolean {
    return /\{[^}]+\}/.test(value);
  }

  /**
   * Replace all token references in a string
   */
  replaceTokens(value: string, context: TokenResolutionContext = {}): ResolvedToken {
    if (!this.hasTokenReferences(value)) {
      return { value, wasResolved: false };
    }

    let resolved = value;
    let wasResolved = false;

    // Find all token references like {category.token}
    const tokenPattern = /\{([^}]+)\}/g;
    let match;

    while ((match = tokenPattern.exec(value)) !== null) {
      const tokenRef = match[1];
      const tokenResult = this.resolve(tokenRef, context);

      if (tokenResult.wasResolved) {
        resolved = resolved.replace(match[0], tokenResult.value);
        wasResolved = true;
      }
    }

    return { value: resolved, wasResolved, tokenRef: wasResolved ? value : undefined };
  }

  /**
   * Clear the entire cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get all available tokens in a category
   */
  getTokens(category: string): Record<string, DesignToken> | undefined {
    return this.registry[category];
  }

  /**
   * Get all registered categories
   */
  getCategories(): string[] {
    return Object.keys(this.registry);
  }

  private doResolve(reference: string, context: TokenResolutionContext): ResolvedToken {
    // Handle direct token references like "color.primary"
    const parts = reference.split(".");

    if (parts.length < 2) {
      return { value: reference, wasResolved: false };
    }

    const [category, ...tokenPath] = parts;
    const categoryTokens = this.registry[category];

    if (!categoryTokens) {
      return { value: reference, wasResolved: false };
    }

    // Navigate through nested token structure
    let current: any = categoryTokens;
    for (const part of tokenPath) {
      if (current && typeof current === "object" && part in current) {
        current = current[part];
      } else {
        return { value: reference, wasResolved: false };
      }
    }

    const token = current as DesignToken;
    if (!token) {
      return { value: reference, wasResolved: false };
    }

    // Handle string tokens
    if (typeof token === "string") {
      return this.resolveTokenValue(token, context, reference);
    }

    // Handle object tokens
    if (typeof token === "object" && "value" in token) {
      return this.resolveTokenValue(token.value, context, reference);
    }

    return { value: reference, wasResolved: false };
  }

  private resolveTokenValue(
    value: string,
    context: TokenResolutionContext,
    originalRef: string
  ): ResolvedToken {
    // Check if this value contains more token references
    if (this.hasTokenReferences(value)) {
      return this.replaceTokens(value, context);
    }

    // Apply contextual transformations
    let finalValue = value;

    // Handle accessibility preferences
    if (context.preferences) {
      finalValue = this.applyAccessibilityTransforms(finalValue, context.preferences);
    }

    return { value: finalValue, wasResolved: true, tokenRef: originalRef };
  }

  private applyAccessibilityTransforms(
    value: string,
    preferences: NonNullable<TokenResolutionContext["preferences"]>
  ): string {
    let result = value;

    // Handle reduced motion
    if (preferences.reducedMotion) {
      // Replace animation/transition classes with reduced motion alternatives
      result = result.replace(/transition-\w+/g, "transition-none");
      result = result.replace(/animate-\w+/g, "");
      result = result.replace(/duration-\w+/g, "duration-0");
    }

    // Handle high contrast
    if (preferences.highContrast) {
      // Enhance contrast for better visibility
      result = result.replace(/text-gray-\d+/g, "text-black dark:text-white");
      result = result.replace(/bg-gray-\d+/g, "bg-white dark:bg-black");
    }

    return result.trim();
  }

  private getCacheKey(reference: string, context: TokenResolutionContext): string {
    const contextKey = JSON.stringify({
      theme: context.theme?.id,
      preferences: context.preferences,
      breakpoint: context.breakpoint
    });
    return `${reference}|${contextKey}`;
  }

  private clearCacheForCategory(category: string): void {
    for (const [key] of this.cache) {
      if (key.startsWith(`${category}.`)) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * Global token resolver instance
 */
export const globalTokenResolver = new TokenResolver();

/**
 * Register tokens globally
 */
export function registerTokens(category: string, tokens: Record<string, DesignToken>): void {
  globalTokenResolver.register(category, tokens);
}

/**
 * Resolve a token reference using the global resolver
 */
export function resolveToken(reference: string, context?: TokenResolutionContext): ResolvedToken {
  return globalTokenResolver.resolve(reference, context);
}
