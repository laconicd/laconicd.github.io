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
  if (!tag) return "oklch(60% 0.2 0)";

  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h = Math.abs(hash * 137.508) % 360;
  const l = 65 + (Math.abs(hash >> 4) % 10); // 65% ~ 75%
  const c = 0.15 + (Math.abs(hash >> 8) % 10) / 100; // 0.15 ~ 0.25

  return `oklch(${l.toFixed(2)}% ${c.toFixed(2)} ${h.toFixed(2)})`;
});

site.ignore("AGENTS.md", "CHANGELOG.md", "node_modules");

site.use(esbuild());
site.use(
  googleFonts({
    fonts: {
      "outfit": "https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap",
      "instrument": "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap",
      "mono": "https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap",
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
