const fonts = [
  {
    name: "outfit-latin.woff2",
    url: "https://fonts.gstatic.com/s/outfit/v15/QGYvz_MVcBeNP4NJtEtq.woff2",
  },
  {
    name: "outfit-latin-ext.woff2",
    url: "https://fonts.gstatic.com/s/outfit/v15/QGYvz_MVcBeNP4NJuktqQ4E.woff2",
  },
];

const FONTS_DIR = "./static/fonts";

async function downloadFonts() {
  try {
    // 폴더 생성
    await Deno.mkdir(FONTS_DIR, { recursive: true });

    for (const font of fonts) {
      const filePath = `${FONTS_DIR}/${font.name}`;
      
      console.log(`[Fonts] Downloading ${font.name}...`);
      const response = await fetch(font.url);
      
      if (!response.ok) {
        throw new Error(`Failed to download ${font.name}: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      await Deno.writeFile(filePath, new Uint8Array(arrayBuffer));
      console.log(`[Fonts] Saved to ${filePath}`);
    }
    
    console.log("[Fonts] All fonts downloaded successfully!");
  } catch (error) {
    console.error("[Fonts] Error downloading fonts:", error);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  downloadFonts();
}
