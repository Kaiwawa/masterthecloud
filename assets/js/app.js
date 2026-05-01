class ThemeManager {
    #html;
    #icon;

    constructor() {
        this.#html = document.documentElement;
        this.#icon = document.getElementById('theme-icon');
    }

    toggleTheme() {
        if (this.#html.classList.contains('dark')) {
            this.#html.classList.remove('dark');
            if (this.#icon) this.#icon.innerText = '☀️';
        } else {
            this.#html.classList.add('dark');
            if (this.#icon) this.#icon.innerText = '🌙';
        }
    }
}

class NavigationManager {
    #overlay;
    #sidebar;

    constructor() {
        this.#overlay = document.getElementById('sidebar-overlay');
        this.#sidebar = document.getElementById('left-sidebar');
    }

    openSidebar() {
        if (!this.#overlay || !this.#sidebar) return;
        this.#overlay.classList.remove('hidden');
        setTimeout(() => {
            this.#overlay.classList.remove('opacity-0');
            this.#sidebar.classList.remove('-translate-x-full');
        }, 10);
    }

    closeSidebar() {
        if (!this.#overlay || !this.#sidebar) return;
        this.#overlay.classList.add('opacity-0');
        this.#sidebar.classList.add('-translate-x-full');
        setTimeout(() => this.#overlay.classList.add('hidden'), 300);
    }

    navigateTo(targetId) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.querySelectorAll('.content-section').forEach(s => s.classList.add('hidden'));

        const targetSection = document.getElementById(targetId);
        if (!targetSection) return;
        targetSection.classList.remove('hidden');

        document.querySelectorAll('.nav-btn').forEach(x => {
            x.classList.remove('bg-brand-accent', 'text-white', 'text-slate-900');
            x.classList.add('text-slate-500');
        });

        const btn = document.querySelector(`.nav-btn[data-target="${targetId}"]`);
        if (btn) {
            btn.classList.add('bg-brand-accent', 'text-white');
            btn.classList.remove('text-slate-500');
        }
        this.closeSidebar();
    }

    goHome() {
        const s = document.getElementById('section-home');
        if (s && !s.classList.contains('hidden')) {
            window.location.href = 'index.html';
        } else {
            this.navigateTo('section-home');
        }
    }
}

class SearchManager {
    #allServices;
    #resultsBox;
    #searchBox;

    constructor(allServices) {
        this.#allServices = allServices;
        this.#resultsBox = document.getElementById('search-results');
        this.#searchBox = document.getElementById('global-search');
        this.#bindEvents();
    }

    #bindEvents() {
        if (this.#searchBox) {
            this.#searchBox.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }
    }

    handleSearch(query) {
        if (!this.#resultsBox) return;
        if (!query.trim()) {
            this.#resultsBox.classList.add('hidden');
            return;
        }

        const filtered = this.#allServices.filter(s =>
            s.title.toLowerCase().includes(query.toLowerCase()) ||
            s.desc.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);

        if (filtered.length > 0) {
            this.#resultsBox.innerHTML = filtered.map(s => `
                <div data-action="show-dive" data-target="${s.id}" class="p-4 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer border-b border-slate-100 dark:border-slate-700 last:border-0 flex items-center gap-3">
                    <span class="text-xl">${s.icon}</span>
                    <div>
                        <div class="font-bold text-sm text-slate-800 dark:text-white">${s.title}</div>
                        <div class="text-xs text-slate-500">${s.desc}</div>
                    </div>
                </div>
            `).join('');
            this.#resultsBox.classList.remove('hidden');
        } else {
            this.#resultsBox.innerHTML = `<div class="p-4 text-xs text-slate-400">No results found.</div>`;
            this.#resultsBox.classList.remove('hidden');
        }
    }

    clearSearch() {
        if (this.#searchBox) this.#searchBox.value = '';
        if (this.#resultsBox) this.#resultsBox.classList.add('hidden');
    }
}

class ModalManager {
    #modal;
    #title;
    #icon;
    #iconBg;
    #subtitle;
    #content;
    #shell;

    constructor() {
        this.#modal = document.getElementById('deep-dive-modal');
        if (!this.#modal) return;

        this.#shell = this.#modal.querySelector('div');
        this.#title = document.getElementById('m-title');
        this.#icon = document.getElementById('m-icon');
        this.#iconBg = document.getElementById('m-icon-bg');
        this.#subtitle = document.getElementById('m-subtitle');
        this.#content = document.getElementById('m-content');
    }

    showDive(serviceData, domainColor) {
        if (!this.#modal) return;

        if (this.#title) this.#title.innerText = serviceData.title;
        if (this.#icon) this.#icon.innerText = serviceData.icon;

        // Remove previous theme classes
        const classesToRemove = Array.from(this.#modal.classList).filter(c => c.startsWith('theme-'));
        this.#modal.classList.remove(...classesToRemove);

        // Add new theme class based on domain color
        if (domainColor) {
            this.#modal.classList.add(`theme-${domainColor}`);
        }

        // The modal UI components (iconBg, subtitle, content) now use CSS variables defined by the theme class
        // No inline styles needed!

        if (this.#content) {
            this.#content.innerHTML = window.marked?.parse ? marked.parse(serviceData.dive) : serviceData.dive;
            setTimeout(() => {
                if (window.mermaid) {
                    try { mermaid.init(undefined, this.#content.querySelectorAll('.mermaid')); }
                    catch (e) { console.error('Mermaid init error:', e); }
                }
            }, 50);
        }

        this.#modal.classList.add('active');
        setTimeout(() => {
            this.#modal.classList.add('opacity-100');
            if (this.#shell) this.#shell.classList.add('scale-100');
        }, 10);
    }

    closeModal() {
        if (!this.#modal) return;
        this.#modal.classList.remove('opacity-100');
        if (this.#shell) this.#shell.classList.remove('scale-100');
        setTimeout(() => this.#modal.classList.remove('active'), 300);
    }
}

class GridManager {
    #grids;

    constructor(grids) {
        this.#grids = grids;
    }

    renderAll() {
        this.#grids.forEach(g => {
            const el = document.getElementById(g.id);
            if (el) {
                el.innerHTML = g.data.map(d => this.#createCard(d, g)).join('');
            }
        });
    }

    #hexToRgba(hex, alpha) {
        const normalized = hex.replace('#', '');
        const red = parseInt(normalized.slice(0, 2), 16);
        const green = parseInt(normalized.slice(2, 4), 16);
        const blue = parseInt(normalized.slice(4, 6), 16);
        return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    }

    #resolveColorHex(colorToken) {
        const colorHexMap = {
            'brand-accent': '#ef4444',
            'red-500': '#ef4444',
            'orange-500': '#f97316',
            'amber-500': '#f59e0b',
            'yellow-500': '#eab308',
            'green-500': '#22c55e',
            'emerald-500': '#10b981',
            'teal-500': '#14b8a6',
            'cyan-500': '#06b6d4',
            'blue-500': '#3b82f6',
            'indigo-500': '#6366f1',
            'purple-500': '#8b5cf6',
            'pink-500': '#ec4899'
        };
        return colorHexMap[colorToken] || colorHexMap['brand-accent'];
    }

    #createCard(c, grid) {
        const accentHex = this.#resolveColorHex(grid.color);
        const accentSoft = this.#hexToRgba(accentHex, 0.18);
        const accentBorder = this.#hexToRgba(accentHex, 0.45);

        return `
        <div class="flip-card study-guide-card" style="--card-accent:${accentHex}; --card-accent-soft:${accentSoft}; --card-border:${accentBorder};" data-action="flip-card">
            <div class="flip-card-inner">
                <div class="card-face card-front">
                    <div class="card-icon">${c.icon}</div>
                    <h4 class="card-title">${c.title}</h4>
                    <p class="text-slate-400 text-[10px] mt-2 uppercase tracking-[0.2em] font-black text-center">Flip for Details</p>
                </div>
                <div class="card-face card-back">
                    <p class="card-kicker">${c.title}</p>
                    <p class="card-desc">${c.desc}</p>
                    <div class="card-summary">
                        ${c.summary.split('\n').map(line => `<div class="card-summary-item">${line}</div>`).join('')}
                    </div>
                    <button data-action="show-dive" data-target="${c.id}" class="card-cta">DEEP DIVE →</button>
                </div>
            </div>
        </div>`;
    }
}

class StudyGuideApp {
    #grids;
    #allServices;
    #themeManager;
    #navManager;
    #searchManager;
    #modalManager;
    #gridManager;

    constructor(config) {
        this.#grids = config.grids;
        this.#allServices = config.grids.flatMap(g => g.data);

        this.#themeManager = new ThemeManager();
        this.#navManager = new NavigationManager();
        this.#searchManager = new SearchManager(this.#allServices);
        this.#modalManager = new ModalManager();
        this.#gridManager = new GridManager(this.#grids);

        this.#gridManager.renderAll();
        this.#bindGlobalEvents();

        // Expose legacy global variable for inline scripts if necessary
        window.app = this;
    }

    #bindGlobalEvents() {
        document.addEventListener('click', (e) => {
            // Close search results if clicked outside
            if (!e.target.closest('#global-search')) {
                const res = document.getElementById('search-results');
                if (res) res.classList.add('hidden');
            }

            // Global Event Delegation for data-action attributes
            const actionEl = e.target.closest('[data-action]');
            if (!actionEl) return;

            const action = actionEl.getAttribute('data-action');
            const target = actionEl.getAttribute('data-target');

            switch(action) {
                case 'show-dive':
                    e.stopPropagation(); // prevent bubbling to flip card
                    this.#handleShowDive(target);
                    break;
                case 'close-modal':
                    this.#modalManager.closeModal();
                    break;
                case 'stop-propagation':
                    e.stopPropagation();
                    break;
                case 'toggle-theme':
                    this.#themeManager.toggleTheme();
                    break;
                case 'open-sidebar':
                    this.#navManager.openSidebar();
                    break;
                case 'close-sidebar':
                    this.#navManager.closeSidebar();
                    break;
                case 'navigate':
                    if (target) this.#navManager.navigateTo(target);
                    break;
                case 'go-home':
                    this.#navManager.goHome();
                    break;
                case 'flip-card':
                    actionEl.classList.toggle('flipped');
                    break;
            }
        });
    }

    #handleShowDive(id) {
        const serviceData = this.#allServices.find(x => x.id === id);
        if (!serviceData) return;

        let domainColor = 'brand-accent';
        for (const grid of this.#grids) {
            if (grid.data.some(item => item.id === id)) {
                domainColor = grid.color;
                break;
            }
        }

        this.#searchManager.clearSearch();
        this.#modalManager.showDive(serviceData, domainColor);
    }
}