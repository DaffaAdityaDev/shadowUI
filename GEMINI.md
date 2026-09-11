# ShadowUI Monorepo — Engineering Standards & Hard Rules

This document establishes the mandatory architecture, engineering standards, performance constraints, and development workflows for the **ShadowUI** codebase. All coding, refactoring, and bug fixes must strictly adhere to these rules.

---

## 1. Monorepo Architecture: Understanding What Each Layer Does

```text
shadowui/
├── packages/
│   ├── ui/                # Core library: React components, design tokens, hooks, optical shaders
│   ├── cli/               # Scaffolding tool & code generator templates for consumer projects
│   ├── typescript-config/ # Shared tsconfig bases across monorepo
│   └── eslint-config/     # Shared linting configs
└── apps/
    ├── frontend/          # Next.js 16 (App Router + Turbopack + React 19) showcase & /testglass playground
    └── docs/              # Storybook (Vite + React 18) documentation & component sandbox
```

### Roles & Responsibilities:

- **`packages/ui` (`@shadoworg/shadowui`)**: The single source of truth for component logic and styling. Bundled via `tsup` into CJS, ESM, and TypeScript declarations (`.d.ts`).
- **`packages/cli`**: Must be kept in sync when component templates change (in `packages/cli/src/templates/components.ts`).
- **`apps/frontend`**: Tests real-world integration, Next.js hydration, server/client boundaries, React 19 compatibility, and heavy optical shaders (e.g., interactive physics on `/testglass`).
- **`apps/docs`**: Verifies component states, padding scales, variant combinations, theme switching, and React 18 backwards compatibility in isolated Storybook stories.

---

## 2. Technology Stack Constraints

- **React 18 & 19 Dual Compatibility**:
  - `packages/ui` targets `peerDependencies: "react": "^18.2.0 || ^19.0.0"`.
  - Always use `forwardRef` so React 18 consumers (like Storybook) do not break.
- **Direct Named React Imports (Mandatory)**:
  - ALWAYS use direct named imports from React: `import { forwardRef, useRef, useEffect, useState } from "react";`.
  - NEVER use namespace syntax like `React.useState`, `React.useEffect`, `React.forwardRef`, or `React.useRef`.
- **Next.js 16 & Server Components**:
  - Bundled components must preserve the `"use client";` banner.
  - Browser APIs (`window`, `document`, `HTMLCanvasElement`, `ResizeObserver`, `requestAnimationFrame`) must NEVER run during SSR. Wrap them in `useEffect` or guard with `typeof window !== "undefined"`.
- **TailwindCSS v4**:
  - Tailwind v4 is configured via CSS (`@layer theme, components, utilities;` and `@import "tailwindcss/theme";`).
  - NEVER introduce or rely on legacy `tailwind.config.js`. Themes use native CSS variables in `tokens/theme/*.css`.

---

## 3. Component Architecture: File Separation & Hard Boundaries

Every component under `packages/ui/src/components/<Component>/` **MUST** be decoupled into dedicated modules:

```text
packages/ui/src/components/<Component>/
├── index.ts                     # Component barrel export
├── themes/                      # Theme-isolated definitions
│   ├── primer/
│   │   ├── v1/                  # Active major version implementation
│   │   │   ├── primer.types.ts  # Primer-specific props & variants
│   │   │   └── primer.variants.ts # Primer CVA styling
│   │   └── index.ts             # Barrel export (defaults to current v1)
│   ├── fluid-glass/
│   │   ├── v1/
│   │   │   ├── fluid-glass.types.ts # Optical & glass-specific props
│   │   │   └── fluid-glass.variants.ts # Fluid glass CVA styling
│   │   └── index.ts             # Barrel export (defaults to current v1)
│   └── index.ts                 # Themes barrel export
├── <component>.types.ts         # Base props + Discriminated Union
├── <component>.variants.ts      # Base layout CVA + Theme dispatcher
└── <component>.tsx              # Dumb presentational component (< 100 lines)
```

### Strict File Rules:

1. **`<component>.types.ts` is a Pure Leaf Node**:
   - **NEVER** import runtime values or functions (such as `cva` definitions from `*.variants.ts`) into `*.types.ts`.
   - Explicitly define union types (`CardPadding`, `CardVariant`) directly in types.
   - Prevents TypeScript circular module errors (`Cannot find module './*.variants'`).
