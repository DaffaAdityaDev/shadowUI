import type { Meta, StoryObj } from "@storybook/react";
import type { BadgeProps, BadgeVariant } from "@shadoworg/shadowui";
import { Badge } from "@shadoworg/shadowui";

type BadgeStoryArgs = BadgeProps & {
  theme?: "primer" | "fluid-glass";
};

const meta: Meta<BadgeStoryArgs> = {
  title: "Components/Badge",
  component: Badge,
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
      options: ["filled", "outline", "subtle"],
      description: "Visual variant badge",
    },
    tone: {
      control: { type: "select" },
      options: ["default", "danger"],
    },
    children: {
      control: { type: "text" },
    },
  },
  args: {
    theme: "primer",
    children: "New Feature",
    variant: "filled",
    tone: "default",
  },
};

export default meta;

type Story = StoryObj<BadgeStoryArgs>;

// 1. Default (Playground): Interactive Controls
export const Default: Story = {
  name: "Playground",
  render: (args: BadgeStoryArgs) => {
    const { theme = "primer", children, ...props } = args;
    const activeTheme = theme;
    return (
      <div
        data-theme={activeTheme}
        className={`p-10 min-h-[200px] flex flex-col items-center justify-center gap-4 rounded-2xl transition-all duration-300 ${
          activeTheme === "fluid-glass"
            ? "bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white"
            : "bg-slate-100"
        }`}
      >
        <Badge {...props} theme={activeTheme as any}>
          {children}
        </Badge>
        <span className="text-xs font-mono opacity-60">Active Theme: {activeTheme}</span>
      </div>
    );
  },
};

// 2. Variants: Visual Comparison (Filled, Outline, Subtle)
export const Variants: Story = {
  name: "Variants",
  render: (args: BadgeStoryArgs) => {
    const { theme = "primer", tone = "default", children, ...props } = args;
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
        <div className="flex flex-wrap items-center gap-3">
          <Badge {...props} theme={activeTheme as any} tone={tone} variant="filled">
            {children ? `${children} (Filled)` : "Filled Badge"}
          </Badge>
          <Badge {...props} theme={activeTheme as any} tone={tone} variant="outline">
            {children ? `${children} (Outline)` : "Outline Badge"}
          </Badge>
          <Badge {...props} theme={activeTheme as any} tone={tone} variant="subtle">
            {children ? `${children} (Subtle)` : "Subtle Badge"}
          </Badge>
        </div>
      </div>
    );
  },
};

// 3. Tones: Intent Comparison (Default vs Danger)
export const Tones: Story = {
  name: "Tones",
  render: (args: BadgeStoryArgs) => {
    const { theme = "primer", variant = "filled", children, ...props } = args;
    const activeTheme = theme;
    const resolvedVariant: BadgeVariant = (variant as BadgeVariant) || "filled";
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
        <div className="flex flex-wrap items-center gap-3">
          <Badge {...props} theme={activeTheme as any} variant={resolvedVariant} tone="default">
            {children || "Default"}
          </Badge>
          <Badge {...props} theme={activeTheme as any} variant={resolvedVariant} tone="danger">
            {children ? `${children} (Danger)` : "Danger Tone"}
          </Badge>
        </div>
      </div>
    );
  },
};
