<script lang="ts">
  import LoaderCircle from "~icons/lucide/loader-circle";
  import { Demo } from "@sv0/components/demos";
  import { createStyleSet, type VariantProps } from "../../../src";

  export const button = createStyleSet({
    base: "inline-flex items-center justify-center font-medium transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
    variants: {
      intent: {
        primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
        secondary: "bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800",
        success: "bg-green-600 text-white hover:bg-green-700 active:bg-green-800",
        danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
        warning: "bg-yellow-600 text-white hover:bg-yellow-700 active:bg-yellow-800",
        ghost: "bg-transparent hover:bg-gray-100 active:bg-gray-200",
        link: "bg-transparent text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline"
      },
      size: {
        xs: "h-7 px-2 text-xs rounded",
        sm: "h-8 px-3 text-sm rounded",
        md: "h-10 px-4 text-base rounded-md",
        lg: "h-12 px-6 text-lg rounded-lg",
        xl: "h-14 px-8 text-xl rounded-lg"
      },
      fullWidth: {
        true: "w-full",
        false: ""
      },
      loading: {
        true: "cursor-wait",
        false: ""
      }
    },
    compoundVariants: [
      {
        intent: "ghost",
        size: "sm",
        class: "hover:bg-gray-50"
      },
      {
        intent: "link",
        size: "sm",
        class: "h-auto px-0"
      }
    ],
    defaultVariants: {
      intent: "primary",
      size: "md",
      fullWidth: false,
      loading: false
    },
    accessibility: {
      focusRing: {
        default: "focus:ring-2 focus:ring-offset-2",
        variants: {
          primary: "focus:ring-blue-500",
          secondary: "focus:ring-gray-500",
          success: "focus:ring-green-500",
          danger: "focus:ring-red-500"
        },
        auto: true
      },
      reducedMotion: {
        replace: {
          "transition-all": "transition-none"
        },
        auto: true
      }
    }
  });

  type ButtonProps = {
    fullWidth?: boolean;
    loading?: boolean;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    onclick?: () => void;
  } & VariantProps<typeof button>;

  let {
    intent = "danger",
    size = "sm",
    fullWidth = false,
    loading = false,
    disabled = false,
    type = "button",
    onclick,
    children
  }: ButtonProps & { children?: any } = $props();
</script>

<Demo.Root title="Quiz" description="A quiz component.">
  <Demo.Section title="Default" description="A default quiz component." class="p-3 space-y-3">
    <div class="text-sm">
      <pre>{JSON.stringify(button({ intent, size, fullWidth, loading }), null, 2)}</pre>
    </div>
    <div class="flex gap-2">
      <button
        {type}
        disabled={disabled || loading}
        class={button({ intent, size, fullWidth, loading })}
        {onclick}
        aria-busy={loading}>
        {#if loading}
          <LoaderCircle />
          <svg
            class="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        {/if}
      </button>
    </div>
  </Demo.Section>
</Demo.Root>
