# GEMINI.md

## Project Overview
This repository contains a static blog/journal site built with **Lume**, a fast and flexible static site generator for **Deno**. The project emphasizes modern web aesthetics, featuring fluid typography, editorial layouts, and a clean "lofi" theme.

### Key Technologies
- **Runtime:** Deno
- **SSG:** Lume
- **Templating:** Vento (`.vto`)
- **CSS:** LightningCSS with Stylelint for formatting.
- **Fonts:** Google Fonts (Instrument Serif, Outfit, Noto Serif KR).
- **Interactivity:** TypeScript (`script.ts`).

### Architecture
- `_config.ts`: Central Lume configuration and plugin management.
- `_components/`: Reusable UI components (Hero, Navbar, Post Card, etc.).
- `_includes/layouts/`: Base and page-specific templates.
- `posts/`: Content authored in Markdown.
- `categories/` & `tags/`: Logic for generating dynamic archive pages.
- `assets/`: Static images and client-side scripts.

---

## Building and Running

### Development
To start the local development server with hot reloading:
```bash
deno task serve
```

### Production Build
To generate the static site in the `_site/` directory:
```bash
deno task build
```

---

## Development Conventions

### Code Style & Linting
- **Formatting:** Use `deno fmt`. Note: `lineWidth` is set to `120` in `deno.json`.
- **TypeScript Linting:** Run `deno lint`.
- **CSS Linting:** Run `deno task fmt:css` to use Stylelint for CSS formatting and ordering.
- **Naming:** Follow existing patterns (snake_case for components like `post_card.vto`, kebab-case for some directory names).

### Templating (Vento)
- Components are accessed via the `comp` namespace: `{{ await comp.name({ props }) }}`.
- Always use `await` when rendering components.
- Layouts are specified in front matter: `layout: layouts/base.vto`.

### Content Creation
- **Posts:** Create new `.md` files in `posts/`.
- **Front Matter:** Required fields include `title`, `date`, `type: post`, and `layout`. Optional fields: `description`, `category`, `tags`, `img`.
- **Images:** Sourced from `assets/images/` or external URLs.

### CSS Patterns
- The project uses **OKLCH** for colors (see `tagColor` filter in `_config.ts`).
- Styling is split between `style.css` (global/base) and component-specific `style.css` files within `_components/`.
- Respect the "lofi" theme and fluid typography principles documented in `posts/test-post-1.md`.
