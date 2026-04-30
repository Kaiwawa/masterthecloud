class StudyGuideApp {
    constructor(config) {
        this.grids = config.grids;
        this.allServices = config.grids.flatMap(g => g.data);
        this.colorHexMap = {
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
        this.bindEvents();
        this.renderAll();
    }

    hexToRgba(hex, alpha) {
        const normalized = hex.replace('#', '');
        const red = parseInt(normalized.slice(0, 2), 16);
        const green = parseInt(normalized.slice(2, 4), 16);
        const blue = parseInt(normalized.slice(4, 6), 16);
        return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    }

    resolveColorHex(colorToken) {
        return this.colorHexMap[colorToken] || this.colorHexMap['brand-accent'];
    }

    bindEvents() {
        window.handleSearch = this.handleSearch.bind(this);
        window.toggleTheme = this.toggleTheme.bind(this);
        window.showDive = this.showDive.bind(this);
        window.closeModal = this.closeModal.bind(this);
        window.goHome = this.goHome.bind(this);
        window.openSidebar = this.openSidebar.bind(this);
        window.closeSidebar = this.closeSidebar.bind(this);
        window.navigateTo = this.navigateTo.bind(this);

        document.addEventListener('click', (e) => {
            if (!e.target.closest('#global-search')) {
                const res = document.getElementById('search-results');
                if(res) res.classList.add('hidden');
            }
        });
    }

    handleSearch(query) {
        const resultsBox = document.getElementById('search-results');
        if (!resultsBox) return;
        if (!query.trim()) { resultsBox.classList.add('hidden'); return; }
        const filtered = this.allServices.filter(s => 
            s.title.toLowerCase().includes(query.toLowerCase()) || 
            s.desc.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
        if (filtered.length > 0) {
            resultsBox.innerHTML = filtered.map(s => `
                <div onclick="showDive('${s.id}'); document.getElementById('global-search').value=''" class="p-4 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer border-b border-slate-100 dark:border-slate-700 last:border-0 flex items-center gap-3">
                    <span class="text-xl">${s.icon}</span>
                    <div>
                        <div class="font-bold text-sm text-slate-800 dark:text-white">${s.title}</div>
                        <div class="text-xs text-slate-500">${s.desc}</div>
                    </div>
                </div>
            `).join('');
            resultsBox.classList.remove('hidden');
        } else {
            resultsBox.innerHTML = `<div class="p-4 text-xs text-slate-400">No results found.</div>`;
            resultsBox.classList.remove('hidden');
        }
    }

    toggleTheme() {
        const html = document.documentElement;
        const icon = document.getElementById('theme-icon');
        if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            if(icon) icon.innerText = '☀️';
        } else {
            html.classList.add('dark');
            if(icon) icon.innerText = '🌙';
        }
    }

    createCard(c, grid) {
        const accentHex = this.resolveColorHex(grid.color);
        const accentSoft = this.hexToRgba(accentHex, 0.18);
        const accentBorder = this.hexToRgba(accentHex, 0.45);
        return `
        <div class="flip-card study-guide-card" style="--card-accent:${accentHex}; --card-accent-soft:${accentSoft}; --card-border:${accentBorder};" onclick="this.classList.toggle('flipped')">
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
                    <button onclick="event.stopPropagation(); showDive('${c.id}')" class="card-cta">DEEP DIVE →</button>
                </div>
            </div>
        </div>`;
    }

    renderAll() { this.grids.forEach(g => { const el = document.getElementById(g.id); if (el) el.innerHTML = g.data.map(d => this.createCard(d, g)).join(''); }); }

    showDive(id) {
        const c = this.allServices.find(x => x.id === id);
        if(!c) return;
        let domainColor = 'brand-accent';
        for (const grid of this.grids) { if (grid.data.some(item => item.id === id)) { domainColor = grid.color; break; } }
        const accentHex = this.resolveColorHex(domainColor);
        const accentSoft = this.hexToRgba(accentHex, 0.2);
        document.getElementById('m-title').innerText = c.title;
        document.getElementById('m-icon').innerText = c.icon;
        const mIconBg = document.getElementById('m-icon-bg');
        const mSubtitle = document.getElementById('m-subtitle');
        const mContent = document.getElementById('m-content');
        if (mIconBg) mIconBg.style.backgroundColor = accentSoft;
        if (mSubtitle) mSubtitle.style.color = accentHex;
        if (mContent) {
            mContent.style.setProperty('--brand-accent', accentHex);
            mContent.innerHTML = window.marked?.parse ? marked.parse(c.dive) : c.dive;
        }
        const m = document.getElementById('deep-dive-modal');
        m.classList.add('active'); setTimeout(() => { m.classList.add('opacity-100'); m.querySelector('div').classList.add('scale-100'); }, 10);
    }

    closeModal(e) { if(e) e.stopPropagation(); const m = document.getElementById('deep-dive-modal'); if (!m) return; m.classList.remove('opacity-100'); const shell = m.querySelector('div'); if (shell) shell.classList.remove('scale-100'); setTimeout(() => m.classList.remove('active'), 300); }
    goHome() { const s = document.getElementById('section-home'); if(s && !s.classList.contains('hidden')) window.location.href = 'index.html'; else this.navigateTo('section-home'); }
    openSidebar() { const overlay = document.getElementById('sidebar-overlay'); const sidebar = document.getElementById('left-sidebar'); if (!overlay || !sidebar) return; overlay.classList.remove('hidden'); setTimeout(() => { overlay.classList.remove('opacity-0'); sidebar.classList.remove('-translate-x-full'); }, 10); }
    closeSidebar() { const overlay = document.getElementById('sidebar-overlay'); const sidebar = document.getElementById('left-sidebar'); if (!overlay || !sidebar) return; overlay.classList.add('opacity-0'); sidebar.classList.add('-translate-x-full'); setTimeout(() => overlay.classList.add('hidden'), 300); }
    navigateTo(targetId) { window.scrollTo({ top: 0, behavior: 'smooth' }); document.querySelectorAll('.content-section').forEach(s => s.classList.add('hidden')); const targetSection = document.getElementById(targetId); if (!targetSection) return; targetSection.classList.remove('hidden'); document.querySelectorAll('.nav-btn').forEach(x => { x.classList.remove('bg-brand-accent', 'text-white', 'text-slate-900'); x.classList.add('text-slate-500'); }); const btn = document.querySelector(`.nav-btn[data-target="${targetId}"]`); if (btn) { btn.classList.add('bg-brand-accent', 'text-white'); btn.classList.remove('text-slate-500'); } this.closeSidebar(); }
}
