'use client';

import React from 'react';

interface FooterProps {
  rootDomain: string;
}

export const Footer: React.FC<FooterProps> = ({ rootDomain }) => {
  return (
    <footer className="mt-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
          <span>
            &copy; {new Date().getFullYear()} <strong>Aayush Babu</strong> &bull;{' '}
            <a
              href={`https://${rootDomain}`}
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
            >
              {rootDomain}
            </a>
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span>Production Subdomain Gateway</span>
          <span>&bull;</span>
          <a
            href="https://github.com/aayushrambo8"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            @aayushrambo8
          </a>
        </div>
      </div>
    </footer>
  );
};
