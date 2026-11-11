'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ExternalLink,
  Sun,
  Moon,
  Plus,
  Layers,
  FileDown,
  X,
  Globe,
} from 'lucide-react';
import { GithubIcon } from '@/components/GithubIcon';
import { SubdomainItem } from '@/types/subdomain';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  subdomains: SubdomainItem[];
  rootDomain: string;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenAddModal: () => void;
  onOpenDomainModal: () => void;
  onOpenConfigModal: () => void;
  onShowToast: (msg: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  subdomains,
  rootDomain,
  theme,
  onToggleTheme,
  onOpenAddModal,
  onOpenDomainModal,
  onOpenConfigModal,
  onShowToast,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Filter subdomains
  const filteredSubdomains = subdomains.filter((s) => {
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.subdomain.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.techStack.some((t) => t.toLowerCase().includes(q))
    );
  });

  // System actions
  const systemActions = [
    {
      id: 'action-add',
      name: 'Add New Subdomain',
      icon: Plus,
      category: 'Action',
      run: () => {
        onClose();
        onOpenAddModal();
      },
    },
    {
      id: 'action-theme',
      name: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
      icon: theme === 'dark' ? Sun : Moon,
      category: 'Preferences',
      run: () => {
        onToggleTheme();
        onClose();
      },
    },
    {
      id: 'action-domain',
      name: 'Configure Root Domain',
      icon: Layers,
      category: 'Preferences',
      run: () => {
        onClose();
        onOpenDomainModal();
      },
    },
    {
      id: 'action-backup',
      name: 'Backup / Import Subdomains Config',
      icon: FileDown,
      category: 'Data',
      run: () => {
        onClose();
        onOpenConfigModal();
      },
    },
    {
      id: 'action-github',
      name: 'GitHub Profile (@aayushrambo8)',
      icon: GithubIcon,
      category: 'External',
      run: () => {
        window.open('https://github.com/aayushrambo8', '_blank', 'noopener,noreferrer');
        onClose();
      },
    },
    {
      id: 'action-copy-root',
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

  const totalItems = filteredSubdomains.length + systemActions.length;

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
      if (selectedIndex < filteredSubdomains.length) {
        const item = filteredSubdomains[selectedIndex];
        const url = item.customUrl || `https://${item.subdomain}.${rootDomain}`;
        window.open(url, '_blank', 'noopener,noreferrer');
        onClose();
      } else {
        const actionIndex = selectedIndex - filteredSubdomains.length;
        if (systemActions[actionIndex]) {
          systemActions[actionIndex].run();
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
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 gap-3">
          <Search className="w-4 h-4 text-slate-400" />
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
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {/* Subdomains Group */}
          {filteredSubdomains.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                Subdomains & Services
              </div>
              {filteredSubdomains.map((item, idx) => {
                const isSelected = selectedIndex === idx;
                const fullUrl =
                  item.customUrl || `https://${item.subdomain}.${rootDomain}`;

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
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {item.name}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                          {item.subdomain}.{rootDomain}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                      <span>{item.category}</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* System Actions Group */}
          {systemActions.length > 0 && (
            <div className="pt-2">
              <div className="px-3 py-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                Actions & Navigation
              </div>
              {systemActions.map((action, actionIdx) => {
                const globalIdx = filteredSubdomains.length + actionIdx;
                const isSelected = selectedIndex === globalIdx;
                const IconComponent = action.icon;

                return (
                  <div
                    key={action.id}
                    onClick={action.run}
                    onMouseEnter={() => setSelectedIndex(globalIdx)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 border border-emerald-500/20'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComponent className="w-4 h-4 text-slate-400" />
                      <span className="font-medium">{action.name}</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {action.category}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {totalItems === 0 && (
            <div className="py-8 text-center text-slate-400 text-xs font-mono">
              No matching commands or subdomains found.
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
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
};
