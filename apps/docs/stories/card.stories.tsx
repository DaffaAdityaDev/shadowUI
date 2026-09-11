import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode, CSSProperties } from "react";
import { Card } from "@shadoworg/shadowui/card";
import { Button } from "@shadoworg/shadowui/button";
import { Badge } from "@shadoworg/shadowui";

type CardStoryArgs = {
  theme?: "primer" | "fluid-glass";
  variant?: "filled" | "outline" | "ghost";
  themeVersion?: string | number;
  padding?: "none" | "sm" | "md" | "lg";
  interactive?: boolean;
  fluidMode?: "full" | "border";
  fluidSurface?: "convex-squircle" | "convex-circle" | "concave" | "lip";
  fluidIor?: number;
  fluidScale?: number;
  fluidThickness?: number;
  fluidBezel?: number;
  fluidBlur?: number;
  fluidOpacity?: number;
  fluidSaturate?: number;
  fluidAberration?: any;
  fluidSpecular?: number;
  fluidInteractiveLight?: boolean;
  backgroundType?:
    | "geometric-lines"
    | "image-city"
    | "image-abstract"
    | "gradient"
    | "checkerboard"
    | "clean";
  children?: ReactNode;
  className?: string;
  [key: string]: any;
};

const BACKGROUND_STYLES: Record<
  string,
  { className: string; style?: CSSProperties; overlay?: string; label: string; watermark?: string }
> = {
  "geometric-lines": {
    label: "Geometric Zebra Lines (/testglass Reference)",
    className: "bg-slate-950 relative overflow-hidden",
    style: {
      backgroundImage:
        "repeating-linear-gradient(45deg, #6366f1 0, #6366f1 15px, #1e1b4b 15px, #1e1b4b 30px)",
    },
    overlay: "bg-slate-950/20",
    watermark: "GEOMETRIC LINES",
  },
  "image-city": {
    label: "Tokyo Neon Wallpaper",
    className: "bg-cover bg-center relative overflow-hidden",
    style: {
      backgroundImage: `url("https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80")`,
    },
    overlay: "bg-gradient-to-t from-black/60 via-transparent to-black/30",
    watermark: "TOKYO NIGHT REFRACTION",
  },
  "image-abstract": {
    label: "Abstract 3D Liquid Waves",
    className: "bg-cover bg-center relative overflow-hidden",
    style: {
      backgroundImage: `url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80")`,
    },
    overlay: "bg-black/25",
    watermark: "OPTICAL DISPLACEMENT",
  },
  gradient: {
    label: "Vibrant Gradient",
    className: "bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500",
  },
  checkerboard: {
    label: "Refraction Distortion Grid",
    className: "bg-slate-950 relative overflow-hidden",
    style: {
      backgroundImage:
        "linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.2) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.2) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.2) 75%)",
      backgroundSize: "40px 40px",
      backgroundPosition: "0 0, 0 20px, 20px -20px, -20px 0px",
    },
    watermark: "CHECKERBOARD GRID",
  },
  clean: {
    label: "Minimal Slate",
    className: "bg-slate-100",
  },
};

