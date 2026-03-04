# GEMINI.md

## Project Overview

This is a personal blog and digital journal project built with **Lume**, a fast and flexible static site generator for
**Deno**. The site follows a **"Hyper-minimalist Lofi Editorial"** aesthetic, emphasizing the "Power of the Void"
(negative space), structured layouts, and high-contrast typography. It seeks a radical balance between digital
efficiency and classic magazine elegance.

### Key Technologies

- **Runtime**: Deno
- **Static Site Generator**: Lume
- **Templating**: Vento (`.vto`)
- **CSS Architecture**: CUBE CSS (Composition, Utility, Block, Exception)
- **Color System**: OKLCH (Perceptually uniform colors)
- **Plugins**: LightningCSS (for processing), Esbuild (for JS), Google Fonts, Metas, SEO, Sitemaps.

### Architecture

- `_config.ts`: Central Lume configuration and plugin management.
- `_components/`: Reusable Vento components (Navbar, Hero, Icons, etc.).
- `_includes/css/`: Modular CSS following CUBE CSS principles.
  - `base/`: Reset, global styles, and design tokens (colors, spacing).
  - `compositions/`: Layout primitives (Stack, Cluster, Grid).
  - `blocks/`: High-level UI components (Editorial List, Tag Cloud, Category Board).
- `_includes/layouts/`: Page templates (Base, Post, Categories, Tags).
- `posts/`: Content authored in Markdown.
- `categories/` & `tags/`: Logic and templates for dynamic archive pages.

---

## Building and Running

### Development

Start the local development server with hot reloading:

```bash
deno task serve
```

### Production Build

Generate the static site in the `_site/` directory:

```bash
deno task build
```

### Formatting and Linting

- **CSS Formatting**: Uses Stylelint to order and format CSS.
  ```bash
  deno task fmt:css
  ```
- **Deno Formatting**: Standard formatting for TS and Vto files.
  ```bash
  deno fmt
  ```

---

## Development Conventions

### HTML & Semantics

Strict adherence to semantic HTML is mandatory to ensure accessibility, SEO, and structural clarity.

- **Semantic Tags**: Use correct tags for their intended purpose (e.g., `<main>`, `<article>`, `<section>`, `<nav>`,
  `<header>`, `<footer>`, `<aside>`, `<details>`, `<summary>`). Avoid "div-soup".
- **Heading Hierarchy**: Maintain a logical heading structure (`h1` -> `h2` -> `h3`). Never skip heading levels for
  styling purposes.
- **Interactive Elements**: Use `<button>` for actions and `<a>` for navigation. Ensure all interactive elements have
  visible focus states.
- **Accessibility (A11y)**: Provide `alt` text for images and use ARIA attributes only when native HTML elements are
  insufficient.

### Design Principles

- **Hyper-minimalist Editorial Aesthetic**: Embrace **"Functional Reduction"**. Every element must earn its place; if it
  doesn't add value, remove it. Focus on high-quality typography as the primary interface.
- **The Power of the Void**: Treat whitespace not as "empty space" but as an active structural component. Use negative
  space to guide the reader's focus and create a sense of elite clarity.
- **Lofi Editorial**: Maintain a balance between digital efficiency and classic magazine typography. Use serif fonts for
  headings and dramatic drop caps in articles against a clean, minimalist backdrop.

### Templating (Vento)

- **Filters**: Use the pipe-forward operator `|>` for filters (e.g., `tag |> tagColor`).
- **Icons**: Icons are located in `_components/icons/` and can be called via `comp.icons.name()`. All icons should
  support `classes` and `size` props.
- **Dynamic Data**: Category and tag information can be customized in `_data.yml` files within their respective
  directories.

### Modern CSS & Logical Properties

Always prioritize modern CSS features and logical properties over physical ones to ensure a robust, future-proof layout
(RTL/LTR ready and mobile-optimized).

- **Logical Properties (Mandatory)**:
  - **Sizing**: `inline-size` (width), `block-size` (height) - `inline-size: 100%;`
  - **Spacing**: `margin-inline`, `padding-block` - `margin-inline: auto; padding-block: var(--space-md);`
  - **Positioning**: `inset-inline-start` (left/right) - `inset-inline-start: 0;`
  - **Borders**: `border-inline-end`, `border-start-start-radius` - `border-inline-end: 1px solid;`
- **Modern Logical Units**:
  - **Dynamic Viewport**: `dvi`, `dvb` - `height: 100dvb; width: 100dvi;`
  - **Container Queries**: `cqi`, `cqb` - `font-size: 5cqi;`
  - **Typography**: `cap`, `lh`, `ic` - `margin-top: 1lh; padding-top: 1cap;`
