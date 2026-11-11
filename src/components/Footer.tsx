'use client';

import React from 'react';
import { Globe, Heart } from 'lucide-react';
import { GithubIcon } from '@/components/GithubIcon';

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
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub @aayushrambo8</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
