import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        root: __dirname,
        test: {
          name: "ts",
          environment: "node",
          include: ["src/**/*.test.ts"],
          typecheck: {
            enabled: true,
            include: ["src/**/*.test.ts"],
            tsconfig: "tsconfig.test.json"
          }
        }
      },
      {
        root: __dirname,
        test: {
          name: "dom",
          environment: "happy-dom",
          include: ["src/**/*.{svelte.test,test}.ts"],
          browser: {
            enabled: true,
            // headless: true,
            instances: [
              {
                browser: "chrome",
                viewport: {
                  width: 1920,
                  height: 1080
                }
              }
            ]
          },
          printConsoleTrace: true,
          css: true,
          globals: true,
          maxConcurrency: 10,
          typecheck: {
            enabled: true
          }
        }
      }
    ],
    coverage: {
      all: true,
      reporter: ["json"],
      provider: "v8",
      include: ["src"],
      exclude: [...coverageConfigDefaults.exclude, "tmp/**/*", "demo/**/*", "node_modules/**/*"],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80
      }
    }
  }
});
