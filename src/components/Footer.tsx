'use client';

import React from 'react';

interface FooterProps {
  rootDomain: string;
}

export const Footer: React.FC<FooterProps> = ({ rootDomain }) => {
  return (
    <footer className="mt-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/30 backdrop-blur-sm py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>
            &copy; {new Date().getFullYear()} <strong>Aayush Babu</strong> &bull;{' '}
            <a
              href={`https://${rootDomain}`}
              className="text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              {rootDomain}
            </a>
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="hidden sm:inline text-slate-400">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">⌘K</kbd> to search
          </span>
          <span>&bull;</span>
          <a
            href="https://github.com/aayushrambo8"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            <span>GitHub @aayushrambo8</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
