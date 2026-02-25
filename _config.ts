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
  const hash = [...tag].reduce((acc, char) => (char.codePointAt(0) ?? 0) + ((acc << 5) - acc), 0);

  const h = Math.abs(hash) % 360;
  return `oklch(65% 0.15 ${h})`;
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
site.copy("assets/js");

export default site;
