import { createHighlighter, type Highlighter } from "shiki";

/**
 * Service Layer: Handles code syntax highlighting using Shiki.
 */
export class SyntaxHighlighter {
  private static highlighter: Highlighter | null = null;

  /**
   * Initializes the highlighter with specific themes and languages.
   */
  public static async init(): Promise<void> {
    if (this.highlighter) return;

    this.highlighter = await createHighlighter({
      themes: ["github-dark", "github-light"],
      langs: [
        "typescript",
        "javascript",
        "python",
        "rust",
        "bash",
        "json",
        "css",
        "markdown",
        "toml",
        "yaml",
      ],
    });
  }

  /**
   * Highlights all code blocks in the document.
   */
  public static async highlightAll(): Promise<void> {
    try {
      if (!this.highlighter) {
        await this.init();
      }

      const codeBlocks = document.querySelectorAll("pre code");
      const currentTheme = document.documentElement.getAttribute("data-theme") || "lofi";
      const shikiTheme = currentTheme === "dim" ? "github-dark" : "github-light";

      for (const block of codeBlocks) {
        const parent = block.parentElement;
        if (!parent || parent.tagName !== "PRE") continue;

        const code = block.textContent || "";
        const langClass = Array.from(block.classList).find((c) =>
          c.startsWith("language-")
        );
        const lang = langClass ? langClass.replace("language-", "") : "text";

        const html = this.highlighter!.codeToHtml(code, {
          lang,
          theme: shikiTheme,
        });

        const temp = document.createElement("div");
        temp.innerHTML = html;
        const newPre = temp.querySelector("pre");
        if (newPre) {
          parent.replaceWith(newPre);
        }
      }
    } catch (err) {
      console.error("Shiki highlighting failed:", err);
    }
  }
}
