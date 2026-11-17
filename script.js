(() => {
    const root = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const themeLabel = themeToggle?.querySelector('.theme-label');
    const themeIcon = themeToggle?.querySelector('i');
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

    function readSavedTheme() {
        try {
            return localStorage.getItem('coffee-cafe-theme');
        } catch {
            return null;
        }
    }

    function saveTheme(theme) {
        try {
            localStorage.setItem('coffee-cafe-theme', theme);
        } catch {
            // The toggle still works if browser storage is unavailable.
        }
    }

    function applyTheme(theme) {
        const isDark = theme === 'dark';
        root.dataset.theme = isDark ? 'dark' : 'light';

        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', String(isDark));
            themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
        }

        if (themeLabel) {
            themeLabel.textContent = isDark ? 'Light mode' : 'Dark mode';
        }

        if (themeIcon) {
            themeIcon.classList.toggle('fa-sun', isDark);
            themeIcon.classList.toggle('fa-moon', !isDark);
        }

        if (themeColorMeta) {
            themeColorMeta.setAttribute('content', isDark ? '#171411' : '#fdfbf7');
        }
    }

    const savedTheme = readSavedTheme();
    applyTheme(
        savedTheme === 'light' || savedTheme === 'dark'
            ? savedTheme
            : (systemTheme.matches ? 'dark' : 'light')
    );

    themeToggle?.addEventListener('click', () => {
        const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
        saveTheme(nextTheme);
    });

    systemTheme.addEventListener?.('change', (event) => {
        if (!readSavedTheme()) {
            applyTheme(event.matches ? 'dark' : 'light');
        }
    });

    // Menu filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuCards = document.querySelectorAll('.menu-card');
    const filterStatus = document.getElementById('filter-status');

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const filterValue = button.dataset.filter || 'all';
            let visibleCount = 0;

            filterButtons.forEach((filterButton) => {
                const isActive = filterButton === button;
                filterButton.classList.toggle('active', isActive);
                filterButton.setAttribute('aria-pressed', String(isActive));
            });

            menuCards.forEach((card) => {
                const matches = filterValue === 'all' || card.dataset.category === filterValue;
                card.hidden = !matches;
                if (matches) visibleCount += 1;
            });

            if (filterStatus) {
                const categoryName = button.textContent.trim();
                filterStatus.textContent =
                    `Showing ${visibleCount} ${visibleCount === 1 ? 'menu item' : 'menu items'} for ${categoryName}.`;
            }
        });
    });

    // Mobile navigation
    const mobileMenuToggle = document.getElementById('mobile-menu');
    const navbar = document.getElementById('site-navigation');

    function setMenuOpen(isOpen) {
        if (!mobileMenuToggle || !navbar) return;

        navbar.classList.toggle('is-open', isOpen);
        mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
        mobileMenuToggle.setAttribute(
            'aria-label',
            isOpen ? 'Close navigation menu' : 'Open navigation menu'
        );

        const icon = mobileMenuToggle.querySelector('i');
        icon?.classList.toggle('fa-xmark', isOpen);
        icon?.classList.toggle('fa-bars', !isOpen);
    }

    mobileMenuToggle?.addEventListener('click', () => {
        const isOpen = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        setMenuOpen(!isOpen);
    });

    navbar?.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') setMenuOpen(false);
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 760) setMenuOpen(false);
    });
})();