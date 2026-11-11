'use client';

import React, { useState, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { DEFAULT_SUBDOMAINS, DEFAULT_ROOT_DOMAIN } from '@/data/defaultSubdomains';
import {
  ExternalLink,
  Copy,
  Check,
  Search,
  X,
  ShieldCheck,
  Sparkles,
  Gamepad2,
  CheckCircle2,
  Activity,
  Layers,
  SearchX,
} from 'lucide-react';

export default function SubdomainHubPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [heroCopied, setHeroCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    showToast(`Switched to ${next} mode`);
  };

  const handleCopyHero = async () => {
    try {
      await navigator.clipboard.writeText(`https://${DEFAULT_ROOT_DOMAIN}`);
      setHeroCopied(true);
      showToast(`Copied https://${DEFAULT_ROOT_DOMAIN}`);
      setTimeout(() => setHeroCopied(false), 2000);
    } catch {
      showToast(DEFAULT_ROOT_DOMAIN);
    }
  };

  const handleCopyCardUrl = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      showToast(`Copied ${url}`);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      showToast(url);
    }
  };

  // Filter subdomains
  const filteredSubdomains = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return DEFAULT_SUBDOMAINS.filter((item) => {
      const matchCat =
        activeCategory === 'All' ||
        item.category.toLowerCase() === activeCategory.toLowerCase();
      const matchQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.subdomain.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.techStack.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [searchQuery, activeCategory]);

  const categories = ['All', 'Security', 'Showcase', 'Games'];

  const getSubdomainIcon = (id: string) => {
    switch (id) {
      case 'sub-exploitdb':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'sub-portfolio':
        return <Sparkles className="w-5 h-5 text-violet-400" />;
      case 'sub-tictactoe':
        return <Gamepad2 className="w-5 h-5 text-cyan-400" />;
      default:
        return <Layers className="w-5 h-5 text-slate-400" />;
    }
  };

  const getCardTheme = (id: string) => {
    switch (id) {
      case 'sub-exploitdb':
        return {
          glow: 'group-hover:border-emerald-500/50 group-hover:shadow-[0_0_40px_-8px_rgba(16,185,129,0.3)]',
          badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
          iconBg: 'bg-emerald-500/15 border-emerald-500/30 shadow-emerald-500/10',
          btn: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20',
          accent: 'text-emerald-600 dark:text-emerald-400',
        };
      case 'sub-portfolio':
        return {
          glow: 'group-hover:border-violet-500/50 group-hover:shadow-[0_0_40px_-8px_rgba(139,92,246,0.3)]',
          badge: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/25',
          iconBg: 'bg-violet-500/15 border-violet-500/30 shadow-violet-500/10',
          btn: 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold shadow-md shadow-violet-500/20',
          accent: 'text-violet-600 dark:text-violet-400',
        };
      case 'sub-tictactoe':
        return {
          glow: 'group-hover:border-cyan-500/50 group-hover:shadow-[0_0_40px_-8px_rgba(6,182,212,0.3)]',
          badge: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/25',
          iconBg: 'bg-cyan-500/15 border-cyan-500/30 shadow-cyan-500/10',
          btn: 'bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20',
          accent: 'text-cyan-600 dark:text-cyan-400',
        };
      default:
        return {
          glow: 'group-hover:border-slate-500/50',
          badge: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
          iconBg: 'bg-slate-500/15 border-slate-500/30',
          btn: 'bg-slate-800 text-white',
          accent: 'text-slate-400',
        };
    }
  };

  return (
    <div className="min-h-screen cyber-grid flex flex-col justify-between selection:bg-emerald-500/25 selection:text-emerald-400">
      <div>
        {/* Navbar */}
        <Navbar
          rootDomain={DEFAULT_ROOT_DOMAIN}
          theme={theme}
          onToggleTheme={toggleTheme}
          totalSubdomains={DEFAULT_SUBDOMAINS.length}
        />

        {/* Ambient Glowing Background Aura */}
        <div className="relative overflow-hidden">
          <div className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-emerald-500/15 dark:bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-10 right-1/4 translate-x-1/2 w-96 h-96 bg-violet-500/15 dark:bg-violet-500/20 blur-[130px] rounded-full pointer-events-none" />
          <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[450px] h-[350px] bg-cyan-500/10 dark:bg-cyan-500/15 blur-[140px] rounded-full pointer-events-none" />

          {/* Hero Section */}
          <section className="relative pt-12 pb-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-5">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-medium shadow-xs shadow-emerald-500/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>PRODUCTION VERIFIED // SUBDOMAIN DIRECTORY</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Engineering Portals &{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Web Services
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Explore verified web applications, vulnerability search engines, and interactive media portfolios hosted under{' '}
              <span className="font-bold text-slate-900 dark:text-white">{DEFAULT_ROOT_DOMAIN}</span>.
            </p>

            {/* Interactive Domain Pill */}
            <div className="pt-2 flex items-center justify-center">
              <button
                onClick={handleCopyHero}
                type="button"
                className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 hover:border-emerald-500/50 text-slate-900 dark:text-slate-100 font-mono text-sm shadow-lg shadow-black/5 dark:shadow-emerald-950/20 backdrop-blur-md transition-all hover:scale-[1.02] cursor-pointer"
                title="Click to copy root URL"
              >
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">https://</span>
                <span className="font-extrabold tracking-tight">{DEFAULT_ROOT_DOMAIN}</span>
                <span className="ml-1 text-slate-400 group-hover:text-emerald-500 transition-colors">
                  {heroCopied ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </span>
              </button>
            </div>

            {/* Quick Search & Filters */}
            <div className="pt-6 max-w-xl mx-auto space-y-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by name, CVE, Python, Canvas, stack..."
                  className="w-full pl-11 pr-10 py-3 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/90 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-md backdrop-blur-xl"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Category buttons */}
              <div className="flex items-center justify-center gap-2">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25 font-bold scale-105'
                          : 'bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Subdomains Showcase Grid */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {filteredSubdomains.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSubdomains.map((item) => {
                  const fullUrl = `https://${item.subdomain}.${DEFAULT_ROOT_DOMAIN}`;
                  const displayUrl = `${item.subdomain}.${DEFAULT_ROOT_DOMAIN}`;
                  const isCopied = copiedId === item.id;
                  const themeClasses = getCardTheme(item.id);

                  return (
                    <article
                      key={item.id}
                      className={`group relative flex flex-col justify-between rounded-3xl border border-slate-200 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/70 p-6 sm:p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 shadow-lg shadow-black/5 dark:shadow-black/40 ${themeClasses.glow}`}
                    >
                      <div>
                        {/* Top Bar: Icon, Category Badge & Ping */}
                        <div className="flex items-start justify-between gap-3 mb-5">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-11 h-11 rounded-2xl border flex items-center justify-center shadow-md transition-transform group-hover:scale-110 ${themeClasses.iconBg}`}
                            >
                              {getSubdomainIcon(item.id)}
                            </div>
                            <div>
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wider border ${themeClasses.badge}`}
                              >
                                {item.category.toUpperCase()}
                              </span>
                              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>{item.pingMs}ms latency</span>
                              </div>
                            </div>
                          </div>

                          {/* Quick Copy URL Icon */}
                          <button
                            onClick={() => handleCopyCardUrl(fullUrl, item.id)}
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Copy Subdomain Link"
                          >
                            {isCopied ? (
                              <Check className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {/* Title & Domain URL */}
                        <div className="space-y-1.5 mb-3">
                          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                            {item.name}
                          </h2>

                          <a
                            href={fullUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-1.5 text-xs font-mono font-semibold transition-colors hover:underline ${themeClasses.accent}`}
                          >
                            <span>{displayUrl}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                          {item.description}
                        </p>

                        {/* Tech Stack Pills */}
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {item.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
                        {item.githubUrl && (
                          <a
                            href={item.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all hover:border-slate-300 dark:hover:border-slate-700"
                            title="GitHub Repository"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-3.5 h-3.5"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                              />
                            </svg>
                            <span>Repo</span>
                          </a>
                        )}

                        <a
                          href={fullUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs transition-all hover:scale-[1.02] ${themeClasses.btn}`}
                        >
                          <span>Launch Service</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center space-y-3 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/30">
                <SearchX className="w-8 h-8 mx-auto text-slate-400" />
                <div className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                  No matching services found
                </div>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('All');
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Clear search filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <Footer rootDomain={DEFAULT_ROOT_DOMAIN} />

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 text-slate-900 dark:text-white shadow-2xl backdrop-blur-xl text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
