const PACKAGE_NAME = "@fontsource-variable/outfit";
const FONTS_DIR = "./static/fonts";

// Helper to join paths without external dependencies
function joinPath(...parts: string[]) {
  return parts.join("/").replace(/\/+/g, "/");
}

async function copyFonts() {
  try {
    const pkgPath = joinPath(Deno.cwd(), "node_modules", PACKAGE_NAME);
    const destPath = FONTS_DIR;

    // Create destination
    await Deno.mkdir(joinPath(destPath, "files"), { recursive: true });

    console.log(`[Fonts] Copying files from ${PACKAGE_NAME}...`);

    // Copy index.css and fix paths
    const cssContent = await Deno.readTextFile(joinPath(pkgPath, "index.css"));
    // Change ./files/ to /fonts/files/ to ensure correct resolution from the root styles.css
    const fixedCssContent = cssContent.replace(/\.\/files\//g, "/fonts/files/");
    await Deno.writeTextFile(joinPath(destPath, "index.css"), fixedCssContent);
    console.log(`[Fonts] Copied and fixed index.css`);

    // Copy all woff2 files in files/
    for await (const entry of Deno.readDir(joinPath(pkgPath, "files"))) {
      if (entry.isFile && entry.name.endsWith(".woff2")) {
        await Deno.copyFile(
          joinPath(pkgPath, "files", entry.name),
          joinPath(destPath, "files", entry.name)
        );
      }
    }
    console.log(`[Fonts] Copied font files`);

    console.log("[Fonts] Font preparation complete!");
  } catch (error) {
    console.error("[Fonts] Error preparing fonts:", error);
    if (error instanceof Deno.errors.NotFound) {
      console.error("[Fonts] Make sure to run 'deno install' first.");
    }
    Deno.exit(1);
  }
}

if (import.meta.main) {
  copyFonts();
}
