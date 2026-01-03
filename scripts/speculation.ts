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
  
  // Aggressive rules for general mode testing
  const rules = {
    prerender: [
      {
        where: {
          href_matches: "/*"
        },
        eagerness: "eager"
      }
    ]
  };

  specScript.textContent = JSON.stringify(rules);
  document.head.appendChild(specScript);
  console.log("[Speculation] Rules injected.");
}