const meta: Meta<CardStoryArgs> = {
  title: "Components/Card",
  component: Card,
  argTypes: {
    theme: {
      control: { type: "select" },
      options: ["primer", "fluid-glass"],
      description: "Pilih theme visual yang aktif",
      table: {
        category: "Theme",
      },
    },
    themeVersion: {
      control: { type: "text" },
      description: "Theme version iteration (e.g. '1', '2')",
      table: {
        category: "Theme",
      },
    },
    backgroundType: {
      control: { type: "select" },
      options: [
        "geometric-lines",
        "image-city",
        "image-abstract",
        "gradient",
        "checkerboard",
        "clean",
      ],
      description:
        "Pilih wallpaper background di balik kartu untuk menguji efek pembiasan refraksi fisik (Snell's Law)",
      table: {
        category: "Preview Environment",
      },
    },
    fluidMode: {
      control: { type: "radio" },
      options: ["full", "border"],
      description:
        "Mode transmisi refraksi: 'full' (seluruh permukaan cembung/lensa) atau 'border' (hanya bevel tepi)",
      table: {
        category: "Fluid Glass Optical Physics",
      },
    },
    fluidSurface: {
      control: { type: "select" },
      options: ["convex-squircle", "convex-circle", "concave", "lip"],
      description: "Geometri kurva permukaan 3D lensa kaca",
      table: {
        category: "Fluid Glass Optical Physics",
      },
    },
    fluidIor: {
      control: { type: "range", min: 1.0, max: 2.5, step: 0.05 },
      description: "Indeks Bias (Snell's Law: 1.0=udara, 1.52=kaca crown, 2.42=berlian)",
      table: {
        category: "Fluid Glass Optical Physics",
      },
    },
    fluidScale: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Kekuatan defleksi perpindahan SVG displacement map",
      table: {
        category: "Fluid Glass Optical Physics",
      },
    },
    fluidThickness: {
      control: { type: "range", min: 0.5, max: 3.0, step: 0.1 },
      description: "Ketebalan kaca & kurva kelengkungan profil tepi splay",
      table: {
        category: "Fluid Glass Optical Physics",
      },
    },
    fluidBezel: {
      control: { type: "range", min: 4, max: 80, step: 2 },
      description: "Lebar bevel batas pembiasan optik (dalam pixel)",
      table: {
        category: "Fluid Glass Optical Physics",
      },
    },
    fluidBlur: {
      control: { type: "range", min: 0, max: 32, step: 1 },
      description: "Backdrop blur (0px = kristal jernih ala Apple visionOS, >12px = frosted glass)",
      table: {
        category: "Fluid Glass Optical Physics",
      },
    },
    fluidOpacity: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Transparansi permukaan kaca (0% = murni tanpa tint, 6% = default jernih)",
      table: {
        category: "Fluid Glass Optical Physics",
      },
    },
    fluidSaturate: {
      control: { type: "range", min: 100, max: 200, step: 5 },
      description: "Backdrop saturation boost untuk memperkaya warna di balik kaca",
      table: {
        category: "Fluid Glass Optical Physics",
      },
    },
    fluidSpecular: {
      control: { type: "range", min: 0, max: 1.5, step: 0.05 },
      description: "Intensitas specular highlight & pantulan cahaya rim",
      table: {
        category: "Fluid Glass Optical Physics",
      },
    },
    fluidInteractiveLight: {
      control: { type: "boolean" },
      description: "Mengaktifkan pelacakan sudut sinar kursor mouse secara dinamis",
      table: {
        category: "Fluid Glass Optical Physics",
      },
    },
    variant: {
      control: { type: "select" },
      options: ["filled", "outline", "ghost"],
      description: "Visual variant semantik",
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
    theme: "primer",
    themeVersion: "1",
    variant: "filled",
    padding: "md",
    interactive: true,
  },
};

export default meta;

type Story = StoryObj<CardStoryArgs>;

function resolveTheme(theme?: string) {
  return theme ?? "primer";
}

function resolveVersion(themeVersion?: string | number) {
  return themeVersion;
}

