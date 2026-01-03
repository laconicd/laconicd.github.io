/**
 * Speculation Rules API - Prerenders and prefetches pages for instant navigation.
 */
export function initSpeculationRules() {
  // @ts-ignore: Speculation Rules API
  if (!HTMLScriptElement.supports?.("speculationrules")) {
    console.warn("[Speculation] Speculation Rules API not supported.");
    return;
  }

  const specScript = document.createElement("script");
  specScript.type = "speculationrules";
  
  // Rules for pre-rendering local links on hover or moderate eagerness
  const rules = {
    prerender: [
      {
        where: {
          and: [
            { href_matches: "/*" },
            { not: { href_matches: ["/admin/*", "/*#*", "/*.*"] } },
            { not: { selector_matches: "[rel~='nofollow']" } }
          ]
        },
        eagerness: "moderate" // Pre-render on hover
      }
    ],
    prefetch: [
       {
        where: {
          and: [
            { href_matches: "/*" },
            { not: { href_matches: ["/admin/*", "/*#*", "/*.*"] } }
          ]
        },
        eagerness: "conservative" // Prefetch on pointer down
      }
    ]
  };

  specScript.textContent = JSON.stringify(rules);
  document.head.appendChild(specScript);
  console.log("[Speculation] Rules injected.");
}
