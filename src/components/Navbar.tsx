'use client';

import React from 'react';
import {
  Globe,
  Search,
  Moon,
  Sun,
  Plus,
  SlidersHorizontal,
  Layers,
} from 'lucide-react';

interface NavbarProps {
  rootDomain: string;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenCommandPalette: () => void;
  onOpenAddModal: () => void;
  onOpenConfigModal: () => void;
  onOpenDomainModal: () => void;
  totalSubdomains: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  rootDomain,
  theme,
  onToggleTheme,
  onOpenCommandPalette,
  onOpenAddModal,
  onOpenConfigModal,
  onOpenDomainModal,
  totalSubdomains,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-[#080c14]/75 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <a
            href={`https://${rootDomain}`}
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:border-emerald-500/50 transition-colors">
              <Globe className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-sm text-slate-900 dark:text-white uppercase">
                  Aayush Babu
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  HUB
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono -mt-0.5">
                {rootDomain}
              </span>
            </div>
          </a>

          {/* Operational Status Pill */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[11px]">{totalSubdomains} Online</span>
            <span className="text-emerald-500/40">|</span>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">~14ms</span>
          </div>
        </div>

        {/* Center / Search Trigger */}
        <div className="flex-1 max-w-md hidden sm:block">
          <button
            onClick={onOpenCommandPalette}
            type="button"
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5" />
              <span>Search subdomains, tags, routes...</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[10px] text-slate-500 dark:text-slate-400 bg-slate-200/80 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-300/60 dark:border-slate-700">
              <span>⌘K</span>
            </div>
          </button>
        </div>

        {/* Actions Right */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Search on mobile */}
          <button
            onClick={onOpenCommandPalette}
            className="sm:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            title="Search (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Add Subdomain */}
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors cursor-pointer"
            title="Add Subdomain"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>

          {/* Manage Config */}
          <button
            onClick={onOpenConfigModal}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
            title="Manage Configuration & Backups"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Domain settings */}
          <button
            onClick={onOpenDomainModal}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
            title="Configure Root Domain"
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* GitHub Profile */}
          <a
            href="https://github.com/aayushrambo8"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            title="GitHub @aayushrambo8"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
};