2. **`<component>.variants.ts` Handles Visual Styling**:
   - Imports pure types from `*.types.ts`.
   - Never hardcode 5+ theme styles in one file. Dispatches to theme-specific variants dynamically.
3. **`<component>.tsx` is 100% "Dumb" Presentational**:
   - Handles only DOM rendering, Radix Slot polymorphism (`asChild`), and forwardRef.
   - **Zero side-effects or math in JSX**: Delegates all observers, physics, and canvas rendering to custom hooks (e.g., `useTheme`).
   - **Target length**: Under 100 lines.

---

## 4. The Golden Rules of Multi-Theming & Variants

1. **Consistent Naming Standard: "Theme" Only (Zero "Skin" Terminology)**:
   - The official domain term is **`theme`**, NEVER `skin`.
   - Props: `theme`, `themeVersion`, `themeProps`. (All legacy `skin`, `skinVersion`, `skinProps` aliases have been completely removed).
   - Hooks & Registries: `useTheme`, `themeRegistry`, `hooks/themes/`.
   - CSS Selectors: Strictly `[data-theme="<theme>"]`.
2. **Token Abstraction Over Hardcoded Classes**:
   - Never embed huge compound variant classes for every theme inside component files.
   - Styles must be backed by CSS variables (`--ui-surface-base`, `--ui-border`, `--ui-shadow`, `--ui-radius`, `--ui-text-contrast`).
   - Themes are registered in `tokens/theme/<theme>.css` using scoped selectors (`[data-theme="<theme>"]`).
3. **Dark Mode Support**:
   - Every theme must provide full light and dark mode coverage via `[data-theme="dark"][data-theme="..."]` and `.dark [data-theme="..."]`.
4. **Semantic Intent Across Themes**:
   - Variants must represent semantic intent rather than visual implementation:
     - `variant`: `"filled" | "outline" | "ghost"`
     - `size`: `"sm" | "md" | "lg"`
     - `tone`: `"default" | "danger"`
   - Each theme implements how those semantic variants visually manifest in its own design language.
5. **Discriminated Unions for Theme Props**:
   - Base props are shared by all themes.
   - Theme-specific props (like `fluidBezel`, `fluidIor`) are scoped via discriminated union on `theme` so developers only get relevant autocomplete without polluting other themes.
6. **Theme Versioning & Directory Evolution Policy (SemVer)**:
   - For all patches and minor updates (`< next major version`, e.g. `v1.1.0`, `v1.2.3`), keep editing in-place inside the current major folder (`v1/`).
   - Never create a new directory for minor/patch changes.
   - Only when a breaking major version arrives (`v2.0.0`) do we create a new `v2/` directory alongside `v1/` (`themes/<theme>/v2/`).
   - Both `v1` and `v2` coexist seamlessly so existing layouts do not break, and `themeRegistry` dispatches based on `themeVersion`.

---

## 5. Optical Engine, Performance & Memory Rules

1. **Zero DOM Attribute Leakage**:
   - Specialized theme props (`fluidBezel`, `fluidScale`, `fluidIor`, `fluidThickness`, `fluidRimWidth`, etc.) must be passed to hooks and **deleted from `rest` before spreading onto HTML DOM elements**.
   - Prevents React "Unknown DOM property" console warnings.
2. **Shader & Filter Caching**:
   - Optical shaders and SVG displacement maps must utilize `filterCache.ts`. Never regenerate filters on every frame if parameters have not changed.
   - In-memory SVG defs reside in `#shadowui-fluid-glass-defs`. Call `clearFluidGlassCache()` on major unmounts if needed.
3. **Observer & Listener Cleanups**:
   - Any `ResizeObserver`, `IntersectionObserver`, or window/pointer listeners instantiated in hooks must be cleaned up in the `useEffect` return function to prevent memory leaks during rapid unmounting or page transitions.
4. **60fps Animation Budget**:
   - Interactive lighting, specular updates, and gyro tracking must use `requestAnimationFrame` and avoid triggering React state re-renders during high-frequency mouse/touch moves.
5. **Offscreen Canvas Management**:
   - Canvas generation for specular/displacement maps must bound canvas width and height to element dimensions and reuse contexts where possible.

---

## 6. Non-Breaking & Regression Prevention Rules

Before modifying existing components or utilities:

