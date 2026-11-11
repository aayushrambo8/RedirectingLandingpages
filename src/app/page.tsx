'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { ControlsToolbar } from '@/components/ControlsToolbar';
import { SubdomainCard } from '@/components/SubdomainCard';
import { SubdomainListView } from '@/components/SubdomainListView';
import { CommandPalette } from '@/components/CommandPalette';
import { AddEditSubdomainModal } from '@/components/AddEditSubdomainModal';
import { DomainConfigModal } from '@/components/DomainConfigModal';
import { EndpointsModal } from '@/components/EndpointsModal';
import { ConfigManagerModal } from '@/components/ConfigManagerModal';
import { Toast } from '@/components/Toast';
import { Footer } from '@/components/Footer';
import { DEFAULT_SUBDOMAINS, DEFAULT_ROOT_DOMAIN } from '@/data/defaultSubdomains';
import { SubdomainItem, ViewMode, SortOption } from '@/types/subdomain';
import { SearchX, Plus } from 'lucide-react';

export default function SubdomainHubPage() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [rootDomain, setRootDomain] = useState<string>(DEFAULT_ROOT_DOMAIN);
  const [subdomains, setSubdomains] = useState<SubdomainItem[]>(DEFAULT_SUBDOMAINS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Modals
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SubdomainItem | null>(null);
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [endpointsModalItem, setEndpointsModalItem] = useState<SubdomainItem | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  // Initialize from LocalStorage
  useEffect(() => {
    setMounted(true);
    try {
      const storedTheme = localStorage.getItem('sh_theme') as 'dark' | 'light' | null;
      if (storedTheme) {
        setTheme(storedTheme);
        document.documentElement.classList.toggle('dark', storedTheme === 'dark');
      } else {
        document.documentElement.classList.add('dark');
      }

      const storedDomain = localStorage.getItem('sh_root_domain');
      if (storedDomain) setRootDomain(storedDomain);

      const storedList = localStorage.getItem('sh_subdomains');
      if (storedList) {
        const parsed = JSON.parse(storedList);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSubdomains(parsed);
        }
      }

      const storedViewMode = localStorage.getItem('sh_view_mode') as ViewMode | null;
      if (storedViewMode) setViewMode(storedViewMode);
    } catch (e) {
      console.error('Failed to load local storage state:', e);
    }
  }, []);

  // Sync subdomains to localStorage
  const updateSubdomains = (newList: SubdomainItem[]) => {
    setSubdomains(newList);
    try {
      localStorage.setItem('sh_subdomains', JSON.stringify(newList));
    } catch (e) {
      console.error('Failed to save subdomains:', e);
    }
  };

  // Theme toggle
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    try {
      localStorage.setItem('sh_theme', nextTheme);
    } catch {}
    showToast(`Switched to ${nextTheme} mode`);
  };

  // Base domain save
  const handleSaveDomain = (newDomain: string) => {
    setRootDomain(newDomain);
    try {
      localStorage.setItem('sh_root_domain', newDomain);
    } catch {}
    showToast(`Base domain set to ${newDomain}`);
  };

  // View mode save
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('sh_view_mode', mode);
    } catch {}
  };

  // Pin toggle
  const handleTogglePin = (id: string) => {
    const next = subdomains.map((item) =>
      item.id === id ? { ...item, isPinned: !item.isPinned } : item
    );
    updateSubdomains(next);
  };

  // Delete
  const handleDelete = (id: string) => {
    const target = subdomains.find((s) => s.id === id);
    if (!target) return;
    if (confirm(`Remove "${target.name}" from your subdomains directory?`)) {
      const next = subdomains.filter((s) => s.id !== id);
      updateSubdomains(next);
      showToast(`Removed "${target.name}"`);
    }
  };

  // Save add/edit
  const handleSaveItem = (item: SubdomainItem) => {
    const existingIndex = subdomains.findIndex((s) => s.id === item.id);
    let next: SubdomainItem[];
    if (existingIndex >= 0) {
      next = [...subdomains];
      next[existingIndex] = item;
      showToast(`Updated "${item.name}"`);
    } else {
      next = [item, ...subdomains];
      showToast(`Added "${item.name}"`);
    }
    updateSubdomains(next);
  };

  // Import config
  const handleImportConfig = (imported: SubdomainItem[]) => {
    updateSubdomains(imported);
  };

  // Reset defaults
  const handleResetDefaults = () => {
    updateSubdomains(DEFAULT_SUBDOMAINS);
    setRootDomain(DEFAULT_ROOT_DOMAIN);
    try {
      localStorage.setItem('sh_root_domain', DEFAULT_ROOT_DOMAIN);
      localStorage.setItem('sh_subdomains', JSON.stringify(DEFAULT_SUBDOMAINS));
    } catch {}
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA' &&
        !isCommandPaletteOpen &&
        !isAddModalOpen &&
        !isDomainModalOpen &&
        !isConfigModalOpen &&
        !endpointsModalItem
      ) {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>('input[type="text"]');
        searchInput?.focus();
      } else if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsAddModalOpen(false);
        setEditingItem(null);
        setIsDomainModalOpen(false);
        setIsConfigModalOpen(false);
        setEndpointsModalItem(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isCommandPaletteOpen,
    isAddModalOpen,
    isDomainModalOpen,
    isConfigModalOpen,
    endpointsModalItem,
  ]);

  // Categories list with counts
  const categoriesWithCounts = useMemo(() => {
    const counts: Record<string, number> = { All: subdomains.length };
    subdomains.forEach((s) => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });

    const categoryList = Object.keys(counts)
      .filter((c) => c !== 'All')
      .sort();

    return [
      { name: 'All', count: subdomains.length },
      ...categoryList.map((name) => ({ name, count: counts[name] })),
    ];
  }, [subdomains]);

  // Filtered and Sorted subdomains
  const filteredSubdomains = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    let list = subdomains.filter((item) => {
      const matchesCategory =
        activeCategory === 'All' ||
        item.category.toLowerCase() === activeCategory.toLowerCase();

      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.subdomain.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.techStack.some((t) => t.toLowerCase().includes(q)) ||
        (item.endpoints && item.endpoints.some((ep) => ep.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });

    // Sorting
    list = [...list].sort((a, b) => {
      if (sortOption === 'ping-asc') {
        return (a.pingMs || 999) - (b.pingMs || 999);
      }
      if (sortOption === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortOption === 'name-desc') {
        return b.name.localeCompare(a.name);
      }
      if (sortOption === 'category') {
        return a.category.localeCompare(b.category);
      }
      // default: pinned first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

    return list;
  }, [subdomains, searchQuery, activeCategory, sortOption]);

  const onlineCount = subdomains.filter((s) => s.status === 'online').length;
  const avgLatency = Math.round(
    subdomains.reduce((acc, curr) => acc + (curr.pingMs || 14), 0) /
      (subdomains.length || 1)
  );

  return (
    <div className="min-h-screen ambient-grid flex flex-col justify-between selection:bg-emerald-500/20 selection:text-emerald-500">
      <div>
        {/* Navbar */}
        <Navbar
          rootDomain={rootDomain}
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenAddModal={() => {
            setEditingItem(null);
            setIsAddModalOpen(true);
          }}
          onOpenConfigModal={() => setIsConfigModalOpen(true)}
          onOpenDomainModal={() => setIsDomainModalOpen(true)}
          totalSubdomains={subdomains.length}
        />

        {/* Hero */}
        <Hero
          rootDomain={rootDomain}
          totalSubdomains={subdomains.length}
          onlineCount={onlineCount}
          avgLatency={avgLatency}
          onOpenDomainModal={() => setIsDomainModalOpen(true)}
          onShowToast={showToast}
        />

        {/* Controls Bar */}
        <ControlsToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categories={categoriesWithCounts}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          sortOption={sortOption}
          onSortChange={setSortOption}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          totalFilteredCount={filteredSubdomains.length}
        />

        {/* Subdomains Showcase Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {filteredSubdomains.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredSubdomains.map((item) => (
                  <SubdomainCard
                    key={item.id}
                    item={item}
                    rootDomain={rootDomain}
                    onTogglePin={handleTogglePin}
                    onEdit={(itm) => {
                      setEditingItem(itm);
                      setIsAddModalOpen(true);
                    }}
                    onDelete={handleDelete}
                    onViewEndpoints={(itm) => setEndpointsModalItem(itm)}
                    onShowToast={showToast}
                  />
                ))}
              </div>
            ) : (
              <SubdomainListView
                items={filteredSubdomains}
                rootDomain={rootDomain}
                onTogglePin={handleTogglePin}
                onEdit={(itm) => {
                  setEditingItem(itm);
                  setIsAddModalOpen(true);
                }}
                onDelete={handleDelete}
                onViewEndpoints={(itm) => setEndpointsModalItem(itm)}
                onShowToast={showToast}
              />
            )
          ) : (
            /* Empty State */
            <div className="py-16 text-center space-y-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/30">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <SearchX className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  No matching subdomains found
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try clearing your search query or switching categories. You can also add a new custom subdomain.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('All');
                  }}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setIsAddModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Subdomain</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer rootDomain={rootDomain} />

      {/* Modals & Dialogs */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        subdomains={subdomains}
        rootDomain={rootDomain}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenAddModal={() => {
          setEditingItem(null);
          setIsAddModalOpen(true);
        }}
        onOpenDomainModal={() => setIsDomainModalOpen(true)}
        onOpenConfigModal={() => setIsConfigModalOpen(true)}
        onShowToast={showToast}
      />

      <AddEditSubdomainModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        editingItem={editingItem}
        rootDomain={rootDomain}
      />

      <DomainConfigModal
        isOpen={isDomainModalOpen}
        onClose={() => setIsDomainModalOpen(false)}
        rootDomain={rootDomain}
        onSaveDomain={handleSaveDomain}
      />

      <EndpointsModal
        item={endpointsModalItem}
        onClose={() => setEndpointsModalItem(null)}
        rootDomain={rootDomain}
        onShowToast={showToast}
      />

      <ConfigManagerModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        subdomains={subdomains}
        rootDomain={rootDomain}
        onImportConfig={handleImportConfig}
        onResetDefaults={handleResetDefaults}
        onShowToast={showToast}
      />

      {/* Floating Toast */}
      <Toast message={toastMessage} />
    </div>
  );
}
