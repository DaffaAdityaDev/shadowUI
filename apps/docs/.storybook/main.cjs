const { dirname, resolve } = require("path");
const tailwindcss = require("@tailwindcss/postcss");

const config = {
  stories: ["../stories/*.stories.tsx", "../stories/**/*.stories.tsx"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  core: {},

  async viteFinal(config, { configType }) {
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
          {
            find: "ui",
            replacement: resolve(__dirname, "../../../packages/ui/"),
          },
        ],
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

