import type { Meta, StoryObj } from "@storybook/react";
import type { ButtonProps } from "@shadoworg/shadowui/button";
import { Button } from "@shadoworg/shadowui/button";

type ButtonStoryArgs = ButtonProps & {
  theme?: "primer" | "fluid-glass";
};

const meta: Meta<ButtonStoryArgs> = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    theme: {
      control: { type: "select" },
      options: ["primer", "fluid-glass"],
      description: "Pilih theme visual yang aktif",
      table: {
        category: "Theme",
      },
    },
    variant: {
      control: { type: "select" },
      options: ["filled", "outline", "ghost"],
      description: "Visual variant of the button",
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
      description: "Size of the button",
    },
    tone: {
      control: { type: "select" },
      options: ["default", "danger"],
      description: "Color tone / intent",
    },
    loading: {
      control: { type: "boolean" },
      description: "Shows an animated spinner and disables interaction",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Disables the button",
    },
    children: {
      control: { type: "text" },
      description: "Button label / content",
    },
  },
  args: {
    theme: "primer",
    children: "Button",
    variant: "filled",
    size: "md",
    tone: "default",
    loading: false,
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<ButtonStoryArgs>;

// 1. Default (Playground): Interactive Controls
export const Default: Story = {
  name: "Playground",
  render: (args: ButtonStoryArgs) => {
    const { theme = "primer", children, ...props } = args;
    const activeTheme = theme;
    return (
      <div
        data-theme={activeTheme}
        className={`p-10 min-h-[200px] flex flex-col items-center justify-center gap-4 rounded-2xl transition-all duration-300 ${
          activeTheme === "fluid-glass"
            ? "bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500"
            : "bg-slate-100"
        }`}
      >
        <Button {...props} theme={activeTheme as any}>
          {children}
        </Button>
        <span className="text-xs font-mono opacity-60">Active Theme: {activeTheme}</span>
      </div>
    );
  },
};

// Backward compatibility for old story ID `components-button--primary`
export const Primary: Story = Default;

// 2. Variants: Visual Comparison (Filled, Outline, Ghost)
export const Variants: Story = {
  name: "Variants",
  render: (args: ButtonStoryArgs) => {
    const { theme = "primer", tone = "default", size = "md", children, ...props } = args;
    const activeTheme = theme;
    return (
      <div
        data-theme={activeTheme}
        className={`p-8 rounded-2xl flex flex-col gap-4 transition-all duration-300 ${
          activeTheme === "fluid-glass"
            ? "bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white"
            : "bg-slate-100"
        }`}
      >
        <span className="text-xs font-mono uppercase tracking-wider font-semibold opacity-70">
          Variants ({activeTheme}) — Tone: {tone}
        </span>
        <div className="flex flex-wrap items-center gap-4">
          <Button {...props} theme={activeTheme as any} tone={tone} size={size} variant="filled">
            {children ? `${children} (Filled)` : "Filled"}
          </Button>
          <Button {...props} theme={activeTheme as any} tone={tone} size={size} variant="outline">
            {children ? `${children} (Outline)` : "Outline"}
          </Button>
          <Button {...props} theme={activeTheme as any} tone={tone} size={size} variant="ghost">
            {children ? `${children} (Ghost)` : "Ghost"}
          </Button>
        </div>
      </div>
    );
  },
};

// 3. Sizes: Scale Comparison (sm, md, lg)
export const Sizes: Story = {
  name: "Sizes",
  render: (args: ButtonStoryArgs) => {
    const { theme = "primer", variant = "filled", tone = "default", children, ...props } = args;
    const activeTheme = theme;
    return (
      <div
        data-theme={activeTheme}
        className={`p-8 rounded-2xl flex flex-col gap-4 transition-all duration-300 ${
          activeTheme === "fluid-glass"
            ? "bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white"
            : "bg-slate-100"
        }`}
      >
        <span className="text-xs font-mono uppercase tracking-wider font-semibold opacity-70">
          Sizes ({activeTheme}) — Variant: {variant}
        </span>
        <div className="flex flex-wrap items-center gap-4">
          <Button {...props} theme={activeTheme as any} variant={variant} tone={tone} size="sm">
            {children ? `${children} (sm)` : "Small (sm)"}
          </Button>
          <Button {...props} theme={activeTheme as any} variant={variant} tone={tone} size="md">
            {children ? `${children} (md)` : "Medium (md)"}
          </Button>
          <Button {...props} theme={activeTheme as any} variant={variant} tone={tone} size="lg">
            {children ? `${children} (lg)` : "Large (lg)"}
          </Button>
        </div>
      </div>
    );
  },
};

// 4. States: Interaction States (Default, Loading, Disabled)
export const States: Story = {
  name: "States",
  render: (args: ButtonStoryArgs) => {
    const {
      theme = "primer",
      variant = "filled",
      tone = "default",
      size = "md",
      children,
      ...props
    } = args;
    const activeTheme = theme;
    return (
      <div
        data-theme={activeTheme}
        className={`p-8 rounded-2xl flex flex-col gap-4 transition-all duration-300 ${
          activeTheme === "fluid-glass"
            ? "bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white"
            : "bg-slate-100"
        }`}
      >
        <span className="text-xs font-mono uppercase tracking-wider font-semibold opacity-70">
          States ({activeTheme}) — Variant: {variant}
        </span>
        <div className="flex flex-wrap items-center gap-4">
          <Button {...props} theme={activeTheme as any} variant={variant} tone={tone} size={size}>
            {children || "Normal"}
          </Button>
          <Button
            {...props}
            theme={activeTheme as any}
            variant={variant}
            tone={tone}
            size={size}
            loading
          >
            Loading State
          </Button>
          <Button
            {...props}
            theme={activeTheme as any}
            variant={variant}
            tone={tone}
            size={size}
            disabled
          >
            Disabled State
          </Button>
        </div>
      </div>
    );
  },
};

// 5. Tones: Intent Comparison (Default vs Danger)
export const Tones: Story = {
  name: "Tones",
  render: (args: ButtonStoryArgs) => {
    const { theme = "primer", variant = "filled", size = "md", children, ...props } = args;
    const activeTheme = theme;
    return (
      <div
        data-theme={activeTheme}
        className={`p-8 rounded-2xl flex flex-col gap-4 transition-all duration-300 ${
          activeTheme === "fluid-glass"
            ? "bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white"
            : "bg-slate-100"
        }`}
      >
        <span className="text-xs font-mono uppercase tracking-wider font-semibold opacity-70">
          Tones ({activeTheme}) — Variant: {variant}
        </span>
        <div className="flex flex-wrap items-center gap-4">
          <Button
            {...props}
            theme={activeTheme as any}
            variant={variant}
            size={size}
            tone="default"
          >
            {children ? `${children} (Default)` : "Default Intent"}
          </Button>
          <Button {...props} theme={activeTheme as any} variant={variant} size={size} tone="danger">
            {children ? `${children} (Danger)` : "Danger Intent"}
          </Button>
        </div>
      </div>
    );
  },
};
