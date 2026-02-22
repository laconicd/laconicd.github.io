# Agent Guidelines for this Repository

This repository hosts a static site built with [Lume](https://lume.land/), a static site generator for Deno.

## 1. Build, Lint, and Test Commands

Use `deno task` to run project-specific scripts defined in `deno.json`.

- **Build for Production:**
  ```bash
  deno task build
  ```
  This command builds the site into the `_site/` directory.

- **Development Server:**
  ```bash
  deno task serve
  ```
  Starts a local development server with hot reloading.

- **Linting:**
  ```bash
  deno lint
  ```
  Checks TypeScript/JavaScript files for linting errors.

- **Formatting:**
  ```bash
  deno fmt
  ```
  Formats all supported files (TS, JS, JSON, MD).
  Configuration: `lineWidth: 120` (in `deno.json`).

- **CSS Formatting:**
  ```bash
  deno task fmt:css
  ```
  Formats CSS files using `stylelint`.

- **Testing:**
  ```bash
  deno test
  ```
  Runs tests if present (e.g., `*_test.ts` files). Currently, explicit tests may not be set up, but this is the standard command.

## 2. Code Style & Conventions

### Environment
- **Runtime:** Deno.
- **Framework:** Lume (Static Site Generator).
- **Templating:** Vento (`.vto`).

### Imports
- Use **Import Maps**: Refer to `deno.json` for mapped imports (e.g., `lume/`, `htmx.org`).
- **URL Imports**: Use full URLs for external dependencies if not in the import map.
- **Extensions**: Always include file extensions in imports (e.g., `import "./_includes/js/htmx.ts";`).

### Formatting & Structure
- **Indentation**: 2 spaces.
- **Quotes**: Double quotes for strings.
- **Semicolons**: Always use semicolons.
- **File Naming**:
  - Source files: `kebab-case.ts` or `snake_case.ts` (consistent with existing files like `post_card.vto`).
  - Components: Located in `_components/`.
- **Directory Structure**:
  - `_config.ts`: Main Lume configuration.
  - `_components/`: Reusable UI components.
  - `_includes/`: Layouts and shared snippets.
  - `assets/`: Static assets (images, JS, CSS).

### Components (Lume)
- Define components in `_components/` as `.vto` or `.ts` files.
- Access components in Vento templates using the `comp` namespace (e.g., `{{ await comp.hero({...}) }}`).
- Use `await` when rendering components in Vento templates.

### Types & Error Handling
- **TypeScript**: Use strict typing where possible.
- **Lume Types**: Import types from `lume/core.ts` or specific plugins if needed (though mostly handled by `deno.json` types config).

### CSS
- **Processing**: Uses `lightningcss` plugin.
- **Linting**: Uses `stylelint` with standard config and recess order.
- **Files**: Main styles in `style.css`.