// 1. Default (Playground): Standard Storybook Component Playground
export const Default: Story = {
  name: "Playground",
  render: (args: CardStoryArgs) => {
    const { theme, themeVersion, ...restArgs } = args;
    const activeTheme = resolveTheme(theme);
    const activeVersion = resolveVersion(themeVersion);
    const isGlass = activeTheme === "fluid-glass";

    return (
      <div
        data-theme={activeTheme}
        className={`p-10 min-h-[380px] flex items-center justify-center rounded-2xl transition-all duration-300 ${
          isGlass
            ? "bg-slate-950 relative overflow-hidden text-white"
            : "bg-slate-100 dark:bg-slate-900"
        }`}
        style={
          isGlass
            ? {
                backgroundImage:
                  "repeating-linear-gradient(45deg, #6366f1 0, #6366f1 15px, #1e1b4b 15px, #1e1b4b 30px)",
              }
            : undefined
        }
      >
        <Card
          theme={activeTheme as any}
          themeVersion={activeVersion}
          {...restArgs}
          className="w-full max-w-md shadow-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <Badge variant="subtle">Component Card</Badge>
            <span className="text-xs font-mono opacity-60">
              {activeTheme === "fluid-glass" ? "Glass Refraction" : "Solid Primer"}
            </span>
          </div>
          <h3 className="text-xl font-bold mb-2">
            {activeTheme === "fluid-glass" ? "Fluid Glass Card" : "Primer Card"}
          </h3>
          <p className="text-sm opacity-80 mb-4 leading-relaxed">
            Card component with multi-theme support, semantic variants, and design token
            integration.
          </p>
          <div className="flex items-center gap-2.5">
            <Button size="sm">Action Button</Button>
            <Button size="sm" variant="outline">
              Secondary
            </Button>
          </div>
        </Card>
      </div>
    );
  },
};

// 2. Paddings: Scale Comparison (none, sm, md, lg)
export const Paddings: Story = {
  name: "Padding Scales",
  render: (args: CardStoryArgs) => {
    const { theme, themeVersion } = args;
    const activeTheme = resolveTheme(theme);
    const activeVersion = resolveVersion(themeVersion);

    return (
      <div
        data-theme={activeTheme}
        className={`p-8 rounded-2xl flex flex-col gap-6 transition-all duration-300 ${
          activeTheme === "fluid-glass"
            ? "bg-slate-950 text-white"
            : "bg-slate-100 dark:bg-slate-900"
        }`}
      >
        <span className="text-xs font-mono uppercase tracking-wider font-semibold opacity-70">
          Padding Scales ({activeTheme})
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card theme={activeTheme as any} themeVersion={activeVersion} padding="sm">
            <h4 className="font-semibold text-sm">Small Padding (sm)</h4>
            <p className="text-xs opacity-75 mt-1">Compact inner spacing.</p>
          </Card>
          <Card theme={activeTheme as any} themeVersion={activeVersion} padding="md">
            <h4 className="font-semibold text-sm">Medium Padding (md)</h4>
            <p className="text-xs opacity-75 mt-1">Default standard spacing.</p>
          </Card>
          <Card theme={activeTheme as any} themeVersion={activeVersion} padding="lg">
            <h4 className="font-semibold text-sm">Large Padding (lg)</h4>
            <p className="text-xs opacity-75 mt-1">Spacious inner layout.</p>
          </Card>
        </div>
      </div>
    );
  },
};

// 3. Interactive vs Static: Side by Side Behavior Comparison
export const InteractiveVsStatic: Story = {
  name: "Interactive vs Static",
  render: (args: CardStoryArgs) => {
    const { theme, themeVersion } = args;
    const activeTheme = resolveTheme(theme);
    const activeVersion = resolveVersion(themeVersion);
    const isGlass = activeTheme === "fluid-glass";

    return (
      <div
        data-theme={activeTheme}
        className={`p-8 rounded-2xl flex flex-col gap-6 transition-all duration-300 ${
          isGlass ? "bg-slate-950 text-white" : "bg-slate-100 dark:bg-slate-900"
        }`}
        style={
          isGlass
            ? {
                backgroundImage:
                  "repeating-linear-gradient(45deg, #6366f1 0, #6366f1 15px, #1e1b4b 15px, #1e1b4b 30px)",
              }
            : undefined
        }
      >
        <span className="text-xs font-mono uppercase tracking-wider font-semibold opacity-70">
          Interaction Comparison ({activeTheme})
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            theme={activeTheme as any}
            themeVersion={activeVersion}
            interactive={false}
            className="w-full"
          >
            <h4 className="font-semibold text-base mb-1">Static Card</h4>
            <p className="text-sm opacity-75">
              Tidak bereaksi saat mouse di-hover. Tidak ada animasi lift atau pergerakan specular
              light.
            </p>
          </Card>
          <Card
            theme={activeTheme as any}
            themeVersion={activeVersion}
            interactive={true}
            className="w-full"
          >
            <h4 className="font-semibold text-base mb-1">Interactive Card</h4>
            <p className="text-sm opacity-75">
              Hover mouse di atas card untuk melihat elevasi lift dan pantulan highlight interaktif.
            </p>
          </Card>
        </div>
      </div>
    );
  },
};

