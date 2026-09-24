/* ==========================================================================
   SUBDOMAIN HUB - MAXIMALIST APPLICATION CONTROLLER
   Domain: aayushbabu.live
   ========================================================================== */

(function () {
  'use strict';

  // DEFAULT PRESET SUBDOMAINS DATA FOR aayushbabu.live
  const DEFAULT_SUBDOMAINS = [
    {
      id: 'sub-exploitdb',
      name: 'ExploitDB Search & Vulnerabilities',
      subdomain: 'exploitdb',
      category: 'Security',
      status: 'online',
      description: 'Search portal and vulnerability inspector for browsing CVEs, security exploits, and proof-of-concept code. Source: https://github.com/aayushrambo8/ExploitDB-Website',
      githubUrl: 'https://github.com/aayushrambo8/ExploitDB-Website',
      techStack: ['Security', 'ExploitDB', 'CVE Search', 'Python', 'Web API'],
      icon: 'shield-check',
      colorAccent: '#10b981',
      pingMs: 14,
      isPinned: true,
      lastCheck: 'Just now',
      endpoints: ['/search', '/cve/lookup', '/exploits/raw', '/api/v1/search']
    },
    {
      id: 'sub-portfolio',
      name: 'Media Portfolio & Showcase',
      subdomain: 'portfolio',
      category: 'Showcase',
      status: 'online',
      description: 'Interactive digital media portfolio showcasing creative design assets, artwork, UI components, and video productions. Source: https://github.com/aayushrambo8/Media-Portfolio',
      githubUrl: 'https://github.com/aayushrambo8/Media-Portfolio',
      techStack: ['JavaScript', 'CSS3', 'HTML5', 'UI/UX Design', 'Media Engine'],
      icon: 'sparkles',
      colorAccent: '#ec4899',
      pingMs: 18,
      isPinned: true,
      lastCheck: '1 min ago',
      endpoints: ['/gallery', '/projects', '/video-showcase', '/about']
    },
    {
      id: 'sub-tictactoe',
      name: 'TicTacToe Web Game',
      subdomain: 'tictactoe',
      category: 'Games',
      status: 'online',
      description: 'Sleek interactive Tic-Tac-Toe web game featuring single player AI and local multiplayer modes. Source: https://github.com/aayushrambo8/TicTacToe',
      githubUrl: 'https://github.com/aayushrambo8/TicTacToe',
      techStack: ['JavaScript', 'HTML5 Canvas', 'CSS Animations', 'Game Logic'],
      icon: 'grid',
      colorAccent: '#06b6d4',
      pingMs: 12,
      isPinned: true,
      lastCheck: 'Just now',
      endpoints: ['/play', '/singleplayer', '/multiplayer', '/stats']
    }
  ];

  // STATE MANAGEMENT
  let appState = {
    rootDomain: localStorage.getItem('sh_root_domain') || 'aayushbabu.live',
    protocol: 'https://',
    subdomains: JSON.parse(localStorage.getItem('sh_subdomains')) || DEFAULT_SUBDOMAINS,
    activeCategory: 'All',
    searchQuery: '',
    sortBy: 'default',
    viewMode: localStorage.getItem('sh_view_mode') || 'grid',
    theme: localStorage.getItem('sh_theme') || 'dark',
    activeModal: null,
    editingSubdomainId: null
  };

  // SVG ICONS LIBRARY
  const SVG_ICONS = {
    grid: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    'shield-check': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 11 12 14 22 4"/></svg>`,
    sparkles: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/></svg>`,
    github: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>`,
    externalLink: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
    copy: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
    pin: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14l-1.5-6H19l-2-7H7L5 10h1.5L5 17z"/></svg>`,
    info: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    trash: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
    edit: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
    bolt: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`
  };

  // DOM ELEMENTS CACHE
  const DOM = {
    themeToggleBtn: document.getElementById('theme-toggle-btn'),
    rootDomainPill: document.getElementById('root-domain-pill'),
    rootDomainText: document.getElementById('root-domain-text'),
    heroDomainText: document.getElementById('hero-domain-text'),
    heroSubtitleDomain: document.getElementById('hero-subtitle-domain'),
    statsTotalCount: document.getElementById('stats-total-count'),
    statsOnlineCount: document.getElementById('stats-online-count'),
    statsAvgPing: document.getElementById('stats-avg-ping'),
    searchInput: document.getElementById('search-input'),
    categoryContainer: document.getElementById('category-container'),
    sortSelect: document.getElementById('sort-select'),
    viewGridBtn: document.getElementById('view-grid-btn'),
    viewListBtn: document.getElementById('view-list-btn'),
    subdomainsGrid: document.getElementById('subdomains-grid'),
    pinnedSection: document.getElementById('pinned-section'),
    pinnedGrid: document.getElementById('pinned-grid'),
    emptyState: document.getElementById('empty-state'),
    
    // Modals
    domainConfigModal: document.getElementById('domain-config-modal'),
    domainConfigInput: document.getElementById('domain-config-input'),
    saveDomainBtn: document.getElementById('save-domain-btn'),
    closeDomainModalBtn: document.getElementById('close-domain-modal'),
    
    subdomainModal: document.getElementById('subdomain-modal'),
    subdomainForm: document.getElementById('subdomain-form'),
    modalTitleText: document.getElementById('modal-title-text'),
    subFormName: document.getElementById('sub-name'),
    subFormPrefix: document.getElementById('sub-prefix'),
    subFormCategory: document.getElementById('sub-category'),
    subFormStatus: document.getElementById('sub-status'),
    subFormIcon: document.getElementById('sub-icon'),
    subFormDesc: document.getElementById('sub-desc'),
    subFormTech: document.getElementById('sub-tech'),
    saveSubdomainBtn: document.getElementById('save-subdomain-btn'),
    closeSubModalBtn: document.getElementById('close-sub-modal'),
    
    detailsModal: document.getElementById('details-modal'),
    detailsContainer: document.getElementById('details-container'),
    closeDetailsModalBtn: document.getElementById('close-details-modal'),

    cmdPaletteModal: document.getElementById('cmd-palette-modal'),
    cmdInput: document.getElementById('cmd-input'),
    cmdList: document.getElementById('cmd-list'),
    
    // Actions
    addSubdomainBtn: document.getElementById('add-subdomain-btn'),
    exportConfigBtn: document.getElementById('export-config-btn'),
    importConfigInput: document.getElementById('import-config-input'),
    resetDefaultsBtn: document.getElementById('reset-defaults-btn'),
    toastContainer: document.getElementById('toast-container')
  };

  // INITIALIZATION
  function init() {
    applyTheme(appState.theme);
    updateDomainDisplay();
    renderCategories();
    renderSubdomains();
    renderStats();
    setupEventListeners();
  }

  // EVENT LISTENERS
  function setupEventListeners() {
    DOM.themeToggleBtn.addEventListener('click', () => {
      appState.theme = appState.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('sh_theme', appState.theme);
      applyTheme(appState.theme);
      showToast(`Switched to ${appState.theme} mode`);
    });

    DOM.rootDomainPill.addEventListener('click', openDomainModal);
    DOM.closeDomainModalBtn.addEventListener('click', closeDomainModal);
    DOM.saveDomainBtn.addEventListener('click', saveRootDomain);

    DOM.searchInput.addEventListener('input', (e) => {
      appState.searchQuery = e.target.value.toLowerCase().trim();
      renderSubdomains();
    });

    DOM.sortSelect.addEventListener('change', (e) => {
      appState.sortBy = e.target.value;
      renderSubdomains();
    });

    DOM.viewGridBtn.addEventListener('click', () => setViewMode('grid'));
    DOM.viewListBtn.addEventListener('click', () => setViewMode('list'));

    DOM.addSubdomainBtn.addEventListener('click', () => openSubdomainModal());
    DOM.closeSubModalBtn.addEventListener('click', closeSubdomainModal);
    DOM.subdomainForm.addEventListener('submit', handleSubdomainFormSubmit);
    DOM.closeDetailsModalBtn.addEventListener('click', closeDetailsModal);

    DOM.exportConfigBtn.addEventListener('click', exportConfiguration);
    DOM.importConfigInput.addEventListener('change', importConfiguration);
    DOM.resetDefaultsBtn.addEventListener('click', resetToDefaults);

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openCmdPalette();
      } else if (e.key === '/' && document.activeElement !== DOM.searchInput && !appState.activeModal) {
        e.preventDefault();
        DOM.searchInput.focus();
      } else if (e.key === 'Escape') {
        closeAllModals();
      }
    });

    document.querySelectorAll('.modal-overlay').forEach((overlay) => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeAllModals();
      });
    });
  }

  // THEME MANAGEMENT
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const sunIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
    const moonIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    DOM.themeToggleBtn.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
  }

  // DOMAIN DISPLAYS
  function updateDomainDisplay() {
    DOM.rootDomainText.textContent = appState.rootDomain;
    DOM.heroDomainText.textContent = appState.rootDomain;
    DOM.heroSubtitleDomain.textContent = appState.rootDomain;
  }

  function getFullUrl(subdomainPrefix) {
    return `${appState.protocol}${subdomainPrefix}.${appState.rootDomain}`;
  }

  // PARSE LINKS IN DESCRIPTION
  function formatDescriptionWithLinks(text) {
    if (!text) return '';
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return escapeHTML(text).replace(urlRegex, function (url) {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });
  }

  // RENDER CATEGORY TAGS
  function renderCategories() {
    const categories = ['All', ...new Set(appState.subdomains.map(s => s.category))];
    DOM.categoryContainer.innerHTML = categories.map(cat => `
      <button class="category-tag ${appState.activeCategory === cat ? 'active' : ''}" data-category="${cat}">
        ${cat}
      </button>
    `).join('');

    DOM.categoryContainer.querySelectorAll('.category-tag').forEach(btn => {
      btn.addEventListener('click', () => {
        appState.activeCategory = btn.getAttribute('data-category');
        renderCategories();
        renderSubdomains();
      });
    });
  }

  // RENDER SUBDOMAINS GRID
  function renderSubdomains() {
    let filtered = appState.subdomains.filter(sub => {
      const matchesCategory = appState.activeCategory === 'All' || sub.category === appState.activeCategory;
      const fullUrl = `${sub.subdomain}.${appState.rootDomain}`.toLowerCase();
      const matchesSearch = !appState.searchQuery ||
        sub.name.toLowerCase().includes(appState.searchQuery) ||
        sub.description.toLowerCase().includes(appState.searchQuery) ||
        fullUrl.includes(appState.searchQuery) ||
        (sub.techStack && sub.techStack.some(t => t.toLowerCase().includes(appState.searchQuery)));
      return matchesCategory && matchesSearch;
    });

    if (appState.sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (appState.sortBy === 'status') {
      filtered.sort((a, b) => (a.status === 'online' ? -1 : 1));
    } else if (appState.sortBy === 'ping') {
      filtered.sort((a, b) => a.pingMs - b.pingMs);
    }

    const pinned = filtered.filter(s => s.isPinned);
    
    if (pinned.length > 0 && !appState.searchQuery && appState.activeCategory === 'All') {
      DOM.pinnedSection.style.display = 'block';
      DOM.pinnedGrid.innerHTML = pinned.map(sub => createCardHTML(sub, true)).join('');
      attachCardEvents(DOM.pinnedGrid);
    } else {
      DOM.pinnedSection.style.display = 'none';
    }

    if (filtered.length === 0) {
      DOM.subdomainsGrid.style.display = 'none';
      DOM.emptyState.style.display = 'block';
    } else {
      DOM.subdomainsGrid.style.display = appState.viewMode === 'list' ? 'flex' : 'grid';
      DOM.emptyState.style.display = 'none';
      DOM.subdomainsGrid.innerHTML = filtered.map(sub => createCardHTML(sub, false)).join('');
      attachCardEvents(DOM.subdomainsGrid);
    }

    renderStats();
  }

  // CARD HTML TEMPLATE BUILDER
  function createCardHTML(sub, isPinnedGrid) {
    const fullUrl = getFullUrl(sub.subdomain);
    const iconSVG = SVG_ICONS[sub.icon] || SVG_ICONS['grid'];
    const statusLabel = sub.status.toUpperCase();

    const formattedDesc = formatDescriptionWithLinks(sub.description);

    const githubButton = sub.githubUrl ? `
      <a href="${sub.githubUrl}" target="_blank" rel="noopener noreferrer" class="github-btn" title="View Source on GitHub">
        ${SVG_ICONS.github} GitHub Repo
      </a>
    ` : '';

    const githubBadge = sub.githubUrl ? `
      <a href="${sub.githubUrl}" target="_blank" rel="noopener noreferrer" class="github-repo-badge">
        ${SVG_ICONS.github} <span>${sub.githubUrl.replace('https://github.com/', '')}</span>
      </a>
    ` : '';

    const customAccent = sub.colorAccent ? `--card-accent-color: ${sub.colorAccent}; --card-icon-color: ${sub.colorAccent};` : '';

    return `
      <div class="subdomain-card" data-id="${sub.id}" style="${customAccent}">
        <div>
          <div class="card-header">
            <div class="card-icon-title">
              <div class="card-icon">
                ${iconSVG}
              </div>
              <div class="card-title-group">
                <span class="card-title">${escapeHTML(sub.name)}</span>
                <a href="${fullUrl}" target="_blank" rel="noopener noreferrer" class="card-subdomain-url">
                  ${escapeHTML(sub.subdomain)}.${escapeHTML(appState.rootDomain)}
                  ${SVG_ICONS.externalLink}
                </a>
              </div>
            </div>
            <button class="card-pin-btn ${sub.isPinned ? 'pinned' : ''}" data-action="pin" title="${sub.isPinned ? 'Unpin' : 'Pin to Launchpad'}">
              ${SVG_ICONS.pin}
            </button>
          </div>

          <div class="card-body">
            <div style="margin-bottom: 0.85rem; display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
              <span class="status-badge ${sub.status}">
                <span class="status-dot"></span> ${statusLabel}
              </span>
              <span class="tech-tag" style="background: var(--bg-tertiary); font-weight: 700; color: var(--text-primary);">${escapeHTML(sub.category)}</span>
            </div>

            <p class="card-description">${formattedDesc}</p>
            
            ${githubBadge}

            <div class="card-tech-tags">
              ${(sub.techStack || []).map(t => `<span class="tech-tag">${escapeHTML(t)}</span>`).join('')}
            </div>
          </div>
        </div>

        <div class="card-footer">
          <div class="card-meta-info">
            <span class="latency-indicator" title="Latency speed">
              ${SVG_ICONS.bolt} ${sub.pingMs}ms
            </span>
          </div>

          <div class="action-group">
            <button class="action-btn-icon" data-action="copy" title="Copy URL">
              ${SVG_ICONS.copy}
            </button>
            <button class="action-btn-icon" data-action="info" title="Inspect Service & Endpoints">
              ${SVG_ICONS.info}
            </button>
            <button class="action-btn-icon" data-action="edit" title="Edit Subdomain">
              ${SVG_ICONS.edit}
            </button>
            <button class="action-btn-icon" data-action="delete" title="Delete Subdomain">
              ${SVG_ICONS.trash}
            </button>
            ${githubButton}
            <a href="${fullUrl}" target="_blank" rel="noopener noreferrer" class="launch-btn">
              Launch ${SVG_ICONS.externalLink}
            </a>
          </div>
        </div>
      </div>
    `;
  }

  // ATTACH CARD BUTTON ACTIONS
  function attachCardEvents(container) {
    container.querySelectorAll('.subdomain-card').forEach(card => {
      const id = card.getAttribute('data-id');
      const sub = appState.subdomains.find(s => s.id === id);
      if (!sub) return;

      const fullUrl = getFullUrl(sub.subdomain);

      card.querySelector('[data-action="pin"]')?.addEventListener('click', (e) => {
        e.stopPropagation();
        sub.isPinned = !sub.isPinned;
        saveSubdomainsToStorage();
        renderSubdomains();
        showToast(sub.isPinned ? `Pinned ${sub.name}` : `Unpinned ${sub.name}`);
      });

      card.querySelector('[data-action="copy"]')?.addEventListener('click', (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(fullUrl).then(() => {
          showToast(`Copied ${fullUrl} to clipboard!`);
        });
      });

      card.querySelector('[data-action="info"]')?.addEventListener('click', (e) => {
        e.stopPropagation();
        openDetailsModal(sub);
      });

      card.querySelector('[data-action="edit"]')?.addEventListener('click', (e) => {
        e.stopPropagation();
        openSubdomainModal(sub);
      });

      card.querySelector('[data-action="delete"]')?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`Delete "${sub.name}" (${sub.subdomain}.${appState.rootDomain})?`)) {
          appState.subdomains = appState.subdomains.filter(s => s.id !== id);
          saveSubdomainsToStorage();
          renderSubdomains();
          showToast(`Deleted ${sub.name}`);
        }
      });
    });
  }

  // STATS DISPLAY
  function renderStats() {
    DOM.statsTotalCount.textContent = appState.subdomains.length;
    DOM.statsOnlineCount.textContent = appState.subdomains.filter(s => s.status === 'online').length;
    const avgPing = Math.round(appState.subdomains.reduce((acc, s) => acc + s.pingMs, 0) / (appState.subdomains.length || 1));
    DOM.statsAvgPing.textContent = `${avgPing} ms`;
  }

  // VIEW MODE SETTER
  function setViewMode(mode) {
    appState.viewMode = mode;
    localStorage.setItem('sh_view_mode', mode);
    DOM.viewGridBtn.classList.toggle('active', mode === 'grid');
    DOM.viewListBtn.classList.toggle('active', mode === 'list');
    renderSubdomains();
  }

  // ROOT DOMAIN MODAL HANDLERS
  function openDomainModal() {
    DOM.domainConfigInput.value = appState.rootDomain;
    DOM.domainConfigModal.classList.add('active');
    appState.activeModal = DOM.domainConfigModal;
    setTimeout(() => DOM.domainConfigInput.focus(), 100);
  }

  function closeDomainModal() {
    DOM.domainConfigModal.classList.remove('active');
    appState.activeModal = null;
  }

  function saveRootDomain() {
    const val = DOM.domainConfigInput.value.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    if (!val) return alert('Please enter a valid domain name');
    appState.rootDomain = val;
    localStorage.setItem('sh_root_domain', val);
    updateDomainDisplay();
    renderSubdomains();
    closeDomainModal();
    showToast(`Root domain updated to: ${val}`);
  }

  // SUBDOMAIN ADD / EDIT MODAL
  function openSubdomainModal(subdomainToEdit = null) {
    appState.editingSubdomainId = subdomainToEdit ? subdomainToEdit.id : null;
    DOM.modalTitleText.textContent = subdomainToEdit ? 'Edit Subdomain' : 'Add New Subdomain';

    if (subdomainToEdit) {
      DOM.subFormName.value = subdomainToEdit.name;
      DOM.subFormPrefix.value = subdomainToEdit.subdomain;
      DOM.subFormCategory.value = subdomainToEdit.category;
      DOM.subFormStatus.value = subdomainToEdit.status;
      DOM.subFormIcon.value = subdomainToEdit.icon || 'grid';
      DOM.subFormDesc.value = subdomainToEdit.description;
      DOM.subFormTech.value = (subdomainToEdit.techStack || []).join(', ');
    } else {
      DOM.subdomainForm.reset();
    }

    DOM.subdomainModal.classList.add('active');
    appState.activeModal = DOM.subdomainModal;
    setTimeout(() => DOM.subFormName.focus(), 100);
  }

  function closeSubdomainModal() {
    DOM.subdomainModal.classList.remove('active');
    appState.activeModal = null;
    appState.editingSubdomainId = null;
  }

  function handleSubdomainFormSubmit(e) {
    e.preventDefault();

    const name = DOM.subFormName.value.trim();
    const prefix = DOM.subFormPrefix.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    const category = DOM.subFormCategory.value;
    const status = DOM.subFormStatus.value;
    const icon = DOM.subFormIcon.value;
    const description = DOM.subFormDesc.value.trim();
    const techStack = DOM.subFormTech.value.split(',').map(t => t.trim()).filter(Boolean);

    if (!name || !prefix || !description) {
      return alert('Please complete all required fields.');
    }

    if (appState.editingSubdomainId) {
      const sub = appState.subdomains.find(s => s.id === appState.editingSubdomainId);
      if (sub) {
        sub.name = name;
        sub.subdomain = prefix;
        sub.category = category;
        sub.status = status;
        sub.icon = icon;
        sub.description = description;
        sub.techStack = techStack;
      }
      showToast(`Updated "${name}"`);
    } else {
      const newSub = {
        id: 'sub-' + Date.now(),
        name,
        subdomain: prefix,
        category,
        status,
        description,
        techStack,
        icon,
        pingMs: Math.floor(Math.random() * 30) + 10,
        isPinned: false,
        lastCheck: 'Just now',
        endpoints: [`/${prefix}/v1`, `/${prefix}/health`]
      };
      appState.subdomains.unshift(newSub);
      showToast(`Added new subdomain "${name}"`);
    }

    saveSubdomainsToStorage();
    renderCategories();
    renderSubdomains();
    closeSubdomainModal();
  }

  // DETAILS & INSPECTION MODAL
  function openDetailsModal(sub) {
    const fullUrl = getFullUrl(sub.subdomain);
    const iconSVG = SVG_ICONS[sub.icon] || SVG_ICONS['grid'];
    const formattedDesc = formatDescriptionWithLinks(sub.description);

    DOM.detailsContainer.innerHTML = `
      <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem;">
        <div class="card-icon" style="width: 58px; height: 58px; font-size: 1.8rem; color: ${sub.colorAccent || 'var(--accent-secondary)'};">
          ${iconSVG}
        </div>
        <div>
          <h2 style="font-size: 1.4rem; font-weight: 800;">${escapeHTML(sub.name)}</h2>
          <a href="${fullUrl}" target="_blank" rel="noopener noreferrer" class="card-subdomain-url" style="font-size: 0.95rem;">
            ${fullUrl} ${SVG_ICONS.externalLink}
          </a>
        </div>
      </div>

      <div style="background: var(--bg-tertiary); padding: 1.15rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 1.25rem;">
        <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700; margin-bottom: 0.4rem;">Service & Project Description</div>
        <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6;">${formattedDesc}</p>
      </div>

      ${sub.githubUrl ? `
        <div style="margin-bottom: 1.25rem;">
          <a href="${sub.githubUrl}" target="_blank" rel="noopener noreferrer" class="github-repo-badge" style="width: 100%; justify-content: center; padding: 0.75rem; font-size: 0.9rem;">
            ${SVG_ICONS.github} <span>View GitHub Repository: ${sub.githubUrl}</span> ${SVG_ICONS.externalLink}
          </a>
        </div>
      ` : ''}

      <div class="form-row" style="margin-bottom: 1.25rem;">
        <div style="background: var(--bg-tertiary); padding: 0.9rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <div style="font-size: 0.78rem; color: var(--text-muted);">Status</div>
          <div style="margin-top: 0.25rem; font-weight: 700;" class="status-badge ${sub.status}">
            <span class="status-dot"></span> ${sub.status.toUpperCase()}
          </div>
        </div>
        <div style="background: var(--bg-tertiary); padding: 0.9rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <div style="font-size: 0.78rem; color: var(--text-muted);">Latency Check</div>
          <div style="margin-top: 0.25rem; font-weight: 700; font-family: var(--font-mono); color: var(--status-online);">
            ${sub.pingMs} ms (Active)
          </div>
        </div>
      </div>

      <div style="margin-bottom: 1.25rem;">
        <div style="font-size: 0.85rem; font-weight: 700; margin-bottom: 0.5rem;">Tech Stack & Badges</div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          ${(sub.techStack || []).map(t => `<span class="tech-tag" style="font-size: 0.82rem; padding: 0.3rem 0.7rem;">${escapeHTML(t)}</span>`).join('')}
        </div>
      </div>

      <div>
        <div style="font-size: 0.85rem; font-weight: 700; margin-bottom: 0.5rem;">Available Endpoints / Routes</div>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.45rem;">
          ${(sub.endpoints || ['/']).map(ep => `
            <li style="font-family: var(--font-mono); font-size: 0.85rem; background: var(--bg-primary); padding: 0.55rem 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); color: var(--accent-secondary); display: flex; justify-content: space-between; align-items: center;">
              <span>${escapeHTML(ep)}</span>
              <span style="font-size: 0.75rem; color: var(--text-muted);">GET / POST</span>
            </li>
          `).join('')}
        </ul>
      </div>
    `;

    DOM.detailsModal.classList.add('active');
    appState.activeModal = DOM.detailsModal;
  }

  function closeDetailsModal() {
    DOM.detailsModal.classList.remove('active');
    appState.activeModal = null;
  }

  // COMMAND PALETTE OVERLAY
  function openCmdPalette() {
    DOM.cmdInput.value = '';
    renderCmdItems('');
    DOM.cmdPaletteModal.classList.add('active');
    appState.activeModal = DOM.cmdPaletteModal;
    setTimeout(() => DOM.cmdInput.focus(), 100);

    DOM.cmdInput.oninput = (e) => {
      renderCmdItems(e.target.value.toLowerCase().trim());
    };
  }

  function renderCmdItems(query) {
    const commands = [
      { name: 'Add New Subdomain', action: () => { closeAllModals(); openSubdomainModal(); }, badge: 'Action' },
      { name: 'Configure Root Domain', action: () => { closeAllModals(); openDomainModal(); }, badge: 'Settings' },
      { name: 'Toggle Light/Dark Theme', action: () => { closeAllModals(); DOM.themeToggleBtn.click(); }, badge: 'Theme' },
      { name: 'Export Config JSON', action: () => { exportConfiguration(); closeAllModals(); }, badge: 'Export' },
      { name: 'Reset to Presets', action: () => { resetToDefaults(); closeAllModals(); }, badge: 'Reset' }
    ];

    const matchingSubdomains = appState.subdomains.filter(s =>
      s.name.toLowerCase().includes(query) || s.subdomain.toLowerCase().includes(query)
    ).map(s => ({
      name: `Launch ${s.name} (${s.subdomain}.${appState.rootDomain})`,
      action: () => { window.open(getFullUrl(s.subdomain), '_blank'); closeAllModals(); },
      badge: 'Subdomain'
    }));

    const allItems = [...commands, ...matchingSubdomains].filter(item =>
      !query || item.name.toLowerCase().includes(query)
    );

    DOM.cmdList.innerHTML = allItems.map((item, idx) => `
      <div class="cmd-item ${idx === 0 ? 'selected' : ''}" data-idx="${idx}">
        <div class="cmd-item-left">
          <span>${escapeHTML(item.name)}</span>
        </div>
        <span class="cmd-badge">${item.badge}</span>
      </div>
    `).join('');

    DOM.cmdList.querySelectorAll('.cmd-item').forEach((el, idx) => {
      el.addEventListener('click', () => {
        allItems[idx].action();
      });
    });
  }

  function saveSubdomainsToStorage() {
    localStorage.setItem('sh_subdomains', JSON.stringify(appState.subdomains));
  }

  function exportConfiguration() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      rootDomain: appState.rootDomain,
      subdomains: appState.subdomains
    }, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `${appState.rootDomain}-subdomains-config.json`);
    document.body.appendChild(dlAnchorElem);
    dlAnchorElem.click();
    dlAnchorElem.remove();
    showToast('Configuration exported as JSON!');
  }

  function importConfiguration(e) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.rootDomain) {
          appState.rootDomain = parsed.rootDomain;
          localStorage.setItem('sh_root_domain', parsed.rootDomain);
        }
        if (Array.isArray(parsed.subdomains)) {
          appState.subdomains = parsed.subdomains;
          saveSubdomainsToStorage();
        }
        updateDomainDisplay();
        renderCategories();
        renderSubdomains();
        showToast('Successfully imported subdomain setup!');
      } catch (err) {
        alert('Invalid JSON configuration file.');
      }
    };
    if (e.target.files[0]) {
      fileReader.readAsText(e.target.files[0]);
    }
  }

  function resetToDefaults() {
    if (confirm('Reset all subdomains and root domain settings back to default presets?')) {
      appState.rootDomain = 'aayushbabu.live';
      appState.subdomains = [...DEFAULT_SUBDOMAINS];
      localStorage.removeItem('sh_root_domain');
      localStorage.removeItem('sh_subdomains');
      updateDomainDisplay();
      renderCategories();
      renderSubdomains();
      showToast('Reset back to default presets.');
    }
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    appState.activeModal = null;
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `${SVG_ICONS.sparkles} <span>${escapeHTML(message)}</span>`;
    DOM.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  function escapeHTML(str) {
    return String(str || '').replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
