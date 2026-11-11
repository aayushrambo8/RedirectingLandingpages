'use client';

import React from 'react';
import { Globe, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  rootDomain: string;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  totalSubdomains: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  rootDomain,
  theme,
  onToggleTheme,
  totalSubdomains,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-[#030712]/75 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <a
          href={`https://${rootDomain}`}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-sky-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-sm shadow-emerald-500/10 group-hover:scale-105 group-hover:border-emerald-500/60 transition-all">
            <Globe className="w-4.5 h-4.5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-wider text-sm text-slate-900 dark:text-white uppercase">
                AAYUSH BABU
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                .LIVE
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono -mt-0.5">
              Subdomain Gateway
            </span>
          </div>
        </a>

        {/* Right side: Status beacon, GitHub, Theme Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Live System Status Pill */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-xs font-medium shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[11px] font-semibold">{totalSubdomains} Online</span>
            <span className="text-emerald-500/40 hidden sm:inline">|</span>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-300 hidden sm:inline">
              ~14ms
            </span>
          </div>

          {/* GitHub Profile */}
          <a
            href="https://github.com/aayushrambo8"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-all hover:border-slate-300 dark:hover:border-slate-700"
            title="GitHub @aayushrambo8"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            <span className="hidden sm:inline">GitHub</span>
          </a>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
