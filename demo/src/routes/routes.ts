import type { RouteConfig } from "@mateothegreat/svelte5-router";
import Basic from "./basic.svelte";
import Button from "./button.svelte";
import Demo from "./demo.svelte";
import ThemeShowcase from "./theme-showcase.svelte";

export type NavGroup = {
  label: string;
  components: NavComponent[];
};

export type NavComponent = {
  label: string;
  type?: "route" | "separator";
  route?: RouteConfig;
};

export const navGroups: NavGroup[] = [
  {
    label: "Button",
    components: [
      {
        label: "Button",
        route: {
          path: "/button",
          component: Button,
          props: {
            label: "Button",
            description: "A button component that renders a label and an input."
          }
        }
      }
    ]
  },
  {
    label: "Basics",
    components: [
      {
        label: "Basic",
        route: {
          path: "/basic",
          component: Basic,
          props: {
            label: "Basic",
            description: "A basic component that renders a label and an input."
          }
        }
      }
    ]
  },
  {
    label: "Enhanced Features",
    components: [
      {
        label: "StyleSets Demo",
        route: {
          path: "/demo",
          component: Demo,
          props: {
            label: "StyleSets Enhanced Demo",
            description:
              "Comprehensive demonstration of all StyleSets features including tokens, themes, and accessibility."
          }
        }
      },
      {
        label: "Theme Showcase",
        route: {
          path: "/themes",
          component: ThemeShowcase,
          props: {
            label: "Theme Showcase",
            description: "Interactive demonstration of theme switching and token resolution."
          }
        }
      }
    ]
  }
];

export const routes: RouteConfig[] = navGroups
  .flatMap((component) => component.components.map((component) => component.route))
  .filter(Boolean) as RouteConfig[];
