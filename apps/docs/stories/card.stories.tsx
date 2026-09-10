import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "@shadoworg/shadowui/card";
import { Button } from "@shadoworg/shadowui/button";
import { Badge } from "@shadoworg/shadowui";

type CardStoryArgs = React.ComponentProps<typeof Card> & {
  skin: "primer" | "fluid-glass";
};

const meta: Meta<CardStoryArgs> = {
  title: "Components/Card",
  component: Card,
  argTypes: {
    skin: {
      control: { type: "select" },
      options: ["primer", "fluid-glass"],
      description: "Pilih theme / skin visual yang aktif",
      table: {
        category: "Theme",
      },
    },
    fluidMode: {
      control: { type: "select" },
      options: ["full", "border"],
      description: "Pilihan mode refraksi: 'full' (kubah lensa cembung penuh) atau 'border' (bezel pinggir saja)",
      table: {
        category: "Theme",
      },
    },
    fluidSurface: {
      control: { type: "select" },
      options: ["convex-squircle", "convex-circle", "concave", "lip"],
      description: "Pilihan profil kurva kaca fisik (Squircle, Circle, Concave, Lip)",
      table: {
        category: "Theme",
      },
    },
    fluidAberration: {
      control: { type: "object" },
      description: "Dispersi prisma kromatik (angka atau objek per-warna: { r, g, b })",
      table: {
        category: "Theme",
      },
    },
    padding: {
      control: { type: "select" },
      options: ["none", "sm", "md", "lg"],
      description: "Ukuran inner padding card",
    },
    interactive: {
      control: { type: "boolean" },
      description: "Menambahkan hover lift, efek kursor, dan state aktif",
    },
    children: {
      control: { type: "text" },
      description: "Konten di dalam card",
    },
  },
  args: {
    skin: "primer",
    padding: "md",
    interactive: true,
  },
};

export default meta;

type Story = StoryObj<CardStoryArgs>;

// 1. Default (Playground): Interactive Controls
export const Default: Story = {
  name: "Playground",
  render: ({ skin = "primer", ...args }) => (
    <div
      data-skin={skin}
      className={`p-12 min-h-[350px] flex items-center justify-center rounded-2xl transition-all duration-300 ${
        skin === "fluid-glass"
          ? "bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500"
          : "bg-slate-100"
      }`}
    >
      <Card {...args} className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="subtle">Active Skin: {skin}</Badge>
        </div>
        <h3 className="text-lg font-semibold mb-2">
          {skin === "fluid-glass" ? "Glass Surface Card" : "Primer Clean Card"}
        </h3>
        <p className="text-sm opacity-80 mb-4">
          Gunakan panel Controls di bawah untuk menguji padding, state interaktif, dan skin.
        </p>
        <Button size="sm">Action Button</Button>
      </Card>
    </div>
  ),
};

// 2. Paddings: Scale Comparison (none, sm, md, lg)
export const Paddings: Story = {
  name: "Padding Scales",
  render: ({ skin = "primer" }) => (
    <div
      data-skin={skin}
      className={`p-10 rounded-2xl flex flex-col gap-6 transition-all duration-300 ${
        skin === "fluid-glass"
          ? "bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500"
          : "bg-slate-100"
      }`}
    >
      <span className="text-xs font-mono uppercase tracking-wider font-semibold opacity-70">
        Padding Scales ({skin})
      </span>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card padding="sm">
          <h4 className="font-semibold text-sm">Small Padding (sm)</h4>
          <p className="text-xs opacity-75 mt-1">Compact inner spacing.</p>
        </Card>
        <Card padding="md">
          <h4 className="font-semibold text-sm">Medium Padding (md)</h4>
          <p className="text-xs opacity-75 mt-1">Default standard spacing.</p>
        </Card>
        <Card padding="lg">
          <h4 className="font-semibold text-sm">Large Padding (lg)</h4>
          <p className="text-xs opacity-75 mt-1">Spacious inner layout.</p>
        </Card>
      </div>
    </div>
  ),
};