- **Fluid Design & Math**:
  - **Fluidity**: `clamp()` - `font-size: clamp(1.5rem, 4vi + 1rem, 3rem);`
  - **Calculations**: `calc()`, `min()`, `max()` - `width: min(100%, 65ch);`
- **Modern Colors (Mandatory)**:
  - **OKLCH**: `oklch()` - `color: oklch(65% 0.15 250);`
  - **Color Manipulation**: Relative color syntax - `background: oklch(from var(--primary) l c h / 0.2);`
  - **Light/Dark**: `light-dark()` - `color: light-dark(#333, #ccc);`
- **Advanced Selectors & Syntax**:
  - **Range Syntax**: `(width <= 768px)` - `@container (width <= 600px) { ... }`
  - **Typed OM**: `@property` - `@property --angle { syntax: "<angle>"; initial-value: 0deg; inherits: false; }`
  - **Independent Transforms**: `scale`, `rotate`, `translate` - `rotate: 45deg; scale: 1.5;`
  - **Math Functions**: `sin()`, `cos()` - `translate: calc(sin(45deg) * 100px);`
  - **Grid Control**: `subgrid` - `grid-template-columns: subgrid;`
  - **Stability**: `scrollbar-gutter` - `scrollbar-gutter: stable;`
- **Editorial Typography**:
  - **Text Wrapping**: `balance`, `pretty` - `text-wrap: balance;` (headings), `text-wrap: pretty;` (body)
  - **Drop Caps**: `initial-letter` - `::first-letter { initial-letter: 3; }`
  - **Spacing**: `hanging-punctuation` - `hanging-punctuation: first last;`
  - **Decorations**: `box-decoration-break: clone;` for consistent multi-line highlights.
  - **Underlines**: `text-underline-offset: 0.2em; text-decoration-thickness: 1px;` for refined editorial underlines.
  - **Dynamic Fonts**: Use Variable Fonts with `font-optical-sizing: auto;` and `font-variation-settings` for responsive
    weight/width.
  - **Consistency**: `font-size-adjust: 0.5;` to maintain vertical rhythm across font fallbacks.
- **Motion & Transitions**:
  - **Explicit Transitions**: Target properties - `transition: translate 0.3s, opacity 0.3s;`
  - **Elite Tokens**: Project tokens - `transition: opacity var(--transition-speed-base) var(--transition-ease-snap);`
  - **A11y**: Always respect `@media (prefers-reduced-motion: reduce)` to disable or simplify complex animations.
  - **Optimization**: GPU-accelerated - Use `transform` and `opacity` for animations.
- **Scroll & Interaction**:
  - **Scroll-Driven Animation**: `view-timeline` - `view-timeline: --image-scroll; animation-timeline: --image-scroll;`
  - **Scroll Snapping**: `scroll-snap` - `scroll-snap-type: x mandatory; scroll-snap-align: center;`
  - **Visual Haptics**: Add subtle feedback on `:active` states (e.g., `scale: 0.98; brightness: 0.95;`).
  - **Containment**: `overscroll-behavior: contain;`
  - **Fluid Heights**: `interpolate-size: allow-keywords;`
- **Performance & Navigations**:
  - **View Transitions**: `view-transition-name: post-title-42;`
  - **Speculation Rules**: `<script type="speculationrules">` for instantaneous loads.
  - **Priority**: Use `fetchpriority="high"` for critical hero images and above-the-fold assets.
  - **Rendering**: `content-visibility: auto;`
- **UI & Next-Gen Layouts**:
  - **Popover API**: `popover` - `<div popover id="menu">`, `[popovertarget="menu"]`
  - **Anchor Positioning**: `anchor()` - `top: anchor(bottom); left: anchor(left);`
  - **Advanced Grid**: `masonry` - `grid-template-rows: masonry;`
  - **Shape Wrapping**: `shape-outside` - `shape-outside: circle(50%);` to wrap text around non-rectangular shapes.
  - **Image Control**: `object-view-box` - `object-view-box: inset(10% 20% 10% 20%);`
- **Architecture & State**:
  - **CSS Layers**: `@layer` - `@layer base, blocks, utils;`
  - **Scoping**: `@scope` - `@scope (.card) { :scope { ... } & .title { ... } }`
  - **Explicit Containers**: Use `container-name: sidebar` and `@container sidebar (width > 200px)` for targeted
    responsiveness.
  - **State Queries**: Style queries - `@container style(--sticky: true) { ... }`
  - **Nesting**: Native nesting - `.parent { .child { ... } }`
  - **Composition First**: Layout containers - `.stack { container-type: inline-size; }`
