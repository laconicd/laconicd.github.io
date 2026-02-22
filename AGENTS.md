# Agent Guidelines for MyBlog

This repository is a Deno-based static site using [Lume](https://lume.land/).

## 1. Build, Lint, and Test Commands

### Build & Run

- **Development Server**: `deno task serve` (runs `lume -s`)
  - Starts a local server with hot reloading.
- **Production Build**: `deno task build` (runs `lume`)
  - Generates static files in the `_site/` directory.

### Linting & Formatting

- **Lint TypeScript/JS**: `deno lint`
- **Lint CSS**: `deno task lint:css` (uses `stylelint`)
- **Format TypeScript/JS**: `deno fmt`
- **Format CSS**: `deno task fmt:css` (uses `stylelint --fix`)
- **Check All**: Run `deno lint && deno task lint:css` before committing.

### Testing

- **Run Tests**: `deno test`
  - _Note_: Currently, explicit test files are minimal. Create `*_test.ts` files for new logic.
  - Use `Deno.test` for writing tests.

## 2. Code Style & Structure

### Project Structure

- `_components/`: Reusable UI components. Each component typically resides in its own subdirectory (e.g.,
  `_components/navbar/`) containing:
  - `comp.vto`: The Vento template.
  - `script.ts`: Component-specific logic.
  - `style.css`: Component-specific styles.
- `_includes/`: Layout templates (e.g., `base.vto`, `page.vto`).
- `assets/`: Static assets (CSS, images, scripts).
  - `assets/css/`: Global styles following CUBE CSS.
- `posts/`: Content files (Markdown).
- `_config.ts`: Lume configuration.

### Templating (Vento)

- Use [Vento](https://vento.js.org/) (`.vto`) for templates.
- Layouts are in `_includes/`.
- Components are in `_components/` and can be used in templates.

### CSS Architecture (CUBE CSS)

- Follow the **CUBE CSS** methodology (Composition, Utility, Block, Exception).
- **Layers**: CSS is organized into `@layer`s: `reset`, `base`, `composition`, `blocks`, `exceptions`, `utilities`.
- **Global Styles**: Defined in `assets/css/main.css`, importing from subdirectories.
- **Component Styles**: Define specific styles in `_components/<name>/style.css`.
- **Naming**: Use kebab-case for CSS classes.

### TypeScript / Deno

- **Imports**: Use explicit file extensions (`.ts`, `.js`, `.json`).
- **Dependencies**: Managed in `deno.json` (imports map) or standard Deno URL imports.
- **Formatting**: Strictly follow `deno fmt` rules.
- **Types**: Use strict typing. Avoid `any` unless absolutely necessary.

### Helper Scripts

- `create_posts.py`: Utility script to generate test posts. Use for populating content during dev.

## 3. General Workflow

1. **Understand**: Read `deno.json` and `_config.ts` to grasp the environment.
2. **Develop**: Use `deno task serve` to see changes in real-time.
3. **Style**: When adding styles, decide if it belongs in a component (Block) or global utility/composition. Respect the
   CSS layers.
4. **Verify**: Run `deno fmt` and `deno lint` before finalizing changes.
