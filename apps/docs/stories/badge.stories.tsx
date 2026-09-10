import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@shadoworg/shadowui";

type BadgeStoryArgs = React.ComponentProps<typeof Badge> & {
  skin: "primer" | "fluid-glass";
};

const meta: Meta<BadgeStoryArgs> = {
  title: "Components/Badge",
  component: Badge,
  argTypes: {
    skin: {
      control: { type: "select" },
      options: ["primer", "fluid-glass"],
      description: "Pilih theme / skin visual yang aktif",
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
    skin: "primer",
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
  render: ({ skin = "primer", children, ...props }) => (
    <div
      data-skin={skin}
      className={`p-10 min-h-[200px] flex flex-col items-center justify-center gap-4 rounded-2xl transition-all duration-300 ${
        skin === "fluid-glass"
          ? "bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white"
          : "bg-slate-100"
      }`}
    >
      <Badge {...props}>{children}</Badge>
      <span className="text-xs font-mono opacity-60">Active Skin: {skin}</span>
    </div>
  ),
};

// 2. Variants: Visual Comparison (Filled, Outline, Subtle)
export const Variants: Story = {
  name: "Variants",
  render: ({ skin = "primer", tone = "default", children, ...props }) => (
    <div
      data-skin={skin}
      className={`p-8 rounded-2xl flex flex-col gap-4 transition-all duration-300 ${
        skin === "fluid-glass"
          ? "bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white"
          : "bg-slate-100"
      }`}
    >
      <span className="text-xs font-mono uppercase tracking-wider font-semibold opacity-70">
        Variants ({skin}) — Tone: {tone}
      </span>
      <div className="flex flex-wrap items-center gap-3">
        <Badge {...props} tone={tone} variant="filled">
          {children ? `${children} (Filled)` : "Filled Badge"}
        </Badge>
        <Badge {...props} tone={tone} variant="outline">
          {children ? `${children} (Outline)` : "Outline Badge"}
        </Badge>
        <Badge {...props} tone={tone} variant="subtle">
          {children ? `${children} (Subtle)` : "Subtle Badge"}
        </Badge>
      </div>
    </div>
  ),
};

// 3. Tones: Intent Comparison (Default vs Danger)
export const Tones: Story = {
  name: "Tones",
  render: ({ skin = "primer", variant = "filled", children, ...props }) => (
    <div
      data-skin={skin}
      className={`p-8 rounded-2xl flex flex-col gap-4 transition-all duration-300 ${
        skin === "fluid-glass"
          ? "bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white"
          : "bg-slate-100"
      }`}
    >
      <span className="text-xs font-mono uppercase tracking-wider font-semibold opacity-70">
        Tones ({skin}) — Variant: {variant}
      </span>
      <div className="flex flex-wrap items-center gap-3">
        <Badge {...props} variant={variant} tone="default">
          {children || "Default"}
        </Badge>
        <Badge {...props} variant={variant} tone="danger">
          {children ? `${children} (Danger)` : "Danger Tone"}
        </Badge>
      </div>
    </div>
  ),
};
