'use client';

import React, { useState } from 'react';
import { X, Globe, Check, RotateCcw } from 'lucide-react';
import { DEFAULT_ROOT_DOMAIN } from '@/data/defaultSubdomains';

interface DomainConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  rootDomain: string;
  onSaveDomain: (newDomain: string) => void;
}

export const DomainConfigModal: React.FC<DomainConfigModalProps> = ({
  isOpen,
  onClose,
  rootDomain,
  onSaveDomain,
}) => {
  const [domainInput, setDomainInput] = useState(rootDomain);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = domainInput.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (clean) {
      onSaveDomain(clean);
      onClose();
    }
  };

  const handleReset = () => {
    setDomainInput(DEFAULT_ROOT_DOMAIN);
    onSaveDomain(DEFAULT_ROOT_DOMAIN);
    onClose();
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
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Base Root Domain
              </h3>
              <p className="text-xs text-slate-500">Configure target apex domain</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Apex Domain Name
            </label>
            <input
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="e.g. aayushbabu.live"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              required
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
            <span className="text-slate-400 font-mono text-[11px] block">Quick Presets:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setDomainInput('aayushbabu.live')}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-mono text-[11px] hover:border-emerald-500 transition-colors"
              >
                aayushbabu.live
              </button>
              <button
                type="button"
                onClick={() => setDomainInput('localhost:3000')}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-mono text-[11px] hover:border-emerald-500 transition-colors"
              >
                localhost:3000
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
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
};