// 4. Dedicated Scroll Test: ONE dedicated sub-doc to test scroll refraction without getting left behind
export const ScrollTest: Story = {
  name: "Scroll Test",
  args: {
    theme: "fluid-glass",
    themeVersion: "1",
    fluidMode: "full",
    fluidSurface: "convex-squircle",
    fluidIor: 2.5,
    fluidScale: 36,
    fluidThickness: 1.2,
    fluidBezel: 36,
    fluidBlur: 0,
    fluidOpacity: 5,
    fluidSpecular: 0.85,
    fluidInteractiveLight: true,
    interactive: true,
  },
  render: (args: CardStoryArgs) => {
    const { theme, themeVersion, ...restArgs } = args;
    const activeTheme = resolveTheme(theme);
    const activeVersion = resolveVersion(themeVersion);

    return (
      <div className="relative w-full rounded-2xl border border-white/15 bg-slate-950 overflow-hidden shadow-2xl">
        {/* Bench Header Info */}
        <div className="p-4 border-b border-white/10 bg-slate-900/90 backdrop-blur-md flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-indigo-400">🔬 OPTICAL REFRACTION BENCH</span>
            <Badge variant="subtle">Dedicated Scroll Test</Badge>
          </div>
          <span className="text-slate-400 font-mono hidden md:inline">
            Scroll container ini ke bawah untuk melihat pembiasan dinamis
          </span>
        </div>

        {/* Scrollable Container with Sticky Floating Lens */}
        <div className="relative h-[620px] overflow-y-auto overflow-x-hidden p-6">
          {/* Pinned Sticky Lens: stays anchored in viewport without being left behind */}
          <div className="sticky top-4 z-30 flex justify-center pointer-events-none mb-[-260px]">
            <div className="pointer-events-auto w-full max-w-md shadow-2xl">
              <Card
                theme={activeTheme as any}
                themeVersion={activeVersion}
                {...restArgs}
                className="w-full text-white shadow-2xl"
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="subtle">Optical Lens Active</Badge>
                  <span className="text-xs font-mono text-cyan-300">Sticky Viewport Lens</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Fluid Glass Lens</h3>
                <p className="text-sm opacity-85 mb-4 leading-relaxed">
                  Scroll container ini ke atas dan ke bawah! Kartu tetap melayang stabil di sini
                  sementara garis zebra, tipografi, dan lampu kota bergeser di baliknya.
                </p>
                <div className="flex items-center gap-2.5">
                  <Button size="sm">Action Button</Button>
                  <Button size="sm" variant="outline">
                    Secondary
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Scrolling Background Track */}
          <div className="flex flex-col gap-10 pt-[270px] pb-12">
            {/* Section 1: Geometric Diagonal Zebra Lines */}
            <div className="relative h-[440px] rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center p-8 bg-slate-900 shadow-xl">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, #6366f1 0, #6366f1 15px, #1e1b4b 15px, #1e1b4b 30px)",
                }}
              />
              <div className="relative z-10 text-center flex flex-col items-center gap-2">
                <span className="text-5xl md:text-6xl font-black uppercase tracking-wider text-white drop-shadow-md">
                  GEOMETRIC LINES
                </span>
                <p className="text-xs text-slate-300 max-w-md bg-black/60 backdrop-blur-sm p-3 rounded-xl border border-white/10 font-mono">
                  Garis-garis diagonal tampak melengkung tajam saat melintasi tepi lensa
                  (Snell&apos;s Law feDisplacementMap).
                </p>
              </div>
            </div>

            {/* Section 2: Bold Typography Wall */}
            <div className="py-12 flex flex-col gap-4 select-none overflow-hidden text-center">
              <div className="text-6xl md:text-7xl font-black uppercase text-indigo-500/40 tracking-tighter leading-none">
                LIGHT BENDING
              </div>
              <div className="text-6xl md:text-7xl font-black uppercase text-pink-500/40 tracking-tighter leading-none">
                SNELL&apos;S LAW
              </div>
              <div className="text-6xl md:text-7xl font-black uppercase text-cyan-500/40 tracking-tighter leading-none">
                OPTICAL DISPLACEMENT
              </div>
            </div>

            {/* Section 3: Tokyo Neon City Night Lights */}
            <div className="relative h-[440px] rounded-2xl overflow-hidden border border-white/15 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80"
                alt="Tokyo Neon City Night Lights"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex items-end p-6">
                <span className="text-xl font-bold text-white tracking-wide">
                  Tokyo Street Lights &amp; Surface Reflection
                </span>
              </div>
            </div>

            {/* Section 4: Optical Checkerboard Grid */}
            <div className="relative h-[380px] rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center p-8 bg-slate-950">
              <div
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage:
                    "linear-gradient(45deg, #fff 25%, transparent 25%), linear-gradient(-45deg, #fff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #fff 75%), linear-gradient(-45deg, transparent 75%, #fff 75%)",
                  backgroundSize: "40px 40px",
                  backgroundPosition: "0 0, 0 20px, 20px -20px, -20px 0px",
                }}
              />
              <div className="relative z-10 text-center">
                <span className="text-3xl font-bold text-white">Checkerboard Grid Distortion</span>
                <p className="text-xs text-slate-400 mt-2 font-mono">
                  Bandingkan distorsi kisi-kisi saat melintasi kurva lensa.
                </p>
              </div>
            </div>

            {/* Section 5: Abstract 3D Fluid Liquid Waves */}
            <div className="relative h-[440px] rounded-2xl overflow-hidden border border-white/15 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80"
                alt="Abstract 3D Liquid Waves"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 flex items-end p-6">
                <span className="text-xl font-bold text-white tracking-wide">
                  3D Fluid Waves &amp; Curvature Warp
                </span>
              </div>
            </div>

            <div className="py-6 text-center text-xs font-mono text-slate-500">
              ShadowUI Fluid Glass Optical Physics System • Snell&apos;s Law Refraction
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// 5. Compositions: Real-world card composition
export const Composition: Story = {
  name: "Composition",
  render: (args: CardStoryArgs) => {
    const { theme, themeVersion } = args;
    const activeTheme = resolveTheme(theme);
    const activeVersion = resolveVersion(themeVersion);

    return (
      <div
        data-theme={activeTheme}
        className={`p-12 min-h-[400px] flex items-center justify-center rounded-2xl transition-all duration-300 ${
          activeTheme === "fluid-glass"
            ? "bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500"
            : "bg-slate-100"
        }`}
      >
        <Card
          theme={activeTheme as any}
          themeVersion={activeVersion}
          interactive
          className="w-full max-w-md"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <Badge variant="subtle" className="mb-2">
                Analytics
              </Badge>
              <h3 className="text-xl font-bold">Monthly Revenue Overview</h3>
            </div>
            <span className="text-xs font-mono opacity-60">Q1 2025</span>
          </div>
          <p className="text-sm opacity-80 mb-6">
            Monitor your real-time performance, conversions, and metrics with our advanced dashboard
            suite.
          </p>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10">
            <Button variant="ghost" size="sm">
              Dismiss
            </Button>
            <Button variant="filled" size="sm">
              View Report
            </Button>
          </div>
        </Card>
      </div>
    );
  },
};

