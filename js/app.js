class StudyGuideApp {
    constructor(config) {
        this.grids = config.grids;
        this.allServices = config.grids.flatMap(g => g.data);
        this.colors = ['brand-accent', 'red-500', 'orange-500', 'amber-500', 'yellow-500', 'green-500', 'emerald-500', 'teal-500', 'cyan-500', 'blue-500', 'indigo-500', 'purple-500', 'pink-500'];
        this.bindEvents();
        this.renderAll();
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

    createCard(c, borderColorClass, gradientFromClass) {
        const textColorClass = borderColorClass.replace('border-', 'text-');
        const bgColorClass = borderColorClass.replace('border-', 'bg-');
        const hoverBgColorClass = `hover:${bgColorClass.replace('500', '700')}`;
        return `
        <div class="flip-card h-[320px] cursor-pointer group" onclick="this.classList.toggle('flipped')">
            <div class="flip-card-inner h-full w-full relative transform-style-3d shadow-xl rounded-[1.5rem]">
                <div class="absolute inset-0 backface-hidden bg-white dark:bg-slate-800/60 backdrop-blur-xl rounded-[1.5rem] flex flex-col items-center justify-center p-6 border-2 border-slate-200 dark:border-slate-700/50 group-hover:${borderColorClass.replace('500','accent')}/50 transition-all">
                    <div class="w-16 h-16 bg-gradient-to-br ${gradientFromClass} to-transparent rounded-2xl flex items-center justify-center text-3xl mb-4">${c.icon}</div>
                    <h4 class="font-black text-lg text-slate-800 dark:text-white tracking-tight text-center">${c.title}</h4>
                    <p class="text-slate-400 text-[10px] mt-2 uppercase tracking-[0.2em] font-black">Flip for Details</p>
                </div>
                <div class="absolute inset-0 backface-hidden rotate-y-180 bg-slate-900 dark:bg-slate-900 rounded-[1.5rem] flex flex-col p-6 border-2 ${borderColorClass}">
                    <p class="text-xs font-black ${textColorClass} uppercase tracking-widest mb-2">${c.title}</p>
                    <p class="text-slate-300 text-s mb-4 leading-relaxed line-clamp-2">${c.desc}</p>
                    <div class="space-y-1.5 mb-4">
                        ${c.summary.split('\n').map(line => `<div class="text-[12px] text-slate-400 font-medium">${line}</div>`).join('')}
                    </div>
                    <button onclick="event.stopPropagation(); showDive('${c.id}')" class="mt-auto w-full ${bgColorClass} text-white py-3 rounded-xl text-xs font-black transition-all ${hoverBgColorClass}">DEEP DIVE →</button>
                </div>
            </div>
        </div>`;
    }

    renderAll() { this.grids.forEach(g => { const el = document.getElementById(g.id); if (el) el.innerHTML = g.data.map(d => this.createCard(d, g.border, g.grad)).join(''); }); }

    showDive(id) {
        const c = this.allServices.find(x => x.id === id);
        if(!c) return;
        let domainColor = 'brand-accent';
        for (const grid of this.grids) { if (grid.data.some(item => item.id === id)) { domainColor = grid.color; break; } }
        document.getElementById('m-title').innerText = c.title;
        document.getElementById('m-icon').innerText = c.icon;
        const mIconBg = document.getElementById('m-icon-bg');
        const mSubtitle = document.querySelector('#deep-dive-modal p.uppercase');
        mIconBg.classList.remove(...this.colors.map(col => `bg-${col}/20`));
        mIconBg.classList.add(`bg-${domainColor}/20`);
        mSubtitle.classList.remove(...this.colors.map(col => `text-${col}`));
        mSubtitle.classList.add(`text-${domainColor}`);
        document.getElementById('m-content').innerHTML = marked.parse(c.dive);
        const m = document.getElementById('deep-dive-modal');
        m.classList.add('active'); setTimeout(() => { m.classList.add('opacity-100'); m.querySelector('div').classList.add('scale-100'); }, 10);
    }

    closeModal(e) { if(e) e.stopPropagation(); const m = document.getElementById('deep-dive-modal'); m.classList.remove('opacity-100'); m.querySelector('div').classList.remove('scale-100'); setTimeout(() => m.classList.remove('active'), 300); }
    goHome() { const s = document.getElementById('section-home'); if(s && !s.classList.contains('hidden')) window.location.href = 'index.html'; else this.navigateTo('section-home'); }
    openSidebar() { document.getElementById('sidebar-overlay').classList.remove('hidden'); setTimeout(() => { document.getElementById('sidebar-overlay').classList.remove('opacity-0'); document.getElementById('left-sidebar').classList.remove('-translate-x-full'); }, 10); }
    closeSidebar() { document.getElementById('sidebar-overlay').classList.add('opacity-0'); document.getElementById('left-sidebar').classList.add('-translate-x-full'); setTimeout(() => document.getElementById('sidebar-overlay').classList.add('hidden'), 300); }
    navigateTo(targetId) { window.scrollTo({ top: 0, behavior: 'smooth' }); document.querySelectorAll('.content-section').forEach(s => s.classList.add('hidden')); document.getElementById(targetId).classList.remove('hidden'); document.querySelectorAll('.nav-btn').forEach(x => { x.classList.remove('bg-brand-accent', 'text-white', 'text-slate-900'); x.classList.add('text-slate-500'); }); const btn = document.querySelector(`.nav-btn[data-target="${targetId}"]`); if (btn) { btn.classList.add('bg-brand-accent', 'text-white'); btn.classList.remove('text-slate-500'); } this.closeSidebar(); }
}
