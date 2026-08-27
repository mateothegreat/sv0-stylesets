import { describe, expect, expectTypeOf, it } from "vitest";
import { createStyleSet } from "./stylesets";
import type {
  InferRecipeNames,
  InferVariantKeys,
  InferVariantNames,
  VariantProps
} from "./types/themes";

describe("Type Inference", () => {
  it("should infer variant props from StyleSet", () => {
    const button = createStyleSet({
      base: "button",
      variants: {
        intent: {
          primary: "bg-blue-600",
          secondary: "bg-gray-600",
          danger: "bg-red-600"
        },
        size: {
          sm: "text-sm",
          md: "text-base",
          lg: "text-lg"
        },
        disabled: {
          true: "opacity-50",
          false: ""
        }
      },
      defaultVariants: {
        intent: "primary",
        size: "md"
      }
    });

    // Extract variant props
    type ButtonVariants = VariantProps<typeof button>;

    // Type assertions
    expectTypeOf<ButtonVariants>().toEqualTypeOf<{
      intent?: "primary" | "secondary" | "danger" | null;
      size?: "sm" | "md" | "lg" | null;
      disabled?: boolean | null;
    }>();

    // Test runtime
    const className = button({ intent: "secondary", size: "lg" });
    expect(className).toContain("bg-gray-600");
    expect(className).toContain("text-lg");
  });

  it("should infer specific variant keys", () => {
    const button = createStyleSet({
      base: "button",
      variants: {
        intent: {
          primary: "bg-blue-600",
          secondary: "bg-gray-600"
        },
        size: {
          sm: "text-sm",
          md: "text-base",
          lg: "text-lg"
        }
      }
    });

    type IntentKeys = InferVariantKeys<typeof button, "intent">;
    type SizeKeys = InferVariantKeys<typeof button, "size">;

    expectTypeOf<IntentKeys>().toEqualTypeOf<"primary" | "secondary">();
    expectTypeOf<SizeKeys>().toEqualTypeOf<"sm" | "md" | "lg">();
  });

  it("should infer variant names", () => {
    const button = createStyleSet({
      base: "button",
      variants: {
        intent: { primary: "..." },
        size: { sm: "..." },
        disabled: { true: "..." }
      }
    });

    type VariantNames = InferVariantNames<typeof button>;

    expectTypeOf<VariantNames>().toEqualTypeOf<"intent" | "size" | "disabled">();
  });

  it("should infer recipe names", () => {
    const layout = createStyleSet({
      recipes: {
        container: "max-w-7xl mx-auto",
        card: "bg-white rounded",
        title: "text-2xl font-bold"
      }
    });

    type RecipeNames = InferRecipeNames<typeof layout>;

    expectTypeOf<RecipeNames>().toEqualTypeOf<"container" | "card" | "title">();
  });

  it("should work with component props interface", () => {
    const button = createStyleSet({
      base: "button",
      variants: {
        intent: {
          primary: "bg-blue-600",
          secondary: "bg-gray-600"
        },
        size: {
          sm: "text-sm",
          md: "text-base"
        }
      }
    });

    // Create component props interface
    interface ButtonProps extends VariantProps<typeof button> {
      disabled?: boolean;
      type?: "button" | "submit" | "reset";
      onclick?: () => void;
    }

    // Type assertion
    expectTypeOf<ButtonProps>().toMatchTypeOf<{
      intent?: "primary" | "secondary" | null;
      size?: "sm" | "md" | null;
      disabled?: boolean;
      type?: "button" | "submit" | "reset";
      onclick?: () => void;
    }>();
  });

  it("should work with complex variants", () => {
    const card = createStyleSet({
      base: "rounded border",
      variants: {
        variant: {
          elevated: "shadow-lg",
          outline: "border-2",
          filled: "bg-gray-100"
        },
        padding: {
          none: "p-0",
          sm: "p-4",
          md: "p-6",
          lg: "p-8"
        },
        interactive: {
          true: "cursor-pointer hover:shadow-xl",
          false: ""
        }
      },
      compoundVariants: [
        {
          variant: "elevated",
          interactive: true,
          class: "hover:shadow-2xl"
        }
      ]
    });

    type CardVariants = VariantProps<typeof card>;

    expectTypeOf<CardVariants>().toEqualTypeOf<{
      variant?: "elevated" | "outline" | "filled" | null;
      padding?: "none" | "sm" | "md" | "lg" | null;
      interactive?: boolean | null;
    }>();
  });

  it("should extract variant props for Svelte component", () => {
    // Simulate a real component scenario
    const alert = createStyleSet({
      base: "p-4 rounded border",
      variants: {
        status: {
          info: "bg-blue-50 border-blue-200",
          success: "bg-green-50 border-green-200",
          warning: "bg-yellow-50 border-yellow-200",
          error: "bg-red-50 border-red-200"
        },
        dismissible: {
          true: "pr-10",
          false: ""
        }
      },
      defaultVariants: {
        status: "info",
        dismissible: false
      }
    });

    // Component Props Interface
    interface AlertProps extends VariantProps<typeof alert> {
      title?: string;
      message: string;
      onDismiss?: () => void;
    }

    // Verify types
    expectTypeOf<AlertProps>().toMatchTypeOf<{
      status?: "info" | "success" | "warning" | "error" | null;
      dismissible?: boolean | null;
      title?: string;
      message: string;
      onDismiss?: () => void;
    }>();

    // Test usage
    const props: AlertProps = {
      status: "success",
      message: "Operation completed successfully",
      dismissible: true
    };

    const { message, title, onDismiss, ...variantProps } = props;
    const className = alert(variantProps);
    expect(className).toContain("bg-green-50");
  });

  it("should work with boolean variants", () => {
    const toggle = createStyleSet({
      base: "switch",
      variants: {
        checked: {
          true: "bg-blue-600",
          false: "bg-gray-300"
        },
        disabled: {
          true: "opacity-50 cursor-not-allowed",
          false: "cursor-pointer"
        },
        size: {
          sm: "h-4 w-8",
          md: "h-6 w-12",
          lg: "h-8 w-16"
        }
      }
    });

    type ToggleVariants = VariantProps<typeof toggle>;

    expectTypeOf<ToggleVariants>().toEqualTypeOf<{
      checked?: boolean | null;
      disabled?: boolean | null;
      size?: "sm" | "md" | "lg" | null;
    }>();
  });

  it("should handle empty variants", () => {
    const simple = createStyleSet({
      base: "simple-component"
    });

    type SimpleVariants = VariantProps<typeof simple>;

    expectTypeOf<SimpleVariants>().toEqualTypeOf<Record<never, never>>();
  });

  it("should work with recipes and variants together", () => {
    const mixed = createStyleSet({
      base: "component",
      variants: {
        variant: { primary: "bg-blue", secondary: "bg-gray" }
      },
      recipes: {
        header: "header-class",
        body: "body-class"
      }
    });

    type MixedVariants = VariantProps<typeof mixed>;
    type MixedRecipes = InferRecipeNames<typeof mixed>;

    expectTypeOf<MixedVariants>().toEqualTypeOf<{
      variant?: "primary" | "secondary" | null;
    }>();

    expectTypeOf<MixedRecipes>().toEqualTypeOf<"header" | "body">();
  });
});
