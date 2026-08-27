import { getViteConfig } from "@sv0/common/config/vite";
import { FileType } from "@sv0/common/filesystem/files";
import { usePathPattern } from "@sv0/common/filesystem/patterns";
import { cwd } from "node:process";
import { defineConfig } from "vite";

console.log(cwd());

const matcher = usePathPattern()
  .with(/.*/) // include anything starting with "src"
  .without(/(?:^|\/)\.[^/]+/) // exclude dot-prepended files/dirs
  .without(/(?:^|\/)node_modules(?:\/|$)/); // exclude node_modules anywhere

export default defineConfig(
  getViteConfig(
    {
      features: ["frontend"],
      base: "./../",

      // aliases: {
      //   $utils: "../src/utils",
      //   $types: "../src/types",
      //   "$util/props": "../src/util/props"
      // },
      pattern: matcher,
      types: [FileType.FILE, FileType.DIRECTORY]
    },
    {
      resolve: {
        alias: {
          $utils: "./src/utils",
          $components: "./src/components",
          $util: "./src/util"
        }
      }
    }
  )
);
