const { dirname, resolve, join } = require("path");
const fs = require("fs");
const tailwindcss = require("@tailwindcss/postcss");

// Auto-detect all component entries dynamically (Scalable Zero-Config)
const uiComponentsDir = resolve(__dirname, "../../../packages/ui/src/components");
const dynamicComponentAliases = fs.existsSync(uiComponentsDir)
  ? fs
      .readdirSync(uiComponentsDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .flatMap((dirent) => {
        const compDir = join(uiComponentsDir, dirent.name);
        const files = fs.readdirSync(compDir);
        const mainFile = files.find(
          (f) => f.endsWith(".tsx") && !f.includes(".test.") && !f.includes(".stories."),
        );
        if (!mainFile) return [];
        return [
          {
            find: `@shadoworg/shadowui/${dirent.name.toLowerCase()}`,
            replacement: join(compDir, mainFile),
          },
        ];
      })
  : [];

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}

const config = {
  stories: ["../stories/*.stories.tsx", "../stories/**/*.stories.tsx"],
  addons: [getAbsolutePath("@storybook/addon-links"), getAbsolutePath("@storybook/addon-docs")],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },

  core: {},

  async viteFinal(config) {
    // customize the Vite config here
    const existingAlias = config.resolve?.alias;
    const aliasArray = Array.isArray(existingAlias)
      ? existingAlias
      : existingAlias
        ? Object.entries(existingAlias).map(([key, value]) => ({
            find: key,
            replacement: value,
          }))
        : [];

    return {
      ...config,
      define: { "process.env": {} },
      resolve: {
        ...config.resolve,
        alias: [
          ...aliasArray,
          ...dynamicComponentAliases,
          {
            find: "@shadoworg/shadowui",
            replacement: resolve(__dirname, "../../../packages/ui/src/index.ts"),
          },
        ],
      },
      optimizeDeps: {
        ...config.optimizeDeps,
        exclude: [...(config.optimizeDeps?.exclude || []), "@shadoworg/shadowui"],
      },
      server: {
        ...config.server,
        watch: {
          ...config.server?.watch,
          ignored: ["!**/packages/ui/**"],
        },
      },
      css: {
        ...config.css,
        postcss: {
          plugins: [tailwindcss],
        },
      },
    };
  },

  docs: {
    autodocs: true,
  },
};

module.exports = config;
