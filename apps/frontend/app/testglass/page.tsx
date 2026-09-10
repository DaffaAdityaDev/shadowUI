"use client";

import React, { useState } from "react";
import { Card, Button, Badge, getMaterialNameByIor } from "@shadoworg/shadowui";

export default function TestGlassPage() {
  // Parameter Fisika Refraksi
  const [scale, setScale] = useState(36);
  const [bezel, setBezel] = useState(36);
  const [ior, setIor] = useState(1.52); // Index of Refraction (Snell's Law)
  const [thickness, setThickness] = useState(1.2); // Physical Glass Thickness & Edge Splay Profile
  const [aberration, setAberration] = useState(0); // 0 for crystal clear optics like reference
  const [aberrationMode, setAberrationMode] = useState<"linked" | "per-channel">("linked");
  const [aberrationR, setAberrationR] = useState(-4);
  const [aberrationG, setAberrationG] = useState(0);
  const [aberrationB, setAberrationB] = useState(6);
  const [specular, setSpecular] = useState(0.85); // Specular Highlights & Reflection
  const [rimWidth, setRimWidth] = useState(4); // Specular Border Rim Width (in pixels)
  const [lightAngle, setLightAngle] = useState(225); // Light angle in degrees (top-left 225°)
  const [interactiveLight, setInteractiveLight] = useState(true); // Interactive Cursor Tracking

  // Effective Aberration (Unified or Per-Channel)
  const effectiveAberration =
    aberrationMode === "linked"
      ? aberration
      : { r: aberrationR, g: aberrationG, b: aberrationB };

  // Parameter Dimensi Kartu
  const [cardWidth, setCardWidth] = useState(420);
  const [cardHeight, setCardHeight] = useState(270);
  const [radius, setRadius] = useState(28);

  // Parameter Material Optik
  const [blur, setBlur] = useState(0); // 0px for crystal clear glass like iOS Clear
  const [saturate, setSaturate] = useState(150);
  const [opacity, setOpacity] = useState(4); // surface tint opacity dalam % (transparan bening)

  // State UI & Demo Content Modes
  const [contentMode, setContentMode] = useState<"music" | "card">("music");
  const [skin, setSkin] = useState<"fluid-glass" | "primer">("fluid-glass");
  const [lensMode, setLensMode] = useState<"full" | "border">("full");
  const [surface, setSurface] = useState<"convex-squircle" | "convex-circle" | "concave" | "lip">("convex-squircle");
  const [showControls, setShowControls] = useState(true);

  // Preset Handlers
  const applyClearPreset = () => {
    setLensMode("full");
    setSurface("convex-squircle");
    setBlur(0);
    setOpacity(4);
    setAberration(0);
    setAberrationMode("linked");
    setScale(36);
    setThickness(1.2);
    setSpecular(0.85);
  };

  const applyFrostedPreset = () => {
    setLensMode("border");
    setSurface("convex-squircle");
    setBlur(16);
    setOpacity(14);
    setAberration(4);
    setAberrationMode("linked");
    setScale(32);
    setThickness(1.0);
    setSpecular(0.65);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white selection:bg-pink-500 selection:text-white">
      {/* 1. FLOATING FLUID GLASS DI TENGAH LAYAR */}
      <div className="fixed inset-0 z-30 pointer-events-none flex flex-col items-center justify-center p-4">
        <div className="pointer-events-auto flex flex-col items-center gap-4">
          
          {contentMode === "music" && (
            /* PRESET 1: MUSIC PLAYER FLUID GLASS WIDGET */
            <Card
              skin={skin}
              skinProps={{
                scale,
                bezel,
                ior,
                thickness,
                rimWidth,
                aberration: effectiveAberration,
                specular,
                lightAngle,
                interactiveLight,
                mode: lensMode,
                surface,
              }}
              style={{
                width: `${cardWidth}px`,
                minHeight: `${cardHeight}px`,
                borderRadius: `${radius}px`,
                ...(skin === "fluid-glass"
                  ? {
                      "--ui-backdrop-blur": `${blur}px`,
                      "--ui-backdrop-saturate": `${saturate}%`,
                      "--ui-surface-base": `rgba(255, 255, 255, ${opacity / 100})`,
                    }
                  : {}),
              } as React.CSSProperties}
              className="flex flex-col justify-between p-5 select-none cursor-pointer transition-shadow hover:shadow-2xl overflow-hidden"
            >
              <div className="flex items-center gap-3.5">
                {/* Album Cover Art */}
                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg border border-white/20 flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80"
                    alt="Album Cover"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <Badge variant="subtle" skin={skin} className="w-fit text-[10px] py-0.5 px-2 mb-1">
                    Spatial Audio • Master Edition
                  </Badge>
                  <h3 className="font-bold text-base text-white truncate drop-shadow">
                    Midnight Refraction
                  </h3>
                  <p className="text-xs text-white/70 truncate">
                    Fluid Glass Symphony • Studio Edition
                  </p>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="flex flex-col gap-1 my-2">
                <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-white h-full w-[65%]" />
                </div>
                <div className="flex justify-between text-[10px] text-white/60 font-mono">
                  <span>2:34</span>
                  <span>-1:18</span>
                </div>
              </div>

              {/* Controls Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div className="flex items-center gap-2.5">
                  <button type="button" className="text-white/80 hover:text-white text-base">⏮</button>
                  <button type="button" className="w-8 h-8 rounded-full bg-white text-black font-bold flex items-center justify-center hover:scale-105 transition-transform text-xs">▶</button>
                  <button type="button" className="text-white/80 hover:text-white text-base">⏭</button>
                </div>
                <span className="font-mono text-[11px] bg-white/15 px-2.5 py-1 rounded-full text-white/80">
                  Lossless Audio
                </span>
              </div>
            </Card>
          )}

          {contentMode === "card" && (
            /* PRESET 2: REGULAR SHADOWUI CARD UI */
            <Card
              skin={skin}
              skinProps={{
                scale,
                bezel,
                ior,
                thickness,
                rimWidth,
                aberration: effectiveAberration,
                specular,
                lightAngle,
                interactiveLight,
                mode: lensMode,
                surface,
              }}
              style={{
                width: `${cardWidth}px`,
                minHeight: `${cardHeight}px`,
                borderRadius: `${radius}px`,
                ...(skin === "fluid-glass"
                  ? {
                      "--ui-backdrop-blur": `${blur}px`,
                      "--ui-backdrop-saturate": `${saturate}%`,
                      "--ui-surface-base": `rgba(255, 255, 255, ${opacity / 100})`,
                    }
                  : {}),
              } as React.CSSProperties}
              className="flex flex-col justify-between p-5 select-none cursor-pointer transition-shadow hover:shadow-2xl overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between">
                  <Badge variant="subtle" skin={skin} className="text-[10px] font-semibold">
                    {skin === "fluid-glass" ? `Snell's IOR ${ior.toFixed(2)}` : "Primer Clean"}
                  </Badge>
                  <span className="text-[11px] font-mono text-white/70">
                    {cardWidth} × {cardHeight}px
                  </span>
                </div>
                <h2 className="text-xl font-bold mt-2 tracking-tight drop-shadow-md">
                  @shadoworg/shadowui
                </h2>
                <p className="text-xs text-white/80 mt-1 line-clamp-2">
                  Physical background refraction with pure native backdrop-filter performance.
                </p>
              </div>

              <div className="pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 text-xs text-white/90">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="filled"
                    skin={skin}
                    onClick={() => alert("Button clicked!")}
                    className="h-7 text-xs px-2.5"
                  >
                    Action
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    skin={skin}
                    onClick={() => setSkin(skin === "fluid-glass" ? "primer" : "fluid-glass")}
                    className="h-7 text-xs px-2.5"
                  >
                    {skin === "fluid-glass" ? "Primer" : "Glass"}
                  </Button>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono flex-wrap justify-end">
                  <span className="bg-white/20 px-1.5 py-0.5 rounded">Scale: {scale}</span>
                  <span className="bg-white/20 px-1.5 py-0.5 rounded">Bezel: {bezel}</span>
                  {cardWidth >= 320 && (
                    <>
                      <span className="bg-pink-500/30 text-pink-200 border border-pink-500/40 px-1.5 py-0.5 rounded">IOR: {ior.toFixed(2)}</span>
                      <span className="bg-blue-500/30 text-blue-200 border border-blue-500/40 px-1.5 py-0.5 rounded">Thick: {thickness.toFixed(1)}x</span>
                    </>
                  )}
                  {specular > 0 && (
                    <span className="bg-amber-500/30 text-amber-200 border border-amber-500/40 px-1.5 py-0.5 rounded">
                      Spec: {Math.round(specular * 100)}%
                    </span>
                  )}
                </div>
              </div>
            </Card>
          )}

        </div>
      </div>

      {/* 2. FLOATING CONTROL PANEL (BOTTOM DOCK) */}
      <div className="fixed bottom-6 inset-x-0 z-40 flex flex-col items-center pointer-events-none px-4">
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-2xl p-5 w-full max-w-5xl text-xs transition-all duration-300">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm text-white tracking-tight flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
                Fluid Glass Controls
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Real-time SVG Displacement Map
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex bg-white/10 rounded-xl p-0.5 border border-white/10">
                <button
                  type="button"
                  onClick={() => setContentMode("music")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    contentMode === "music"
                      ? "bg-pink-500 text-white shadow"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  🎵 Music Player
                </button>
                <button
                  type="button"
                  onClick={() => setContentMode("card")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    contentMode === "card"
                      ? "bg-pink-500 text-white shadow"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  📄 Feature Card
                </button>
              </div>
              <button
                type="button"
                onClick={applyClearPreset}
                className="px-3 py-1 rounded-xl bg-cyan-500/20 border border-cyan-500/40 hover:bg-cyan-500/30 text-cyan-200 font-semibold transition-colors text-xs flex items-center gap-1"
                title="Crystal clear 3D convex lens dome (like reference)"
              >
                <span>💎</span> Clear (Reference)
              </button>
              <button
                type="button"
                onClick={applyFrostedPreset}
                className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-medium transition-colors text-xs flex items-center gap-1"
                title="Frosted glass with border refraction"
              >
                <span>🧊</span> Frosted
              </button>
              <button
                type="button"
                onClick={() => setLensMode(lensMode === "full" ? "border" : "full")}
                className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors text-xs"
              >
                Lens: <span className="font-bold text-cyan-400">{lensMode === "full" ? "Full" : "Border"}</span>
              </button>
              {/* 4 Surface Curvature Profiles */}
              <div className="flex bg-white/10 rounded-xl p-0.5 border border-white/10 items-center">
                <button
                  type="button"
                  onClick={() => setSurface("convex-squircle")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    surface === "convex-squircle"
                      ? "bg-cyan-500 text-white shadow"
                      : "text-slate-300 hover:text-white"
                  }`}
                  title="Convex Squircle: Gentle continuous squircle curve"
                >
                  ⌒ Squircle
                </button>
                <button
                  type="button"
                  onClick={() => setSurface("convex-circle")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    surface === "convex-circle"
                      ? "bg-cyan-500 text-white shadow"
                      : "text-slate-300 hover:text-white"
                  }`}
                  title="Convex Circle: Spherical arc dome"
                >
                  ⌢ Circle
                </button>
                <button
                  type="button"
                  onClick={() => setSurface("concave")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    surface === "concave"
                      ? "bg-cyan-500 text-white shadow"
                      : "text-slate-300 hover:text-white"
                  }`}
                  title="Concave: Bowl depression (diverging rays / zoom-out)"
                >
                  ⌣ Concave
                </button>
                <button
                  type="button"
                  onClick={() => setSurface("lip")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    surface === "lip"
                      ? "bg-cyan-500 text-white shadow"
                      : "text-slate-300 hover:text-white"
                  }`}
                  title="Lip: Raised tactile rim with center dip (Switch/Slider)"
                >
                  〰 Lip
                </button>
              </div>
              <button
                type="button"
                onClick={() => setSkin(skin === "fluid-glass" ? "primer" : "fluid-glass")}
                className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors text-xs"
              >
                Skin: <span className="font-bold text-pink-400">{skin}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowControls(!showControls)}
                className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-medium transition-colors"
              >
                {showControls ? "Hide Panel ▲" : "Show Controls ▼"}
              </button>
            </div>
          </div>

          {showControls && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Kolom 1: Refraksi Fisik & IOR */}
              <div className="flex flex-col gap-3 bg-black/30 p-3.5 rounded-2xl border border-white/5">
                <span className="font-bold text-[11px] uppercase tracking-wider text-pink-400">
                  1. Refraction Optics & IOR
                </span>

                {/* Slider: Refraction Scale */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Scale (Shift):</span>
                    <input
                      type="number"
                      min={0}
                      max={80}
                      value={scale}
                      onChange={(e) => setScale(Number(e.target.value))}
                      className="w-14 bg-white/10 text-white rounded px-1.5 py-0.5 text-right font-mono focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={80}
                    value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                </div>

                {/* Slider: Bezel Width */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Bezel Width:</span>
                    <input
                      type="number"
                      min={4}
                      max={70}
                      value={bezel}
                      onChange={(e) => setBezel(Number(e.target.value))}
                      className="w-14 bg-white/10 text-white rounded px-1.5 py-0.5 text-right font-mono focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={70}
                    value={bezel}
                    onChange={(e) => setBezel(Number(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                </div>

                {/* Slider: Physical Glass Thickness & Edge Splay Profile */}
                <div className="flex flex-col gap-1 pt-1.5 border-t border-white/10">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span className="font-semibold text-blue-300">Glass Thickness:</span>
                      <span className="text-[10px] text-blue-400 font-mono">
                        {thickness < 0.8 ? "Thin" : thickness <= 1.2 ? "Standard" : thickness <= 1.8 ? "Thick" : "Extreme Splay"}
                      </span>
                    </span>
                    <span className="text-blue-400 font-mono">{thickness.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={25}
                    value={Math.round(thickness * 10)}
                    onChange={(e) => setThickness(Number(e.target.value) / 10)}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                  {/* Thickness Presets */}
                  <div className="grid grid-cols-4 gap-1 mt-1 text-[9px] font-mono text-center">
                    <button
                      type="button"
                      onClick={() => setThickness(0.5)}
                      className={`py-0.5 rounded transition-all ${
                        thickness === 0.5 ? "bg-blue-500 text-white font-bold" : "bg-white/10 hover:bg-white/20 text-slate-300"
                      }`}
                    >
                      0.5x Thin
                    </button>
                    <button
                      type="button"
                      onClick={() => setThickness(1.0)}
                      className={`py-0.5 rounded transition-all ${
                        thickness === 1.0 ? "bg-blue-500 text-white font-bold" : "bg-white/10 hover:bg-white/20 text-slate-300"
                      }`}
                    >
                      1.0x Std
                    </button>
                    <button
                      type="button"
                      onClick={() => setThickness(1.6)}
                      className={`py-0.5 rounded transition-all ${
                        thickness === 1.6 ? "bg-blue-500 text-white font-bold" : "bg-white/10 hover:bg-white/20 text-slate-300"
                      }`}
                    >
                      1.6x Deep
                    </button>
                    <button
                      type="button"
                      onClick={() => setThickness(2.2)}
                      className={`py-0.5 rounded transition-all ${
                        thickness === 2.2 ? "bg-blue-500 text-white font-bold" : "bg-white/10 hover:bg-white/20 text-slate-300"
                      }`}
                    >
                      2.2x Splay
                    </button>
                  </div>
                </div>

                {/* Slider: Snell's Law IOR */}
                <div className="flex flex-col gap-1 pt-1.5 border-t border-white/10">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span>Index (IOR):</span>
                      <span className="text-[10px] text-pink-400 font-mono">
                        {getMaterialNameByIor(ior)}
                      </span>
                    </span>
                    <input
                      type="number"
                      min={1.0}
                      max={2.5}
                      step={0.01}
                      value={ior}
                      onChange={(e) => setIor(Number(e.target.value))}
                      className="w-14 bg-white/10 text-white rounded px-1.5 py-0.5 text-right font-mono focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={250}
                    value={Math.round(ior * 100)}
                    onChange={(e) => setIor(Number(e.target.value) / 100)}
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                  {/* Preset Chips */}
                  <div className="grid grid-cols-5 gap-1 mt-1 text-[9px] font-mono text-center">
                    <button
                      type="button"
                      onClick={() => setIor(1.0)}
                      className={`py-0.5 rounded transition-all ${
                        ior === 1.0 ? "bg-pink-500 text-white font-bold" : "bg-white/10 hover:bg-white/20 text-slate-300"
                      }`}
                    >
                      1.00 Air
                    </button>
                    <button
                      type="button"
                      onClick={() => setIor(1.33)}
                      className={`py-0.5 rounded transition-all ${
                        ior === 1.33 ? "bg-pink-500 text-white font-bold" : "bg-white/10 hover:bg-white/20 text-slate-300"
                      }`}
                    >
                      1.33 H₂O
                    </button>
                    <button
                      type="button"
                      onClick={() => setIor(1.52)}
                      className={`py-0.5 rounded transition-all ${
                        ior === 1.52 ? "bg-pink-500 text-white font-bold" : "bg-white/10 hover:bg-white/20 text-slate-300"
                      }`}
                    >
                      1.52 Glass
                    </button>
                    <button
                      type="button"
                      onClick={() => setIor(1.8)}
                      className={`py-0.5 rounded transition-all ${
                        ior === 1.8 ? "bg-pink-500 text-white font-bold" : "bg-white/10 hover:bg-white/20 text-slate-300"
                      }`}
                    >
                      1.80 Cryst
                    </button>
                    <button
                      type="button"
                      onClick={() => setIor(2.42)}
                      className={`py-0.5 rounded transition-all ${
                        ior === 2.42 ? "bg-pink-500 text-white font-bold" : "bg-white/10 hover:bg-white/20 text-slate-300"
                      }`}
                    >
                      2.42 Dia
                    </button>
                  </div>
                </div>

                {/* Chromatic Aberration Section */}
                <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-purple-300 text-xs flex items-center gap-1.5">
                      <span>Chromatic Aberration:</span>
                      <span className="text-[10px] text-purple-400 font-mono">
                        {aberrationMode === "linked"
                          ? (aberration === 0 ? "Off" : aberration < 6 ? "Subtle" : aberration < 14 ? "Vivid" : "Prism")
                          : "RGB Tuning"}
                      </span>
                    </span>

                    {/* Mode Toggle: Linked vs RGB */}
                    <div className="flex bg-white/10 rounded-lg p-0.5 text-[10px] font-mono">
                      <button
                        type="button"
                        onClick={() => setAberrationMode("linked")}
                        className={`px-1.5 py-0.5 rounded transition-all ${
                          aberrationMode === "linked"
                            ? "bg-purple-500 text-white font-bold shadow"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Linked
                      </button>
                      <button
                        type="button"
                        onClick={() => setAberrationMode("per-channel")}
                        className={`px-1.5 py-0.5 rounded transition-all ${
                          aberrationMode === "per-channel"
                            ? "bg-purple-500 text-white font-bold shadow"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        RGB
                      </button>
                    </div>
                  </div>

                  {aberrationMode === "linked" ? (
                    <>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min={0}
                          max={30}
                          value={aberration}
                          onChange={(e) => setAberration(Number(e.target.value))}
                          className="w-full accent-purple-500 cursor-pointer"
                        />
                        <input
                          type="number"
                          min={0}
                          max={30}
                          value={aberration}
                          onChange={(e) => setAberration(Number(e.target.value))}
                          className="w-12 bg-white/10 text-white rounded px-1 py-0.5 text-right font-mono text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                      {/* Aberration Presets */}
                      <div className="grid grid-cols-4 gap-1 text-[9px] font-mono text-center">
                        <button
                          type="button"
                          onClick={() => setAberration(0)}
                          className={`py-0.5 rounded transition-all ${
                            aberration === 0 ? "bg-purple-500 text-white font-bold" : "bg-white/10 hover:bg-white/20 text-slate-300"
                          }`}
                        >
                          0 Off
                        </button>
                        <button
                          type="button"
                          onClick={() => setAberration(4)}
                          className={`py-0.5 rounded transition-all ${
                            aberration === 4 ? "bg-purple-500 text-white font-bold" : "bg-white/10 hover:bg-white/20 text-slate-300"
                          }`}
                        >
                          4 Subtle
                        </button>
                        <button
                          type="button"
                          onClick={() => setAberration(10)}
                          className={`py-0.5 rounded transition-all ${
                            aberration === 10 ? "bg-purple-500 text-white font-bold" : "bg-white/10 hover:bg-white/20 text-slate-300"
                          }`}
                        >
                          10 Vivid
                        </button>
                        <button
                          type="button"
                          onClick={() => setAberration(18)}
                          className={`py-0.5 rounded transition-all ${
                            aberration === 18 ? "bg-purple-500 text-white font-bold" : "bg-white/10 hover:bg-white/20 text-slate-300"
                          }`}
                        >
                          18 Prism
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      {/* Red Channel Slider */}
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="w-5 font-bold text-red-400 font-mono">R:</span>
                        <input
                          type="range"
                          min={-20}
                          max={20}
                          value={aberrationR}
                          onChange={(e) => setAberrationR(Number(e.target.value))}
                          className="w-full accent-red-500 cursor-pointer h-1.5"
                        />
                        <span className="w-8 font-mono text-right text-red-400 text-[10px]">
                          {aberrationR > 0 ? `+${aberrationR}` : aberrationR}
                        </span>
                      </div>

                      {/* Green Channel Slider */}
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="w-5 font-bold text-emerald-400 font-mono">G:</span>
                        <input
                          type="range"
                          min={-20}
                          max={20}
                          value={aberrationG}
                          onChange={(e) => setAberrationG(Number(e.target.value))}
                          className="w-full accent-emerald-500 cursor-pointer h-1.5"
                        />
                        <span className="w-8 font-mono text-right text-emerald-400 text-[10px]">
                          {aberrationG > 0 ? `+${aberrationG}` : aberrationG}
                        </span>
                      </div>

                      {/* Blue Channel Slider */}
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="w-5 font-bold text-blue-400 font-mono">B:</span>
                        <input
                          type="range"
                          min={-20}
                          max={20}
                          value={aberrationB}
                          onChange={(e) => setAberrationB(Number(e.target.value))}
                          className="w-full accent-blue-500 cursor-pointer h-1.5"
                        />
                        <span className="w-8 font-mono text-right text-blue-400 text-[10px]">
                          {aberrationB > 0 ? `+${aberrationB}` : aberrationB}
                        </span>
                      </div>

                      {/* Per-Channel Color Presets */}
                      <div className="grid grid-cols-4 gap-1 mt-0.5 text-[9px] font-mono text-center">
                        <button
                          type="button"
                          onClick={() => { setAberrationR(-5); setAberrationG(0); setAberrationB(7); }}
                          className="py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-300 transition-all"
                          title="Classic Prism: R:-5 G:0 B:+7"
                        >
                          Prism
                        </button>
                        <button
                          type="button"
                          onClick={() => { setAberrationR(-8); setAberrationG(0); setAberrationB(0); }}
                          className="py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-300 transition-all"
                          title="Cyan-Red: R:-8 G:0 B:0"
                        >
                          Cyan-Red
                        </button>
                        <button
                          type="button"
                          onClick={() => { setAberrationR(0); setAberrationG(0); setAberrationB(10); }}
                          className="py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-300 transition-all"
                          title="Blue Rim: R:0 G:0 B:+10"
                        >
                          Blue Rim
                        </button>
                        <button
                          type="button"
                          onClick={() => { setAberrationR(8); setAberrationG(0); setAberrationB(-4); }}
                          className="py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-300 transition-all"
                          title="Warm Red: R:+8 G:0 B:-4"
                        >
                          Warm
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Kolom 2: Dimensi Kartu */}
              <div className="flex flex-col gap-3.5 bg-black/30 p-3.5 rounded-2xl border border-white/5">
                <span className="font-bold text-[11px] uppercase tracking-wider text-indigo-400">
                  2. Dimensions
                </span>

                {/* Slider: Card Width */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Width:</span>
                    <span className="text-indigo-400 font-mono">{cardWidth}px</span>
                  </div>
                  <input
                    type="range"
                    min={280}
                    max={600}
                    value={cardWidth}
                    onChange={(e) => setCardWidth(Number(e.target.value))}
                    className="w-full accent-indigo-400 cursor-pointer"
                  />
                </div>

                {/* Slider: Card Height */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Height:</span>
                    <span className="text-indigo-400 font-mono">{cardHeight}px</span>
                  </div>
                  <input
                    type="range"
                    min={200}
                    max={450}
                    value={cardHeight}
                    onChange={(e) => setCardHeight(Number(e.target.value))}
                    className="w-full accent-indigo-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Kolom 3: Geometry & Radius */}
              <div className="flex flex-col gap-3.5 bg-black/30 p-3.5 rounded-2xl border border-white/5">
                <span className="font-bold text-[11px] uppercase tracking-wider text-cyan-400">
                  3. Edge Geometry
                </span>

                {/* Slider: Corner Radius */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Radius:</span>
                    <input
                      type="number"
                      min={0}
                      max={60}
                      value={radius}
                      onChange={(e) => setRadius(Number(e.target.value))}
                      className="w-14 bg-white/10 text-white rounded px-1.5 py-0.5 text-right font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={60}
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                {/* Slider: Backdrop Blur */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Blur:</span>
                    <input
                      type="number"
                      min={0}
                      max={40}
                      value={blur}
                      onChange={(e) => setBlur(Number(e.target.value))}
                      className="w-14 bg-white/10 text-white rounded px-1.5 py-0.5 text-right font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={40}
                    value={blur}
                    onChange={(e) => setBlur(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Kolom 4: Material & Tint */}
              <div className="flex flex-col gap-3.5 bg-black/30 p-3.5 rounded-2xl border border-white/5">
                <span className="font-bold text-[11px] uppercase tracking-wider text-emerald-400">
                  4. Color & Tint
                </span>

                {/* Slider: Saturate */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Saturate:</span>
                    <input
                      type="number"
                      min={100}
                      max={250}
                      value={saturate}
                      onChange={(e) => setSaturate(Number(e.target.value))}
                      className="w-14 bg-white/10 text-white rounded px-1.5 py-0.5 text-right font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={250}
                    value={saturate}
                    onChange={(e) => setSaturate(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                {/* Slider: White Tint Opacity */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Tint Opacity:</span>
                    <input
                      type="number"
                      min={0}
                      max={60}
                      value={opacity}
                      onChange={(e) => setOpacity(Number(e.target.value))}
                      className="w-14 bg-white/10 text-white rounded px-1.5 py-0.5 text-right font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={60}
                    value={opacity}
                    onChange={(e) => setOpacity(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Kolom 5: Specular Highlights & Reflection */}
              <div className="flex flex-col gap-3.5 bg-black/30 p-3.5 rounded-2xl border border-white/5">
                <span className="font-bold text-[11px] uppercase tracking-wider text-amber-400 flex items-center justify-between">
                  <span>5. Specular & Light</span>
                  <span className="text-[10px] text-amber-300/80 font-mono">Blinn-Phong</span>
                </span>

                {/* Slider: Specular Intensity */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Glint Intensity:</span>
                    <span className="text-amber-400 font-mono">{Math.round(specular * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={Math.round(specular * 100)}
                    onChange={(e) => setSpecular(Number(e.target.value) / 100)}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  {/* Presets */}
                  <div className="grid grid-cols-4 gap-1 mt-0.5 text-[9px] font-mono text-center">
                    <button
                      type="button"
                      onClick={() => setSpecular(0)}
                      className={`py-0.5 rounded transition-all ${
                        specular === 0 ? "bg-amber-500 text-black font-bold" : "bg-white/10 hover:bg-white/20 text-slate-300"
                      }`}
                    >
                      0% Off
                    </button>
                    <button
                      type="button"
                      onClick={() => setSpecular(0.4)}
                      className={`py-0.5 rounded transition-all ${
                        specular === 0.4 ? "bg-amber-500 text-black font-bold" : "bg-white/10 hover:bg-white/20 text-slate-300"
                      }`}
                    >
                      40% Sub
                    </button>
                    <button
                      type="button"
                      onClick={() => setSpecular(0.75)}
                      className={`py-0.5 rounded transition-all ${
                        specular === 0.75 ? "bg-amber-500 text-black font-bold" : "bg-white/10 hover:bg-white/20 text-slate-300"
                      }`}
                    >
                      75% App
                    </button>
                    <button
                      type="button"
                      onClick={() => setSpecular(1.0)}
                      className={`py-0.5 rounded transition-all ${
                        specular === 1.0 ? "bg-amber-500 text-black font-bold" : "bg-white/10 hover:bg-white/20 text-slate-300"
                      }`}
                    >
                      100% Dia
                    </button>
                  </div>
                </div>

                {/* Slider: Specular Border Rim Width */}
                <div className="flex flex-col gap-1.5 pt-1.5 border-t border-white/10">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span>Border Rim Width:</span>
                      <span className="text-[10px] text-amber-300 font-mono">
                        {rimWidth <= 3 ? "Thin Crisp" : rimWidth <= 5 ? "Glass Rim" : "Wide Chamfer"}
                      </span>
                    </span>
                    <span className="text-amber-400 font-mono">{rimWidth}px</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={10}
                    value={rimWidth}
                    onChange={(e) => setRimWidth(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  {/* Rim Width Presets */}
                  <div className="grid grid-cols-4 gap-1 mt-0.5 text-[9px] font-mono text-center">
                    <button
                      type="button"
                      onClick={() => setRimWidth(2)}
                      className={`py-0.5 rounded transition-all ${
                        rimWidth === 2 ? "bg-amber-500 text-black font-bold" : "bg-white/10 hover:bg-white/20 text-slate-300"
                      }`}
                    >
                      2px Sharp
                    </button>
                    <button
                      type="button"
                      onClick={() => setRimWidth(4)}
                      className={`py-0.5 rounded transition-all ${
                        rimWidth === 4 ? "bg-amber-500 text-black font-bold" : "bg-white/10 hover:bg-white/20 text-slate-300"
                      }`}
                    >
                      4px Std
                    </button>
                    <button
                      type="button"
                      onClick={() => setRimWidth(6)}
                      className={`py-0.5 rounded transition-all ${
                        rimWidth === 6 ? "bg-amber-500 text-black font-bold" : "bg-white/10 hover:bg-white/20 text-slate-300"
                      }`}
                    >
                      6px Soft
                    </button>
                    <button
                      type="button"
                      onClick={() => setRimWidth(8)}
                      className={`py-0.5 rounded transition-all ${
                        rimWidth === 8 ? "bg-amber-500 text-black font-bold" : "bg-white/10 hover:bg-white/20 text-slate-300"
                      }`}
                    >
                      8px Wide
                    </button>
                  </div>
                </div>

                {/* Toggle: Interactive Mouse Tracking */}
                <div className="flex items-center justify-between p-2 bg-white/5 rounded-xl border border-white/10 pt-1.5 mt-0.5">
                  <div className="flex flex-col">
                    <span className="font-semibold text-white flex items-center gap-1.5 text-[11px]">
                      <span>Mouse Tracking</span>
                      {interactiveLight && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
                    </span>
                    <span className="text-[9px] text-slate-400">Kilau ikut arah kursor</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInteractiveLight(!interactiveLight)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      interactiveLight
                        ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/30"
                        : "bg-white/10 text-slate-400 hover:text-white"
                    }`}
                  >
                    {interactiveLight ? "ON" : "OFF"}
                  </button>
                </div>

                {/* Slider: Light Source Angle */}
                <div className={`flex flex-col gap-1.5 pt-1.5 border-t border-white/10 transition-opacity ${interactiveLight ? "opacity-50" : "opacity-100"}`}>
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center gap-1">
                      <span>Angle (Static):</span>
                      <span className="text-[10px] text-amber-400 font-mono">
                        {lightAngle >= 315 || lightAngle < 45 ? "↖ NW" : lightAngle < 135 ? "↗ NE" : lightAngle < 225 ? "↘ SE" : "↙ SW"}
                      </span>
                    </span>
                    <span className="text-amber-400 font-mono">{lightAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    disabled={interactiveLight}
                    value={lightAngle}
                    onChange={(e) => setLightAngle(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer disabled:cursor-not-allowed"
                  />
                  {/* Compass Angle Presets */}
                  <div className="grid grid-cols-4 gap-1 mt-0.5 text-[9px] font-mono text-center">
                    <button
                      type="button"
                      disabled={interactiveLight}
                      onClick={() => setLightAngle(315)}
                      className={`py-0.5 rounded transition-all disabled:opacity-50 ${
                        lightAngle === 315 ? "bg-amber-500 text-black font-bold" : "bg-white/10 hover:bg-white/20 text-slate-300"
                      }`}
                    >
                      ↖ 315°
                    </button>
                    <button
                      type="button"
                      disabled={interactiveLight}
                      onClick={() => setLightAngle(45)}
                      className={`py-0.5 rounded transition-all disabled:opacity-50 ${
                        lightAngle === 45 ? "bg-amber-500 text-black font-bold" : "bg-white/10 hover:bg-white/20 text-slate-300"
                      }`}
                    >
                      ↗ 45°
                    </button>
                    <button
                      type="button"
                      disabled={interactiveLight}
                      onClick={() => setLightAngle(135)}
                      className={`py-0.5 rounded transition-all disabled:opacity-50 ${
                        lightAngle === 135 ? "bg-amber-500 text-black font-bold" : "bg-white/10 hover:bg-white/20 text-slate-300"
                      }`}
                    >
                      ↘ 135°
                    </button>
                    <button
                      type="button"
                      disabled={interactiveLight}
                      onClick={() => setLightAngle(225)}
                      className={`py-0.5 rounded transition-all disabled:opacity-50 ${
                        lightAngle === 225 ? "bg-amber-500 text-black font-bold" : "bg-white/10 hover:bg-white/20 text-slate-300"
                      }`}
                    >
                      ↙ 225°
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. BACKGROUND BERGAMBAR YANG BISA DI-SCROLL */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-20 flex flex-col gap-24">
        {/* Header Intro */}
        <section className="flex flex-col items-center text-center gap-6 pt-12">
          <span className="text-xs uppercase tracking-widest text-pink-400 font-bold bg-pink-950/60 border border-pink-800/50 px-3 py-1 rounded-full">
            ShadowUI • Native Package
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-3xl bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
            Native Fluid Glass in Card Component
          </h1>
          <p className="text-slate-400 text-lg max-w-xl">
            Scroll ke bawah perlahan. Perhatikan bagaimana gambar dan garis melengkung secara fisik di pinggiran kartu <code className="text-pink-400">&lt;Card skin=&quot;fluid-glass&quot;&gt;</code>.
          </p>
          <div className="flex items-center gap-2 text-slate-500 text-sm mt-4 animate-bounce">
            <span>↓ Scroll down to view behind the glass</span>
          </div>
        </section>

        {/* Gambar 1: Vibrant Abstract Fluid Artwork */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-pink-300">
              1. Vibrant Fluid Art Wallpaper
            </h2>
            <span className="text-xs text-slate-400">High Contrast Gradient</span>
          </div>
          <div className="relative h-[550px] w-full rounded-3xl overflow-hidden shadow-2xl border border-white/15">
            <img
              src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1600&q=80"
              alt="Colorful Abstract Fluid Paint"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 flex items-end p-8">
              <span className="text-xl font-bold text-white tracking-wide">
                Abstract Fluid Swirls & Gradients
              </span>
            </div>
          </div>
        </section>

        {/* Diagonal High Contrast Zebra Pattern */}
        <section className="relative rounded-3xl overflow-hidden border border-white/10 bg-slate-900/60 p-8 flex flex-col items-center justify-center min-h-[400px]">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #6366f1 0, #6366f1 15px, transparent 15px, transparent 30px)",
            }}
          />
          <div className="relative z-10 text-center flex flex-col items-center gap-4">
            <h3 className="text-4xl font-black uppercase tracking-wider text-white">
              GEOMETRIC LINES
            </h3>
            <p className="text-sm text-slate-300 max-w-md bg-black/60 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              Garis-garis diagonal ini tampak melengkung tajam (*distorted*) saat bersinggungan dengan bezel kartu.
            </p>
          </div>
        </section>

        {/* Bold Typography Wall */}
        <section className="py-12 flex flex-col gap-6 overflow-hidden select-none">
          <div className="text-6xl md:text-8xl font-black uppercase text-slate-800 tracking-tighter leading-none">
            LIGHT BENDING
          </div>
          <div className="text-6xl md:text-8xl font-black uppercase text-indigo-500/30 tracking-tighter leading-none pl-12">
            SNELL'S LAW
          </div>
          <div className="text-6xl md:text-8xl font-black uppercase text-pink-500/30 tracking-tighter leading-none">
            OPTICAL REFRACTION
          </div>
          <div className="text-6xl md:text-8xl font-black uppercase text-cyan-500/30 tracking-tighter leading-none pl-8">
            DISPLACEMENT MAP
          </div>
        </section>

        {/* Gambar 2: Tokyo Neon Cyberpunk City Landscape */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-indigo-300">
              2. Neon Cyberpunk City Landscape
            </h2>
            <span className="text-xs text-slate-400">Night Lights & High Detail</span>
          </div>
          <div className="relative h-[550px] w-full rounded-3xl overflow-hidden shadow-2xl border border-white/15">
            <img
              src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80"
              alt="Tokyo Neon City Night Lights"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 flex items-end p-8">
              <span className="text-xl font-bold text-white tracking-wide">
                Dense Tokyo Street Lights & Reflections
              </span>
            </div>
          </div>
        </section>

        {/* Checkerboard Pattern */}
        <section className="relative rounded-3xl overflow-hidden border border-white/10 p-12 min-h-[400px] flex items-center justify-center">
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "linear-gradient(45deg, #fff 25%, transparent 25%), linear-gradient(-45deg, #fff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #fff 75%), linear-gradient(-45deg, transparent 75%, #fff 75%)",
              backgroundSize: "40px 40px",
              backgroundPosition: "0 0, 0 20px, 20px -20px, -20px 0px",
            }}
          />
          <div className="relative z-10 bg-slate-900/90 border border-white/20 p-8 rounded-2xl text-center max-w-lg">
            <h4 className="text-2xl font-bold text-white">Checkerboard Grid Test</h4>
            <p className="text-sm text-slate-400 mt-2">
              Bandingkan distorsi saat <code className="text-pink-400">skin=&quot;fluid-glass&quot;</code> aktif vs <code className="text-indigo-400">skin=&quot;primer&quot;</code> biasa.
            </p>
          </div>
        </section>

        <div className="h-40 flex items-center justify-center text-slate-600 text-sm">
          ShadowUI Fluid Glass System • Ready for Production
        </div>
      </div>
    </div>
  );
}
