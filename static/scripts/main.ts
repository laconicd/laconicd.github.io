/**
 * Global application logic
 */
const syncThemeControllers = () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const isDark = currentTheme === 'dim';
  document.querySelectorAll('.theme-controller').forEach(el => {
    el.checked = isDark;
  });
};

document.addEventListener('DOMContentLoaded', syncThemeControllers);
window.addEventListener('page:updated', syncThemeControllers);

document.addEventListener('change', (e) => {
  if (e.target.classList.contains('theme-controller')) {
    const isDark = e.target.checked;
    const newTheme = isDark ? 'dim' : 'lofi';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    const link = document.getElementById('syntax-theme');
    if (link && window.__SYNTAX_THEME_URLS__) {
      link.href = window.__SYNTAX_THEME_URLS__[newTheme];
    }

    document.querySelectorAll('.theme-controller').forEach(el => {
      if (el !== e.target) el.checked = isDark;
    });
  }
});
