# Agent Instructions

This repository contains the source code for a static site generated with
[Zola](https://www.getzola.org/), using [Deno](https://deno.com/) for tooling
and asset management. These instructions are intended for AI agents operating
within this codebase to ensure consistency and correctness.

## 1. Build, Run, and Test Commands

### Prerequisites

- **Deno**: The project relies on Deno for task management, linting, formatting,
  and bundling assets.
- **Zola**: The static site generator used to build the content.

### Task Management

All primary tasks are defined in `deno.json`. Use `deno task <task_name>` to
execute them.

#### Core Commands

- **Start Development Server**
  ```bash
  deno task dev
  ```
  _Action_: Builds CSS assets and starts the Zola development server. _Output_:
  Server typically accessible at `http://127.0.0.1:1111` (or the network
  interface IP). _Use Case_: Previewing changes locally.

- **Build for Production**
  ```bash
  deno task prd
  ```
  _Action_: Builds CSS assets and generates the full static site into the
  `public/` directory. _Use Case_: Verifying that the site builds successfully
  before deployment.

- **Build CSS Only**
  ```bash
  deno task css:build
  ```
  _Action_: Runs the `tools/bundle.ts` script to bundle and minify CSS files.
  _Details_: Uses `esbuild` (via Deno) to process `static/css/main.css` into
  `static/main.css`.

#### Verification Commands

- **Lint Code**
  ```bash
  deno lint
  ```
  _Action_: Runs Deno's built-in linter. _Rule_: Code must pass linting without
  warnings or errors.

- **Format Code**
  ```bash
  deno fmt
  ```
  _Action_: Formats code according to Deno's standard style. _Rule_: Always run
  this before submitting changes. You can check status with `deno fmt --check`.

- **Test** _Current State_: No explicit test suite exists in the repository.
  _Instruction_: If you introduce new logic (especially in `tools/`), you
  **must** add tests. _Command_: Run all tests using:
  ```bash
  deno test
  ```
  _Command_: Run a single test file using:
  ```bash
  deno test <file_path>
  ```
  _Convention_: Place tests alongside source files (e.g.,
  `tools/bundle_test.ts`) or in a `tests/` directory.

## 2. Code Style & Conventions

### Toolchain

- **Deno First**: Use Deno for all scripting and tooling needs. Do not introduce
  `npm` scripts or `node_modules` reliance unless absolutely necessary and
  wrapped via Deno.
- **Configuration**: Respect settings in `deno.json` and `zola.toml`.

### TypeScript / JavaScript (e.g., `tools/`)

- **Imports**:
  - Use explicit file extensions: `import { foo } from "./utils.ts";`
  - Use `npm:` specifiers for packages:
    `import * as esbuild from "npm:esbuild";`
- **Formatting (Deno Default)**:
  - Indentation: 2 spaces.
  - Quotes: Double quotes (`"`).
  - Semicolons: Enabled.
  - Trailing Commas: Enabled.
- **Type Safety**:
  - Use TypeScript. Avoid `any` whenever possible.
  - Define interfaces for data structures.
- **Error Handling**:
  - Use `try...catch` for failable operations (I/O, network).
  - Log errors clearly to `console.error` and exit with code 1 if a script fails
    (`Deno.exit(1)`).
- **Naming Conventions**: Follow standard TypeScript/JavaScript conventions
  (camelCase for variables/functions, PascalCase for types/classes).

### Zola Templates (`templates/`)

- **Language**: [Tera](https://keats.github.io/tera/) template engine.
- **Structure**:
  - `base.html`: The master template defining the HTML skeleton.
  - `macros/`: Contains reusable macros (functions) for UI components (e.g.,
    icons, post cards).
  - `partials/`: Contains reusable HTML fragments (e.g., `head.html`,
    `navbar.html`).
- **Conventions**:
  - Use semantic HTML5.
  - Keep logic simple in templates. Complex data manipulation should happen in
    the Zola config or data files if possible.
  - Use the `macros` namespace for importing components:
    `{% import "macros/components/post-card.html" as post_card %}`.

### Content (`content/`)

- **Format**: Markdown (`.md`) files.
- **Front Matter**: Use TOML format enclosed in `+++`.
  ```toml
  +++
  title = "Example Post"
  date = 2023-01-01
  description = "A brief summary for SEO and previews."
  [taxonomies]
  tags = ["rust", "zola"]
  +++
  ```
- **Organization**: Follow the directory structure (e.g., `content/blog/`,
  `content/projects/`). `_index.md` defines section metadata.

### CSS / Styling

- **Source**: `static/css/main.css` is the entry point.
- **Build**: The build process bundles imports (e.g.,
  `@import "./partials/..."`) into a single `static/main.css` file.
- **View Transitions**:
  - Global activation is handled via `@view-transition { navigation: auto; }` in `styles/main.css`.
  - Use unique IDs (e.g., `#site-header`, `#site-footer`) for global elements to avoid `view-transition-name` collisions with page-specific headers.
- **Speed Dial**:
  - Implemented as a macro in `templates/macros/components/speed-dial.html`.
  - Uses the Popover API for toggling and CSS `@scope` for fan-like animation.
  - Features: Theme toggle, Search, Scroll to Top, RSS, and Share.
- **Approach**: All CSS should adhere to the
  [CUBE CSS methodology](docs/css-convention.md#1-cube-css-방법론-준수) for
  maintainability and scalability. For detailed styling guidelines, including
  preferred units, color formats, logical properties, and modern CSS features,
  refer to the [CSS Convention Guide](docs/css-convention.md).

## 3. Operational Rules for Agents

1. **Safety First**:
   - Before editing `tools/bundle.ts` or `deno.json`, read the file to
     understand dependencies.
   - Before deleting files, verify they are not referenced in `zola.toml` or
     templates.

2. **Validation Loop**:
   - **Step 1**: Make changes.
   - **Step 2**: Format code (`deno fmt`).
   - **Step 3**: Lint code (`deno lint`).
   - **Step 4**: Verify build (`deno task css:build` && `deno task zola:build`).
   - **Step 5**: Only mark task as complete if the build succeeds.

3. **Documentation**:
   - **CRITICAL**: Agents **must** update this `AGENTS.md` file and any other
     relevant documentation (e.g., `docs/css-convention.md`) with new tools,
     conventions, or significant changes introduced during their work. This rule
     is paramount for maintaining consistency and knowledge within the codebase.
   - Add comments to complex TypeScript logic in `tools/`.

4. **Debugging**:
   - If the Zola build fails, check the console output for Template errors.
   - If CSS fails to build, check `tools/bundle.ts` logs.

## 4. Repository Structure Overview

- `content/`: Markdown content source (e.g., `content/insights/`, `content/about.md`).
- `static/`: Static assets (images, raw CSS). `static/main.css` is a generated
  artifact—do not edit it directly; edit `static/css/main.css` instead.
- `templates/`: HTML/Tera templates.
- `tools/`: Deno scripts for build/maintenance.
- `zola.toml`: Main site configuration.
- `deno.json`: Deno configuration and task runner definitions.

---

_Updated by opencode on 2026-02-07 to reflect the fix for View Transition animations and HTML structure stabilization._