// 3. Interactive vs Static
export const InteractiveVsStatic: Story = {
  name: "Interactive vs Static",
  render: ({ skin = "primer" }) => (
    <div
      data-skin={skin}
      className={`p-10 rounded-2xl flex flex-col gap-6 transition-all duration-300 ${
        skin === "fluid-glass"
          ? "bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500"
          : "bg-slate-100"
      }`}
    >
      <span className="text-xs font-mono uppercase tracking-wider font-semibold opacity-70">
        Interaction Comparison ({skin})
      </span>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card interactive={false}>
          <h4 className="font-semibold text-base mb-1">Static Card</h4>
          <p className="text-sm opacity-75">
            Tidak bereaksi saat kursor mouse di-hover. Cocok untuk wadah konten pasif.
          </p>
        </Card>
        <Card interactive={true}>
          <h4 className="font-semibold text-base mb-1">Interactive Card</h4>
          <p className="text-sm opacity-75">
            Hover mouse di atas card ini untuk melihat efek kursor, elevasi lift, dan shadow highlight!
          </p>
        </Card>
      </div>
    </div>
  ),
};

// 4. Compositions: Real-world card composition
export const Composition: Story = {
  name: "Composition (Real-World)",
  render: ({ skin = "primer" }) => (
    <div
      data-skin={skin}
      className={`p-12 min-h-[400px] flex items-center justify-center rounded-2xl transition-all duration-300 ${
        skin === "fluid-glass"
          ? "bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500"
          : "bg-slate-100"
      }`}
    >
      <Card interactive className="w-full max-w-md">
        <div className="flex items-start justify-between mb-4">
          <div>
            <Badge variant="subtle" className="mb-2">Analytics</Badge>
            <h3 className="text-xl font-bold">Monthly Revenue Overview</h3>
          </div>
          <span className="text-xs font-mono opacity-60">Q1 2025</span>
        </div>
        <p className="text-sm opacity-80 mb-6">
          Monitor your real-time performance, conversions, and metrics with our advanced dashboard suite.
        </p>
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10">
          <Button variant="ghost" size="sm">Dismiss</Button>
          <Button variant="filled" size="sm">View Report</Button>
        </div>
      </Card>
    </div>
  ),
};

// 5. Fluid Glass (Dedicated showcase)
export const FluidGlass: Story = {
  name: "Fluid Glass",
  args: {
    skin: "fluid-glass",
    interactive: true,
  },
  render: (args) => (
    <div
      data-skin="fluid-glass"
      className="p-10 min-h-[350px] flex items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500"
    >
      <Card {...args} className="w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-2">Glass Surface</h3>
        <p className="text-sm opacity-90 mb-4">
          Efek blur tembus pandang dengan pantulan cahaya di tepinya.
        </p>
        <Button size="sm">Explore</Button>
      </Card>
    </div>
  ),
};

// 6. Side by Side Comparison
export const SkinComparison: Story = {
  name: "Side by Side Comparison",
  render: () => (
    <div className="p-10 min-h-[400px] bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 grid grid-cols-1 md:grid-cols-2 gap-8 items-center rounded-2xl">
      <div data-skin="primer" className="flex flex-col items-center gap-3">
        <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">
          Skin: Primer
        </span>
        <Card interactive className="w-full max-w-xs">
          <h4 className="font-semibold text-base mb-1">Primer Surface</h4>
          <p className="text-xs text-slate-500">
            Flat solid surface, 1px subtle border, 8px radius.
          </p>
        </Card>
      </div>

      <div data-skin="fluid-glass" className="flex flex-col items-center gap-3">
        <span className="text-xs font-mono tracking-widest text-pink-300 uppercase">
          Skin: Fluid Glass
        </span>
        <Card interactive className="w-full max-w-xs">
          <h4 className="font-semibold text-base mb-1">Glass Surface</h4>
          <p className="text-xs opacity-80">
            Backdrop blur 16px, glowing ambient shadow, 20px radius.
          </p>
        </Card>
      </div>
    </div>
  ),
};
