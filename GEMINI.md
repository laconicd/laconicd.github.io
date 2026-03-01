# GEMINI.md

## Project Overview

This is a personal blog and digital journal project built with **Lume**, a fast and flexible static site generator for
**Deno**. The site follows a "lofi editorial" aesthetic, emphasizing clean typography, structured layouts (Bento grids
and stripe lists), and a modern color system.

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

### Design Principles

- **Lofi Editorial Aesthetic**: Maintain a balance between digital efficiency and classic magazine typography. Use serif
  fonts for headings and dramatic drop caps in articles.
- **Perceptual Colors**: Use the `tagColor` filter for dynamic elements. Colors are generated in **OKLCH** space to
  ensure consistent visual weight and accessibility.
- **System Theme Detection**: The project uses `light-dark()` CSS functions to automatically switch between **lofi**
  (light) and **dim** (dark) modes based on the browser settings.

### Templating (Vento)

- **Filters**: Use the pipe-forward operator `|>` for filters (e.g., `tag |> tagColor`).
- **Icons**: Icons are located in `_components/icons/` and can be called via `comp.icons.name()`. All icons should
  support `classes` and `size` props.
- **Dynamic Data**: Category and tag information can be customized in `_data.yml` files within their respective
  directories.

### CSS (CUBE CSS)

- **Avoid Inline Styles**: Extract UI components into new block files in `_includes/css/blocks/`.
- **Scoped Styles**: Prefer using `@scope (.block-name)` to keep styles contained and prevent leakage.
- **Composition First**: Use layout primitives like `.stack` and `.cluster` for spacing instead of hardcoded margins.
