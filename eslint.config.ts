import { getConfig } from "@mateothegreat/eslint-config";
import { defineConfig } from "eslint/config";

const config = getConfig({
  files: ["**/*.ts"]
});

export default defineConfig(config);
