/**
 * Theme Initialization
 * Sets the theme attribute on <html> to prevent FOUC.
 */
(function () {
  const theme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dim"
      : "lofi");
  document.documentElement.setAttribute("data-theme", theme);

  // Apply syntax theme
  const link = document.createElement("link");
  link.id = "syntax-theme";
  link.rel = "stylesheet";

  const urls = window.__SYNTAX_THEME_URLS__ || {};
  link.href = theme === "dim" ? urls.dim : urls.lofi;

  if (link.href && link.href !== window.location.href) {
    document.head.appendChild(link);
  }
})();
