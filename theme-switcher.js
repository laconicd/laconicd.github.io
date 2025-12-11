(function() {
    'use strict';

    var themeToggle = document.getElementById('theme-toggle');
    var currentTheme = localStorage.getItem('theme');

    // Set the initial theme
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            themeToggle.checked = true;
        }
    } else {
        // Default to 'winter' if no theme is set
        document.documentElement.setAttribute('data-theme', 'winter');
    }

    // Handle theme switching
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'winter');
            localStorage.setItem('theme', 'winter');
        }
    });
})();
