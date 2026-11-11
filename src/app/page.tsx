'use client';

import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Navbar} from '@/components/Navbar';
import {Footer} from '@/components/Footer';
import {DEFAULT_ROOT_DOMAIN, DEFAULT_SUBDOMAINS} from '@/data/defaultSubdomains';
import {SortOption, SubdomainItem, SubdomainStatus, ViewMode} from '@/types/subdomain';
import {
    AlertTriangle,
    Check,
    CheckCircle2,
    Copy,
    Download,
    Edit2,
    ExternalLink,
    FileDown,
    FileJson,
    Globe,
    Layers,
    Moon,
    MoreVertical,
    Pin,
    Plus,
    RotateCcw,
    Search,
    SearchX,
    Sun,
    Terminal,
    Trash2,
    Upload,
    X,
} from 'lucide-react';

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

    // Card dropdown & copy states
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [copiedUrlId, setCopiedUrlId] = useState<string | null>(null);
    const [heroCopied, setHeroCopied] = useState(false);

    // Toast feedback
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        } catch {
        }
        showToast(`Switched to ${nextTheme} mode`);
    };

    // Base domain save
    const handleSaveDomain = (newDomain: string) => {
        setRootDomain(newDomain);
        try {
            localStorage.setItem('sh_root_domain', newDomain);
        } catch {
        }
        showToast(`Base domain set to ${newDomain}`);
    };

    // View mode save
    const handleViewModeChange = (mode: ViewMode) => {
        setViewMode(mode);
        try {
            localStorage.setItem('sh_view_mode', mode);
        } catch {
        }
    };

    // Pin toggle
    const handleTogglePin = (id: string) => {
        const next = subdomains.map((item) =>
            item.id === id ? {...item, isPinned: !item.isPinned} : item
        );
        updateSubdomains(next);
    };

    // Delete item
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

    // Copy URL helper
    const handleCopyUrl = async (url: string, id: string) => {
        try {
            await navigator.clipboard.writeText(url);
            setCopiedUrlId(id);
            showToast(`Copied ${url}`);
            setTimeout(() => setCopiedUrlId(null), 2000);
        } catch {
            showToast(url);
        }
    };

    const handleCopyHeroDomain = async () => {
        try {
            await navigator.clipboard.writeText(`https://${rootDomain}`);
            setHeroCopied(true);
            showToast(`Copied https://${rootDomain} to clipboard!`);
            setTimeout(() => setHeroCopied(false), 2000);
        } catch {
            showToast(`Domain: ${rootDomain}`);
        }
    };

    // Keyboard Shortcuts
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
                setActiveMenuId(null);
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
        const counts: Record<string, number> = {All: subdomains.length};
        subdomains.forEach((s) => {
            counts[s.category] = (counts[s.category] || 0) + 1;
        });

        const categoryList = Object.keys(counts)
            .filter((c) => c !== 'All')
            .sort();

        return [
            {name: 'All', count: subdomains.length},
            ...categoryList.map((name) => ({name, count: counts[name]})),
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

    const getCategoryStyles = (category: string) => {
        switch (category.toLowerCase()) {
            case 'security':
                return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20';
            case 'showcase':
                return 'bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20';
            case 'games':
                return 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20';
            default:
                return 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20';
        }
    };

    return (
        <div
            className="min-h-screen ambient-grid flex flex-col justify-between selection:bg-emerald-500/20 selection:text-emerald-500">
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

                {/* Hero Section */}
                <section className="relative pt-10 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div
                        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full"/>
                    <div
                        className="absolute top-1/3 right-1/4 w-80 h-80 bg-sky-500/5 dark:bg-sky-500/10 blur-[100px] pointer-events-none rounded-full"/>

                    <div className="relative text-center max-w-3xl mx-auto space-y-4">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            Subdomain Hub &{' '}
                            <span
                                className="bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-600 dark:from-emerald-400 dark:via-teal-300 dark:to-sky-400 bg-clip-text text-transparent">
                Project Gateway
              </span>
                        </h1>

                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
                            Centralized directory and launcher for security vulnerability search portals, media
                            showcases, and interactive web applications hosted under{' '}
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{rootDomain}</span>.
                        </p>
                    </div>
                </section>

                {/* Main Content Showcase */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    {filteredSubdomains.length > 0 ? (
                        viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {filteredSubdomains.map((item) => {
                                    const fullUrl = item.customUrl || `https://${item.subdomain}.${rootDomain}`;
                                    const displayUrl = `${item.subdomain}.${rootDomain}`;
                                    const isCopied = copiedUrlId === item.id;
                                    const isMenuOpen = activeMenuId === item.id;

                                    return (
                                        <article
                                            key={item.id}
                                            className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700/90 hover:shadow-lg dark:hover:shadow-emerald-950/20 backdrop-blur-sm transition-all duration-200 overflow-hidden p-5 sm:p-6"
                                        >
                                            <div>
                                                <div className="flex items-center justify-between gap-2 mb-3">
                                                    <div className="flex items-center gap-2">
                            <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-medium border ${getCategoryStyles(
                                    item.category
                                )}`}
                            >
                              {item.category.toUpperCase()}
                            </span>

                                                        <span
                                                            className="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60">
                              <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                      item.status === 'online'
                                          ? 'bg-emerald-500 animate-pulse'
                                          : 'bg-amber-500'
                                  }`}
                              />
                              <span>{item.pingMs ? `${item.pingMs}ms` : 'active'}</span>
                            </span>
                                                    </div>

                                                    <div className="relative flex items-center gap-1">
                                                        <button
                                                            onClick={() => handleTogglePin(item.id)}
                                                            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                                                                item.isPinned
                                                                    ? 'text-amber-500 bg-amber-500/10'
                                                                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                                            }`}
                                                            title={item.isPinned ? 'Unpin subdomain' : 'Pin subdomain'}
                                                        >
                                                            <Pin className="w-3.5 h-3.5"/>
                                                        </button>

                                                        <button
                                                            onClick={() => setActiveMenuId(isMenuOpen ? null : item.id)}
                                                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                                            title="More options"
                                                        >
                                                            <MoreVertical className="w-3.5 h-3.5"/>
                                                        </button>

                                                        {isMenuOpen && (
                                                            <>
                                                                <div
                                                                    className="fixed inset-0 z-30"
                                                                    onClick={() => setActiveMenuId(null)}
                                                                />
                                                                <div
                                                                    className="absolute right-0 top-8 z-40 w-40 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl py-1 text-xs text-slate-700 dark:text-slate-200 animate-in fade-in zoom-in-95">
                                                                    <button
                                                                        onClick={() => {
                                                                            handleCopyUrl(fullUrl, item.id);
                                                                            setActiveMenuId(null);
                                                                        }}
                                                                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition-colors cursor-pointer"
                                                                    >
                                                                        <Copy className="w-3.5 h-3.5 text-slate-400"/>
                                                                        <span>Copy URL</span>
                                                                    </button>

                                                                    {item.endpoints && item.endpoints.length > 0 && (
                                                                        <button
                                                                            onClick={() => {
                                                                                setActiveMenuId(null);
                                                                                setEndpointsModalItem(item);
                                                                            }}
                                                                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition-colors cursor-pointer"
                                                                        >
                                                                            <Layers
                                                                                className="w-3.5 h-3.5 text-slate-400"/>
                                                                            <span>Endpoints ({item.endpoints.length})</span>
                                                                        </button>
                                                                    )}

                                                                    <button
                                                                        onClick={() => {
                                                                            setActiveMenuId(null);
                                                                            setEditingItem(item);
                                                                            setIsAddModalOpen(true);
                                                                        }}
                                                                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition-colors cursor-pointer"
                                                                    >
                                                                        <Edit2 className="w-3.5 h-3.5 text-slate-400"/>
                                                                        <span>Edit</span>
                                                                    </button>

                                                                    <div
                                                                        className="my-1 border-t border-slate-100 dark:border-slate-700"/>

                                                                    <button
                                                                        onClick={() => {
                                                                            setActiveMenuId(null);
                                                                            handleDelete(item.id);
                                                                        }}
                                                                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 text-left transition-colors cursor-pointer"
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5"/>
                                                                        <span>Delete</span>
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-1 mb-2.5">
                                                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                        {item.name}
                                                    </h2>

                                                    <div className="flex items-center gap-2">
                                                        <a
                                                            href={fullUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline"
                                                        >
                                                            <span>{displayUrl}</span>
                                                            <ExternalLink className="w-3 h-3"/>
                                                        </a>

                                                        <button
                                                            onClick={() => handleCopyUrl(fullUrl, item.id)}
                                                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                                            title="Copy URL"
                                                        >
                                                            {isCopied ? (
                                                                <Check className="w-3 h-3 text-emerald-500"/>
                                                            ) : (
                                                                <Copy className="w-3 h-3"/>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>

                                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3">
                                                    {item.description}
                                                </p>

                                                <div className="flex flex-wrap gap-1.5 mb-4">
                                                    {item.techStack.map((tech) => (
                                                        <span
                                                            key={tech}
                                                            className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                                                        >
                              {tech}
                            </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div
                                                className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-1.5">
                                                    {item.githubUrl ? (
                                                        <a
                                                            href={item.githubUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                                                            title="View GitHub Repository"
                                                        >
                                                            <svg viewBox="0 0 24 24" fill="currentColor"
                                                                 className="w-3.5 h-3.5" aria-hidden="true">
                                                                <path fillRule="evenodd" clipRule="evenodd"
                                                                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                                                            </svg>
                                                            <span className="hidden sm:inline">Repo</span>
                                                        </a>
                                                    ) : null}

                                                    {item.endpoints && item.endpoints.length > 0 && (
                                                        <button
                                                            onClick={() => setEndpointsModalItem(item)}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs transition-colors cursor-pointer"
                                                            title="View Endpoints"
                                                        >
                                                            <Layers className="w-3 h-3 text-slate-400"/>
                                                            <span
                                                                className="font-mono text-[11px]">{item.endpoints.length} routes</span>
                                                        </button>
                                                    )}
                                                </div>

                                                <a
                                                    href={fullUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs hover:shadow transition-all group-hover:scale-[1.01]"
                                                >
                                                    <span>Launch</span>
                                                    <ExternalLink className="w-3.5 h-3.5"/>
                                                </a>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        ) : (
                            /* Compact Table / List View */
                            <div
                                className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-xs">
                                        <thead>
                                        <tr className="border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                                            <th className="py-3 px-4 w-10">Pin</th>
                                            <th className="py-3 px-4">Subdomain & Service</th>
                                            <th className="py-3 px-4">Category</th>
                                            <th className="py-3 px-4">Status / Latency</th>
                                            <th className="py-3 px-4 hidden md:table-cell">Stack</th>
                                            <th className="py-3 px-4 text-right">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                        {filteredSubdomains.map((item) => {
                                            const fullUrl = item.customUrl || `https://${item.subdomain}.${rootDomain}`;
                                            const isCopied = copiedUrlId === item.id;

                                            return (
                                                <tr
                                                    key={item.id}
                                                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                                                >
                                                    <td className="py-3 px-4">
                                                        <button
                                                            onClick={() => handleTogglePin(item.id)}
                                                            className={`p-1 rounded cursor-pointer transition-colors ${
                                                                item.isPinned
                                                                    ? 'text-amber-500'
                                                                    : 'text-slate-300 dark:text-slate-600 hover:text-slate-500'
                                                            }`}
                                                            title={item.isPinned ? 'Unpin' : 'Pin'}
                                                        >
                                                            <Pin className="w-3.5 h-3.5"/>
                                                        </button>
                                                    </td>

                                                    <td className="py-3 px-4">
                                                        <div className="font-semibold text-slate-900 dark:text-white">
                                                            {item.name}
                                                        </div>
                                                        <div
                                                            className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                                                            <span>{item.subdomain}.{rootDomain}</span>
                                                            <button
                                                                onClick={() => handleCopyUrl(fullUrl, item.id)}
                                                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                                                title="Copy URL"
                                                            >
                                                                {isCopied ? (
                                                                    <Check className="w-3 h-3 text-emerald-500"/>
                                                                ) : (
                                                                    <Copy className="w-3 h-3"/>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </td>

                                                    <td className="py-3 px-4">
                              <span
                                  className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                {item.category}
                              </span>
                                                    </td>

                                                    <td className="py-3 px-4">
                                                        <div
                                                            className="flex items-center gap-1.5 font-mono text-[11px]">
                                                            <span
                                                                className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>
                                                            <span className="text-slate-700 dark:text-slate-300">
                                  {item.status}
                                </span>
                                                            {item.pingMs && (
                                                                <span
                                                                    className="text-slate-400">({item.pingMs}ms)</span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td className="py-3 px-4 hidden md:table-cell">
                                                        <div className="flex flex-wrap gap-1 max-w-xs">
                                                            {item.techStack.slice(0, 3).map((t) => (
                                                                <span
                                                                    key={t}
                                                                    className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                                                                >
                                    {t}
                                  </span>
                                                            ))}
                                                            {item.techStack.length > 3 && (
                                                                <span className="text-[10px] font-mono text-slate-400">
                                    +{item.techStack.length - 3}
                                  </span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td className="py-3 px-4 text-right">
                                                        <div className="inline-flex items-center gap-1.5">
                                                            {item.endpoints && item.endpoints.length > 0 && (
                                                                <button
                                                                    onClick={() => setEndpointsModalItem(item)}
                                                                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                                    title="View Endpoints"
                                                                >
                                                                    <Layers className="w-3.5 h-3.5"/>
                                                                </button>
                                                            )}

                                                            {item.githubUrl && (
                                                                <a
                                                                    href={item.githubUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                                    title="GitHub Repository"
                                                                >
                                                                    <svg viewBox="0 0 24 24" fill="currentColor"
                                                                         className="w-3.5 h-3.5" aria-hidden="true">
                                                                        <path fillRule="evenodd" clipRule="evenodd"
                                                                              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                                                                    </svg>
                                                                </a>
                                                            )}

                                                            <button
                                                                onClick={() => {
                                                                    setEditingItem(item);
                                                                    setIsAddModalOpen(true);
                                                                }}
                                                                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                                title="Edit"
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5"/>
                                                            </button>

                                                            <button
                                                                onClick={() => handleDelete(item.id)}
                                                                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5"/>
                                                            </button>

                                                            <a
                                                                href={fullUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
                                                            >
                                                                <span>Open</span>
                                                                <ExternalLink className="w-3 h-3"/>
                                                            </a>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )
                    ) : (
                        <div
                            className="py-16 text-center space-y-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/30">
                            <div
                                className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                <SearchX className="w-6 h-6"/>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                                    No matching subdomains found
                                </h3>
                                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                    Try clearing your search query or switching categories. You can also add a new
                                    custom subdomain.
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
                                    <Plus className="w-3.5 h-3.5"/>
                                    <span>Add Subdomain</span>
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Footer */}
            <Footer rootDomain={rootDomain}/>

            {/* INLINE MODALS */}

            {/* 1. Command Palette Modal */}
            {isCommandPaletteOpen && (
                <CommandPaletteModal
                    onClose={() => setIsCommandPaletteOpen(false)}
                    subdomains={subdomains}
                    rootDomain={rootDomain}
                    theme={theme}
                    onToggleTheme={toggleTheme}
                    onOpenAdd={() => {
                        setIsCommandPaletteOpen(false);
                        setEditingItem(null);
                        setIsAddModalOpen(true);
                    }}
                    onOpenDomain={() => {
                        setIsCommandPaletteOpen(false);
                        setIsDomainModalOpen(true);
                    }}
                    onOpenConfig={() => {
                        setIsCommandPaletteOpen(false);
                        setIsConfigModalOpen(true);
                    }}
                    onShowToast={showToast}
                />
            )}

            {/* 2. Add / Edit Subdomain Modal */}
            {isAddModalOpen && (
                <AddEditModal
                    onClose={() => {
                        setIsAddModalOpen(false);
                        setEditingItem(null);
                    }}
                    onSave={handleSaveItem}
                    editingItem={editingItem}
                    rootDomain={rootDomain}
                />
            )}

            {/* 3. Base Domain Config Modal */}
            {isDomainModalOpen && (
                <DomainModal
                    rootDomain={rootDomain}
                    onClose={() => setIsDomainModalOpen(false)}
                    onSaveDomain={handleSaveDomain}
                />
            )}

            {/* 4. Endpoints Inspector Modal */}
            {endpointsModalItem && (
                <EndpointsViewModal
                    item={endpointsModalItem}
                    rootDomain={rootDomain}
                    onClose={() => setEndpointsModalItem(null)}
                    onShowToast={showToast}
                />
            )}

            {/* 5. Data & Config Backup Modal */}
            {isConfigModalOpen && (
                <ConfigBackupModal
                    subdomains={subdomains}
                    rootDomain={rootDomain}
                    onClose={() => setIsConfigModalOpen(false)}
                    onImport={(items) => updateSubdomains(items)}
                    onReset={() => {
                        updateSubdomains(DEFAULT_SUBDOMAINS);
                        setRootDomain(DEFAULT_ROOT_DOMAIN);
                        showToast('Reset to original default configuration.');
                        setIsConfigModalOpen(false);
                    }}
                    onShowToast={showToast}
                />
            )}

            {/* 6. Floating Toast */}
            {toastMessage && (
                <div
                    className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 text-slate-900 dark:text-white shadow-xl backdrop-blur-md text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0"/>
                    <span>{toastMessage}</span>
                </div>
            )}
        </div>
    );
}

// ==========================================
// INLINE DIALOGS & OVERLAYS (Single Page Architecture)
// ==========================================

function CommandPaletteModal({
                                 onClose,
                                 subdomains,
                                 rootDomain,
                                 theme,
                                 onToggleTheme,
                                 onOpenAdd,
                                 onOpenDomain,
                                 onOpenConfig,
                                 onShowToast,
                             }: {
    onClose: () => void;
    subdomains: SubdomainItem[];
    rootDomain: string;
    theme: 'dark' | 'light';
    onToggleTheme: () => void;
    onOpenAdd: () => void;
    onOpenDomain: () => void;
    onOpenConfig: () => void;
    onShowToast: (msg: string) => void;
}) {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const q = query.toLowerCase().trim();

    const filteredSubs = subdomains.filter((s) => {
        if (!q) return true;
        return (
            s.name.toLowerCase().includes(q) ||
            s.subdomain.toLowerCase().includes(q) ||
            s.category.toLowerCase().includes(q) ||
            s.techStack.some((t) => t.toLowerCase().includes(q))
        );
    });

    const actions = [
        {
            id: 'act-add',
            name: 'Add New Subdomain',
            icon: Plus,
            category: 'Action',
            run: onOpenAdd,
        },
        {
            id: 'act-theme',
            name: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
            icon: theme === 'dark' ? Sun : Moon,
            category: 'Preferences',
            run: () => {
                onToggleTheme();
                onClose();
            },
        },
        {
            id: 'act-domain',
            name: 'Configure Root Domain',
            icon: Layers,
            category: 'Preferences',
            run: onOpenDomain,
        },
        {
            id: 'act-backup',
            name: 'Backup / Import Subdomains Config',
            icon: FileDown,
            category: 'Data',
            run: onOpenConfig,
        },
        {
            id: 'act-github',
            name: 'GitHub Profile (@aayushrambo8)',
            icon: Globe,
            category: 'External',
            run: () => {
                window.open('https://github.com/aayushrambo8', '_blank', 'noopener,noreferrer');
                onClose();
            },
        },
        {
            id: 'act-copy-root',
            name: `Copy Root Domain (https://${rootDomain})`,
            icon: Globe,
            category: 'Action',
            run: async () => {
                await navigator.clipboard.writeText(`https://${rootDomain}`);
                onShowToast(`Copied https://${rootDomain}`);
                onClose();
            },
        },
    ].filter((a) => {
        if (!q) return true;
        return a.name.toLowerCase().includes(q) || a.category.toLowerCase().includes(q);
    });

    const totalItems = filteredSubs.length + actions.length;

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev + 1) % (totalItems || 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev - 1 + (totalItems || 1)) % (totalItems || 1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex < filteredSubs.length) {
                const item = filteredSubs[selectedIndex];
                const url = item.customUrl || `https://${item.subdomain}.${rootDomain}`;
                window.open(url, '_blank', 'noopener,noreferrer');
                onClose();
            } else {
                const actionIndex = selectedIndex - filteredSubs.length;
                if (actions[actionIndex]) {
                    actions[actionIndex].run();
                }
            }
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
            onClick={onClose}
        >
            <div
                className="w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in zoom-in-95"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={handleKeyDown}
            >
                <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 gap-3">
                    <Search className="w-4 h-4 text-slate-400"/>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSelectedIndex(0);
                        }}
                        placeholder="Type a command or search subdomains..."
                        className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                    />
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                    >
                        <X className="w-4 h-4"/>
                    </button>
                </div>

                <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                    {filteredSubs.length > 0 && (
                        <div>
                            <div
                                className="px-3 py-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                                Subdomains & Services
                            </div>
                            {filteredSubs.map((item, idx) => {
                                const isSelected = selectedIndex === idx;
                                const fullUrl = item.customUrl || `https://${item.subdomain}.${rootDomain}`;

                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => {
                                            window.open(fullUrl, '_blank', 'noopener,noreferrer');
                                            onClose();
                                        }}
                                        onMouseEnter={() => setSelectedIndex(idx)}
                                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors ${
                                            isSelected
                                                ? 'bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 border border-emerald-500/20'
                                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500"/>
                                            <div>
                                                <div
                                                    className="font-semibold text-slate-900 dark:text-white">{item.name}</div>
                                                <div
                                                    className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                                                    {item.subdomain}.{rootDomain}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                                            <span>{item.category}</span>
                                            <ExternalLink className="w-3 h-3 ml-1"/>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {actions.length > 0 && (
                        <div className="pt-2">
                            <div
                                className="px-3 py-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                                Actions & Navigation
                            </div>
                            {actions.map((act, actIdx) => {
                                const globalIdx = filteredSubs.length + actIdx;
                                const isSelected = selectedIndex === globalIdx;
                                const IconComponent = act.icon;

                                return (
                                    <div
                                        key={act.id}
                                        onClick={act.run}
                                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors ${
                                            isSelected
                                                ? 'bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 border border-emerald-500/20'
                                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <IconComponent className="w-4 h-4 text-slate-400"/>
                                            <span className="font-medium">{act.name}</span>
                                        </div>
                                        <span
                                            className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {act.category}
                    </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div
                    className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <div className="flex items-center gap-2">
                        <span>↑↓ Navigate</span>
                        <span>•</span>
                        <span>↵ Select</span>
                    </div>
                    <div>ESC to close</div>
                </div>
            </div>
        </div>
    );
}

function AddEditModal({
                          onClose,
                          onSave,
                          editingItem,
                          rootDomain,
                      }: {
    onClose: () => void;
    onSave: (item: SubdomainItem) => void;
    editingItem: SubdomainItem | null;
    rootDomain: string;
}) {
    const [name, setName] = useState(editingItem?.name || '');
    const [subdomain, setSubdomain] = useState(editingItem?.subdomain || '');
    const [category, setCategory] = useState(editingItem?.category || 'Security');
    const [status, setStatus] = useState<SubdomainStatus>(editingItem?.status || 'online');
    const [pingMs, setPingMs] = useState(editingItem?.pingMs || 14);
    const [description, setDescription] = useState(editingItem?.description || '');
    const [githubUrl, setGithubUrl] = useState(editingItem?.githubUrl || '');
    const [techStackInput, setTechStackInput] = useState((editingItem?.techStack || []).join(', '));
    const [endpointsInput, setEndpointsInput] = useState((editingItem?.endpoints || []).join(', '));
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !subdomain.trim() || !description.trim()) {
            setError('Please fill in Name, Subdomain, and Description.');
            return;
        }

        const cleanSubdomain = subdomain.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
        const tags = techStackInput.split(',').map((t) => t.trim()).filter(Boolean);
        const endpoints = endpointsInput
            .split(',')
            .map((ep) => {
                let clean = ep.trim();
                if (clean && !clean.startsWith('/')) clean = '/' + clean;
                return clean;
            })
            .filter(Boolean);

        const saved: SubdomainItem = {
            id: editingItem ? editingItem.id : `sub-${cleanSubdomain}-${Date.now().toString(36)}`,
            name: name.trim(),
            subdomain: cleanSubdomain,
            category: category.trim(),
            status,
            pingMs: Number(pingMs) || 14,
            description: description.trim(),
            githubUrl: githubUrl.trim() || undefined,
            techStack: tags.length ? tags : ['Web'],
            endpoints: endpoints.length ? endpoints : ['/'],
            isPinned: editingItem ? editingItem.isPinned : false,
        };

        onSave(saved);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in zoom-in-95 max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            {editingItem ? 'Edit Subdomain' : 'Add New Subdomain'}
                        </h3>
                        <p className="text-xs text-slate-500 font-mono">
                            target: {subdomain || 'sub'}.{rootDomain}
                        </p>
                    </div>
                    <button onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
                        <X className="w-4 h-4"/>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
                    {error && (
                        <div
                            className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Subdomain Prefix *
                        </label>
                        <div
                            className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/40">
                            <span className="pl-3 text-xs font-mono text-slate-400 select-none">https://</span>
                            <input
                                type="text"
                                value={subdomain}
                                onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                placeholder="e.g. exploitdb"
                                className="flex-1 px-1.5 py-2 text-xs font-mono bg-transparent text-slate-900 dark:text-white focus:outline-none"
                                required
                            />
                            <span className="pr-3 text-xs font-mono text-emerald-600 dark:text-emerald-400 select-none">
                .{rootDomain}
              </span>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Project Name *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. ExploitDB Search Directory"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Category
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                            >
                                <option value="Security">Security</option>
                                <option value="Showcase">Showcase</option>
                                <option value="Games">Games</option>
                                <option value="Tools">Tools</option>
                                <option value="API">API</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as SubdomainStatus)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                            >
                                <option value="online">Online</option>
                                <option value="degraded">Degraded</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="offline">Offline</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Description *
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description of the service and capabilities..."
                            rows={2}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            GitHub URL (Optional)
                        </label>
                        <input
                            type="url"
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                            placeholder="https://github.com/aayushrambo8/..."
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Tech Stack Tags (Comma separated)
                        </label>
                        <input
                            type="text"
                            value={techStackInput}
                            onChange={(e) => setTechStackInput(e.target.value)}
                            placeholder="e.g. Python, REST API, CVE Search"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Endpoints / Routes (Comma separated)
                        </label>
                        <input
                            type="text"
                            value={endpointsInput}
                            onChange={(e) => setEndpointsInput(e.target.value)}
                            placeholder="e.g. /search, /cve/lookup, /api/v1"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                        />
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm"
                        >
                            {editingItem ? 'Save Changes' : 'Add Subdomain'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function DomainModal({
                         rootDomain,
                         onClose,
                         onSaveDomain,
                     }: {
    rootDomain: string;
    onClose: () => void;
    onSaveDomain: (d: string) => void;
}) {
    const [val, setVal] = useState(rootDomain);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const clean = val.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
        if (clean) {
            onSaveDomain(clean);
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 space-y-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <Globe className="w-4 h-4"/>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Base Root Domain</h3>
                            <p className="text-xs text-slate-500">Configure target apex domain</p>
                        </div>
                    </div>
                    <button onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
                        <X className="w-4 h-4"/>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Apex Domain Name
                        </label>
                        <input
                            type="text"
                            value={val}
                            onChange={(e) => setVal(e.target.value)}
                            placeholder="e.g. aayushbabu.live"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                            required
                        />
                    </div>

                    <div
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                        <span className="text-slate-400 font-mono text-[11px] block">Quick Presets:</span>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setVal('aayushbabu.live')}
                                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-mono text-[11px] hover:border-emerald-500 transition-colors"
                            >
                                aayushbabu.live
                            </button>
                            <button
                                type="button"
                                onClick={() => setVal('localhost:3000')}
                                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-mono text-[11px] hover:border-emerald-500 transition-colors"
                            >
                                localhost:3000
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                setVal(DEFAULT_ROOT_DOMAIN);
                                onSaveDomain(DEFAULT_ROOT_DOMAIN);
                                onClose();
                            }}
                            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                        >
                            <RotateCcw className="w-3 h-3"/>
                            <span>Reset Default</span>
                        </button>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-3.5 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

function EndpointsViewModal({
                                item,
                                rootDomain,
                                onClose,
                                onShowToast,
                            }: {
    item: SubdomainItem;
    rootDomain: string;
    onClose: () => void;
    onShowToast: (msg: string) => void;
}) {
    const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
    const baseUrl = item.customUrl || `https://${item.subdomain}.${rootDomain}`;
    const endpoints = item.endpoints && item.endpoints.length > 0 ? item.endpoints : ['/'];

    const copyUrl = async (ep: string, index: number) => {
        const fullUrl = `${baseUrl}${ep.startsWith('/') ? ep : '/' + ep}`;
        try {
            await navigator.clipboard.writeText(fullUrl);
            setCopiedIdx(index);
            onShowToast(`Copied ${fullUrl}`);
            setTimeout(() => setCopiedIdx(null), 2000);
        } catch {
            onShowToast(fullUrl);
        }
    };

    const copyCurl = async (ep: string) => {
        const fullUrl = `${baseUrl}${ep.startsWith('/') ? ep : '/' + ep}`;
        const cmd = `curl -s "${fullUrl}"`;
        try {
            await navigator.clipboard.writeText(cmd);
            onShowToast('Copied cURL command');
        } catch {
            onShowToast(cmd);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in zoom-in-95 space-y-4 p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <Layers className="w-4 h-4"/>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.name} Endpoints</h3>
                            <p className="text-xs text-slate-500 font-mono">{baseUrl}</p>
                        </div>
                    </div>
                    <button onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
                        <X className="w-4 h-4"/>
                    </button>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                    {endpoints.map((ep, idx) => {
                        const epUrl = `${baseUrl}${ep.startsWith('/') ? ep : '/' + ep}`;
                        const isCopied = copiedIdx === idx;

                        return (
                            <div
                                key={idx}
                                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-xs font-mono"
                            >
                                <div className="flex items-center gap-2 overflow-hidden mr-2">
                  <span
                      className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                    GET
                  </span>
                                    <span
                                        className="text-slate-800 dark:text-slate-200 truncate font-semibold">{ep}</span>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                        onClick={() => copyCurl(ep)}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                        title="Copy cURL command"
                                    >
                                        <Terminal className="w-3.5 h-3.5"/>
                                    </button>

                                    <button
                                        onClick={() => copyUrl(ep, idx)}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                        title="Copy full URL"
                                    >
                                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500"/> :
                                            <Copy className="w-3.5 h-3.5"/>}
                                    </button>

                                    <a
                                        href={epUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                        title="Open Route"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5"/>
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="pt-2 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 text-xs font-medium rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

function ConfigBackupModal({
                               subdomains,
                               rootDomain,
                               onClose,
                               onImport,
                               onReset,
                               onShowToast,
                           }: {
    subdomains: SubdomainItem[];
    rootDomain: string;
    onClose: () => void;
    onImport: (items: SubdomainItem[]) => void;
    onReset: () => void;
    onShowToast: (msg: string) => void;
}) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [jsonInput, setJsonInput] = useState('');
    const [error, setError] = useState('');

    const exportJSON = () => {
        const data = {
            rootDomain,
            exportedAt: new Date().toISOString(),
            subdomains,
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `subdomains-${rootDomain}-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        onShowToast('Exported JSON backup file.');
    };

    const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const parsed = JSON.parse(ev.target?.result as string);
                const list = Array.isArray(parsed) ? parsed : parsed.subdomains || [];
                if (!Array.isArray(list) || list.length === 0) throw new Error('Invalid config file.');
                onImport(list);
                onShowToast(`Successfully imported ${list.length} subdomains!`);
                onClose();
            } catch (err: any) {
                setError(err.message || 'Failed to parse JSON file.');
            }
        };
        reader.readAsText(file);
    };

    const pasteImport = () => {
        if (!jsonInput.trim()) return;
        try {
            const parsed = JSON.parse(jsonInput.trim());
            const list = Array.isArray(parsed) ? parsed : parsed.subdomains || [];
            if (!Array.isArray(list) || list.length === 0) throw new Error('Invalid JSON format.');
            onImport(list);
            onShowToast(`Successfully imported ${list.length} subdomains!`);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Invalid JSON syntax.');
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 space-y-5"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <FileJson className="w-4 h-4"/>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Configuration & Data</h3>
                            <p className="text-xs text-slate-500">Backup, restore, or reset directory data</p>
                        </div>
                    </div>
                    <button onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
                        <X className="w-4 h-4"/>
                    </button>
                </div>

                {error && (
                    <div
                        className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0"/>
                        <span>{error}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                        onClick={exportJSON}
                        className="flex flex-col items-start p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer group"
                    >
                        <Download className="w-4 h-4 text-emerald-500 mb-2 group-hover:scale-110 transition-transform"/>
                        <div className="font-semibold text-xs text-slate-900 dark:text-white">Export Backup</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Download JSON file
                            ({subdomains.length} entries)
                        </div>
                    </button>

                    <button
                        onClick={() => fileRef.current?.click()}
                        className="flex flex-col items-start p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer group"
                    >
                        <Upload className="w-4 h-4 text-sky-500 mb-2 group-hover:scale-110 transition-transform"/>
                        <div className="font-semibold text-xs text-slate-900 dark:text-white">Import File</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Load subdomains from JSON</div>
                        <input ref={fileRef} type="file" accept=".json" onChange={uploadFile} className="hidden"/>
                    </button>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Or Paste JSON Configuration:
                    </label>
                    <textarea
                        value={jsonInput}
                        onChange={(e) => {
                            setJsonInput(e.target.value);
                            setError('');
                        }}
                        placeholder='[ { "name": "...", "subdomain": "..." } ]'
                        rows={3}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                    {jsonInput.trim() && (
                        <button
                            onClick={pasteImport}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
                        >
                            Parse & Import JSON
                        </button>
                    )}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                        onClick={() => {
                            if (confirm('Reset subdomains to default verified configuration?')) {
                                onReset();
                            }
                        }}
                        className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium transition-colors cursor-pointer"
                    >
                        <RotateCcw className="w-3.5 h-3.5"/>
                        <span>Reset Factory Defaults</span>
                    </button>

                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 text-xs font-medium rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