1. **Preserve Public API Compatibility**:
   - Subpath exports (`@shadoworg/shadowui/card`, `@shadoworg/shadowui/button`, `@shadoworg/shadowui`) must continue exporting all existing symbols, types, and variant functions.
   - When API is refactored, retain backward-compatible aliases for legacy direct props.
2. **Check Downstream Consuming Apps**:
   - Always check where the symbol is used across `apps/frontend` and `apps/docs` before making breaking structural edits.
3. **CLI Template Synchronization**:
   - Whenever a component's API, structure, or variants change, inspect and update `packages/cli/src/templates/components.ts` so `npx shadowui add <component>` generates the latest standards.
4. **Export Map Alignment**:
   - When adding a new component or utility:
     1. Add export in `packages/ui/src/index.ts`
     2. Add subpath mapping in `packages/ui/package.json` under `"exports"`
     3. Verify `tsup.config.ts` bundles it cleanly.

---

## 7. Standardized Step-by-Step Development Workflow

Follow this workflow for every task, bug fix, or feature:

### Step 1: Deep Investigation (Research Phase)

- Search codebase using `grep_search` and `view_file` to understand active patterns.
- Never guess file paths or component prop shapes.

### Step 2: Dependency Direction & Type Design

- Verify the Directed Acyclic Graph (DAG):
  `*.types.ts` ➔ `themes/*.variants.ts` ➔ `*.variants.ts` ➔ `*.tsx`
- Ensure no circular imports between types and runtime functions.

### Step 3: Implement Without Breaking Existing Behavior

- Implement modular changes following the component separation rules.
- Filter out theme-specific DOM props.
- Keep components lean and presentational.
- Ensure SSR safety (`typeof window !== "undefined"`).

### Step 4: Verification & Automated Builds

Always execute:

```powershell
# 1. Build and typecheck the core UI package (generates CJS, ESM, DTS)
bun --cwd packages/ui run build

# 2. Verify all downstream apps and docs across the monorepo
bun turbo run build
```

Never conclude a task without a clean passing build across all packages and apps.

### Fast Development Workflows (Parallel & Standalone)

To develop with maximum speed without waiting for unnecessary packages:

```powershell
# Run all dev servers in parallel (asynchronous zero-wait)
bun run dev          # or: pnpm dev

# Run ONLY Storybook (port 6006 - instant Vite startup)
bun run dev:docs     # or: pnpm dev:docs

# Run ONLY Next.js Showcase (port 3000 - instant Turbopack startup)
bun run dev:frontend # or: pnpm dev:frontend

# Run ONLY Core UI Watcher
bun run dev:ui       # or: pnpm dev:ui

# Blazing-fast Linting (< 35ms across monorepo via Oxlint)
pnpm run lint        # or: bun run lint

# Blazing-fast Formatting (< 350ms across monorepo via Oxfmt)
pnpm run format      # or: bun run format (check with pnpm run format:check)

# Git Hooks (Lefthook native parallel pre-commit)
npx lefthook run pre-commit
```

---

## 8. How to Debug Common Issues

| Issue                                                         | Root Cause                                               | Solution                                                                                             |
| ------------------------------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `Cannot find module './*.variants' or type declarations`      | Circular import between `*.types.ts` and `*.variants.ts` | Make `*.types.ts` a pure leaf node. Explicitly define union types instead of importing `typeof cva`. |
| `React does not recognize the 'fluid*' prop on a DOM element` | Optical prop leaked into `...rest` spread                | Extract and delete `fluid*` keys from props before spreading onto the HTML element.                  |
| Storybook or Next.js build fails after UI changes             | Outdated DTS types or missing export in `src/index.ts`   | Rebuild `packages/ui` first (`bun run build`), check `package.json` export mappings.                 |
| Glass refraction disappears or renders black                  | SVG filter ID collision or missing backdrop blur         | Ensure SVG filter IDs are unique and that the parent container provides a contrasting background.    |
| Next.js Hydration Mismatch on optical components              | Accessing `window`, `document`, or Canvas during SSR     | Wrap DOM / Canvas creation in `useEffect` or guard with `typeof window !== "undefined"`.             |
| `WARNING no output files found for task frontend#build`       | Turborepo missing `.next/**` output glob                 | Ensure `turbo.json` includes `".next/**"` in `tasks.build.outputs`.                                  |
