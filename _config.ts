import lume from "lume/mod.ts";
import esbuild from "lume/plugins/esbuild.ts";
import googleFonts from "lume/plugins/google_fonts.ts";
import lightningCss from "lume/plugins/lightningcss.ts";
import sourceMaps from "lume/plugins/source_maps.ts";
import metas from "lume/plugins/metas.ts";
import codeHighlight from "lume/plugins/code_highlight.ts";
import minifyHTML from "lume/plugins/minify_html.ts";
import seo from "lume/plugins/seo.ts";
import robots from "lume/plugins/robots.ts";
import sitemap from "lume/plugins/sitemap.ts";

const site = lume();

// Helper to generate dynamic colors for tags
site.filter("tagColor", (tag: string) => {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Hue: 0-360
  const h = Math.abs(hash) % 360;
  // Lightness: 55% - 75% (vary based on hash)
  const l = 55 + (Math.abs(hash >> 8) % 20);
  // Chroma: 0.1 - 0.25 (vary based on hash)
  const c = 0.1 + (Math.abs(hash >> 16) % 15) / 100;

  return `oklch(${l}% ${c} ${h})`;
});

site.ignore("AGENTS.md", "CHANGELOG.md", "node_modules");

site.use(esbuild());
site.use(
  googleFonts({
    fonts: {
      "instrument": "https://fonts.google.com/share?selection.family=Instrument+Serif:ital@0;1",
      "outfit": "https://fonts.google.com/share?selection.family=Outfit:wght@100..900",
      "noto-serif-kr": "https://fonts.google.com/share?selection.family=Noto+Serif+KR:wght@200..900",
    },
  }),
);
site.use(lightningCss());
site.use(sourceMaps());
site.use(metas());
site.use(codeHighlight());
site.use(minifyHTML());
site.use(seo());
site.use(robots());
site.use(sitemap());

site.add("style.css");
site.add("script.ts");

site.copy("assets/images");

export default site;
