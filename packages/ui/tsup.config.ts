import { copyFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "tsup";

// Scan "src/components" to auto-detect all component entry files (e.g. Button/button.tsx, Badge/badge.tsx)
const componentEntries = readdirSync("src/components", { withFileTypes: true })
  .filter((directory) => directory.isDirectory())
  .flatMap((directory) => {
    const componentDir = join("src/components", directory.name);
    return readdirSync(componentDir)
      .filter((fileName) => {
        const isTsxFile = fileName.endsWith(".tsx");
        const isTestOrStory = fileName.includes(".test.") || fileName.includes(".stories.");
        return isTsxFile && !isTestOrStory;
      })
      .map((fileName) => join(componentDir, fileName).replace(/\\/g, "/"));
  });


export default defineConfig((options) => ({
  entryPoints: [
    "src/index.ts",
    "src/utils/fluidGlass/index.ts",
    ...componentEntries,
    "src/styles.css",
  ],
  format: ["cjs", "esm"],
  external: ["react", "react-dom"],
  banner: {
    js: '"use client";',
  },
  outDir: "dist",
  loader: {
    ".css": "file",
  },
  dts: {
    entry: [
      "src/index.ts",
      "src/utils/fluidGlass/index.ts",
      ...componentEntries,
    ],
  },
  // dts: true,
  treeshake: true,
  splitting: true,
  clean: true,
  publicDir: false,
  outExtension({ format }) {
    return {
      js: format === "cjs" ? ".js" : ".mjs",
    };
  },
  esbuildOptions(options) {
    options.treeShaking = true;
    options.preserveSymlinks = false;
  },
  onSuccess: async () => {
    // Copy hashed CSS to styles.css for direct imports
    const distDir = join(process.cwd(), "dist");
    try {
      const files = readdirSync(distDir);
      const cssFile = files.find((f) => f.startsWith("styles-") && f.endsWith(".css"));
      if (cssFile) {
        copyFileSync(join(distDir, cssFile), join(distDir, "styles.css"));
      }
    } catch (error) {
      // Silent fail
    }
  },
  ...options,
}));