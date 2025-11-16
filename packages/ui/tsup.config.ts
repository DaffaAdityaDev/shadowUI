import { copyFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entryPoints: [
    "src/index.ts",
    "src/components/Button/button.tsx",
    "src/styles.css",
  ],
  format: ["cjs", "esm"],
  external: ["react", "react-dom"],
  outDir: "dist",
  loader: {
    ".css": "file",
  },
  dts: {
    entry: ["src/index.ts", "src/components/Button/button.tsx"],
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