// 6. Fluid Glass (Dedicated showcase)
export const FluidGlass: Story = {
  name: "Fluid Glass",
  args: {
    theme: "fluid-glass",
    themeVersion: "1",
    fluidMode: "full",
    fluidSurface: "convex-squircle",
    fluidSpecular: 0.9,
    fluidInteractiveLight: true,
    backgroundType: "image-city",
    interactive: true,
  },
  render: (args: CardStoryArgs) => {
    const { backgroundType = "image-city", ...restArgs } = args;
    const bgConfig = BACKGROUND_STYLES[backgroundType] || BACKGROUND_STYLES["image-city"];
    return (
      <div
        data-theme="fluid-glass"
        style={bgConfig.style}
        className={`p-12 min-h-[440px] flex flex-col items-center justify-center rounded-3xl relative overflow-hidden transition-all duration-300 ${bgConfig.className}`}
      >
        {bgConfig.overlay && (
          <div className={`absolute inset-0 pointer-events-none ${bgConfig.overlay}`} />
        )}

        {/* Typographic elements behind glass to reveal optical warping */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none opacity-30 z-0">
          <span className="text-7xl font-black uppercase tracking-widest text-white drop-shadow-md">
            OPTICAL LENS
          </span>
          <span className="text-sm font-mono tracking-widest text-pink-300 mt-1">
            FE-DISPLACEMENT-MAP • SNELL&apos;S LAW REFRACTION
          </span>
        </div>

        <Card
          {...restArgs}
          theme="fluid-glass"
          className="w-full max-w-md relative z-10 shadow-2xl text-white"
        >
          <div className="flex items-center justify-between mb-3">
            <Badge variant="subtle">Physical Glass Refraction</Badge>
            <span className="text-xs font-mono opacity-80">IOR: 1.52 (Crown Glass)</span>
          </div>
          <h3 className="text-xl font-bold mb-2 drop-shadow">Tokyo Cyberpunk Surface</h3>
          <p className="text-sm opacity-90 mb-4 leading-relaxed drop-shadow-sm">
            Lampu neon kota dan tipografi di balik kartu ini terbiaskan secara fisik melalui kurva
            lensa cembung (dome squircle). Hover untuk melihat pergerakan kilau cahaya specular!
          </p>
          <div className="flex items-center gap-3">
            <Button size="sm">Explore Optics</Button>
            <Button size="sm" variant="ghost">
              Toggle Mode
            </Button>
          </div>
        </Card>
      </div>
    );
  },
};

// 7. Refraction with High-Detail Image Wallpapers
export const OpticalRefractionShowcase: Story = {
  name: "Optical Refraction",
  args: {
    theme: "fluid-glass",
    themeVersion: "1",
    fluidMode: "full",
    fluidSurface: "convex-squircle",
    fluidSpecular: 0.95,
    fluidInteractiveLight: true,
    backgroundType: "image-abstract",
    interactive: true,
  },
  render: (args: CardStoryArgs) => {
    const { backgroundType = "image-abstract", ...restArgs } = args;
    const bgConfig = BACKGROUND_STYLES[backgroundType] || BACKGROUND_STYLES["image-abstract"];
    return (
      <div
        data-theme="fluid-glass"
        style={bgConfig.style}
        className={`p-14 min-h-[460px] flex flex-col items-center justify-center rounded-3xl relative overflow-hidden transition-all duration-300 ${bgConfig.className}`}
      >
        {bgConfig.overlay && (
          <div className={`absolute inset-0 pointer-events-none ${bgConfig.overlay}`} />
        )}

        {/* High-frequency graphic pattern underneath */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-40 z-0">
          <div className="text-center">
            <div className="text-8xl font-black uppercase tracking-tighter text-white/40">
              LIGHT BENDING
            </div>
            <div className="text-xl font-mono tracking-widest text-cyan-300 mt-2">
              PHYSICS ENGINE ACTIVE
            </div>
          </div>
        </div>

        <Card
          {...restArgs}
          theme="fluid-glass"
          className="w-full max-w-lg relative z-10 shadow-2xl text-white"
        >
          <div className="flex items-center justify-between mb-3">
            <Badge variant="subtle">Optical Displacement</Badge>
            <span className="text-xs font-mono text-pink-300">feDisplacementMap</span>
          </div>
          <h3 className="text-2xl font-bold mb-2 drop-shadow">Full Convex Refraction Dome</h3>
          <p className="text-sm opacity-90 mb-5 leading-relaxed drop-shadow-sm">
            Gunakan panel Controls untuk mengubah <b>fluidMode</b> (border vs full),{" "}
            <b>fluidSurface</b> (squircle, circle, concave, lip), serta <b>backgroundType</b> (Tokyo
            Neon, 3D Waves, Checkerboard) untuk melihat bagaimana lensa mendistorsi tekstur di
            baliknya.
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-white/20 text-xs">
            <span className="opacity-80 font-mono">Scale: 28 • Bezel: Auto</span>
            <Button size="sm">Interact</Button>
          </div>
        </Card>
      </div>
    );
  },
};

// 8. Side by Side Comparison
export const ThemeComparison: Story = {
  name: "Side by Side Comparison",
  render: () => (
    <div className="p-10 min-h-[400px] bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 grid grid-cols-1 md:grid-cols-2 gap-8 items-center rounded-2xl">
      <div data-theme="primer" className="flex flex-col items-center gap-3">
        <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">
          Theme: Primer
        </span>
        <Card theme="primer" interactive className="w-full max-w-xs">
          <h4 className="font-semibold text-base mb-1">Primer Surface</h4>
          <p className="text-xs text-slate-500">
            Flat solid surface, 1px subtle border, 8px radius.
          </p>
        </Card>
      </div>

      <div data-theme="fluid-glass" className="flex flex-col items-center gap-3">
        <span className="text-xs font-mono tracking-widest text-pink-300 uppercase">
          Theme: Fluid Glass
        </span>
        <Card theme="fluid-glass" interactive className="w-full max-w-xs">
          <h4 className="font-semibold text-base mb-1">Glass Surface</h4>
          <p className="text-xs opacity-80">
            Backdrop blur 16px, glowing ambient shadow, 20px radius.
          </p>
        </Card>
      </div>
    </div>
  ),
};

// 9. Variants: Filled, Outline, Ghost
export const Variants: Story = {
  name: "Variants",
  render: (args: CardStoryArgs) => {
    const { theme, themeVersion } = args;
    const activeTheme = resolveTheme(theme);
    const activeVersion = resolveVersion(themeVersion);

    return (
      <div
        data-theme={activeTheme}
        className={`p-10 rounded-2xl flex flex-col gap-6 transition-all duration-300 ${
          activeTheme === "fluid-glass"
            ? "bg-gradient-to-tr from-indigo-950 via-purple-900 to-slate-950 text-white"
            : "bg-slate-100"
        }`}
      >
        <span className="text-xs font-mono uppercase tracking-wider font-semibold opacity-70">
          Semantic Variants ({activeTheme})
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            theme={activeTheme as any}
            themeVersion={activeVersion}
            variant="filled"
            interactive
          >
            <div className="mb-2">
              <Badge variant="filled">variant="filled"</Badge>
            </div>
            <h4 className="font-semibold text-sm">Filled Variant</h4>
            <p className="text-xs opacity-75 mt-1">Default surface elevation and shadow.</p>
          </Card>

          <Card
            theme={activeTheme as any}
            themeVersion={activeVersion}
            variant="outline"
            interactive
          >
            <div className="mb-2">
              <Badge variant="outline">variant="outline"</Badge>
            </div>
            <h4 className="font-semibold text-sm">Outline Variant</h4>
            <p className="text-xs opacity-75 mt-1">Transparent body with defined border.</p>
          </Card>

          <Card theme={activeTheme as any} themeVersion={activeVersion} variant="ghost" interactive>
            <div className="mb-2">
              <Badge variant="subtle">variant="ghost"</Badge>
            </div>
            <h4 className="font-semibold text-sm">Ghost Variant</h4>
            <p className="text-xs opacity-75 mt-1">Invisible resting state, elevates on hover.</p>
          </Card>
        </div>
      </div>
    );
  },
};
